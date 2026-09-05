-- ============================================================
-- HumanAI v1.0.0 — 0003: notification preference + self-delete
-- Run this AFTER 0001 and 0002 (SQL Editor -> Run).
-- ============================================================

alter table public.profiles
  add column if not exists notifications_enabled boolean not null default true;

-- Lets a user delete their own account from the Settings page.
-- Conversations/messages/notifications cascade-delete automatically
-- (see "on delete cascade" in 0001_init.sql).
-- NOTE: this only removes the `profiles` row — the underlying
-- auth.users row is NOT deleted from the client (that needs the
-- service-role key, which must stay server-side). A real launch
-- needs a Cloudflare Pages Function that also calls
-- `supabase.auth.admin.deleteUser()` to fully remove the account.
create policy "profiles: self can delete own row"
  on public.profiles for delete
  using (auth.uid() = id);
