import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  operatorEligibilityState,
  operatorDaysElapsed,
  startOperatorEligibility,
  applyForOperator,
  bumpProgress,
  referralLink,
  OPERATOR_ELIGIBILITY_DAYS,
  PROMOTION_TARGET,
  INVITE_TARGET,
} from '../lib/referral';

const ROLE_LABEL: Record<string, string> = { user: 'User', operator: 'Operator', admin: 'Admin', founder: 'Founder' };

export default function Profile() {
  const { profile, refreshProfile } = useAuth();
  const [copied, setCopied] = useState(false);
  if (!profile) return null;

  const state = operatorEligibilityState(profile);
  const days = operatorDaysElapsed(profile);

  async function copyLink() {
    await navigator.clipboard.writeText(referralLink(profile!));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function onStartEligibility() {
    await startOperatorEligibility(profile!.id);
    await refreshProfile();
  }
  async function onApply() {
    await applyForOperator(profile!.id);
    await refreshProfile();
  }
  async function onSimulate(field: 'social_promotion_count' | 'friend_invite_count') {
    await bumpProgress(profile!, field);
    await refreshProfile();
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-10 md:px-12">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-signal-blue to-signal-magenta font-display text-xl font-semibold text-ink">
          {profile.username.slice(0, 1).toUpperCase()}
        </div>
        <div>
          <h1 className="font-display text-xl">{profile.username}</h1>
          <p className="text-sm text-ash-500">{profile.profile_title ?? 'No title yet'}</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Role" value={ROLE_LABEL[profile.role]} />
        <Stat
          label="Member sejak"
          value={new Date(profile.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
        />
        <Stat label="WhatsApp" value={profile.wa_number} />
        <Stat
          label="Status Operator"
          value={
            profile.role === 'operator'
              ? 'Aktif'
              : profile.operator_status
                ? { pending: 'Menunggu', approved: 'Approved', rejected: 'Ditolak' }[profile.operator_status]!
                : 'Belum mengajukan'
          }
        />
      </div>

      {/* Referral / promotion progress */}
      <section className="mt-8 rounded-md border border-ink-border p-5">
        <h2 className="font-display text-base">Promosikan HumanAI</h2>
        <p className="mt-1 text-sm text-ash-500">Bantu HumanAI berkembang lewat promosi & undangan teman.</p>

        <ProgressRow label="Promosi Sosial Media" value={profile.social_promotion_count} target={PROMOTION_TARGET} />
        <ProgressRow label="Undang Teman" value={profile.friend_invite_count} target={INVITE_TARGET} />

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button className="btn-ghost btn-sm" onClick={copyLink}>
            {copied ? 'Tersalin!' : 'Salin Link Undangan'}
          </button>
          {profile.social_promotion_count < PROMOTION_TARGET && (
            <button className="btn-ghost btn-sm" onClick={() => onSimulate('social_promotion_count')}>
              +1 Promosi (simulasi)
            </button>
          )}
          {profile.friend_invite_count < INVITE_TARGET && (
            <button className="btn-ghost btn-sm" onClick={() => onSimulate('friend_invite_count')}>
              +1 Undangan (simulasi)
            </button>
          )}
        </div>
      </section>

      {/* Become an operator */}
      <section className="mt-6 rounded-md border border-ink-border p-5">
        <h2 className="font-display text-base">Jadilah Operator</h2>

        {state === 'already-operator' && (
          <p className="mt-2 text-sm text-ash-300">
            Kamu sudah jadi Operator. Buka <span className="text-human">Operator Panel</span> dari menu atas untuk mulai membalas.
          </p>
        )}
        {state === 'not-started' && (
          <>
            <p className="mt-2 text-sm text-ash-300">
              Kamu harus menggunakan HumanAI selama {OPERATOR_ELIGIBILITY_DAYS} hari dulu sebelum bisa mendaftar.
            </p>
            <button className="btn-primary btn-sm mt-3" onClick={onStartEligibility}>
              Oke, saya mengerti
            </button>
          </>
        )}
        {state === 'counting' && (
          <div className="mt-3">
            <ProgressRow label="Progress" value={days} target={OPERATOR_ELIGIBILITY_DAYS} suffix=" hari" />
          </div>
        )}
        {state === 'eligible' && (
          <>
            <p className="mt-2 text-sm text-ash-300">Kamu sudah eligible! Silakan ajukan diri sebagai operator.</p>
            <button className="btn-primary btn-sm mt-3" onClick={onApply}>
              Ajukan diri sebagai Operator
            </button>
          </>
        )}
        {state === 'pending' && <p className="mt-2 text-sm text-human">Menunggu persetujuan Admin/Founder.</p>}
        {state === 'rejected' && (
          <p className="mt-2 text-sm text-ash-300">Pengajuan kamu belum disetujui kali ini — kamu tetap bisa pakai HumanAI seperti biasa.</p>
        )}
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-ink-border p-3">
      <p className="text-xs text-ash-500">{label}</p>
      <p className="mt-1 font-display text-sm">{value}</p>
    </div>
  );
}

function ProgressRow({ label, value, target, suffix = '' }: { label: string; value: number; target: number; suffix?: string }) {
  const pct = Math.min(100, (value / target) * 100);
  return (
    <div className="mt-3">
      <div className="flex justify-between text-xs text-ash-500">
        <span>{label}</span>
        <span>
          {value} / {target}
          {suffix}
          {value >= target ? ' ✓' : ''}
        </span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-ink-raised">
        <div className="h-full rounded-full bg-gradient-to-r from-signal-blue to-human" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
