import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { fetchNotifications, markAllNotificationsRead } from '../lib/notifications';
import type { Notification } from '../types/database';

function timeAgo(iso: string): string {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return 'Baru saja';
  if (mins < 60) return `${mins} menit lalu`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} jam lalu`;
  return `${Math.floor(hours / 24)} hari lalu`;
}

export default function NotificationBell() {
  const { profile } = useAuth();
  const [items, setItems] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!profile) return;
    fetchNotifications(profile.id).then(setItems);

    const channel = supabase
      .channel(`notifications-${profile.id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${profile.id}` },
        (payload) => setItems((prev) => [payload.new as Notification, ...prev])
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile?.id]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const unread = items.filter((n) => !n.read).length;

  async function toggle() {
    const next = !open;
    setOpen(next);
    if (next && profile && unread > 0) {
      await markAllNotificationsRead(profile.id);
      setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    }
  }

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        onClick={toggle}
        aria-label="Notifikasi"
        className="relative flex h-9 w-9 items-center justify-center rounded-sm text-ash-300 hover:bg-ink-raised"
      >
        <BellIcon />
        {unread > 0 && (
          <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[0.62rem] font-bold text-white">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-40 max-h-96 w-80 overflow-y-auto rounded-md border border-ink-border bg-ink-card p-3 shadow-xl">
          <p className="mb-2 font-display text-sm">Notifikasi</p>
          {items.length === 0 ? (
            <p className="py-3 text-xs text-ash-500">Belum ada notifikasi.</p>
          ) : (
            <div className="space-y-1.5">
              {items.map((n) => (
                <div key={n.id} className={'rounded-sm bg-ink-raised p-2.5 ' + (!n.read ? 'border-l-2 border-signal-blue' : '')}>
                  <p className="text-sm font-medium">{n.title}</p>
                  {n.body && <p className="mt-0.5 text-xs text-ash-300">{n.body}</p>}
                  <p className="mt-1 text-[0.68rem] text-ash-500">{timeAgo(n.created_at)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function BellIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M10 2.5c-2.3 0-4 1.9-4 4.3v2.4c0 .5-.2 1.2-.5 1.7l-.9 1.4c-.5.9 0 2 1 2.2 2.9.6 5.9.6 8.8 0 1-.2 1.5-1.3 1-2.2l-.9-1.4c-.3-.5-.5-1.2-.5-1.7V6.8c0-2.4-1.8-4.3-4-4.3Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M8.2 16.8c.3.9 1 1.5 1.8 1.5s1.5-.6 1.8-1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
