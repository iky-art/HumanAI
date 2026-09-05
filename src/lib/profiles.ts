import { supabase } from './supabase';
import type { Profile } from '../types/database';

export async function fetchAllProfiles(): Promise<Profile[]> {
  const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: true });
  if (error) throw error;
  return (data as Profile[]) ?? [];
}

export async function fetchPendingApplications(): Promise<Profile[]> {
  const { data, error } = await supabase.from('profiles').select('*').eq('operator_status', 'pending');
  if (error) throw error;
  return (data as Profile[]) ?? [];
}

export async function approveOperator(userId: string) {
  const { error } = await supabase
    .from('profiles')
    .update({ role: 'operator', operator_status: 'approved' })
    .eq('id', userId);
  if (error) throw error;
}

export async function rejectOperator(userId: string) {
  const { error } = await supabase.from('profiles').update({ operator_status: 'rejected' }).eq('id', userId);
  if (error) throw error;
}
