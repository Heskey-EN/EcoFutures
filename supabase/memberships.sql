-- Run this in EACH app's Supabase (EPC Checker and Cavwall) → SQL Editor.
--
-- The Stripe webhook on ecofutures.uk writes rows here using the service_role
-- key. Your app reads them (by the logged-in user's email) to unlock the
-- paid membership. Access follows the live subscription: 'active' = unlock,
-- 'past_due'/'canceled' = lock.

create table if not exists public.memberships (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  product text not null,                   -- 'epc-checker' | 'cavwall'
  status text not null default 'active',   -- 'active' | 'past_due' | 'canceled'
  stripe_customer_id text,
  stripe_subscription_id text unique,      -- the webhook upserts on this
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists memberships_email_idx on public.memberships (email);

alter table public.memberships enable row level security;

-- A signed-in user may read only their own membership rows (matched by email).
-- The webhook uses the service_role key, which bypasses RLS for writes.
drop policy if exists "read own membership" on public.memberships;
create policy "read own membership"
  on public.memberships for select
  to authenticated
  using ((auth.jwt() ->> 'email') = email);

-- Your app then gates the paid features with, e.g.:
--   select status from public.memberships
--   where email = auth.email() and product = 'epc-checker' and status = 'active';
