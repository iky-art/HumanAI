import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchAllProfiles } from '../lib/profiles';
import { maskWa, waLink, logWaReveal } from '../lib/wa';
import type { Profile } from '../types/database';

interface WaUserPanelProps {
  /** true = Admin view (masked, reveal requires a logged reason).
   *  false = Founder view (full number, no gate — highest trust level). */
  masked: boolean;
}

export default function WaUserPanel({ masked }: WaUserPanelProps) {
  const { profile: me } = useAuth();
  const [users, setUsers] = useState<Profile[]>([]);
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const [reasonFor, setReasonFor] = useState<string | null>(null);
  const [reason, setReason] = useState('');

  useEffect(() => {
    fetchAllProfiles().then(setUsers);
  }, []);

  async function confirmReveal() {
    if (!reasonFor || !reason.trim() || !me) return;
    await logWaReveal(me.id, reasonFor, reason.trim());
    setRevealed((prev) => new Set(prev).add(reasonFor));
    setReasonFor(null);
    setReason('');
  }

  return (
    <section className="rounded-md border border-ink-border p-5">
      <h2 className="font-display text-base">WA User</h2>
      <p className="mt-1 text-xs text-ash-500">
        {masked
          ? 'Nomor ditampilkan tersamar. Setiap kali kamu buka nomor lengkap, itu tercatat beserta alasannya.'
          : 'Kamu melihat nomor lengkap sebagai Founder — pastikan cuma dipakai untuk keperluan yang memang perlu.'}
      </p>

      <div className="mt-3 max-h-80 space-y-1.5 overflow-y-auto">
        {users.map((u) => {
          const canSeeFull = !masked || revealed.has(u.id);
          return (
            <div key={u.id} className="flex items-center justify-between rounded-sm bg-ink-raised px-3 py-2.5">
              <div>
                <p className="text-sm font-medium">{u.username}</p>
                <p className="font-mono text-xs text-ash-300">{canSeeFull ? u.wa_number : maskWa(u.wa_number)}</p>
              </div>
              <div className="flex items-center gap-2">
                {canSeeFull && (
                  <a
                    href={waLink(u.wa_number)}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-human underline underline-offset-2"
                  >
                    Buka WA
                  </a>
                )}
                {!canSeeFull && (
                  <button className="btn-ghost btn-sm" onClick={() => setReasonFor(u.id)}>
                    Lihat lengkap
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {reasonFor && (
        <div className="mt-4 rounded-sm border border-ink-border bg-ink-card p-4">
          <p className="text-sm font-medium">Kenapa kamu perlu lihat nomor ini?</p>
          <p className="mt-1 text-xs text-ash-500">Alasan ini tercatat di log internal (wa_reveal_log).</p>
          <textarea
            className="input mt-2 min-h-20"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Misal: menindaklanjuti laporan pelanggaran dari user X"
          />
          <div className="mt-2 flex gap-2">
            <button className="btn-primary btn-sm" onClick={confirmReveal} disabled={!reason.trim()}>
              Konfirmasi & Lihat
            </button>
            <button className="btn-ghost btn-sm" onClick={() => { setReasonFor(null); setReason(''); }}>
              Batal
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
