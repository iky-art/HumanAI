import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { getReducedMotionPref, setReducedMotionPref } from '../lib/preferences';
import PasswordInput from '../components/PasswordInput';

export default function Settings() {
  const { profile, logout, refreshProfile } = useAuth();
  const navigate = useNavigate();
  if (!profile) return null;

  return (
    <main className="mx-auto max-w-2xl px-6 py-10 md:px-12">
      <h1 className="font-display text-2xl">Settings</h1>

      <AccountSection />
      <SecuritySection />
      <NotificationSection />
      <AppearanceSection />
      <PrivacySection onDeleted={() => { logout(); navigate('/'); }} />
      <AboutSection />
    </main>
  );

  function AccountSection() {
    const [wa, setWa] = useState(profile!.wa_number);
    const [saved, setSaved] = useState(false);

    async function save() {
      const digits = wa.replace(/[^0-9]/g, '');
      if (digits.length < 9 || digits.length > 15) return;
      await supabase.from('profiles').update({ wa_number: wa.trim() }).eq('id', profile!.id);
      await refreshProfile();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }

    return (
      <Section title="Akun">
        <Field label="Username">
          <input className="input" value={profile!.username} readOnly />
        </Field>
        <Field label="Nomor WhatsApp aktif">
          <div className="flex gap-2">
            <input className="input flex-1" value={wa} onChange={(e) => setWa(e.target.value)} />
            <button className="btn-ghost btn-sm" onClick={save}>
              {saved ? 'Tersimpan' : 'Simpan'}
            </button>
          </div>
        </Field>
        <Field label="Role">
          <p className="font-display text-sm">{profile!.role}</p>
        </Field>
      </Section>
    );
  }

  function SecuritySection() {
    const [current, setCurrent] = useState('');
    const [next, setNext] = useState('');
    const [error, setError] = useState('');
    const [done, setDone] = useState(false);

    async function onSubmit(e: FormEvent) {
      e.preventDefault();
      setError('');
      const email = `${profile!.username.toLowerCase()}@users.humanai.app`;
      const check = await supabase.auth.signInWithPassword({ email, password: current });
      if (check.error) {
        setError('Password saat ini salah.');
        return;
      }
      const { error: updateError } = await supabase.auth.updateUser({ password: next });
      if (updateError) {
        setError(updateError.message);
        return;
      }
      setCurrent('');
      setNext('');
      setDone(true);
      setTimeout(() => setDone(false), 2500);
    }

    return (
      <Section title="Keamanan">
        <form onSubmit={onSubmit} className="space-y-4">
          <Field label="Password saat ini">
            <PasswordInput value={current} onChange={setCurrent} autoComplete="current-password" required />
          </Field>
          <Field label="Password baru">
            <PasswordInput value={next} onChange={setNext} autoComplete="new-password" minLength={6} required />
          </Field>
          {error && <p className="text-sm text-danger">{error}</p>}
          {done && <p className="text-sm text-human">Password berhasil diganti.</p>}
          <button type="submit" className="btn-primary btn-sm">
            Ganti Password
          </button>
        </form>
      </Section>
    );
  }

  function NotificationSection() {
    const [enabled, setEnabled] = useState(profile!.notifications_enabled);

    async function toggle(checked: boolean) {
      setEnabled(checked);
      await supabase.from('profiles').update({ notifications_enabled: checked }).eq('id', profile!.id);
      await refreshProfile();
    }

    return (
      <Section title="Notifikasi">
        <Toggle
          checked={enabled}
          onChange={toggle}
          label="Beri tahu saya saat operator membalas atau status berubah"
        />
      </Section>
    );
  }

  function AppearanceSection() {
    const [reduced, setReduced] = useState(getReducedMotionPref());

    function toggle(checked: boolean) {
      setReduced(checked);
      setReducedMotionPref(checked);
    }

    return (
      <Section title="Tampilan">
        <Toggle checked={reduced} onChange={toggle} label="Kurangi animasi & transisi" />
      </Section>
    );
  }

  function PrivacySection({ onDeleted }: { onDeleted: () => void }) {
    async function eraseData() {
      const confirmed = confirm(
        'Hapus akun, percakapan, dan notifikasi kamu? Tindakan ini tidak bisa dibatalkan.'
      );
      if (!confirmed) return;
      await supabase.from('profiles').delete().eq('id', profile!.id);
      onDeleted();
    }

    return (
      <Section title="Privasi & Data">
        <p className="mb-3 text-sm text-ash-300">
          Data akun, percakapan, dan notifikasi kamu tersimpan di database HumanAI (Supabase). Kamu bisa
          menghapusnya kapan saja.
        </p>
        <button onClick={eraseData} className="btn-ghost btn-sm border-danger text-danger">
          Hapus semua data saya
        </button>
      </Section>
    );
  }

  function AboutSection() {
    return (
      <Section title="Tentang">
        <p className="text-sm text-ash-300">HumanAI v1.0.0 — dikembangkan oleh Orbit Studio.</p>
        <div className="mt-2 flex flex-col gap-1.5">
          <a href="/about" className="text-sm text-signal-blue underline underline-offset-2">
            Tentang HumanAI
          </a>
          <a href="/rules" className="text-sm text-signal-blue underline underline-offset-2">
            Aturan penggunaan
          </a>
        </div>
      </Section>
    );
  }
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6 rounded-md border border-ink-border p-5">
      <h2 className="mb-4 font-display text-base">{title}</h2>
      {children}
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="mb-4 block last:mb-0">
      <span className="mb-1.5 block text-sm text-ash-300">{label}</span>
      {children}
    </label>
  );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center gap-3 text-sm text-ash-300">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded-sm border-ink-border bg-ink-raised accent-signal-blue"
      />
      {label}
    </label>
  );
}
