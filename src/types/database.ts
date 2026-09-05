export type Role = 'user' | 'operator' | 'admin' | 'founder';
export type OperatorStatus = 'pending' | 'approved' | 'rejected' | null;
export type ConversationStatus = 'waiting' | 'active' | 'completed';

export interface Profile {
  id: string;
  username: string;
  wa_number: string;
  role: Role;
  operator_status: OperatorStatus;
  operator_eligibility_started: string | null;
  social_promotion_count: number;
  friend_invite_count: number;
  profile_title: string | null;
  referral_code: string;
  terms_agreed_at: string | null;
  notifications_enabled: boolean;
  created_at: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  operator_id: string | null;
  status: ConversationStatus;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_role: 'user' | 'operator';
  body: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  body: string | null;
  read: boolean;
  created_at: string;
}

export interface Broadcast {
  id: string;
  author_id: string;
  title: string;
  body: string;
  created_at: string;
}
