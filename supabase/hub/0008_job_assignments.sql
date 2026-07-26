-- ═══════════════════════════════════════════════════════════════════════════
--  Eco Futures Hub — who is on each job (RetroManager)
--  Run EIGHTH, in the HUB Supabase project, after 0004. Safe to re-run.
--
--  George, 2026-07-26: "Jobs need to be able to be assigned to people, so you
--  can select who is the assessor, installer, co-ordinator etc."
--
--  Shape: one jsonb object per job, keyed by role —
--    { "assessor":    { "id": "<uuid>", "name": "Dave Smith" },
--      "coordinator": { "id": "<uuid>", "name": "George H"   }, ... }
--
--  The name is stored ALONGSIDE the id on purpose. profiles is readable only
--  by yourself and your org's admins (0003), so a level-1 worker could not
--  resolve a teammate's id into a name — denormalising it means everyone can
--  SEE who is on a job without widening who can read the team list.
--
--  No new RLS is needed: assignments live on the jobs row and inherit 0004's
--  policies (any active member of the org may read and update a job).
-- ═══════════════════════════════════════════════════════════════════════════

alter table public.jobs
  add column if not exists assignments jsonb not null default '{}'::jsonb;

-- Find "my jobs" quickly once there are enough of them to matter.
create index if not exists jobs_assignments_idx
  on public.jobs using gin (assignments);
