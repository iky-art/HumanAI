import { supabase } from './supabase';
import type { Conversation, Message } from '../types/database';

/** Every conversation this user has ever had, most recently updated first. */
export async function fetchMyConversations(userId: string): Promise<Conversation[]> {
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });
  if (error) throw error;
  return (data as Conversation[]) ?? [];
}

/** Finds the user's current open conversation, or creates a fresh one. */
export async function getOrCreateMyConversation(userId: string): Promise<Conversation> {
  const { data: existing, error: findError } = await supabase
    .from('conversations')
    .select('*')
    .eq('user_id', userId)
    .neq('status', 'completed')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (findError) throw findError;
  if (existing) return existing as Conversation;

  const { data: created, error: createError } = await supabase
    .from('conversations')
    .insert({ user_id: userId, status: 'waiting' })
    .select('*')
    .single();

  if (createError) throw createError;
  return created as Conversation;
}

export async function fetchMessages(conversationId: string): Promise<Message[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return (data as Message[]) ?? [];
}

export async function sendUserMessage(conversationId: string, senderId: string, body: string) {
  const { error } = await supabase.from('messages').insert({
    conversation_id: conversationId,
    sender_id: senderId,
    sender_role: 'user',
    body,
  });
  if (error) throw error;

  // A new message from the user re-opens a completed thread, mirroring
  // the old prototype's behavior.
  await supabase
    .from('conversations')
    .update({ status: 'waiting', updated_at: new Date().toISOString() })
    .eq('id', conversationId)
    .eq('status', 'completed');
}

export async function sendOperatorMessage(conversationId: string, operatorId: string, body: string) {
  const { error } = await supabase.from('messages').insert({
    conversation_id: conversationId,
    sender_id: operatorId,
    sender_role: 'operator',
    body,
  });
  if (error) throw error;
  await supabase.from('conversations').update({ updated_at: new Date().toISOString() }).eq('id', conversationId);
}

export interface ConversationWithUser extends Conversation {
  profile: { username: string; wa_number: string } | null;
}

async function withUserProfiles(conversations: Conversation[]): Promise<ConversationWithUser[]> {
  if (conversations.length === 0) return [];
  const userIds = [...new Set(conversations.map((c) => c.user_id))];
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, username, wa_number')
    .in('id', userIds);
  if (error) throw error;

  const byId = new Map((profiles ?? []).map((p) => [p.id, p]));
  return conversations.map((c) => ({ ...c, profile: byId.get(c.user_id) ?? null }));
}

export async function fetchWaitingConversations(): Promise<ConversationWithUser[]> {
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('status', 'waiting')
    .order('created_at', { ascending: true });
  if (error) throw error;
  return withUserProfiles((data as Conversation[]) ?? []);
}

export async function fetchOperatorConversations(
  operatorId: string,
  status: 'active' | 'completed'
): Promise<ConversationWithUser[]> {
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('operator_id', operatorId)
    .eq('status', status)
    .order('updated_at', { ascending: false });
  if (error) throw error;
  return withUserProfiles((data as Conversation[]) ?? []);
}

/** Claims a waiting conversation. Fails silently (returns false) if
 *  another operator claimed it first — the .eq('status','waiting')
 *  guard makes this an atomic compare-and-set. */
export async function claimConversation(conversationId: string, operatorId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('conversations')
    .update({ status: 'active', operator_id: operatorId, updated_at: new Date().toISOString() })
    .eq('id', conversationId)
    .eq('status', 'waiting')
    .select('id');
  if (error) throw error;
  return (data?.length ?? 0) > 0;
}

export async function closeConversation(conversationId: string) {
  const { error } = await supabase
    .from('conversations')
    .update({ status: 'completed', updated_at: new Date().toISOString() })
    .eq('id', conversationId);
  if (error) throw error;
}
