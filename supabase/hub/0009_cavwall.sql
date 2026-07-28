-- ═══════════════════════════════════════════════════════════════════════════
--  Eco Futures Hub — Cavwall (cavity-wall insulation diagram planner)
--  Run NINTH, in the HUB Supabase project, after 0001. Safe to re-run.
--
--  Cavwall joined the suite as a FULL migration (George, 2026-07-28): the
--  standalone product — its own Supabase project, username logins, Stripe
--  billing, free/trial tiers — is retired. The app is now an internal suite
--  app: hub login only, org-scoped plans, RLS as the enforcement layer.
--
--  One table:
--    cwi_plans — a saved cavity-wall diagram (the full editor state as jsonb).
--                Org-scoped: carries org_id, RLS by the caller's membership.
--                read/create level >= 1 · delete level >= 3 (a survey plan is
--                a record, not a job — CLAUDE.md §4/§5, same call as
--                form_submissions in 0006).
--
--  NOTE: the legacy project (eceqmsygvndncuzwfras) still holds the old
--  profiles + cwi_plans rows. Nothing here reads it. Carrying old plans over
--  is a one-off, run by hand:
--    Cav-wall-tech-survey-creator/scripts/migrate-legacy-plans.js
-- ═══════════════════════════════════════════════════════════════════════════

-- Shared updated_at helper (also created by 0004/0005/0006; kept so 0009 can
-- run in any order relative to them)
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end
$$;

-- ── cwi_plans ──────────────────────────────────────────────────────────────

create table if not exists public.cwi_plans (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organisations (id) on delete cascade,
  created_by uuid references auth.users (id) on delete set null default auth.uid(),
  name text not null default 'Untitled plan' check (length(name) <= 120),
  -- Site address is denormalised out of the state so the plan list can show
  -- and search it without pulling every diagram payload down.
  site_address text not null default '',
  -- The whole editor state: elevations, openings, untreatable areas, POPT.
  state jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists cwi_plans_org_idx on public.cwi_plans (org_id, updated_at desc);
create index if not exists cwi_plans_creator_idx on public.cwi_plans (created_by);

drop trigger if exists trg_cwi_plans_updated_at on public.cwi_plans;
create trigger trg_cwi_plans_updated_at
  before update on public.cwi_plans
  for each row execute function public.set_updated_at();

-- org_id and created_by can never be rewritten through the API — a plan stays
-- pinned to who drew it and which org owns it. (Same guard as 0006.)
create or replace function public.guard_cwi_plan_update()
returns trigger
language plpgsql
as $$
begin
  if auth.uid() is not null
     and (new.org_id <> old.org_id
          or new.created_by is distinct from old.created_by) then
    raise exception 'cwi_plans.org_id and created_by are immutable';
  end if;
  return new;
end
$$;

drop trigger if exists guard_cwi_plan_update on public.cwi_plans;
create trigger guard_cwi_plan_update
  before update on public.cwi_plans
  for each row execute function public.guard_cwi_plan_update();

alter table public.cwi_plans enable row level security;

-- Read: any active member of the org (level >= 1); master admin everything.
-- Surveyors share plans across the org — a colleague can pick up your survey.
drop policy if exists "cwi plans: members read" on public.cwi_plans;
create policy "cwi plans: members read"
  on public.cwi_plans for select
  using (is_master_admin() or current_access_level(org_id) >= 1);

-- Create: any active member, into their own org, as themselves.
drop policy if exists "cwi plans: members insert" on public.cwi_plans;
create policy "cwi plans: members insert"
  on public.cwi_plans for insert
  with check (
    (is_master_admin() or current_access_level(org_id) >= 1)
    and created_by = auth.uid()
  );

-- Update: the surveyor keeps editing their OWN plan; org admins (3+) can edit
-- any of the org's plans; master admin everything.
drop policy if exists "cwi plans: edit own or admin" on public.cwi_plans;
create policy "cwi plans: edit own or admin"
  on public.cwi_plans for update
  using (
    is_master_admin()
    or current_access_level(org_id) >= 3
    or (created_by = auth.uid() and current_access_level(org_id) >= 1)
  )
  with check (
    is_master_admin()
    or current_access_level(org_id) >= 3
    or (created_by = auth.uid() and current_access_level(org_id) >= 1)
  );

-- Delete: level >= 3 (a completed diagram is a survey record, not a job —
-- matches form_submissions). Tier 1/2 have NO delete path at all.
drop policy if exists "cwi plans: admins delete" on public.cwi_plans;
create policy "cwi plans: admins delete"
  on public.cwi_plans for delete
  using (is_master_admin() or current_access_level(org_id) >= 3);
