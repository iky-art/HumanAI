import { useEffect, useState, type FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import {
  fetchWaitingConversations,
  fetchOperatorConversations,
  claimConversation,
  closeConversation,
  fetchMessages,
  sendOperatorMessage,
  type ConversationWithUser,
} from '../lib/conversations';
import { waLink } from '../lib/wa';
import type { Message } from '../types/database';

export default function Operator() {
  const { profile } = useAuth();
  const [waiting, setWaiting] = useState<ConversationWithUser[]>([]);
  const [active, setActive] = useState<ConversationWithUser[]>([]);
  const [completed, setCompleted] = useState<ConversationWithUser[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [reply, setReply] = useState('');

  async function refreshLists() {
    if (!profile) return;
    const [w, a, c] = await Promise.all([
      fetchWaitingConversations(),
      fetchOperatorConversations(profile.id, 'active'),
      fetchOperatorConversations(profile.id, 'completed'),
    ]);
    setWaiting(w);
    setActive(a);
    setCompleted(c);
  }

  useEffect(() => {
    refreshLists();

    // Live-refresh the lists whenever any conversation changes — a new
    // one arriving, another operator claiming one, etc.
    const channel = supabase
      .channel('operator-conversations')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'conversations' }, () => refreshLists())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile?.id]);

  useEffect(() => {
    if (!openId) return;
    fetchMessages(openId).then(setMessages);

    const channel = supabase
      .channel(`operator-thread-${openId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${openId}` },
        (payload) => setMessages((prev) => [...prev, payload.new as Message])
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [openId]);

  async function onClaim(id: string) {
    if (!profile) return;
    const ok = await claimConversation(id, profile.id);
    if (ok) setOpenId(id);
    await refreshLists();
  }

  async function onClose(id: string) {
    await closeConversation(id);
    if (openId === id) setOpenId(null);
    await refreshLists();
  }

  async function onSubmitReply(e: FormEvent) {
    e.preventDefault();
    const text = reply.trim();
    if (!text || !openId || !profile) return;
    setReply('');
    await sendOperatorMessage(openId, profile.id, text);
  }

  const openConvo = [...active, ...completed].find((c) => c.id === openId);

  return (
    <main className="grid gap-4 p-6 md:grid-cols-3 md:p-12">
      <ConvoColumn title="Menunggu" empty="Belum ada yang menunggu.">
        {waiting.map((c) => (
          <ConvoRow key={c.id} convo={c} action={<button className="btn-primary btn-sm" onClick={() => onClaim(c.id)}>Ambil</button>} />
        ))}
      </ConvoColumn>

      <ConvoColumn title="Aktif" empty="Belum ada percakapan aktif.">
        {active.map((c) => (
          <ConvoRow
            key={c.id}
            convo={c}
            action={
              <button className="btn-ghost btn-sm" onClick={() => setOpenId(c.id)}>
                Buka
              </button>
            }
          />
        ))}
      </ConvoColumn>

      <ConvoColumn title="Selesai" empty="Belum ada yang selesai.">
        {completed.map((c) => (
          <ConvoRow
            key={c.id}
            convo={c}
            action={
              <button className="btn-ghost btn-sm" onClick={() => setOpenId(c.id)}>
                Buka
              </button>
            }
          />
        ))}
      </ConvoColumn>

      {openConvo && (
        <div className="rounded-md border border-ink-border bg-ink-card p-4 md:col-span-3">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="font-display">{openConvo.profile?.username ?? 'Unknown'}</p>
              {openConvo.profile?.wa_number && (
                <a
                  href={waLink(openConvo.profile.wa_number)}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-human underline underline-offset-2"
                >
                  Konsultasi via WhatsApp
                </a>
              )}
            </div>
            {openConvo.status !== 'completed' && (
              <button className="btn-ghost btn-sm" onClick={() => onClose(openConvo.id)}>
                Tutup percakapan
              </button>
            )}
          </div>

          <div className="mb-3 max-h-80 space-y-2 overflow-y-auto">
            {messages.map((m) => (
              <div
                key={m.id}
                className={
                  'max-w-[80%] rounded-md px-3 py-2 text-sm ' +
                  (m.sender_role === 'operator' ? 'ml-auto bg-signal-blue text-ink' : 'border border-ink-border')
                }
              >
                {m.body}
              </div>
            ))}
          </div>

          {openConvo.status !== 'completed' && (
            <form onSubmit={onSubmitReply} className="flex gap-2">
              <input
                className="input flex-1"
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Balas sebagai operator..."
              />
              <button type="submit" className="btn-primary">
                Kirim
              </button>
            </form>
          )}
        </div>
      )}
    </main>
  );
}

function ConvoColumn({ title, empty, children }: { title: string; empty: string; children: React.ReactNode }) {
  const hasChildren = Array.isArray(children) ? children.length > 0 : Boolean(children);
  return (
    <div className="rounded-md border border-ink-border bg-ink-card p-4">
      <h2 className="mb-3 font-display text-sm">{title}</h2>
      <div className="space-y-2">{hasChildren ? children : <p className="text-xs text-ash-500">{empty}</p>}</div>
    </div>
  );
}

function ConvoRow({ convo, action }: { convo: ConversationWithUser; action: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between rounded-sm bg-ink-raised px-3 py-2.5">
      <p className="text-sm">{convo.profile?.username ?? 'Unknown'}</p>
      {action}
    </div>
  );
}
