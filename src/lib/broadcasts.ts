import { supabase } from './supabase';
import type { Broadcast } from '../types/database';

export interface BroadcastWithReadState extends Broadcast {
  read: boolean;
}

export async function fetchBroadcasts(userId: string): Promise<BroadcastWithReadState[]> {
  const { data: broadcasts, error } = await supabase
    .from('broadcasts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20);
  if (error) throw error;

  const { data: reads, error: readsError } = await supabase
    .from('broadcast_reads')
    .select('broadcast_id')
    .eq('user_id', userId);
  if (readsError) throw readsError;

  const readIds = new Set((reads ?? []).map((r) => r.broadcast_id));
  return (broadcasts as Broadcast[]).map((b) => ({ ...b, read: readIds.has(b.id) }));
}

export async function markBroadcastRead(broadcastId: string, userId: string) {
  const { error } = await supabase
    .from('broadcast_reads')
    .upsert({ broadcast_id: broadcastId, user_id: userId }, { onConflict: 'broadcast_id,user_id' });
  if (error) throw error;
}

export async function sendBroadcast(authorId: string, title: string, body: string) {
  const { error } = await supabase.from('broadcasts').insert({ author_id: authorId, title, body });
  if (error) throw error;
}
