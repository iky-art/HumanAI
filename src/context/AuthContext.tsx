import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { Profile } from '../types/database';

// By design, HumanAI never auto-verifies the WhatsApp number through
// an OTP provider (Twilio, Fonnte, etc.) — wiring in a third-party API
// key just to confirm a phone number would work against the product's
// own "no hidden API key" premise. Supabase Auth still needs an email
// or phone identifier though, so we register with a synthetic email
// built from the chosen username, and keep the *real* WhatsApp number
// in `profiles.wa_number` as a plain, unverified contact field. The
// only "verification" that ever happens is a human operator actually
// messaging that number when it matters — manual, not automated.
function syntheticEmail(username: string) {
  return `${username.toLowerCase()}@users.humanai.app`;
}

function referralCode(username: string) {
  const clean = username.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 6);
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${clean || 'human'}-${suffix}`.toUpperCase();
}

interface AuthContextValue {
  profile: Profile | null;
  loading: boolean;
  register: (input: {
    username: string;
    password: string;
    confirmPassword: string;
    waNumber: string;
    agreedToTerms: boolean;
  }) => Promise<{ ok: boolean; error?: string }>;
  login: (username: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function isValidWhatsapp(value: string) {
  const digitsOnly = value.replace(/[^0-9]/g, '');
  return digitsOnly.length >= 9 && digitsOnly.length <= 15;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadProfile() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }
    const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    if (error) {
      setProfile(null);
    } else {
      setProfile(data as Profile);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadProfile();
    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      loadProfile();
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function register({
    username,
    password,
    confirmPassword,
    waNumber,
    agreedToTerms,
  }: {
    username: string;
    password: string;
    confirmPassword: string;
    waNumber: string;
    agreedToTerms: boolean;
  }): Promise<{ ok: boolean; error?: string }> {
    const cleanUsername = username.trim();
    if (cleanUsername.length < 3) return { ok: false, error: 'Username minimal 3 karakter.' };
    if (password.length < 6) return { ok: false, error: 'Password minimal 6 karakter.' };
    if (password !== confirmPassword) return { ok: false, error: 'Konfirmasi password tidak sama.' };
    if (!isValidWhatsapp(waNumber)) return { ok: false, error: 'Nomor WhatsApp tidak valid.' };
    if (!agreedToTerms) {
      return { ok: false, error: 'Kamu harus menyetujui Syarat & Ketentuan dan Kebijakan Privasi dulu.' };
    }

    // Prototype-style bootstrap, carried over on purpose: the very
    // first account ever created becomes founder, so the founder/admin
    // panels are reachable without a support ticket.
    // TODO(security): remove or gate behind an invite code once a real
    // founder account exists.
    const { count } = await supabase.from('profiles').select('id', { count: 'exact', head: true });
    const role = count === 0 ? 'founder' : 'user';

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: syntheticEmail(cleanUsername),
      password,
    });
    if (signUpError || !signUpData.user) {
      return { ok: false, error: signUpError?.message || 'Gagal membuat akun.' };
    }

    const { error: profileError } = await supabase.from('profiles').insert({
      id: signUpData.user.id,
      username: cleanUsername,
      wa_number: waNumber.trim(),
      role,
      referral_code: referralCode(cleanUsername),
      terms_agreed_at: new Date().toISOString(),
    });
    if (profileError) {
      return { ok: false, error: profileError.message };
    }

    await loadProfile();
    return { ok: true };
  }

  async function login(username: string, password: string): Promise<{ ok: boolean; error?: string }> {
    const { error } = await supabase.auth.signInWithPassword({
      email: syntheticEmail(username.trim()),
      password,
    });
    if (error) return { ok: false, error: 'Username atau password salah.' };
    await loadProfile();
    return { ok: true };
  }

  async function logout() {
    await supabase.auth.signOut();
    setProfile(null);
  }

  return (
    <AuthContext.Provider value={{ profile, loading, register, login, logout, refreshProfile: loadProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
