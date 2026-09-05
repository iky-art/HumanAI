-- ============================================================
-- HumanAI v1.0.0 — initial schema
-- Run this in Supabase: SQL Editor -> paste -> Run
-- (or via CLI: supabase db push, once linked to your project)
-- ============================================================

-- --------------------------------------------------------------
-- profiles
-- One row per user, linked 1:1 to Supabase Auth's auth.users.
-- Supabase Auth already handles password hashing/sessions — we
-- never store passwords ourselves.
-- --------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  wa_number text not null,
  role text not null default 'user' check (role in ('user', 'operator', 'admin', 'founder')),
  operator_status text check (operator_status in ('pending', 'approved', 'rejected')),
  operator_eligibility_started timestamptz,
  social_promotion_count int not null default 0,
  friend_invite_count int not null default 0,
  profile_title text,
  referral_code text unique not null,
  created_at timestamptz not null default now()
);

comment on column public.profiles.wa_number is
  'Full WhatsApp number. Never sent to the client unmasked except to founders — see app-level masking in the admin/founder WA panel.';

-- --------------------------------------------------------------
-- conversations
-- --------------------------------------------------------------
create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  operator_id uuid references public.profiles(id) on delete set null,
  status text not null default 'waiting' check (status in ('waiting', 'active', 'completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- --------------------------------------------------------------
-- messages
-- --------------------------------------------------------------
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  sender_role text not null check (sender_role in ('user', 'operator')),
  body text not null,
  created_at timestamptz not null default now()
);

-- --------------------------------------------------------------
-- notifications (per-user inbox)
-- --------------------------------------------------------------
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  body text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

-- --------------------------------------------------------------
-- broadcasts (admin/founder -> everyone)
-- --------------------------------------------------------------
create table if not exists public.broadcasts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id),
  title text not null,
  body text not null,
  created_at timestamptz not null default now()
);

-- Per-user "have I seen this broadcast" tracking, same idea as
-- notifications' `read` flag but many-to-many (one broadcast, many users).
create table if not exists public.broadcast_reads (
  broadcast_id uuid not null references public.broadcasts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  read_at timestamptz not null default now(),
  primary key (broadcast_id, user_id)
);

-- --------------------------------------------------------------
-- wa_number audit log
-- Every time an admin reveals a masked WhatsApp number, log it.
-- Founders see numbers unmasked with no log (highest trust level);
-- admins must leave a reason, matching the "kalau ada apa-apa"
-- requirement — this is the accountability trail for that.
-- --------------------------------------------------------------
create table if not exists public.wa_reveal_log (
  id uuid primary key default gen_random_uuid(),
  revealed_by uuid not null references public.profiles(id),
  target_user_id uuid not null references public.profiles(id),
  reason text not null,
  created_at timestamptz not null default now()
);

-- --------------------------------------------------------------
-- helper: is the current user an operator/admin/founder?
-- SECURITY DEFINER so it can read profiles even under RLS,
-- without letting callers pass an arbitrary user id.
-- --------------------------------------------------------------
create or replace function public.current_role()
returns text
language sql
security definer
stable
as $$
  select role from public.profiles where id = auth.uid();
$$;

-- ============================================================
-- Row Level Security
-- ============================================================

alter table public.profiles enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.notifications enable row level security;
alter table public.broadcasts enable row level security;
alter table public.broadcast_reads enable row level security;
alter table public.wa_reveal_log enable row level security;

-- --- profiles ---
create policy "profiles: self can read own row"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles: staff can read all rows"
  on public.profiles for select
  using (public.current_role() in ('operator', 'admin', 'founder'));

create policy "profiles: self can update own row"
  on public.profiles for update
  using (auth.uid() = id);

create policy "profiles: admin/founder can update any row"
  on public.profiles for update
  using (public.current_role() in ('admin', 'founder'));

create policy "profiles: self can insert own row on signup"
  on public.profiles for insert
  with check (auth.uid() = id);

-- --- conversations ---
create policy "conversations: user can read own"
  on public.conversations for select
  using (auth.uid() = user_id);

create policy "conversations: staff can read all"
  on public.conversations for select
  using (public.current_role() in ('operator', 'admin', 'founder'));

create policy "conversations: user can create own"
  on public.conversations for insert
  with check (auth.uid() = user_id);

create policy "conversations: staff can update (claim/close)"
  on public.conversations for update
  using (public.current_role() in ('operator', 'admin', 'founder'));

-- --- messages ---
create policy "messages: user can read own conversation's messages"
  on public.messages for select
  using (
    exists (
      select 1 from public.conversations c
      where c.id = conversation_id and c.user_id = auth.uid()
    )
  );

create policy "messages: staff can read all messages"
  on public.messages for select
  using (public.current_role() in ('operator', 'admin', 'founder'));

create policy "messages: user can send in own conversation"
  on public.messages for insert
  with check (
    sender_id = auth.uid()
    and sender_role = 'user'
    and exists (
      select 1 from public.conversations c
      where c.id = conversation_id and c.user_id = auth.uid()
    )
  );

create policy "messages: staff can send as operator"
  on public.messages for insert
  with check (
    sender_id = auth.uid()
    and sender_role = 'operator'
    and public.current_role() in ('operator', 'admin', 'founder')
  );

-- --- notifications ---
create policy "notifications: user manages own"
  on public.notifications for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "notifications: staff can insert for anyone"
  on public.notifications for insert
  with check (public.current_role() in ('operator', 'admin', 'founder'));

-- --- broadcasts ---
create policy "broadcasts: everyone signed in can read"
  on public.broadcasts for select
  using (auth.uid() is not null);

create policy "broadcasts: admin/founder can create"
  on public.broadcasts for insert
  with check (public.current_role() in ('admin', 'founder'));

-- --- broadcast_reads ---
create policy "broadcast_reads: user manages own"
  on public.broadcast_reads for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- --- wa_reveal_log ---
create policy "wa_reveal_log: staff can read"
  on public.wa_reveal_log for select
  using (public.current_role() in ('admin', 'founder'));

create policy "wa_reveal_log: admin must log every reveal"
  on public.wa_reveal_log for insert
  with check (
    revealed_by = auth.uid()
    and public.current_role() in ('admin', 'founder')
  );

-- ============================================================
-- Realtime — let the client subscribe to live changes
-- ============================================================
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.conversations;
alter publication supabase_realtime add table public.notifications;
alter publication supabase_realtime add table public.broadcasts;

-- ============================================================
-- Prototype-bootstrap note (mirrors the old prototype's behavior):
-- the FIRST person to sign up should become founder so the
-- founder/admin panels are reachable without a support ticket.
-- This is handled in application code at sign-up time (checking
-- `select count(*) from profiles`), not in SQL — see
-- src/context/AuthContext.tsx in a later stage.
-- TODO(security): remove this bootstrap path once you have a
-- real founder account, or gate it behind an invite code.
-- ============================================================
