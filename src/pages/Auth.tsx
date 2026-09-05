import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from '../components/LanguageSwitcher';
import PasswordInput from '../components/PasswordInput';

export default function Auth() {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const { t } = useLanguage();

  return (
    <main className="flex min-h-dvh flex-col bg-ink px-6 py-6 text-ash-100 md:px-12">
      <div className="flex items-center justify-between">
        <Link to="/" className="font-display text-lg font-medium">
          HumanAI
        </Link>
        <LanguageSwitcher />
      </div>

      {/* Vertically centers the card in the remaining space below the header. */}
      <div className="flex flex-1 items-center justify-center py-8">
        <div className="w-full max-w-sm">
          <div className="mb-6 flex gap-6 border-b border-ink-border text-sm">
            <TabButton active={tab === 'login'} onClick={() => setTab('login')}>
              {t('auth.login_tab')}
            </TabButton>
            <TabButton active={tab === 'register'} onClick={() => setTab('register')}>
              {t('auth.register_tab')}
            </TabButton>
          </div>

          {tab === 'login' ? <LoginForm /> : <RegisterForm />}
        </div>
      </div>
    </main>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        'relative pb-3 font-medium transition-colors ' + (active ? 'text-ash-100' : 'text-ash-500 hover:text-ash-300')
      }
    >
      {children}
      {active && <span className="absolute inset-x-0 -bottom-px h-0.5 bg-signal-blue" />}
    </button>
  );
}

function LoginForm() {
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    const result = await login(username, password);
    setBusy(false);
    if (!result.ok) {
      setError(result.error || t('auth.error_generic'));
      return;
    }
    navigate('/chat');
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <Field label={t('auth.username')}>
        <input
          className="input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder={t('auth.placeholder_username')}
          autoComplete="username"
          required
        />
      </Field>
      <Field label={t('auth.password')}>
        <PasswordInput
          value={password}
          onChange={setPassword}
          placeholder={t('auth.placeholder_password')}
          autoComplete="current-password"
          required
        />
      </Field>
      {error && <p className="text-sm text-danger">{error}</p>}
      <button type="submit" disabled={busy} className="btn-primary">
        {t('auth.submit_login')}
      </button>
    </form>
  );
}

function RegisterForm() {
  const { register } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (!agreed) {
      setError(t('auth.error_must_agree'));
      return;
    }

    setBusy(true);
    const result = await register({ username, password, confirmPassword, waNumber: whatsapp, agreedToTerms: agreed });
    setBusy(false);
    if (!result.ok) {
      setError(result.error || t('auth.error_generic'));
      return;
    }
    navigate('/chat');
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <Field label={t('auth.username')}>
        <input
          className="input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder={t('auth.placeholder_username_register')}
          minLength={3}
          autoComplete="username"
          required
        />
      </Field>
      <Field label={t('auth.whatsapp')} hint={t('auth.whatsapp_hint')}>
        <input
          className="input"
          type="tel"
          inputMode="numeric"
          placeholder="08123456789"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          autoComplete="tel"
          required
        />
      </Field>
      <Field label={t('auth.password')}>
        <PasswordInput
          value={password}
          onChange={setPassword}
          placeholder={t('auth.placeholder_password_register')}
          autoComplete="new-password"
          minLength={6}
          required
        />
      </Field>
      <Field label={t('auth.confirm_password')}>
        <PasswordInput
          value={confirmPassword}
          onChange={setConfirmPassword}
          placeholder={t('auth.placeholder_confirm')}
          autoComplete="new-password"
          minLength={6}
          required
        />
      </Field>

      <label className="flex items-start gap-2.5 text-xs text-ash-300">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          required
          className="mt-0.5 h-4 w-4 flex-shrink-0 rounded-sm border-ink-border bg-ink-raised accent-signal-blue"
        />
        <span>
          {t('auth.agree_prefix')}{' '}
          <Link to="/legal/terms" target="_blank" className="text-signal-blue underline underline-offset-2">
            {t('auth.terms_link')}
          </Link>{' '}
          {t('auth.and')}{' '}
          <Link to="/legal/privacy" target="_blank" className="text-signal-blue underline underline-offset-2">
            {t('auth.privacy_link')}
          </Link>
          .
        </span>
      </label>

      {error && <p className="text-sm text-danger">{error}</p>}
      <button type="submit" disabled={busy} className="btn-primary">
        {t('auth.submit_register')}
      </button>
    </form>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm text-ash-300">{label}</span>
      {children}
      {hint && <span className="mt-1.5 block text-xs text-ash-500">{hint}</span>}
    </label>
  );
}
