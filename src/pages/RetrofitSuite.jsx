// The Retrofit Suite page — the Hub's front door (CLAUDE.md §1).
//
// Three states:
//   signed out            → what the suite is + sign in / create account
//   signed in, no org     → create an organisation (or wait to be added)
//   signed in with an org → the tile launcher
import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  KeyRound,
  Loader2,
  Lock,
  LogOut,
  MailCheck,
  ShieldCheck,
  Users,
} from 'lucide-react'
import { HubAuthProvider, useHubAuth } from '../lib/hub/HubAuthContext.jsx'
import { APPS, STATUS_LABELS } from '../lib/hub/registry.js'
import { can, levelName, LEVEL_INFO } from '../lib/hub/permissions.js'

const field =
  'w-full rounded border border-ink/15 bg-white px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-ember'
const lbl = 'spec mb-1.5 block text-ink-soft'

/* ── Shared bits ─────────────────────────────────────────────────────── */

function ErrorNote({ children }) {
  if (!children) return null
  return (
    <div
      role="alert"
      className="rounded border border-ember/30 bg-ember/[0.06] px-3 py-2.5 text-sm text-ember-deep"
    >
      {children}
    </div>
  )
}

function AppTile({ app, locked }) {
  const live = app.status === 'live' && app.url && !locked
  const Inner = (
    <>
      <div className="flex items-center justify-between">
        <span
          className={`flex h-11 w-11 items-center justify-center rounded-lg ${
            live ? 'bg-navy text-white' : 'bg-ink/[0.06] text-ink-faint'
          }`}
        >
          <app.icon size={22} />
        </span>
        <span className={`spec ${live ? 'text-moss-deep' : 'text-ink-faint'}`}>
          {locked ? 'Sign in to open' : STATUS_LABELS[app.status]}
        </span>
      </div>
      <h3 className={`mt-4 text-lg font-bold ${live ? 'text-ink' : 'text-ink-soft'}`}>
        {app.name}
      </h3>
      <p className="mt-1 text-sm leading-relaxed text-ink-soft">{app.tagline}</p>
      {live && (
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ember">
          Open app <ArrowUpRight size={15} />
          {app.separateLogin && (
            <span className="font-mono text-[0.65rem] font-medium normal-case text-ink-faint">
              · own login for now
            </span>
          )}
        </span>
      )}
    </>
  )

  if (live) {
    return (
      <a
        href={app.url}
        target="_blank"
        rel="noreferrer"
        className="card card-hover flex flex-col p-6"
      >
        {Inner}
      </a>
    )
  }
  return <article className="card flex flex-col p-6 opacity-80">{Inner}</article>
}

/* ── Signed out ──────────────────────────────────────────────────────── */

function AuthCard() {
  const { signIn, signUp, resetPassword } = useHubAuth()
  const [mode, setMode] = useState('signin') // 'signin' | 'signup'
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setNotice('')
    setBusy(true)
    const form = new FormData(e.currentTarget)
    const email = String(form.get('email') || '')
    const password = String(form.get('password') || '')

    try {
      if (mode === 'signup') {
        const fullName = String(form.get('fullName') || '')
        const { data, error: err } = await signUp(email, password, fullName)
        if (err) setError(err.message)
        else if (!data.session)
          setNotice('Almost there — check your inbox and click the confirmation link.')
      } else {
        const { error: err } = await signIn(email, password)
        if (err) setError(err.message)
      }
    } finally {
      setBusy(false)
    }
  }

  const onForgot = async () => {
    if (busy) return
    const email = document.getElementById('suite-email')?.value || ''
    setError('')
    setNotice('')
    if (!email.includes('@')) {
      setError('Enter your email above first, then tap "Forgotten password".')
      return
    }
    setBusy(true)
    try {
      const { error: err } = await resetPassword(email)
      if (err) setError(err.message)
      else setNotice('Password reset link sent — check your inbox.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="card p-6 md:p-8" id="suite-signin">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy text-white">
          <KeyRound size={19} />
        </span>
        <div>
          <h2 className="text-xl font-bold text-ink">
            {mode === 'signin' ? 'Sign in' : 'Create your account'}
          </h2>
          <p className="text-sm text-ink-faint">Your Eco Futures suite account</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
        {mode === 'signup' && (
          <div>
            <label className={lbl} htmlFor="suite-name">
              Your name
            </label>
            <input
              id="suite-name"
              name="fullName"
              type="text"
              required
              autoComplete="name"
              placeholder="Jane Smith"
              className={field}
            />
          </div>
        )}
        <div>
          <label className={lbl} htmlFor="suite-email">
            Email
          </label>
          <input
            id="suite-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@company.co.uk"
            className={field}
          />
        </div>
        <div>
          <label className={lbl} htmlFor="suite-password">
            Password
          </label>
          <input
            id="suite-password"
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
            placeholder={mode === 'signin' ? 'Your password' : 'At least 8 characters'}
            className={field}
          />
        </div>

        <ErrorNote>{error}</ErrorNote>
        {notice && (
          <div
            role="status"
            className="flex items-start gap-2.5 rounded border border-moss/30 bg-moss/[0.07] px-3 py-2.5 text-sm text-moss-deep"
          >
            <MailCheck size={17} className="mt-0.5 shrink-0" /> {notice}
          </div>
        )}

        <button type="submit" disabled={busy} className="btn-primary w-full disabled:opacity-60">
          {busy ? (
            <>
              <Loader2 size={17} className="animate-spin" />
              {mode === 'signin' ? 'Signing in…' : 'Creating account…'}
            </>
          ) : mode === 'signin' ? (
            <>
              Sign in <ArrowRight size={16} />
            </>
          ) : (
            <>
              Create account <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      <div className="mt-5 flex flex-col gap-2 border-t border-ink/10 pt-4 text-sm">
        {mode === 'signin' ? (
          <>
            <button
              type="button"
              onClick={() => {
                setMode('signup')
                setError('')
                setNotice('')
              }}
              className="font-semibold text-ember hover:underline"
            >
              New here? Create an account
            </button>
            <button
              type="button"
              onClick={onForgot}
              disabled={busy}
              className="text-ink-faint hover:text-ink hover:underline disabled:opacity-60"
            >
              Forgotten password
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => {
              setMode('signin')
              setError('')
              setNotice('')
            }}
            className="font-semibold text-ember hover:underline"
          >
            Already have an account? Sign in
          </button>
        )}
      </div>
    </div>
  )
}

function SignedOut({ configured }) {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy bg-blueprint text-white">
        <div className="container-site py-16 md:py-24">
          <div className="max-w-2xl">
            <span className="eyebrow">
              <ShieldCheck size={14} /> Eco Futures Retrofit Suite
            </span>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight md:text-5xl">
              Every retrofit tool.
              <br />
              One login.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/75">
              The Retrofit Suite is the software behind our surveys — job tracking,
              on-site assessments, EPC data, cavity-wall diagrams and business
              reporting, moving onto one shared account app by app. EPC Checker and
              Cavwall keep their own logins while they migrate across.
            </p>
            <div className="mt-8 flex flex-wrap gap-6 text-sm text-white/70">
              <span className="inline-flex items-center gap-2">
                <Users size={16} className="text-amber" /> Team accounts with four access levels
              </span>
              <span className="inline-flex items-center gap-2">
                <Lock size={16} className="text-amber" /> Your organisation's data stays yours
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Apps + sign in */}
      <section className="container-site grid gap-10 py-14 md:py-20 lg:grid-cols-[1fr_380px] lg:gap-12">
        <div>
          <span className="eyebrow">The tools</span>
          <h2 className="mt-3 font-display text-3xl font-bold text-ink">
            What's in the suite
          </h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {APPS.map((app) => (
              <AppTile key={app.slug} app={app} locked={app.status === 'live'} />
            ))}
          </div>
        </div>

        <div className="lg:sticky lg:top-28 lg:self-start">
          {configured ? (
            <AuthCard />
          ) : (
            <div className="card p-6 md:p-8">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-ink/[0.06] text-ink-faint">
                <Lock size={19} />
              </span>
              <h2 className="mt-4 text-xl font-bold text-ink">Sign-in launching soon</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                Suite accounts aren't switched on yet. If you're an Eco Futures
                member of staff or a partner firm, we'll be in touch by email when
                your login is ready.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Access levels strip */}
      <section className="border-t border-ink/10 bg-paper-card">
        <div className="container-site py-14 md:py-16">
          <span className="eyebrow">Access levels</span>
          <h2 className="mt-3 font-display text-2xl font-bold text-ink">
            The right power for every role
          </h2>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((level) => (
              <div key={level} className="card p-5">
                <span className="font-mono text-xs font-semibold text-ember">
                  LEVEL {level}
                </span>
                <h3 className="mt-1.5 font-bold text-ink">{LEVEL_INFO[level].name}</h3>
                <p className="mt-1 text-sm text-ink-soft">{LEVEL_INFO[level].blurb}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

/* ── Signed in, no organisation yet ──────────────────────────────────── */

function NoOrgYet() {
  const { user, createOrganisation, signOut } = useHubAuth()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const onCreate = async (e) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    const name = String(new FormData(e.currentTarget).get('orgName') || '')
    const { error: err } = await createOrganisation(name)
    if (err) setError(err.message)
    setBusy(false)
  }

  return (
    <section className="container-site py-14 md:py-20">
      <div className="mx-auto max-w-lg">
        <span className="eyebrow">
          <Building2 size={14} /> One more step
        </span>
        <h1 className="mt-3 font-display text-3xl font-bold text-ink">
          Set up your organisation
        </h1>
        <p className="mt-3 leading-relaxed text-ink-soft">
          You're signed in as <strong className="text-ink">{user.email}</strong>, but
          you're not part of an organisation yet. Create one below — or, if your
          company already uses the suite, email{' '}
          <a href="mailto:Info@ecofutures.uk" className="font-medium text-ember underline underline-offset-2">
            Info@ecofutures.uk
          </a>{' '}
          and we'll add you to your team.
        </p>

        <form onSubmit={onCreate} className="card mt-8 flex flex-col gap-4 p-6 md:p-8">
          <div>
            <label className={lbl} htmlFor="org-name">
              Organisation name
            </label>
            <input
              id="org-name"
              name="orgName"
              type="text"
              required
              minLength={2}
              placeholder="e.g. Smith Retrofit Ltd"
              className={field}
            />
          </div>
          <ErrorNote>{error}</ErrorNote>
          <button type="submit" disabled={busy} className="btn-primary w-full disabled:opacity-60">
            {busy ? (
              <>
                <Loader2 size={17} className="animate-spin" /> Creating organisation…
              </>
            ) : (
              'Create organisation'
            )}
          </button>
          <p className="text-xs leading-relaxed text-ink-faint">
            You'll be the organisation's admin and can add your team afterwards.
          </p>
        </form>

        <button
          type="button"
          onClick={signOut}
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-ink-faint hover:text-ink"
        >
          <LogOut size={15} /> Sign out
        </button>
      </div>
    </section>
  )
}

/* ── Signed in — the launcher ────────────────────────────────────────── */

function PasswordCard() {
  const { passwordRecovery, updatePassword } = useHubAuth()
  const [open, setOpen] = useState(false)
  const [skipped, setSkipped] = useState(false) // user closed the auto-opened form
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const show = open || (passwordRecovery && !skipped)

  const onSubmit = async (e) => {
    e.preventDefault()
    const form = e.currentTarget
    const password = String(new FormData(form).get('newPassword') || '')
    setError('')
    setNotice('')
    setBusy(true)
    const { error: err } = await updatePassword(password)
    setBusy(false)
    if (err) setError(err.message)
    else {
      setNotice('Password saved — use it next time you sign in.')
      form.reset()
      setOpen(false)
    }
  }

  return (
    <div className="mt-10 border-t border-ink/10 pt-6">
      {!show ? (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-1.5 font-semibold text-ink-faint transition-colors hover:text-ink"
          >
            <KeyRound size={14} /> Change password
          </button>
          {notice && (
            <span role="status" className="text-moss-deep">
              {notice}
            </span>
          )}
        </div>
      ) : (
        <form onSubmit={onSubmit} className="max-w-sm">
          {passwordRecovery && (
            <p className="mb-3 text-sm font-medium text-ink">
              Choose a password to finish setting up your login.
            </p>
          )}
          <label className="spec mb-1.5 block text-ink-soft" htmlFor="new-password">
            New password
          </label>
          <input
            id="new-password"
            name="newPassword"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="At least 8 characters"
            className="w-full rounded border border-ink/15 bg-white px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-ember"
          />
          {error && (
            <div role="alert" className="mt-3 rounded border border-ember/30 bg-ember/[0.06] px-3 py-2.5 text-sm text-ember-deep">
              {error}
            </div>
          )}
          <div className="mt-3 flex items-center gap-3">
            <button type="submit" disabled={busy} className="btn-dark px-5 py-2.5 text-sm disabled:opacity-60">
              {busy ? (
                <>
                  <Loader2 size={15} className="animate-spin" /> Saving…
                </>
              ) : (
                'Save password'
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setOpen(false)
                setSkipped(true)
                setError('')
              }}
              className="text-sm font-semibold text-ink-faint hover:text-ink"
            >
              {passwordRecovery ? 'Skip for now' : 'Cancel'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

function Launcher() {
  const { user, org, accessLevel, signOut } = useHubAuth()
  const firstName =
    (user.user_metadata?.full_name || user.email).split(/[\s@]/)[0] || 'there'

  return (
    <>
      <section className="bg-navy bg-blueprint text-white">
        <div className="container-site py-12 md:py-16">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <span className="eyebrow">
                <Building2 size={14} /> {org.name}
                {org.is_platform_owner && ' · Platform'}
              </span>
              <h1 className="mt-3 font-display text-3xl font-bold md:text-4xl">
                Hello, {firstName}
              </h1>
              <p className="mt-2 flex items-center gap-2 text-sm text-white/70">
                <ShieldCheck size={15} className="text-amber" />
                {levelName(accessLevel)} · Level {accessLevel}
              </p>
            </div>
            <button
              type="button"
              onClick={signOut}
              className="inline-flex items-center gap-2 rounded border border-white/25 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              <LogOut size={15} /> Sign out
            </button>
          </div>
        </div>
      </section>

      <section className="container-site py-12 md:py-16">
        <span className="eyebrow">Your apps</span>
        <h2 className="mt-3 font-display text-2xl font-bold text-ink">Open a tool</h2>
        <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {APPS.filter((a) => accessLevel >= a.minLevel).map((app) => (
            <AppTile key={app.slug} app={app} locked={false} />
          ))}
        </div>

        {can(accessLevel, 'org.manage_users') && (
          <Link
            to="/retrofit-suite/team"
            className="card card-hover mt-8 flex items-center justify-between p-6"
          >
            <span className="flex items-center gap-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-navy text-white">
                <Users size={22} />
              </span>
              <span>
                <span className="block font-bold text-ink">Manage your team</span>
                <span className="block text-sm text-ink-soft">
                  Invite people and set their access levels
                </span>
              </span>
            </span>
            <ArrowRight size={18} className="shrink-0 text-ember" />
          </Link>
        )}

        <p className="mt-8 text-sm text-ink-faint">
          The organisation dashboard is on the way — it'll appear here.
        </p>

        <PasswordCard />
      </section>
    </>
  )
}

/* ── Page shell ──────────────────────────────────────────────────────── */

function SuiteContent() {
  const { status, session, memberships } = useHubAuth()

  if (status === 'loading') {
    return (
      <div className="container-site flex items-center justify-center py-32 text-ink-faint">
        <Loader2 size={22} className="animate-spin" />
        <span className="sr-only">Loading your account</span>
      </div>
    )
  }
  if (status === 'unconfigured' || !session) {
    return <SignedOut configured={status !== 'unconfigured'} />
  }
  if (memberships.length === 0) return <NoOrgYet />
  return <Launcher />
}

export default function RetrofitSuite() {
  return (
    <HubAuthProvider>
      <SuiteContent />
    </HubAuthProvider>
  )
}
