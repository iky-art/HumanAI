import { useEffect, useState } from 'react';
import { fetchPendingApplications, approveOperator, rejectOperator } from '../lib/profiles';
import { notifyUser } from '../lib/notifications';
import type { Profile } from '../types/database';

export default function PendingApplications() {
  const [pending, setPending] = useState<Profile[]>([]);

  async function refresh() {
    setPending(await fetchPendingApplications());
  }

  useEffect(() => {
    refresh();
  }, []);

  async function onApprove(p: Profile) {
    await approveOperator(p.id);
    await notifyUser(p.id, 'Pengajuan Operator disetujui', 'Selamat! Kamu sekarang resmi jadi Operator HumanAI.');
    await refresh();
  }

  async function onReject(p: Profile) {
    await rejectOperator(p.id);
    await notifyUser(p.id, 'Pengajuan Operator belum disetujui', 'Kamu tetap bisa menggunakan HumanAI seperti biasa.');
    await refresh();
  }

  return (
    <section className="rounded-md border border-ink-border p-5">
      <h2 className="font-display text-base">Pending Operator Applications</h2>
      <div className="mt-3 space-y-2">
        {pending.length === 0 && <p className="text-xs text-ash-500">Tidak ada pengajuan yang menunggu.</p>}
        {pending.map((p) => (
          <div key={p.id} className="flex items-center justify-between rounded-sm bg-ink-raised px-3 py-2.5">
            <div>
              <p className="text-sm font-medium">{p.username}</p>
              <p className="text-xs text-ash-500">Mengajukan diri sebagai operator</p>
            </div>
            <div className="flex gap-2">
              <button className="btn-primary btn-sm" onClick={() => onApprove(p)}>
                Approve
              </button>
              <button className="btn-ghost btn-sm" onClick={() => onReject(p)}>
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
