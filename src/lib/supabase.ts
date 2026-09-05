import { createClient } from '@supabase/supabase-js';

// These are PUBLIC values by design — the anon/publishable key is meant
// to ship inside frontend code (unlike a service-role key, which must
// never appear here). Row Level Security on the database is what
// actually protects data, not hiding this key.
const FALLBACK_URL = 'https://ftjkjgoxfczbcxosbquk.supabase.co';
const FALLBACK_ANON_KEY = 'sb_publishable_9_ClS24Au7gtnOhwEM_5Sw_7hCZ-uLx';

const url = import.meta.env.VITE_SUPABASE_URL || FALLBACK_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || FALLBACK_ANON_KEY;

export const supabase = createClient(url, anonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
