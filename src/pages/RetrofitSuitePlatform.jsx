// Platform overview — level 4 only. Every organisation and every user on the
// platform, powered entirely by RLS (is_master_admin() opens the read
// policies), so no serverless round-trips. Deliberately unlinked and
// neutrally labelled everywhere the public can see; anyone below level 4
// gets a generic no-access gate that gives nothing away.
import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  Building2,
  Globe2,
  Loader2,
  Lock,
  Users,
  Zap,
} from 'lucide-react'
import { HubAuthProvider, useHubAuth } from '../lib/hub/HubAuthContext.jsx'
import { supabase } from '../lib/hub/supabase.js'
import { can, levelName } from '../lib/hub/permissions.js'
import { lastSeenLabel, isActiveNow } from '../lib/hub/format.js'
import SuiteLoadError from '../components/SuiteLoadError.jsx'

function StatTile({ icon: Icon, label, value }) {
  return (
    <div className="card flex items-center gap-4 p-5">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-navy text-white">
        <Icon size={21} />
      </span>
      <div>
        <p className="font-display text-2xl font-bold leading-none text-ink">{value}</p>
        <p className="spec mt-1.5 text-ink-faint">{label}</p>
      </div>
    </div>
  )
}

function MemberLine({ m }) {
  const name = m.profiles?.full_name || ''
  const email = m.profiles?.email || 'Unknown user'
  return (
    <li className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-ink/[0.07] py-2.5 first:border-t-0">
      <div className="min-w-0">
        <span className="font-medium text-ink">{name || email}</span>
        {name && <span className="ml-2 text-sm text-ink-faint">{email}</span>}
        {!m.is_active && (
          <span className="ml-2 font-mono text-[0.65rem] uppercase text-ember">Deactivated</span>
        )}
      </div>
      <div className="flex items-center gap-3 font-mono text-[0.68rem] uppercase tracking-wide">
        <span className="text-ink-soft">{levelName(m.access_level)}</span>
        <span
          className={m.is_active && isActiveNow(m.last_seen) ? 'text-moss-deep' : 'text-ink-faint'}
        >
          {m.is_active && isActiveNow(m.last_seen) && (
            <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-moss align-middle" />
          )}
          {lastSeenLabel(m.last_seen)}
        </span>
      </div>
    </li>
  )
}

function OrgCard({ org, members }) {
  const active = members.filter((m) => m.is_active)
  const online = members.filter((m) => m.is_active && isActiveNow(m.last_seen))
  return (
    <article className="card p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-display text-lg font-bold text-ink">
          {org.name}
          {org.is_platform_owner && (
            <span className="ml-2 rounded bg-navy px-2 py-0.5 align-middle font-mono text-[0.65rem] font-medium uppercase tracking-wide text-amber">
              Platform
            </span>
          )}
        </h3>
        <span className="font-mono text-xs text-ink-faint">
          {active.length} active member{active.length === 1 ? '' : 's'}
          {online.length > 0 && <span className="text-moss-deep"> · {online.length} online</span>}
        </span>
      </div>
      {members.length ? (
        <ul className="mt-4">
          {members.map((m) => (
            <MemberLine key={m.id} m={m} />
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-ink-faint">No members yet.</p>
      )}
      <p className="mt-4 border-t border-ink/[0.07] pt-3 font-mono text-[0.68rem] uppercase tracking-wide text-ink-faint">
        Created {new Date(org.created_at).toLocaleDateString('en-GB')}
      </p>
    </article>
  )
}

function PlatformContent() {
  const { status, session, accessLevel, loadError } = useHubAuth()
  const [orgs, setOrgs] = useState(null)
  const [members, setMembers] = useState([])
  const [error, setError] = useState('')

  const allowed = can(accessLevel, 'platform.view_all')

  const load = useCallback(async () => {
    setError('')
    const [orgRes, memberRes] = await Promise.all([
      supabase.from('organisations').select('id, name, is_platform_owner, created_at').order('created_at'),
      supabase
        .from('memberships')
        .select('id, org_id, user_id, access_level, is_active, last_seen, profiles ( email, full_name )')
        .order('access_level', { ascending: false })
        .order('created_at', { ascending: true }),
    ])
    const err = orgRes.error || memberRes.error
    if (err) {
      setError(err.message)
      return
    }
    setOrgs(orgRes.data ?? [])
    setMembers(memberRes.data ?? [])
  }, [])

  useEffect(() => {
    if (allowed) load()
  }, [allowed, load])

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

  // Deliberately vague for anyone who shouldn't be here.
  if (status === 'unconfigured' || !session || !allowed) {
    return (
      <section className="container-site py-20 md:py-28">
        <div className="mx-auto max-w-md text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-ink/[0.06] text-ink-faint">
            <Lock size={22} />
          </span>
          <h1 className="mt-5 font-display text-2xl font-bold text-ink">
            This page isn't available
          </h1>
          <p className="mt-2 text-ink-soft">
            {!session
              ? 'Sign in to the Retrofit Suite first.'
              : "Your account doesn't have access to this page."}
          </p>
          <Link to="/retrofit-suite" className="btn-primary mt-6">
            <ArrowLeft size={16} /> Back to the suite
          </Link>
        </div>
      </section>
    )
  }

  // Dedup by user_id: someone in two orgs is still one person.
  const totalUsers = new Set(members.filter((m) => m.is_active).map((m) => m.user_id)).size
  const onlineNow = new Set(
    members.filter((m) => m.is_active && isActiveNow(m.last_seen)).map((m) => m.user_id)
  ).size
  const byOrg = (orgId) => members.filter((m) => m.org_id === orgId)

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
            <Globe2 size={14} /> Eco Futures Retrofit Suite
          </span>
          <h1 className="mt-2 font-display text-3xl font-bold md:text-4xl">Platform overview</h1>
          <p className="mt-2 text-sm text-white/70">
            Every organisation and user on the platform
          </p>
        </div>
      </section>

      <section className="container-site py-10 md:py-14">
        {error && (
          <div role="alert" className="mb-6 rounded border border-ember/30 bg-ember/[0.06] px-3 py-2.5 text-sm text-ember-deep">
            {error}
          </div>
        )}

        {orgs === null && !error ? (
          <div className="flex items-center gap-2 py-10 text-ink-faint">
            <Loader2 size={18} className="animate-spin" /> Loading platform data…
          </div>
        ) : orgs !== null ? (
          <>
            <div className="grid gap-4 sm:grid-cols-3">
              <StatTile icon={Building2} label="Organisations" value={orgs.length} />
              <StatTile icon={Users} label="Active users" value={totalUsers} />
              <StatTile icon={Zap} label="Online now" value={onlineNow} />
            </div>

            <h2 className="mt-10 font-display text-xl font-bold text-ink">Organisations</h2>
            <div className="mt-4 flex flex-col gap-5">
              {[...orgs]
                .sort((a, b) => (b.is_platform_owner ? 1 : 0) - (a.is_platform_owner ? 1 : 0))
                .map((org) => (
                  <OrgCard key={org.id} org={org} members={byOrg(org.id)} />
                ))}
            </div>
          </>
        ) : null}
      </section>
    </>
  )
}

export default function RetrofitSuitePlatform() {
  return (
    <HubAuthProvider>
      <PlatformContent />
    </HubAuthProvider>
  )
}
