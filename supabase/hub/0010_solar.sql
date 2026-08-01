-- ═══════════════════════════════════════════════════════════════════════════
--  Eco Futures Hub — Solar Survey (technical PV feasibility + array design)
--  Run TENTH, in the HUB Supabase project, after 0001. Safe to re-run.
--
--  Solar Survey is a suite-native app from day one: no standalone product, no
--  Supabase project of its own, no separate accounts. Hub login, org-scoped
--  surveys, RLS as the enforcement layer.
--
--  One table:
--    solar_surveys — a property's roof model, array layout and MCS yield
--                    result. Org-scoped. read/create level >= 1 ·
--                    delete level >= 3 (a completed survey is a RECORD, not a
--                    job — same call as cwi_plans in 0009 and
--                    form_submissions in 0006).
--
--  WHY THE MCS FIELDS ARE STORED, NOT RECOMPUTED:
--  the yield on a survey is a figure a customer may rely on. Kk, the shade
--  factor and the dataset version are frozen into `results` at the moment the
--  surveyor signs it off, so re-opening a survey two years later shows what
--  was actually quoted — not what today's dataset would produce.
-- ═══════════════════════════════════════════════════════════════════════════

-- Shared updated_at helper (also created by 0004/0005/0006/0009; kept so 0010
-- can run in any order relative to them)
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end
$$;

-- ── solar_surveys ──────────────────────────────────────────────────────────

create table if not exists public.solar_surveys (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organisations (id) on delete cascade,
  created_by uuid references auth.users (id) on delete set null default auth.uid(),
  name text not null default 'Untitled survey' check (length(name) <= 120),

  -- Denormalised so the survey list can show and search an address without
  -- pulling every roof model down.
  site_address text not null default '',
  postcode text not null default '' check (length(postcode) <= 12),

  -- Property location. Nullable: a manual-entry survey for a property with no
  -- aerial coverage never resolves a coordinate, and that is a normal path.
  lat double precision,
  lng double precision,

  -- MCS irradiance zone (1–21). Nullable while the surveyor is still working;
  -- required before a yield figure can be produced.
  mcs_zone smallint check (mcs_zone between 1 and 21),

  -- The roof: one entry per plane (pitch, orientation, area, shade factor,
  -- and whether each value is Google's draft or the surveyor's override).
  roof_planes jsonb not null default '[]'::jsonb,
  -- Panel layout per plane (count, panel dimensions, Wp).
  arrays jsonb not null default '[]'::jsonb,
  -- Frozen MCS result: per-plane kWh with its Kk/SF working, system totals,
  -- and the Kk dataset provenance. See the note at the top of this file.
  results jsonb not null default '{}'::jsonb,

  -- Provenance of the roof model, surfaced in the UI and on the PDF: a
  -- BASE-quality or years-old capture is exactly when NOT to trust the draft.
  data_source text not null default 'manual' check (data_source in ('google', 'manual')),
  imagery_quality text check (imagery_quality in ('HIGH', 'MEDIUM', 'BASE')),
  imagery_date date,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists solar_surveys_org_idx on public.solar_surveys (org_id, updated_at desc);
create index if not exists solar_surveys_creator_idx on public.solar_surveys (created_by);

drop trigger if exists trg_solar_surveys_updated_at on public.solar_surveys;
create trigger trg_solar_surveys_updated_at
  before update on public.solar_surveys
  for each row execute function public.set_updated_at();

-- org_id and created_by can never be rewritten through the API — a survey
-- stays pinned to who ran it and which org owns it. (Same guard as 0006/0009.)
create or replace function public.guard_solar_survey_update()
returns trigger
language plpgsql
as $$
begin
  if auth.uid() is not null
     and (new.org_id <> old.org_id
          or new.created_by is distinct from old.created_by) then
    raise exception 'solar_surveys.org_id and created_by are immutable';
  end if;
  return new;
end
$$;

drop trigger if exists guard_solar_survey_update on public.solar_surveys;
create trigger guard_solar_survey_update
  before update on public.solar_surveys
  for each row execute function public.guard_solar_survey_update();

alter table public.solar_surveys enable row level security;

-- Read: any active member of the org (level >= 1); master admin everything.
-- Surveyors share surveys across the org — a colleague can pick one up.
drop policy if exists "solar surveys: members read" on public.solar_surveys;
create policy "solar surveys: members read"
  on public.solar_surveys for select
  using (is_master_admin() or current_access_level(org_id) >= 1);

-- Create: any active member, into their own org, as themselves.
drop policy if exists "solar surveys: members insert" on public.solar_surveys;
create policy "solar surveys: members insert"
  on public.solar_surveys for insert
  with check (
    (is_master_admin() or current_access_level(org_id) >= 1)
    and created_by = auth.uid()
  );

-- Update: the surveyor keeps editing their OWN survey; org admins (3+) can
-- edit any of the org's surveys; master admin everything.
drop policy if exists "solar surveys: edit own or admin" on public.solar_surveys;
create policy "solar surveys: edit own or admin"
  on public.solar_surveys for update
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

-- Delete: level >= 3. A completed survey is a record, not a job. Tier 1/2
-- have NO delete path at all (absence of policy = denied).
drop policy if exists "solar surveys: admins delete" on public.solar_surveys;
create policy "solar surveys: admins delete"
  on public.solar_surveys for delete
  using (is_master_admin() or current_access_level(org_id) >= 3);
