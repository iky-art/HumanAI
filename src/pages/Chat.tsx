import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { getOrCreateMyConversation, fetchMessages, sendUserMessage } from '../lib/conversations';
import type { Conversation, Message } from '../types/database';

export default function Chat() {
  const { profile } = useAuth();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!profile) return;
    let cancelled = false;

    async function init() {
      const convo = await getOrCreateMyConversation(profile!.id);
      if (cancelled) return;
      setConversation(convo);
      const msgs = await fetchMessages(convo.id);
      if (cancelled) return;
      setMessages(msgs);
      setLoading(false);
    }
    init();

    return () => {
      cancelled = true;
    };
  }, [profile]);

  // Realtime: new messages + conversation status changes (claimed/closed).
  useEffect(() => {
    if (!conversation) return;

    const channel = supabase
      .channel(`chat-${conversation.id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversation.id}` },
        (payload) => setMessages((prev) => [...prev, payload.new as Message])
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'conversations', filter: `id=eq.${conversation.id}` },
        (payload) => setConversation(payload.new as Conversation)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversation?.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || !conversation || !profile) return;
    setInput('');
    await sendUserMessage(conversation.id, profile.id, text);
  }

  if (loading) {
    return <div className="p-6 text-sm text-ash-500">Memuat percakapan...</div>;
  }

  const statusLabel =
    conversation?.status === 'active'
      ? 'Operator sedang menangani'
      : conversation?.status === 'completed'
        ? 'Percakapan selesai'
        : 'Menunggu operator';

  return (
    <main className="flex h-[calc(100dvh-65px)] flex-col">
      <div className="border-b border-ink-border px-6 py-3 text-sm text-ash-500 md:px-12">{statusLabel}</div>

      <div className="flex-1 space-y-3 overflow-y-auto px-6 py-5 md:px-12">
        {messages.length === 0 && (
          <p className="mt-10 text-center text-sm text-ash-500">
            Belum ada percakapan.
            <br />
            Tanya apa saja — nanti dijawab manusia.
          </p>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className={
              'max-w-[78%] rounded-md px-4 py-2.5 text-sm leading-relaxed ' +
              (m.sender_role === 'user'
                ? 'ml-auto bg-signal-blue text-ink'
                : 'border border-ink-border bg-ink-card text-ash-100')
            }
          >
            <p className="mb-0.5 text-[0.68rem] font-medium opacity-70">
              {m.sender_role === 'user' ? 'Kamu' : 'Human'}
            </p>
            <p className="whitespace-pre-wrap">{m.body}</p>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={onSubmit} className="flex gap-3 border-t border-ink-border px-6 py-4 md:px-12">
        <input
          className="input flex-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tulis pesan..."
          autoComplete="off"
        />
        <button type="submit" className="btn-primary">
          Kirim
        </button>
      </form>
    </main>
  );
}
