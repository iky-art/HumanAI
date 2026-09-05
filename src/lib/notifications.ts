import { supabase } from './supabase';
import type { Notification } from '../types/database';

export async function fetchNotifications(userId: string): Promise<Notification[]> {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(30);
  if (error) throw error;
  return (data as Notification[]) ?? [];
}

export async function markAllNotificationsRead(userId: string) {
  const { error } = await supabase.from('notifications').update({ read: true }).eq('user_id', userId).eq('read', false);
  if (error) throw error;
}

export async function notifyUser(userId: string, title: string, body?: string) {
  const { data: pref } = await supabase.from('profiles').select('notifications_enabled').eq('id', userId).single();
  if (pref && pref.notifications_enabled === false) return;

  const { error } = await supabase.from('notifications').insert({ user_id: userId, title, body: body ?? null });
  if (error) throw error;
}
