import { useEffect, useState, type FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { sendBroadcast, fetchBroadcasts, type BroadcastWithReadState } from '../lib/broadcasts';

export default function BroadcastPanel() {
  const { profile } = useAuth();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [sent, setSent] = useState(false);
  const [history, setHistory] = useState<BroadcastWithReadState[]>([]);

  async function loadHistory() {
    if (!profile) return;
    setHistory(await fetchBroadcasts(profile.id));
  }

  useEffect(() => {
    loadHistory();
  }, [profile?.id]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!profile || !title.trim() || !body.trim()) return;
    await sendBroadcast(profile.id, title.trim(), body.trim());
    setTitle('');
    setBody('');
    setSent(true);
    setTimeout(() => setSent(false), 2000);
    await loadHistory();
  }

  return (
    <section className="rounded-md border border-ink-border p-5">
      <h2 className="font-display text-base">Broadcast</h2>
      <p className="mt-1 text-xs text-ash-500">Kirim pengumuman yang muncul sebagai banner ke semua user.</p>

      <form onSubmit={onSubmit} className="mt-3 space-y-3">
        <input
          className="input"
          placeholder="Judul pengumuman"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="input min-h-20"
          placeholder="Isi pengumuman"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <button type="submit" className="btn-primary btn-sm">
          {sent ? 'Terkirim!' : 'Kirim Broadcast'}
        </button>
      </form>

      <div className="mt-5 border-t border-ink-border pt-4">
        <p className="mb-2 text-xs text-ash-500">Riwayat broadcast</p>
        <div className="max-h-56 space-y-2 overflow-y-auto">
          {history.length === 0 && <p className="text-xs text-ash-500">Belum pernah kirim broadcast.</p>}
          {history.map((b) => (
            <div key={b.id} className="rounded-sm bg-ink-raised p-2.5">
              <p className="text-sm font-medium">{b.title}</p>
              <p className="mt-0.5 text-xs text-ash-300">{b.body}</p>
              <p className="mt-1 text-[0.68rem] text-ash-500">
                {new Date(b.created_at).toLocaleString('id-ID')}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
