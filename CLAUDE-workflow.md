# CLAUDE.md — Eco Futures Suite: Cross-App Workflow (buildable revision)

> **Scope:** how the apps in the suite talk to each other — the *orchestration layer*: the
> events, triggers and shared tables that make one action in one app cause the right things to
> happen in the others.
>
> **Related docs:** `CLAUDE.md` (Hub) owns auth, organisations and the four-tier access system.
> Each app has its own `CLAUDE.md` for its internal features. **This file owns the joins between
> them.**
>
> **Status of this revision (2026-07-24):** this is the **buildable** rewrite of the original
> aspirational draft. Every table, column, status value and RLS rule below has been reconciled
> against the *actually deployed* hub schema (`supabase/hub/0001`–`0006`) and the live app code
> (Retrofit Job Manager, Business Tracker, Future Forms), then adversarially re-verified against
> that schema. The earlier draft referenced tables and columns that don't exist and, run verbatim,
> would have (a) aborted every `jobs` INSERT and (b) created unsecured cross-tenant tables. See
> **§0** for exactly what changed and why. Nothing here is built yet — this is the spec to build
> *from*, in the order given in **§10**.

---

## 0. Reality reconciliation — what changed from the first draft

The first draft was a sound *target* but not buildable against today's code. Corrections folded in:

| Area | First draft assumed | Deployed reality | This revision |
|---|---|---|---|
| **jobs spine** | `job_ref` (unique, not null), `property_address`, `client_name`, `quoted_value`, `surveyed_at`; a 7-value lifecycle status enum | `0004_jobs.sql`: none of those columns; address lives in the `data` jsonb; free-text `status` default `'Booking'`, vocabulary `Booking·Assessment·Coordination·Compiling documents·Submitted`; only unique key is the `id` PK | Correlation key is **`jobs.id`** (already a uuid PK). Don't reshape `jobs`. Add only a nullable `surveyed_at` (additive, app-safe). Read address/ref from the real fields. |
| **Business finance** | Relational per-job `job_finance` with generated `net_profit`, auto-created per job | `0005_business.sql`: one **opaque JSON blob per org** (`biz_data`, level-3), no `job_id` link; the tracker writes the whole blob last-write-wins | **Hybrid (George, 2026-07-24):** add a real per-job `job_finance` table alongside `biz_data`. The tracker keeps its blob for expenses/invoices; `job_finance` is the admin ledger tied to the spine. |
| **Future Forms** | Per-org `form_definitions` + `form_instances(job_id)`, status `submitted`, auto-created by the job trigger | `0006_future_forms.sql`: **platform-wide, master-authored** `forms` (status `draft·published·archived`, no `org_id`/`key`); `form_submissions` are **person-owned** (`submitted_by` defaults to the creator and is immutable), have **no `job_id`**, status `CHECK (draft·completed)`; historic integrity via a **denormalised schema copy** | Keep the real tables. Add `forms.is_default_survey` + `form_submissions.job_id` (both additive). **The job↔survey link is set app-side when a surveyor starts the survey** — the trigger does *not* auto-spawn a submission (that would fight the person-owned model, see §3A note). Workflow B keys on the **real** value `'completed'`, never `'submitted'`. |
| **EPC integration** | Separate project reached via an outbox + Edge Function; `job_events`, `job_epc_cache` | Separation is correct; **none of the machinery exists** (no trigger, no outbox, no cache, no `functions/` dir) | Build it as specified — the split premise is right — with the fixes below. |
| **RLS** | Prose promise only (rule 6); DDL had **no** `enable row level security` / policies | Every deployed table enables RLS + tiered policies + an `org_id` guard trigger | **Every new table below ships RLS in the same migration as its DDL.** Non-negotiable. |
| **Invoice lock** | `net_profit` `generated always … stored` *and* "snapshot + lock" — a generated column can't hold a frozen value; no snapshot columns; nothing blocks post-lock edits | — | Live `net_profit` stays generated; **separate frozen `snapshot_*` columns** are filled by a **one-way** lock trigger that then **rejects edits to the inputs, to the snapshot, and any unlock** (via the API). |
| **SECURITY DEFINER** | `on_job_created()` had no `set search_path` | Every deployed definer function pins `set search_path = public, pg_temp` | All definer functions here pin it, and derive/scope by `org_id`. |
| **Outbox idempotency** | "safe to run twice", but `job_events` had no unique key | — | Partial unique index `(job_id, event_type) where status='pending'` + a matching `on conflict … where status='pending'` arbiter. |

---

## 1. The core principle: the job is the golden thread

Almost everything in the suite hangs off a **job**. A job is created once, in Retrofit Job
Manager, and its **`id` (uuid)** is the correlation key every downstream record carries.

```
Retrofit Job Manager  ──creates──>  public.jobs row (the spine, jobs.id)
                                      │
                    ┌─────────────────┼─────────────────┐
                    ▼                 ▼                 ▼
              Future Forms      Business Hub       EPC Checker
          (form_submissions   (job_finance row,   (job_epc_cache,
           .job_id, app-set)   per-job ledger)     via the outbox)
```

**Rules:**

- Every downstream table carries **`job_id`** (→ `jobs.id`) and **`org_id`**. No exceptions.
- Downstream apps **never invent their own job identity**. They reference `jobs.id`.
- Job Manager is the **only** app that inserts into `jobs`.
- The human-facing reference is `jobs.reference` (nullable, not unique). The property address is
  derived — it lives in `jobs.data` (`data->>'Property Address'` / `->>'Address'`) or falls back
  to `jobs.title`. Don't assume a dedicated address column; there isn't one.

---

## 2. Architecture recap (what lives where)

- **One shared Supabase project** — Hub, Job Manager, Future Forms, Business Hub. They share a
  database, so cross-app workflow is mostly foreign keys and triggers. Simple and atomic.
- **EPC Checker is a separate Supabase project** (satellite, live at epc-checker.com, own auth).
  It owns the government EPC API and its key. Nothing else in the suite calls the government
  directly. The suite reaches EPC Checker over HTTP, server-to-server.

**In-database work uses triggers; anything crossing to EPC Checker goes through the event queue
(§6).** Never call an external API from inside a trigger.

---

## 3. THE WORKFLOWS

### Workflow A — Job created → finance ledger + EPC lookup (+ survey link, app-side)

**Trigger:** a new row in `public.jobs` (`on_job_created()`, §5).

1. **Business Hub** — insert one `job_finance` row for the job. `status = 'open'`, `revenue`
   seeded from the job's costing if it holds a valid number (else 0), costs 0. `net_profit` is
   computed. *Idempotent:* `unique (job_id)` + `on conflict (job_id) do nothing`.
2. **EPC Checker (queued)** — if the job has a postcode, enqueue an `epc_lookup_requested` event
   on `job_events` so the survey and job can be pre-populated with prior EPC data. *Idempotent:*
   partial unique `(job_id, event_type) where status='pending'` + a matching `on conflict` arbiter.

Both steps run **in-database** in the job-insert transaction; step 2 only *enqueues* (the outbound
call happens later, §6). The trigger touches only real, guarded objects, every value that could
throw is validated, and a missing postcode is a *skip* — so **job creation cannot be bricked by
this trigger**.

> **Survey link is app-side, by design.** The first draft had the trigger auto-create a survey
> `form_submissions` row. That fights the deployed Future Forms model, where a submission is a
> **person-owned record** (`submitted_by` defaults to the caller and is immutable per
> `guard_submission_update`, `0006`). Auto-spawning one would stamp it with the *job creator*
> (often a level-1 office worker, not the surveyor), and the immutable-owner rule + the
> `unique (job_id, form_id)` index would then prevent the actual field surveyor from ever opening
> or completing it — so Workflow B could never fire. Instead: **when a surveyor opens a job and
> starts its survey, the Future Forms app creates the submission with `job_id` set and pre-fills
> from the job** (it can read the job). Same golden thread, no ownership collision, and Future
> Forms' RLS is left untouched. The `forms.is_default_survey` flag (§4) tells the app which
> published form to offer. *(If you'd rather pre-spawn the draft at job-creation time, that's
> possible but requires relaxing Future Forms' `submitted_by` immutability + draft-edit policy —
> see §11 decision 1.)*

### Workflow B — Survey completed → job progresses

**Trigger:** `form_submissions.status` changes to `'completed'` (the real terminal value; there is
no `'submitted'`), on a submission whose `job_id` is set.

**Then:** stamp the job's `surveyed_at = now()`, and **conservatively** advance its pipeline status:
move it to `'Coordination'` **only if** it is currently `'Booking'` or `'Assessment'` — never move a
job backwards, and never override a stage the user has already pushed it past. The trigger scopes
the update to the survey's own org (`and org_id = new.org_id`) so a survey can only ever advance a
job in the same organisation. It writes **only** `surveyed_at` and `status`.

> **Decision to confirm:** the "advance to Coordination from Booking/Assessment" rule is a
> reasonable default matched to the real pipeline. If you'd rather a completed survey *not*
> auto-advance the board (just stamp `surveyed_at` and leave it to admins), say so — one line.

### Workflow C — Job costs/completion → profit; invoice → lock

**Trigger:** edits to a `job_finance` row's cost/revenue inputs, or `jobs.status` reaching the
terminal pipeline stage `'Submitted'`.

- `net_profit` is a **generated column** (revenue − all costs), so it never drifts from its inputs —
  there is nothing to "recalculate"; editing an input updates it automatically.
- When `jobs.status` becomes `'Submitted'`, mark the linked `job_finance.status = 'complete'`
  (informational; does not lock).

**On lock** (an admin/the tracker sets `job_finance.locked = true`, e.g. when the job is invoiced in
the Business Hub): a `BEFORE UPDATE` trigger **snapshots** the live figures into the frozen
`snapshot_*` columns and stamps `locked_at`. Thereafter it is a **one-way latch**: via the API it
rejects any change to the cost/revenue inputs, any change to the snapshot columns, and any attempt
to unlock. Historic profit therefore cannot move. Corrections after lock create an **adjustment
row** (`job_finance_adjustments`, §4), never an edit to the locked ledger. (A deliberate correction
remains possible only from the SQL editor / service role, where `auth.uid()` is null.)

### Workflow D — EPC data returned → fan out

**Trigger:** an EPC lookup completes (the Edge Function drainer writes the result back, §6).

**Then:** upsert the result into `job_epc_cache` for the job, and use it to pre-fill the linked
survey's EPC fields **only where they are still empty**. **Never overwrite anything a human typed.**

---

## 4. Data model — the spine (deployed, unchanged) + additive links

### The spine (already deployed — `0004_jobs.sql`; do not reshape)

```
public.jobs (
  id          uuid primary key default gen_random_uuid(),   -- the correlation key
  org_id      uuid not null references organisations(id) on delete cascade,
  owner       uuid references auth.users(id) on delete set null default auth.uid(),
  title       text,
  status      text not null default 'Booking',  -- Booking|Assessment|Coordination|
                                                 -- Compiling documents|Submitted (free text)
  start_date  date,  end_date date,
  reference   text,  postcode text,  customer text,  measure text,
  tags        jsonb  not null default '[]'::jsonb,
  archived    boolean not null default false,   -- soft delete
  costing     jsonb,                             -- job-costing scratchpad (RMT, level-1)
  data        jsonb  not null default '{}'::jsonb,  -- address etc. live here
  batch_id    text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
)
```

> `job_finance` (below) is the **admin finance ledger**, distinct from `jobs.costing` (the RMT
> level-1 costing scratchpad). Keeping them separate is what resolves the tier collision: level-1
> workers can edit `jobs.costing`, but only level-3 admins can see or edit the `job_finance` ledger.

### Migration `0007_workflow_links.sql` — additive spine links (safe, app-transparent)

```sql
-- Run in the HUB project, after 0006. Safe to re-run.

-- B: a place for the survey-complete timestamp (Workflow B). RMT ignores unknown columns.
alter table public.jobs add column if not exists surveyed_at timestamptz;

-- A: mark exactly ONE published form as the survey the app offers for new jobs.
-- (Read by the Future Forms app, not by the trigger — see §3A.)
alter table public.forms add column if not exists is_default_survey boolean not null default false;
-- at most one default across the platform (forms are platform-wide, master-authored)
create unique index if not exists forms_one_default_survey
  on public.forms (is_default_survey) where is_default_survey;

-- A/B: link a survey submission to its job (nullable — not every survey is job-born).
alter table public.form_submissions
  add column if not exists job_id uuid references public.jobs(id) on delete cascade;
create index if not exists form_submissions_job_idx on public.form_submissions (job_id);
-- one survey per (job, form)
create unique index if not exists form_submissions_job_form_uniq
  on public.form_submissions (job_id, form_id) where job_id is not null;
```

`form_submissions` already has RLS (`0006`); the new `job_id` inherits it. The app sets `job_id`
(and `submitted_by` naturally becomes the surveyor who starts it) when the survey is created.

### Migration `0008_job_finance.sql` — per-job ledger (hybrid model) + one-way lock

```sql
-- Run in the HUB project, after 0004/0007. Safe to re-run.

create table if not exists public.job_finance (
  id             uuid primary key default gen_random_uuid(),
  org_id         uuid not null references public.organisations(id) on delete cascade,
  job_id         uuid not null references public.jobs(id) on delete cascade,
  revenue        numeric(12,2) not null default 0,
  material_cost  numeric(12,2) not null default 0,
  labour_cost    numeric(12,2) not null default 0,
  other_cost     numeric(12,2) not null default 0,
  net_profit     numeric(12,2)
                   generated always as
                   (revenue - material_cost - labour_cost - other_cost) stored,
  status         text not null default 'open',   -- open | complete | invoiced
  locked         boolean not null default false,  -- true once invoiced/locked (one-way via API)
  locked_at      timestamptz,
  -- frozen historic figures, filled by the lock trigger (NOT generated columns)
  snapshot_revenue       numeric(12,2),
  snapshot_material_cost numeric(12,2),
  snapshot_labour_cost   numeric(12,2),
  snapshot_other_cost    numeric(12,2),
  snapshot_net_profit    numeric(12,2),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  unique (job_id)                                -- IDEMPOTENCY: one ledger per job
);
create index if not exists job_finance_org_idx on public.job_finance (org_id);

drop trigger if exists trg_job_finance_updated_at on public.job_finance;
create trigger trg_job_finance_updated_at
  before update on public.job_finance
  for each row execute function public.set_updated_at();

-- org_id/job_id immutable through the API (same pattern as guard_job_update)
create or replace function public.guard_job_finance_update()
returns trigger language plpgsql
set search_path = public, pg_temp as $$
begin
  if auth.uid() is not null and (new.org_id <> old.org_id or new.job_id <> old.job_id) then
    raise exception 'job_finance.org_id and job_id are immutable';
  end if;
  return new;
end $$;
drop trigger if exists guard_job_finance_update on public.job_finance;
create trigger guard_job_finance_update
  before update on public.job_finance
  for each row execute function public.guard_job_finance_update();

-- LOCK: one-way latch. On false->true, snapshot the live figures. While locked (API callers,
-- auth.uid() not null): reject unlock, reject input edits, reject snapshot/locked_at edits.
create or replace function public.lock_job_finance()
returns trigger language plpgsql
set search_path = public, pg_temp as $$
begin
  if new.locked and not old.locked then
    -- Snapshot the figures AS COMMITTED at lock time. Use new.* (the values being written) and
    -- compute net_profit arithmetically — a STORED generated column is not yet recomputed inside a
    -- BEFORE trigger, so new.net_profit can't be trusted here.
    new.locked_at := now();
    new.snapshot_revenue       := new.revenue;
    new.snapshot_material_cost := new.material_cost;
    new.snapshot_labour_cost   := new.labour_cost;
    new.snapshot_other_cost    := new.other_cost;
    new.snapshot_net_profit    := new.revenue - new.material_cost - new.labour_cost - new.other_cost;
  elsif old.locked and auth.uid() is not null then
    if not new.locked then
      raise exception 'job_finance % is locked and cannot be unlocked via the API', old.id;
    end if;
    if new.revenue <> old.revenue
       or new.material_cost <> old.material_cost
       or new.labour_cost  <> old.labour_cost
       or new.other_cost   <> old.other_cost then
      raise exception 'job_finance % is locked; record a correction in job_finance_adjustments', old.id;
    end if;
    if new.locked_at is distinct from old.locked_at
       or new.snapshot_revenue       is distinct from old.snapshot_revenue
       or new.snapshot_material_cost is distinct from old.snapshot_material_cost
       or new.snapshot_labour_cost   is distinct from old.snapshot_labour_cost
       or new.snapshot_other_cost    is distinct from old.snapshot_other_cost
       or new.snapshot_net_profit    is distinct from old.snapshot_net_profit then
      raise exception 'job_finance % snapshot is frozen once locked', old.id;
    end if;
  end if;
  return new;
end $$;
drop trigger if exists trg_lock_job_finance on public.job_finance;
create trigger trg_lock_job_finance
  before update on public.job_finance
  for each row execute function public.lock_job_finance();

-- ── RLS: finances are Organisation Admin territory — level >= 3, every action ──
alter table public.job_finance enable row level security;

drop policy if exists "job_finance: admins read" on public.job_finance;
create policy "job_finance: admins read" on public.job_finance for select
  using (is_master_admin() or current_access_level(org_id) >= 3);
drop policy if exists "job_finance: admins insert" on public.job_finance;
create policy "job_finance: admins insert" on public.job_finance for insert
  with check (is_master_admin() or current_access_level(org_id) >= 3);
drop policy if exists "job_finance: admins update" on public.job_finance;
create policy "job_finance: admins update" on public.job_finance for update
  using (is_master_admin() or current_access_level(org_id) >= 3)
  with check (is_master_admin() or current_access_level(org_id) >= 3);
drop policy if exists "job_finance: admins delete" on public.job_finance;
create policy "job_finance: admins delete" on public.job_finance for delete
  using (is_master_admin() or current_access_level(org_id) >= 3);

-- append-only corrections to a locked ledger (never rewrite history)
create table if not exists public.job_finance_adjustments (
  id          uuid primary key default gen_random_uuid(),
  org_id      uuid not null references public.organisations(id) on delete cascade,
  job_id      uuid not null references public.jobs(id) on delete cascade,
  amount      numeric(12,2) not null,     -- signed
  reason      text not null default '',
  created_by  uuid references auth.users(id) on delete set null default auth.uid(),
  created_at  timestamptz not null default now()
);
alter table public.job_finance_adjustments enable row level security;
drop policy if exists "finadj: admins read" on public.job_finance_adjustments;
create policy "finadj: admins read" on public.job_finance_adjustments for select
  using (is_master_admin() or current_access_level(org_id) >= 3);
drop policy if exists "finadj: admins insert" on public.job_finance_adjustments;
create policy "finadj: admins insert" on public.job_finance_adjustments for insert
  with check (is_master_admin() or current_access_level(org_id) >= 3);
-- no update/delete policies: adjustments are append-only (absence of policy = denied)
```

> **The tracker keeps its blob.** `biz_data` (`0005`) still holds expenses, invoices and settings.
> `job_finance` is a *new, parallel* per-job ledger. Wiring the two together (the tracker reading
> `job_finance` for per-job profit, or an invoice in the blob setting `job_finance.locked`) is
> app-side work, tracked as a follow-up in §10 — the schema above is the substrate that makes it
> possible without touching `biz_data`.

### Migration `0009_job_epc_cache.sql`

```sql
-- Run in the HUB project, after 0004. Safe to re-run.
create table if not exists public.job_epc_cache (
  job_id     uuid primary key references public.jobs(id) on delete cascade,
  org_id     uuid not null references public.organisations(id) on delete cascade,
  epc_data   jsonb,
  fetched_at timestamptz not null default now(),
  source     text not null default 'epc_checker'
);
create index if not exists job_epc_cache_org_idx on public.job_epc_cache (org_id);

alter table public.job_epc_cache enable row level security;
-- EPC/property data follows the jobs read tier: any active member (level >= 1).
drop policy if exists "epc_cache: members read" on public.job_epc_cache;
create policy "epc_cache: members read" on public.job_epc_cache for select
  using (is_master_admin() or current_access_level(org_id) >= 1);
-- Writes come from the drainer using the service_role key (bypasses RLS); no client
-- insert/update/delete policy is granted (absence of policy = denied to anon/authenticated).
```

### Migration `0010_job_events.sql` — the outbox

```sql
-- Run in the HUB project, after 0004. Safe to re-run.
create table if not exists public.job_events (
  id           bigserial primary key,
  org_id       uuid not null references public.organisations(id) on delete cascade,  -- FK, unlike the first draft
  job_id       uuid not null references public.jobs(id) on delete cascade,
  event_type   text not null,                 -- 'epc_lookup_requested', ...
  payload      jsonb not null default '{}'::jsonb,
  status       text not null default 'pending',  -- pending | processing | done | failed
  attempts     int  not null default 0,
  last_error   text,
  created_at   timestamptz not null default now(),
  processed_at timestamptz
);
create index if not exists job_events_pending_idx
  on public.job_events (status, created_at) where status = 'pending';
-- IDEMPOTENCY on the one path that leaves the DB: never double-enqueue a pending lookup.
create unique index if not exists job_events_dedup
  on public.job_events (job_id, event_type) where status = 'pending';

alter table public.job_events enable row level security;
-- Read: members of the org may see their own org's events (for debugging/audit).
drop policy if exists "job_events: members read" on public.job_events;
create policy "job_events: members read" on public.job_events for select
  using (is_master_admin() or current_access_level(org_id) >= 1);
-- Inserts come only from on_job_created() (SECURITY DEFINER, owner bypasses RLS). The drainer
-- updates rows with the service_role key. No client insert/update/delete policy is granted.
```

---

## 5. Trigger implementation (Workflow A)

```sql
-- Migration 0011_on_job_created.sql — run in the HUB project, after 0008 & 0010. Safe to re-run.
create or replace function public.on_job_created()
returns trigger language plpgsql security definer
set search_path = public, pg_temp as $$   -- pinned: closes the definer search-path hijack
begin
  -- 1. Finance ledger. Revenue seeded from costing ONLY if it holds a plain number; a malformed
  --    value (e.g. '£1,200', 'tbc') seeds 0 rather than raising and aborting the job insert.
  insert into public.job_finance (org_id, job_id, revenue)
  values (
    new.org_id, new.id,
    case when new.costing ? 'revenue'
          and (new.costing->>'revenue') ~ '^\s*-?\d+(\.\d+)?\s*$'
         then (new.costing->>'revenue')::numeric
         else 0 end
  )
  on conflict (job_id) do nothing;

  -- 2. Queue an EPC lookup (only leaves the DB via the drainer, §6). The ON CONFLICT predicate
  --    matches the partial dedup index exactly, so a re-run can't double-enqueue.
  if new.postcode is not null and length(trim(new.postcode)) > 0 then
    insert into public.job_events (org_id, job_id, event_type, payload)
    values (new.org_id, new.id, 'epc_lookup_requested',
            jsonb_build_object('postcode', new.postcode,
                               'address', coalesce(new.data->>'Property Address', new.title)))
    on conflict (job_id, event_type) where status = 'pending' do nothing;
  end if;

  return new;
end $$;

drop trigger if exists trg_job_created on public.jobs;
create trigger trg_job_created
  after insert on public.jobs
  for each row execute function public.on_job_created();
```

**Why this can't brick job creation** (the first draft's critical flaw): it references only tables
and columns that exist after `0008`/`0010`; the only expression that could throw — the revenue cast
— is regex-guarded to fall back to 0; the EPC step is skipped when there's no postcode; every insert
has an `on conflict … do nothing` whose arbiter matches its (partial) index exactly; and it sets
`org_id` from `new.org_id`, never from user input. It inserts into RLS-protected tables successfully
because a `SECURITY DEFINER` function runs as its owner (the `postgres` role that owns the tables and
is exempt from RLS) — the same mechanism `create_organisation()` uses in `0001` to seed
`organisations`/`memberships`.

### Workflow B & C triggers

```sql
-- Migration 0012_workflow_bc.sql — run after 0007 & 0008.

-- B: survey completed -> stamp + conservatively advance the linked job, scoped to its own org.
create or replace function public.on_survey_completed()
returns trigger language plpgsql security definer
set search_path = public, pg_temp as $$
begin
  if new.status = 'completed' and old.status is distinct from 'completed'
     and new.job_id is not null then
    update public.jobs
      set surveyed_at = now(),
          status = case when status in ('Booking','Assessment') then 'Coordination'
                        else status end
      where id = new.job_id
        and org_id = new.org_id;   -- a survey can only advance a job in its OWN org
  end if;
  return new;
end $$;
drop trigger if exists trg_survey_completed on public.form_submissions;
create trigger trg_survey_completed
  after update on public.form_submissions
  for each row execute function public.on_survey_completed();

-- C: job reaches the terminal stage -> mark its ledger complete (informational, no lock).
create or replace function public.on_job_submitted()
returns trigger language plpgsql security definer
set search_path = public, pg_temp as $$
begin
  if new.status = 'Submitted' and old.status is distinct from 'Submitted' then
    update public.job_finance set status = 'complete'
      where job_id = new.id and status = 'open';
  end if;
  return new;
end $$;
drop trigger if exists trg_job_submitted on public.jobs;
create trigger trg_job_submitted
  after update on public.jobs
  for each row execute function public.on_job_submitted();
```

---

## 6. The event queue (for anything leaving the database)

In-database steps run as triggers. Anything that makes an outbound HTTP call — i.e. EPC Checker —
goes through the `job_events` outbox (§4) so it can retry and be debugged.

A **scheduled Edge Function** (`supabase/functions/drain-job-events/`) runs on a cron, using the
**service_role key** (never a `VITE_` var):

1. `select … from job_events where status='pending' order by created_at limit N for update skip locked`,
   mark them `processing`.
2. For each, call EPC Checker server-to-server (its separate project / API).
3. On success: `upsert` into `job_epc_cache`, set the event `done`, stamp `processed_at`.
4. On failure: `attempts = attempts + 1`, record `last_error`, set back to `pending` (or `failed`
   after a cap).

**Never call the government EPC API from inside a database trigger** — it would make job creation
slow and fragile, and an EPC outage would block users from creating jobs at all. The dedup index
(`0010`) guarantees a retry/backfill can't double-enqueue a lookup.

---

## 7. Non-negotiable rules

1. **RLS in the same migration as the DDL.** Every table above ships `enable row level security` +
   per-tier policies + (where it takes updates) an `org_id`/`job_id` guard trigger. A prose promise
   is not a policy. In this shared project the browser `anon` key is only safe *because* RLS is on.
2. **Idempotency.** Every automated creation is safe to run twice — `unique(job_id)` on
   `job_finance`, `unique(job_id, form_id)` on job-linked submissions, and the **partial unique
   index on `job_events`** for the one path that leaves the DB — each with an `on conflict` arbiter
   whose columns **and predicate** match the index (a partial index needs its `where` repeated).
3. **Never overwrite human input.** Auto-fill (survey pre-fill, EPC fan-out) writes only into empty
   fields. If an assessor typed it, it wins.
4. **Reference, don't copy — except money and survey schema.** Apps read job details from `jobs`.
   Financial figures are snapshotted and the ledger is a one-way latch once invoiced (historic
   accounts must not change). A survey's `form_schema`/`form_title` are copied onto the submission so
   later template edits don't mutate completed surveys (the deployed integrity model).
5. **Job Manager owns job creation.** No other app inserts into `jobs`. Others may advance status
   only through the defined transitions (Workflow B's conservative, org-scoped rule).
6. **No external calls in triggers.** Outbound work goes on `job_events`, drained by the Edge Function.
7. **`org_id` on everything, derived from the job; definer functions are org-scoped.** A
   `security definer` trigger bypasses RLS, so it must set `org_id` from the parent job and scope
   every cross-table write to that org (e.g. Workflow B's `and org_id = new.org_id`), never trust
   client input, and pin `set search_path = public, pg_temp`.
8. **Tier discipline.** `job_finance` (+ adjustments) is level-3, matching `biz_data`. `jobs` and
   `form_submissions` stay level-1 read/write, delete level-2/3 per the Hub rules. Auto-creating a
   finance row on a level-1 worker's job insert is fine — the definer trigger does it; the worker
   simply can't see the level-3 ledger they caused.
9. **Deletes cascade deliberately.** Deleting a job cascades to its finance, survey, cache and event
   rows. Prefer soft-delete (`jobs.archived`) over hard delete for anything invoiced/locked.

---

## 8. Data-flow summary (real values)

| Signal (real) | Fires | Effect |
|---|---|---|
| `INSERT` on `jobs` | `on_job_created()` | `job_finance` row + (if postcode) EPC event |
| surveyor starts a survey (app) | Future Forms app | `form_submissions` row with `job_id` set, pre-filled from the job |
| `form_submissions.status → 'completed'` (with `job_id`) | `on_survey_completed()` | stamp `jobs.surveyed_at`; Booking/Assessment → Coordination (same org only) |
| `jobs.status → 'Submitted'` | `on_job_submitted()` | linked `job_finance.status → 'complete'` |
| `job_finance.locked → true` | `lock_job_finance()` | snapshot figures; one-way freeze of inputs + snapshot |
| EPC lookup done (drainer) | Edge Function | upsert `job_epc_cache`; pre-fill empty survey EPC fields |

---

## 9. Guardrails — do NOT

- Do **not** deploy any `CREATE TABLE` without its `enable row level security` + policies in the
  same migration.
- Do **not** reference `job_ref`, `property_address`, `client_name`, `quoted_value`, or the
  `enquiry/scheduled/in_progress/survey_complete/complete/invoiced` status values — none exist. Use
  the real columns and the real `Booking…Submitted` vocabulary.
- Do **not** auto-create a `form_submissions` row from a trigger — submissions are person-owned; let
  the app create them with `job_id` set (§3A).
- Do **not** let Future Forms or Business Hub insert into `jobs`.
- Do **not** call the government EPC API from anywhere except EPC Checker (via the outbox).
- Do **not** let a form template edit change already-completed surveys (schema is copied on submit).
- Do **not** try to freeze `net_profit` by writing to it — it's generated. Freeze the **inputs** and
  read `snapshot_*`; the lock is one-way via the API.
- Do **not** write automation without a unique constraint behind it, or an `on conflict` arbiter
  that doesn't match its index's predicate.
- Do **not** declare a `security definer` function without `set search_path = public, pg_temp`, and
  do not let one write across orgs without an explicit `org_id` scope.
- Do **not** trust `org_id` (or `job_id`) from the client in any trigger or Edge Function — derive
  and scope from the parent job.

---

## 10. Build order

- [ ] `0007_workflow_links.sql` — `jobs.surveyed_at`, `forms.is_default_survey`,
      `form_submissions.job_id` (+ indexes). Additive, app-transparent — run first, verify the live
      apps still work unchanged.
- [ ] `0008_job_finance.sql` — per-job ledger + one-way lock trigger + adjustments, RLS level-3.
- [ ] `0009_job_epc_cache.sql` — EPC cache, RLS level-1 read, drainer-only writes.
- [ ] `0010_job_events.sql` — outbox with FK + dedup index + RLS.
- [ ] `0011_on_job_created.sql` — Workflow A trigger. **Test:** create a job, confirm a finance row
      appears and (if the job has a postcode) an EPC event is queued; confirm creating twice doesn't
      duplicate; confirm a job with no postcode still creates cleanly; confirm a job whose
      `costing.revenue` is non-numeric still creates (revenue seeds 0).
- [ ] `0012_workflow_bc.sql` — Workflow B (survey→job, org-scoped) and C (job→ledger status).
- [ ] Edge Function `drain-job-events` + EPC Checker HTTP lookup endpoint (Workflow D fan-out).
- [ ] Mark one published Future Forms template `is_default_survey = true` (the app reads it).
- [ ] **App-side work** (not schema): Future Forms sets `job_id` + pre-fills when a surveyor starts a
      job's survey; the tracker reads `job_finance` for per-job profit; invoicing in the blob sets
      `job_finance.locked`; survey UI pre-fills EPC from `job_epc_cache`.

---

## 11. Open decisions for George

1. **Survey creation model** (§3A) — default here: the app creates the survey (with `job_id`) when a
   surveyor starts it — clean, and leaves Future Forms' RLS untouched. If you instead want the draft
   **pre-spawned at job-creation time**, that needs a `0006` change: set `submitted_by` null on the
   auto-insert, relax `guard_submission_update` to allow a one-time null→uid "claim", and widen the
   level-1 draft-edit policy so any org surveyor can claim an unassigned draft. That touches Future
   Forms (another session's domain) — confirm with its owner before building.
2. **Workflow B auto-advance** (§3B) — auto-move Booking/Assessment → Coordination on survey
   completion, or just stamp `surveyed_at` and leave the board to admins?
3. **Revenue seeding** (§5 step 1) — seed `job_finance.revenue` from `jobs.costing->>'revenue'`? That
   assumes the RMT costing blob uses a `revenue` key. If it's named differently (or you'd rather seed
   0 and have admins enter revenue), tell me the real key and I'll adjust the guard.
4. **Who sets `job_finance.locked`** — the Business Hub at invoice time, or a manual admin action?
   Determines the app-side follow-up, not the schema.
