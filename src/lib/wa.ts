import { supabase } from './supabase';

/** Turns a stored Indonesian WA number into a valid wa.me link. */
export function waLink(rawNumber: string): string {
  const digits = rawNumber.replace(/[^0-9]/g, '');
  const withCountryCode = digits.startsWith('0') ? `62${digits.slice(1)}` : digits;
  return `https://wa.me/${withCountryCode}`;
}

/** Masks a WA number for the Admin directory: keep first 4 + last 2 digits. */
export function maskWa(rawNumber: string): string {
  const digits = rawNumber.replace(/[^0-9]/g, '');
  if (digits.length <= 6) return '•'.repeat(digits.length);
  const start = digits.slice(0, 4);
  const end = digits.slice(-2);
  return `${start}${'•'.repeat(digits.length - 6)}${end}`;
}

export async function logWaReveal(revealedBy: string, targetUserId: string, reason: string) {
  const { error } = await supabase
    .from('wa_reveal_log')
    .insert({ revealed_by: revealedBy, target_user_id: targetUserId, reason });
  if (error) throw error;
}
