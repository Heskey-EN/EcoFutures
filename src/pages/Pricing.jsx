import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  FileText,
  ClipboardList,
  FileSearch,
  PencilRuler,
  Check,
  ArrowRight,
  ArrowUpRight,
  Lock,
  Loader2,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from 'lucide-react'

const isEligible = (pc) => /^(PR|FY)\d/i.test(pc.trim().replace(/\s+/g, ''))

export default function Pricing() {
  const [params] = useSearchParams()
  const status = params.get('status')

  const [postcode, setPostcode] = useState('')
  const [loading, setLoading] = useState(null) // product id in flight
  const [error, setError] = useState('')

  const pcEligible = isEligible(postcode)

  async function checkout(product, extra = {}) {
    setError('')
    setLoading(product)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product, ...extra }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.url) throw new Error(data.error || 'Something went wrong. Please try again.')
      window.location.href = data.url
    } catch (e) {
      setError(e.message)
      setLoading(null)
    }
  }

  return (
    <>
      {/* Hero */}
      <section className="border-b border-ink/10 bg-navy bg-blueprint text-white">
        <div className="container-site py-14 md:py-20">
          <span className="eyebrow text-ember">Pricing</span>
          <h1 className="mt-4 max-w-2xl text-4xl font-extrabold leading-[1.03] tracking-tight md:text-6xl">
            Order online.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/70">
            Reserve an EPC, or join one of our software memberships. Payments are handled securely by
            Stripe — your card details never touch our site.
          </p>
          <p className="mt-4 inline-flex items-center gap-2 font-mono text-xs text-white/50">
            <Lock size={14} /> Secure checkout by Stripe
          </p>
        </div>
      </section>

      <section className="container-site py-14 md:py-20">
        {/* Status banner */}
        {status === 'success' && (
          <Banner tone="success" icon={CheckCircle2}>
            Payment received — thank you. You’ll get a confirmation by email, and we’ll be in touch to
            arrange the next step.
          </Banner>
        )}
        {status === 'cancelled' && (
          <Banner tone="muted" icon={XCircle}>
            Checkout cancelled — no payment was taken. You can pick up where you left off any time.
          </Banner>
        )}
        {error && (
          <Banner tone="error" icon={AlertCircle}>
            {error}
          </Banner>
        )}

        {/* Surveys */}
        <div className="max-w-prose">
          <span className="eyebrow text-ink-faint">Surveys</span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink md:text-4xl">
            Book your assessment.
          </h2>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {/* EPC deposit */}
          <article className="card flex flex-col p-7">
            <div className="flex items-center justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-navy text-white">
                <FileText size={22} />
              </span>
              <div className="text-right">
                <div className="font-mono text-2xl font-semibold text-ink">£20</div>
                <div className="spec text-ink-faint">deposit</div>
              </div>
            </div>
            <h3 className="mt-5 text-xl font-bold text-ink">Energy Performance Certificate</h3>
            <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-soft">
              Reserve your EPC with a £20 deposit — it’s deducted from your final fee. Available for
              Preston (PR) and Fylde/Blackpool (FY) postcodes.
            </p>

            <div className="mt-5">
              <label htmlFor="pc" className="spec mb-1.5 block text-ink-faint">
                Your postcode
              </label>
              <input
                id="pc"
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
                placeholder="e.g. PR1 2AB"
                autoComplete="postal-code"
                className="w-full rounded border border-ink/15 bg-white px-4 py-3 text-sm uppercase text-ink outline-none transition-colors placeholder:normal-case placeholder:text-ink-faint focus:border-ember"
              />
              {postcode.trim() && !pcEligible && (
                <p className="mt-2 text-xs text-ember-deep">
                  We take EPC deposits online for PR and FY postcodes only.{' '}
                  <Link to="/contact" className="underline underline-offset-2">
                    Contact us
                  </Link>{' '}
                  for other areas.
                </p>
              )}
            </div>

            <button
              type="button"
              disabled={!pcEligible || loading === 'epc-deposit'}
              onClick={() => checkout('epc-deposit', { postcode })}
              className="btn-primary mt-5 w-full py-3 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading === 'epc-deposit' ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Redirecting…
                </>
              ) : (
                <>Pay £20 deposit <ArrowRight size={16} /></>
              )}
            </button>
            <p className="mt-3 font-mono text-[0.65rem] leading-relaxed text-ink-faint">
              Refundable if we can’t complete your EPC. See our{' '}
              <Link to="/terms" className="underline underline-offset-2">
                Terms
              </Link>
              .
            </p>
          </article>

          {/* Retrofit assessment — contact only */}
          <article className="card flex flex-col p-7">
            <div className="flex items-center justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-navy text-white">
                <ClipboardList size={22} />
              </span>
              <div className="text-right">
                <div className="font-mono text-2xl font-semibold text-ink">Bespoke</div>
                <div className="spec text-ink-faint">by quote</div>
              </div>
            </div>
            <h3 className="mt-5 text-xl font-bold text-ink">Retrofit assessment</h3>
            <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-soft">
              A PAS 2035 whole-house assessment is priced to your property and goals. Tell us about
              your home and we’ll send a tailored quote — no online payment needed.
            </p>
            <ul className="mt-5 flex flex-1 flex-col gap-2.5 border-t border-ink/10 pt-5">
              {['Whole-house survey & heat-loss assessment', 'Prioritised, costed retrofit plan', 'Grant eligibility checked'].map(
                (t) => (
                  <li key={t} className="flex items-start gap-2.5 text-sm text-ink">
                    <Check size={17} className="mt-0.5 shrink-0 text-moss" /> {t}
                  </li>
                ),
              )}
            </ul>
            <Link to="/contact" className="btn-dark mt-6 w-full py-3">
              Contact us for a quote <ArrowRight size={16} />
            </Link>
          </article>
        </div>

        {/* Memberships */}
        <div className="mt-20 max-w-prose">
          <span className="eyebrow text-ink-faint">Software memberships</span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink md:text-4xl">
            Join our tools.
          </h2>
          <p className="mt-4 text-lg text-ink-soft">
            Monthly memberships, billed by Stripe. Cancel any time from your receipt.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          <MembershipCard
            icon={FileSearch}
            name="EPC Checker"
            site="epc-checker.com"
            href="https://epc-checker.com"
            price="£20"
            blurb="Look up any UK property’s energy rating, fabric, heating and heritage constraints — with Pro reports and bulk uploads."
            product="epc-checker"
            loading={loading}
            onSubscribe={() => checkout('epc-checker')}
          />
          <MembershipCard
            icon={PencilRuler}
            name="Cavwall"
            site="cavwall.com"
            href="https://cavwall.com"
            price="£10"
            blurb="Draw to-scale cavity-wall elevation diagrams and export a print-ready CWI survey PDF, with AI auto-drafting from floor plans."
            product="cavwall"
            loading={loading}
            onSubscribe={() => checkout('cavwall')}
          />
        </div>

        <p className="mt-10 font-mono text-xs leading-relaxed text-ink-faint">
          Prices include VAT where applicable. Memberships renew monthly until cancelled. By paying
          you agree to our{' '}
          <Link to="/terms" className="underline underline-offset-2">
            Terms
          </Link>{' '}
          and{' '}
          <Link to="/privacy" className="underline underline-offset-2">
            Privacy Policy
          </Link>
          .
        </p>
      </section>
    </>
  )
}

function MembershipCard({ icon: Icon, name, site, href, price, blurb, product, loading, onSubscribe }) {
  return (
    <article className="card flex flex-col p-7">
      <div className="flex items-center justify-between">
        <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-ember/10 text-ember">
          <Icon size={22} />
        </span>
        <div className="text-right">
          <div className="font-mono text-2xl font-semibold text-ink">
            {price}
            <span className="text-sm font-normal text-ink-faint">/mo</span>
          </div>
          <div className="spec text-ink-faint">membership</div>
        </div>
      </div>
      <h3 className="mt-5 text-xl font-bold text-ink">{name}</h3>
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="mt-1 inline-flex w-fit items-center gap-1 font-mono text-xs text-ember hover:underline"
      >
        {site} <ArrowUpRight size={12} />
      </a>
      <p className="mt-3 flex-1 text-[0.95rem] leading-relaxed text-ink-soft">{blurb}</p>
      <button
        type="button"
        disabled={loading === product}
        onClick={onSubscribe}
        className="btn-primary mt-6 w-full py-3 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading === product ? (
          <>
            <Loader2 size={16} className="animate-spin" /> Redirecting…
          </>
        ) : (
          <>Subscribe {price}/mo <ArrowRight size={16} /></>
        )}
      </button>
    </article>
  )
}

function Banner({ tone, icon: Icon, children }) {
  const tones = {
    success: 'border-moss/30 bg-moss/[0.07] text-moss-deep',
    error: 'border-ember/30 bg-ember/[0.06] text-ember-deep',
    muted: 'border-ink/15 bg-paper text-ink-soft',
  }
  return (
    <div className={`mb-8 flex items-start gap-3 rounded-lg border p-4 text-sm ${tones[tone]}`}>
      <Icon size={18} className="mt-0.5 shrink-0" />
      <p>{children}</p>
    </div>
  )
}
