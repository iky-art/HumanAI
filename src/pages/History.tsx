import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchMyConversations, fetchMessages } from '../lib/conversations';
import type { Conversation, Message } from '../types/database';

const STATUS_LABEL: Record<Conversation['status'], string> = {
  waiting: 'Menunggu',
  active: 'Aktif',
  completed: 'Selesai',
};

export default function History() {
  const { profile } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [threadCache, setThreadCache] = useState<Record<string, Message[]>>({});

  useEffect(() => {
    if (!profile) return;
    fetchMyConversations(profile.id).then(setConversations);
  }, [profile?.id]);

  async function toggle(id: string) {
    if (openId === id) {
      setOpenId(null);
      return;
    }
    setOpenId(id);
    if (!threadCache[id]) {
      const msgs = await fetchMessages(id);
      setThreadCache((prev) => ({ ...prev, [id]: msgs }));
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-10 md:px-12">
      <h1 className="font-display text-2xl">History Chat</h1>
      <p className="mt-1 text-sm text-ash-500">Semua percakapan kamu dengan operator, dari yang paling baru.</p>

      <div className="mt-6 space-y-2">
        {conversations.length === 0 && (
          <p className="text-sm text-ash-500">Belum ada riwayat percakapan.</p>
        )}
        {conversations.map((c) => (
          <div key={c.id}>
            <button
              onClick={() => toggle(c.id)}
              className="flex w-full items-center justify-between rounded-sm bg-ink-raised px-4 py-3 text-left hover:bg-ink-card"
            >
              <div>
                <p className="text-sm font-medium">
                  {new Date(c.updated_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                  {' · '}
                  {STATUS_LABEL[c.status]}
                </p>
              </div>
              <span className={'text-ash-500 transition-transform ' + (openId === c.id ? 'rotate-180' : '')}>
                ⌄
              </span>
            </button>

            {openId === c.id && (
              <div className="mt-1 max-h-72 space-y-2 overflow-y-auto rounded-sm border border-ink-border p-3">
                {(threadCache[c.id] ?? []).length === 0 ? (
                  <p className="text-xs text-ash-500">Belum ada pesan di percakapan ini.</p>
                ) : (
                  (threadCache[c.id] ?? []).map((m) => (
                    <div
                      key={m.id}
                      className={
                        'max-w-[80%] rounded-md px-3 py-2 text-sm ' +
                        (m.sender_role === 'user' ? 'ml-auto bg-signal-blue text-ink' : 'border border-ink-border')
                      }
                    >
                      {m.body}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
