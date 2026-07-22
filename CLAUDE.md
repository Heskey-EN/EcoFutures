# CLAUDE.md — Eco Futures Hub

> Project context for the **Hub** — the auth gateway, organisations, four-tier
> access system and app launcher for the whole Eco Futures Retrofit Suite.
> Each app in the suite (Job Manager, Assessment, EPC Checker, Cav Wall,
> Business Manager) has its own repo/CLAUDE.md. **This file owns:** accounts,
> access levels, sessions, and the Retrofit Suite page. When another app needs
> to know "how do accounts / access levels / sessions work", the answer lives here.

---

## 1. What the Hub is

The Hub is the **front door and control panel** for the Eco Futures Retrofit
Suite. It lives inside this repo (the ecofutures.uk marketing site) at
**`/retrofit-suite`** and does three jobs:

1. **Auth gateway** — sign in once; the session cookie is scoped to
   `.ecofutures.uk` so every app on a subdomain shares it.
2. **App launcher** — tiles, one per app, from the registry
   (`src/lib/hub/registry.js`). Signed-out visitors see a description of the
   suite instead.
3. **Organisation dashboard** *(planned)* — assessments completed, net profit,
   expenses, jobs by status, aggregated via the shared Supabase backend.

**Mental model:** hub-and-spoke. The Hub never does an app's job — it routes
to apps, and it holds the account/access/org data every app reads.

## 2. Decisions made (2026-07-21)

These settle the open questions in the original plan — don't relitigate them
without George:

| Question | Decision |
|---|---|
| Session sharing | **Subdomains** (`jobs.ecofutures.uk`, …) with the Supabase session in a **cookie scoped to `.ecofutures.uk`** via `@supabase/ssr`'s `createBrowserClient` (`src/lib/hub/supabase.js`). Not path-based — the apps are separate Vercel projects. |
| Hub stack | **React routes in this repo** (the plan said static HTML; the suite is React in practice). The permission config and registry stay framework-agnostic JS so vanilla-JS apps can consume them. |
| Supabase | **One fresh shared project for the Hub** (`supabase/hub/`). The existing per-app projects (EPC Checker, Cavwall) keep running and **merge in later** — do not touch them yet. |
| Where the login lives | The **`/retrofit-suite` page**: suite description + sign-in when logged out, launcher when logged in. |

## 3. The suite (tiles on the launcher)

Registry = **single source of truth**: `src/lib/hub/registry.js`. Add a row →
a tile appears. Do not hardcode app lists anywhere else.

**Integration order (George, 2026-07-21)** — apps join the shared login and
hub Supabase project in this sequence:

| # | App | Slug | Status today |
|---|-----|------|--------------|
| 1 | Retrofit Job Manager | `jobs` | **integrating now** — RetrofitManagementTool repo wired to the hub project (shared cookie session, `org_id` jobs table via `supabase/hub/0004_jobs.sql`); needs jobs.ecofutures.uk domain + env vars |
| 2 | Business Tracker | `business` | **integrating now** — private repo `Heskey-EN/Eco-Futures-Tracker` (calendar, expenses, tax, invoices; was localStorage+passcode) wired to the hub: shared cookie session, level-3+ gate, org blob in `biz_data` via `supabase/hub/0005_business.sql`, one-time local→cloud migration prompt; needs business.ecofutures.uk domain + env vars |
| 3 | Retrofit Assessment | `assessment` | not made yet |
| 4 | EPC Checker | `epc` | live at epc-checker.com, own Supabase, joins later |
| 5 | Cav Wall Surveys | `cavwall` | live at cavwall.com, own Supabase — **explicitly not a priority** |
| — | Floor Plan Creator | `floorplan` | planned, unranked |

## 4. The four-tier access system (core of this project)

Every user has an **access level 1–4** on their membership of an organisation.
Config: `src/lib/hub/permissions.js` — UI asks `can(level, action)`, never
scatters level checks.

- **1 Office Worker** — add comments, upload files. **Never deletes anything.**
- **2 Senior Worker** — tier 1 + delete jobs.
- **3 Organisation Admin** — sees/manages everything in their own org, incl. users (levels 1–3).
- **4 Master Admin** — George. Cross-org, all users, all data. Exactly one
  platform org: Eco Futures (`organisations.is_platform_owner = true`).

**Enforcement is three layers:** the permission config (source of truth for
the UI) → UI gating (convenience only) → **RLS (the real security — assume the
UI can be bypassed).**

## 5. Backend (Supabase "hub" project)

Schema + policies live in `supabase/hub/` — run order and setup in its README.

- `organisations` (id, name, is_platform_owner, created_at)
- `memberships` (org_id, user_id, access_level 1–4, is_active, last_seen; unique(org_id, user_id))
- Helpers (SECURITY DEFINER): `current_access_level(org)`, `is_master_admin()`
- RPCs: `create_organisation(name)` (sign-up flow — creator becomes level 3),
  `touch_last_seen(org)` (active-users heartbeat)
- RLS pattern for every future app table (all carry `org_id`):
  - read: `is_master_admin() or` member of org
  - delete jobs: `current_access_level(org_id) >= 2`
  - delete anything else: `>= 3`
  - Tier 1 write access = insert on comments/files only; **no delete policy at
    all** (absence of policy = denied)

## 6. Frontend map

- `src/lib/hub/supabase.js` — the ONE client; cookie domain `.ecofutures.uk`
  in prod, host-only on localhost. Env: `VITE_HUB_SUPABASE_URL` / `_ANON_KEY`
  (graceful "not configured" state when absent).
- `src/lib/hub/HubAuthContext.jsx` — the ONE auth state (session, memberships,
  org, accessLevel, sign in/up/out, createOrganisation). Never duplicate
  auth-init per app.
- `src/lib/hub/permissions.js` — levels + `can()`.
- `src/lib/hub/registry.js` — apps + statuses.
- `src/pages/RetrofitSuite.jsx` — signed-out marketing + auth / no-org
  onboarding / launcher (incl. change-password, which also completes invite
  and reset flows). Lazy-loaded in `App.jsx` so marketing pages don't ship
  Supabase.
- `src/pages/RetrofitSuiteTeam.jsx` — `/retrofit-suite/team` (Tier 3+):
  invite by email, set levels 1–3, deactivate/reactivate, remove. Level and
  status changes go through the client under RLS; only invites call
  `api/team-invite.js`.
- `api/team-invite.js` — the ONE place the hub service_role key is used
  (`HUB_SUPABASE_SERVICE_ROLE_KEY`). Verifies the caller's JWT, re-checks
  org-admin authority itself (service_role bypasses RLS), creates/looks up
  the auth user, upserts the membership. Never touches level-4 rows.
- `src/pages/RetrofitSuitePlatform.jsx` — `/retrofit-suite/platform`
  (level 4 only): every org + every user, active-now via `last_seen`.
  Pure client queries — `is_master_admin()` opens the RLS read policies.
  **The public never sees the top tier**: the signed-out page lists levels
  1–3 only, the gate copy is deliberately vague, and the panel is only
  linked from a level-4 launcher. Keep it that way.

## 7. Design system

Existing site brand (defined in `tailwind.config.js` / `src/index.css`):
paper `#EDF1F3`, ink `#16202B`, navy `#0D1B2A`, **ember `#E4572E`** (actions),
**moss `#2E7D4F`** (success), amber `#E8B23A`. Fonts: Bricolage Grotesque
(display), Hanken Grotesk (body), IBM Plex Mono (spec labels). Flat, generous
spacing, mobile-first — George demos on iPhone (~380px). Reuse `.card`,
`.btn-primary`, `.spec`, `.eyebrow`, `.container-site`.

## 8. Guardrails — do NOT

- Put the `service_role` key in client code or the repo (`VITE_`* = public!).
- Rely on hidden buttons/tiles for security — RLS is the enforcement layer.
- Give Tier 1 any delete path anywhere.
- Scatter access-level checks — `permissions.js` only.
- Query without org scoping / RLS — every future table is multi-tenant.
- Let any level below 4 see across organisations.
- Duplicate auth-init logic — `HubAuthContext.jsx` is the only place.
- Invent brand colours — they're in `tailwind.config.js`.
- Touch the per-app Supabase projects (EPC Checker / Cavwall) — they merge
  in later, on their own migration plan.

## 9. Status & next steps

- [x] Session approach decided (subdomain cookie)
- [x] Hub schema written (`supabase/hub/0001` + `0002`)
- [x] Auth + Retrofit Suite page (sign in/up, create org, launcher)
- [x] Hub Supabase project live; George is Master Admin (level 4)
- [x] Org admin page (Tier 3+): `/retrofit-suite/team` + `api/team-invite.js`
      + `0003_profiles.sql` (George: run 0003 + set the service-role env var)
- [x] Master admin panel: `/retrofit-suite/platform` (all orgs, all users,
      online-now) — public UI scrubbed of any top-tier mention
- [x] Jobs integration code: `supabase/hub/0004_jobs.sql` here + the
      RetrofitManagementTool repo rewired (shared cookie session, hub
      memberships/levels, org_id on jobs, old admin console retired)
- [x] Business Tracker integration code: `supabase/hub/0005_business.sql`
      here + Eco-Futures-Tracker rewired (suite session, level-3+ gate,
      cloud blob sync with realtime, local→cloud migration prompt; passcode
      + localStorage kept as the unconfigured fallback)
- [ ] George: run 0004 + 0005 in the hub SQL editor; add jobs.ecofutures.uk
      (RMT) and business.ecofutures.uk (tracker) to their Vercel projects +
      DNS; set `VITE_HUB_SUPABASE_*` env vars on both
- [ ] Follow-ups: RMT documents + tracker receipts to org-scoped Supabase
      Storage; per-row biz tables if concurrent-admin editing ever matters
- [ ] Org dashboard aggregations (needs app data in the shared project)
- [ ] Migrate apps onto the shared project: cavwall → jobs → epc (in that
      order — see the migration notes below)

**Migration note:** existing apps hold their own data with no `org_id`. When
each joins the Hub: add `org_id`, backfill to the Eco Futures org, add RLS
following §5, then point the app at the shared project. Do this before
onboarding any external customer.
