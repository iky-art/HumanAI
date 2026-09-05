-- ============================================================
-- HumanAI v1.0.0 — 0002: record ToS/Privacy consent
-- Run this AFTER 0001_init.sql, same way (SQL Editor -> Run).
-- ============================================================

alter table public.profiles
  add column if not exists terms_agreed_at timestamptz;

comment on column public.profiles.terms_agreed_at is
  'Timestamp when the user ticked "I agree to Terms & Privacy Policy" at
   signup. Kept as evidence of consent — never backdated or auto-filled.';
