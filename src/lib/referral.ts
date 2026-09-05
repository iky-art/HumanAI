import { supabase } from './supabase';
import { notifyUser } from './notifications';
import type { Profile } from '../types/database';

export const PROMOTION_TARGET = 10;
export const INVITE_TARGET = 10;
export const OPERATOR_ELIGIBILITY_DAYS = 30;

export function operatorDaysElapsed(profile: Profile): number {
  if (!profile.operator_eligibility_started) return 0;
  const started = new Date(profile.operator_eligibility_started).getTime();
  return Math.max(0, Math.floor((Date.now() - started) / (1000 * 60 * 60 * 24)));
}

export type EligibilityState =
  | 'already-operator'
  | 'pending'
  | 'rejected'
  | 'not-started'
  | 'counting'
  | 'eligible';

export function operatorEligibilityState(profile: Profile): EligibilityState {
  if (profile.role === 'operator') return 'already-operator';
  if (profile.operator_status === 'pending') return 'pending';
  if (profile.operator_status === 'rejected') return 'rejected';
  if (!profile.operator_eligibility_started) return 'not-started';
  return operatorDaysElapsed(profile) >= OPERATOR_ELIGIBILITY_DAYS ? 'eligible' : 'counting';
}

export async function startOperatorEligibility(userId: string) {
  const { error } = await supabase
    .from('profiles')
    .update({ operator_eligibility_started: new Date().toISOString() })
    .eq('id', userId);
  if (error) throw error;
}

export async function applyForOperator(userId: string) {
  const { error } = await supabase.from('profiles').update({ operator_status: 'pending' }).eq('id', userId);
  if (error) throw error;
}

/** Bumps a promo/invite counter by one (prototype simulation — a real
 *  build should verify shares/invites server-side, not trust the client). */
export async function bumpProgress(
  profile: Profile,
  field: 'social_promotion_count' | 'friend_invite_count'
): Promise<Profile> {
  const nextValue = Math.min((profile[field] || 0) + 1, PROMOTION_TARGET);
  const patch: Partial<Profile> = { [field]: nextValue };

  const promoDone = field === 'social_promotion_count' ? nextValue >= PROMOTION_TARGET : profile.social_promotion_count >= PROMOTION_TARGET;
  const inviteDone = field === 'friend_invite_count' ? nextValue >= INVITE_TARGET : profile.friend_invite_count >= INVITE_TARGET;

  if (promoDone && inviteDone && !profile.profile_title) {
    patch.profile_title = 'Support for HumanAI';
  }

  const { data, error } = await supabase.from('profiles').update(patch).eq('id', profile.id).select('*').single();
  if (error) throw error;

  if (patch.profile_title) {
    await notifyUser(profile.id, 'Title baru terbuka!', '"Support for HumanAI" sekarang ada di profile kamu.');
  }

  return data as Profile;
}

export function referralLink(profile: Profile): string {
  return `${window.location.origin}/login?ref=${profile.referral_code}`;
}
