// Org admin page (Tier 3+) — manage the organisation's users (CLAUDE.md §4).
//
// Invites go through /api/team-invite (service_role, server-side) because
// they may create an auth user. Everything else — level changes, deactivate,
// remove — runs straight through the client and is enforced by RLS: an org
// admin can never touch their own row, a level-4 row, or another org.
import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  Building2,
  Loader2,
  Lock,
  MailPlus,
  ShieldCheck,
  Trash2,
  UserX,
  UserCheck,
} from 'lucide-react'
import { HubAuthProvider, useHubAuth } from '../lib/hub/HubAuthContext.jsx'
import { supabase } from '../lib/hub/supabase.js'
import { can, levelName, LEVEL_INFO } from '../lib/hub/permissions.js'
import { lastSeenLabel } from '../lib/hub/format.js'
import SuiteLoadError from '../components/SuiteLoadError.jsx'

const field =
  'w-full rounded border border-ink/15 bg-white px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-ember'
const lbl = 'spec mb-1.5 block text-ink-soft'

function Note({ tone, children }) {
  if (!children) return null
  const cls =
    tone === 'error'
      ? 'border-ember/30 bg-ember/[0.06] text-ember-deep'
      : 'border-moss/30 bg-moss/[0.07] text-moss-deep'
  return (
    <div role={tone === 'error' ? 'alert' : 'status'} className={`rounded border px-3 py-2.5 text-sm ${cls}`}>
      {children}
    </div>
  )
}

/* ── Invite form ─────────────────────────────────────────────────────── */

function InviteCard({ orgId, onAdded }) {
  const { session } = useHubAuth()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    setError('')
    setNotice('')
    setBusy(true)
    try {
      const res = await fetch('/api/team-invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          email: String(data.get('email') || ''),
          fullName: String(data.get('fullName') || ''),
          level: Number(data.get('level')),
          orgId,
        }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(json.error || 'Something went wrong — try again.')
        return
      }
      setNotice(
        json.invited
          ? 'Invite sent — they’ll get an email to set up their login.'
          : 'They already had an account, so they’ve been added straight away.'
      )
      form.reset()
      onAdded()
    } catch {
      setError('Could not reach the server — check your connection and try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="card p-6 md:p-7">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy text-white">
          <MailPlus size={19} />
        </span>
        <div>
          <h2 className="text-lg font-bold text-ink">Add a team member</h2>
          <p className="text-sm text-ink-faint">They'll get an email invite to the suite</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="mt-5 flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={lbl} htmlFor="invite-name">
              Name
            </label>
            <input id="invite-name" name="fullName" type="text" placeholder="Jane Smith" className={field} />
          </div>
          <div>
            <label className={lbl} htmlFor="invite-email">
              Email
            </label>
            <input
              id="invite-email"
              name="email"
              type="email"
              required
              placeholder="jane@company.co.uk"
              className={field}
            />
          </div>
        </div>
        <div>
          <label className={lbl} htmlFor="invite-level">
            Access level
          </label>
          <select id="invite-level" name="level" defaultValue="1" className={field}>
            {[1, 2, 3].map((l) => (
              <option key={l} value={l}>
                Level {l} — {LEVEL_INFO[l].name}
              </option>
            ))}
          </select>
          <p className="mt-1.5 text-xs text-ink-faint">
            1 comments &amp; uploads only · 2 can delete jobs · 3 full admin of this organisation
          </p>
        </div>

        <Note tone="error">{error}</Note>
        <Note tone="ok">{notice}</Note>

        <button type="submit" disabled={busy} className="btn-primary w-full disabled:opacity-60 sm:w-auto">
          {busy ? (
            <>
              <Loader2 size={17} className="animate-spin" /> Sending invite…
            </>
          ) : (
            'Send invite'
          )}
        </button>
      </form>
    </div>
  )
}

/* ── Member row ──────────────────────────────────────────────────────── */

function MemberRow({ row, isSelf, onChanged, onError }) {
  const [busy, setBusy] = useState(false)
  const [pendingLevel, setPendingLevel] = useState(null) // optimistic while saving
  const isMasterRow = row.access_level === 4
  const locked = isSelf || isMasterRow // RLS blocks these anyway; the UI says so

  // RLS quietly filters an update/delete to 0 rows when the caller has lost
  // permission (e.g. deactivated in another tab) — .select('id') makes that
  // visible so it doesn't masquerade as success.
  const run = async (fn) => {
    setBusy(true)
    onError('')
    try {
      const { data, error } = await fn()
      if (error) onError(error.message)
      else if (!data?.length)
        onError('That change didn’t go through — you may no longer have permission. Refresh the page.')
      else onChanged()
    } finally {
      setBusy(false)
      setPendingLevel(null)
    }
  }

  const setLevel = (level) => {
    setPendingLevel(level)
    run(() =>
      supabase.from('memberships').update({ access_level: level }).eq('id', row.id).select('id')
    )
  }
  const setActive = (is_active) =>
    run(() => supabase.from('memberships').update({ is_active }).eq('id', row.id).select('id'))
  const remove = () => {
    const who = row.profiles?.email || 'this member'
    if (!window.confirm(`Remove ${who} from the organisation? They'll lose access to every suite app.`))
      return
    run(() => supabase.from('memberships').delete().eq('id', row.id).select('id'))
  }

  const name = row.profiles?.full_name || ''
  const email = row.profiles?.email || 'Unknown user'

  return (
    <li
      className={`card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between ${
        row.is_active ? '' : 'opacity-70'
      }`}
    >
      <div className="min-w-0">
        <p className="truncate font-semibold text-ink">
          {name || email}
          {isSelf && <span className="ml-2 font-mono text-[0.65rem] text-ink-faint">YOU</span>}
          {!row.is_active && (
            <span className="ml-2 font-mono text-[0.65rem] uppercase text-ember">Deactivated</span>
          )}
        </p>
        {name && <p className="truncate text-sm text-ink-faint">{email}</p>}
        <p className="mt-1 font-mono text-[0.68rem] uppercase tracking-wide text-ink-faint">
          {lastSeenLabel(row.last_seen)}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        {isMasterRow ? (
          <span className="inline-flex items-center gap-1.5 rounded bg-navy px-3 py-2 text-xs font-semibold text-white">
            <ShieldCheck size={14} className="text-amber" /> Master Admin
          </span>
        ) : (
          <label className="flex items-center gap-2">
            <span className="sr-only">Access level for {email}</span>
            <select
              value={pendingLevel ?? row.access_level}
              disabled={locked || busy}
              onChange={(e) => setLevel(Number(e.target.value))}
              className="rounded border border-ink/15 bg-white px-2.5 py-2 text-sm text-ink outline-none focus:border-ember disabled:opacity-60"
            >
              {[1, 2, 3].map((l) => (
                <option key={l} value={l}>
                  Level {l} — {LEVEL_INFO[l].name}
                </option>
              ))}
            </select>
          </label>
        )}

        {!locked && (
          <>
            <button
              type="button"
              disabled={busy}
              onClick={() => setActive(!row.is_active)}
              className="inline-flex items-center gap-1.5 rounded border border-ink/20 px-3 py-2 text-xs font-semibold text-ink transition-colors hover:border-ink/40 disabled:opacity-60"
            >
              {row.is_active ? (
                <>
                  <UserX size={14} /> Deactivate
                </>
              ) : (
                <>
                  <UserCheck size={14} /> Reactivate
                </>
              )}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={remove}
              aria-label={`Remove ${email}`}
              className="inline-flex items-center rounded border border-ember/30 p-2 text-ember transition-colors hover:bg-ember/[0.06] disabled:opacity-60"
            >
              <Trash2 size={15} />
            </button>
          </>
        )}
        {busy && <Loader2 size={15} className="animate-spin text-ink-faint" />}
      </div>
    </li>
  )
}

/* ── Page body ───────────────────────────────────────────────────────── */

function TeamContent() {
  const { status, session, user, org, accessLevel, loadError } = useHubAuth()
  const [rows, setRows] = useState(null) // null = loading
  const [listError, setListError] = useState('')
  const [rowError, setRowError] = useState('')

  const allowed = can(accessLevel, 'org.manage_users')

  const load = useCallback(async () => {
    if (!org?.id) return
    setListError('')
    setRowError('') // fresh list, fresh slate
    const { data, error } = await supabase
      .from('memberships')
      .select('id, user_id, access_level, is_active, last_seen, created_at, profiles ( email, full_name )')
      .eq('org_id', org.id)
      .order('access_level', { ascending: false })
      .order('created_at', { ascending: true })
    if (error) setListError(error.message)
    else setRows(data ?? [])
  }, [org?.id])

  useEffect(() => {
    if (allowed && org) load()
  }, [allowed, org, load])

  if (status === 'loading') {
    return (
      <div className="container-site flex items-center justify-center py-32 text-ink-faint">
        <Loader2 size={22} className="animate-spin" />
        <span className="sr-only">Loading</span>
      </div>
    )
  }

  // A failed account load must never read as a permissions verdict.
  if (session && loadError) return <SuiteLoadError />

  // Signed out (or backend not configured): send them to the suite page.
  if (status === 'unconfigured' || !session || !org || !allowed) {
    return (
      <section className="container-site py-20 md:py-28">
        <div className="mx-auto max-w-md text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-ink/[0.06] text-ink-faint">
            <Lock size={22} />
          </span>
          <h1 className="mt-5 font-display text-2xl font-bold text-ink">
            {!session ? 'Sign in to manage your team' : 'Admins only'}
          </h1>
          <p className="mt-2 text-ink-soft">
            {!session
              ? 'This page is part of the Retrofit Suite — sign in first.'
              : 'Managing users needs Organisation Admin access (level 3). Ask your admin if you think you should have it.'}
          </p>
          <Link to="/retrofit-suite" className="btn-primary mt-6">
            <ArrowLeft size={16} /> Back to the suite
          </Link>
        </div>
      </section>
    )
  }

  return (
    <>
      <section className="bg-navy bg-blueprint text-white">
        <div className="container-site py-10 md:py-14">
          <Link
            to="/retrofit-suite"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/70 transition-colors hover:text-white"
          >
            <ArrowLeft size={15} /> Back to the suite
          </Link>
          <span className="eyebrow mt-5">
            <Building2 size={14} /> {org.name}
          </span>
          <h1 className="mt-2 font-display text-3xl font-bold md:text-4xl">Your team</h1>
          <p className="mt-2 text-sm text-white/70">
            Signed in as {user.email} · {levelName(accessLevel)}
          </p>
        </div>
      </section>

      <section className="container-site grid gap-8 py-10 md:py-14 lg:grid-cols-[380px_1fr] lg:gap-10">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <InviteCard orgId={org.id} onAdded={load} />
        </div>

        <div>
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-xl font-bold text-ink">Members</h2>
            {rows && (
              <span className="font-mono text-xs text-ink-faint">
                {rows.filter((r) => r.is_active).length} active
              </span>
            )}
          </div>

          <div className="mt-4 flex flex-col gap-3">
            <Note tone="error">{listError || rowError}</Note>
            {rows === null && !listError && (
              <div className="flex items-center gap-2 py-10 text-ink-faint">
                <Loader2 size={18} className="animate-spin" /> Loading members…
              </div>
            )}
            {rows && (
              <ul className="flex flex-col gap-3">
                {rows.map((row) => (
                  <MemberRow
                    key={row.id}
                    row={row}
                    isSelf={row.user_id === user.id}
                    onChanged={load}
                    onError={setRowError}
                  />
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
    </>
  )
}

export default function RetrofitSuiteTeam() {
  return (
    <HubAuthProvider>
      <TeamContent />
    </HubAuthProvider>
  )
}
