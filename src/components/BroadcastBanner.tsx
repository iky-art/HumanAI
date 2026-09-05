import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchBroadcasts, markBroadcastRead, type BroadcastWithReadState } from '../lib/broadcasts';

export default function BroadcastBanner() {
  const { profile } = useAuth();
  const [unread, setUnread] = useState<BroadcastWithReadState[]>([]);

  useEffect(() => {
    if (!profile) return;
    fetchBroadcasts(profile.id).then((all) => setUnread(all.filter((b) => !b.read)));
  }, [profile?.id]);

  if (!profile || unread.length === 0) return null;

  const current = unread[0];

  async function dismiss() {
    await markBroadcastRead(current.id, profile!.id);
    setUnread((prev) => prev.filter((b) => b.id !== current.id));
  }

  return (
    <div className="border-b border-signal-blue/30 bg-signal-blue/10 px-6 py-3 md:px-12">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-ash-100">{current.title}</p>
          <p className="mt-0.5 text-sm text-ash-300">{current.body}</p>
        </div>
        <button
          type="button"
          onClick={dismiss}
          className="flex-shrink-0 text-xs text-ash-500 hover:text-ash-300"
        >
          Tutup
        </button>
      </div>
      {unread.length > 1 && (
        <p className="mt-1 text-xs text-ash-500">+{unread.length - 1} pengumuman lain menunggu</p>
      )}
    </div>
  );
}
