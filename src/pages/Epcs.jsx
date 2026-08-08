import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  ArrowRight,
  FileCheck2,
  Scale,
  CalendarClock,
  Ruler,
  Lock,
  Loader2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Phone,
  Mail,
  MapPin,
  BadgeCheck,
  Minus,
  Plus,
} from 'lucide-react'
import { COMPANY, isPlaceholder } from '../data/company.js'

/**
 * /epcs — the paid-traffic landing page for "buy an EPC".
 *
 * This page is the destination of the Google Ads campaign, so it has to do
 * exactly what the ad promises, immediately and without a gate:
 *   · the full price is stated up front and is the price actually charged
 *     (no deposit, no undisclosed "final fee")
 *   · the buy button is NEVER disabled — an out-of-area postcode explains the
 *     problem and offers a route forward instead of a dead control
 *   · nothing blocks or overlays the content, and the checkout stays on this
 *     same origin (Stripe is the payment processor, not a different landing
 *     destination)
 * Keep the ad's final URL as https://www.ecofutures.uk/epcs — the apex
 * (ecofutures.uk) 308-redirects to www, which adds a hop Google can read as a
 * destination mismatch.
 */

/* Pricing mirrors api/checkout.js — the server recomputes it from the bedroom
   count, so this is only ever a display figure. Keep the two in step. */
const EPC_BASE = 65
const PER_EXTRA_BEDROOM = 5
const BEDROOMS_INCLUDED = 3
const MAX_BEDROOMS = 10

const priceFor = (beds) =>
  EPC_BASE + Math.max(0, Math.min(beds, MAX_BEDROOMS) - BEDROOMS_INCLUDED) * PER_EXTRA_BEDROOM

/* We carry out EPCs in Preston (PR) and Blackpool/Fylde (FY) only. */
const isEligible = (pc) => /^(PR|FY)\d/i.test(pc.trim().replace(/\s+/g, ''))

const facts = [
  {
    icon: FileCheck2,
    title: 'The baseline',
    body: 'An EPC rates energy efficiency from A to G and lists recommended improvements — the starting point for any retrofit plan.',
  },
  {
    icon: Scale,
    title: 'Often a legal must',
    body: 'Required to sell or rent a home, and increasingly tied to minimum standards for landlords.',
  },
  {
    icon: CalendarClock,
    title: 'Valid 10 years',
    body: 'Once lodged, an EPC is valid for a decade — though a retrofit is a good reason to refresh it.',
  },
  {
    icon: Ruler,
    title: 'Measured, not guessed',
    body: 'EPCs are produced by an accredited assessor on RdSAP — the same measured data that drives your retrofit plan.',
  },
]

const ratings = [
  { band: 'A', range: '92–100', label: 'Very efficient', width: '100%', bg: '#2E7D4F', text: '#fff' },
  { band: 'B', range: '81–91', label: '', width: '88%', bg: '#4FA36B', text: '#fff' },
  { band: 'C', range: '69–80', label: '', width: '76%', bg: '#8CC63F', text: '#14200f' },
  { band: 'D', range: '55–68', label: 'Average', width: '64%', bg: '#E8B23A', text: '#241a05' },
  { band: 'E', range: '39–54', label: '', width: '52%', bg: '#E89A2A', text: '#241a05' },
  { band: 'F', range: '21–38', label: '', width: '40%', bg: '#E4572E', text: '#fff' },
  { band: 'G', range: '1–20', label: 'Least efficient', width: '30%', bg: '#B0342A', text: '#fff' },
]

const steps = [
  ['01', 'Pay online', 'Choose your bedroom count and pay the full fee securely by card. Nothing else to pay later.'],
  ['02', 'We book you in', 'We call to arrange a visit that suits you — usually within a few days.'],
  ['03', 'Certificate lodged', 'The assessment takes about 45 minutes. Your EPC is lodged on the national register and emailed to you.'],
]

export default function Epcs() {
  const [params] = useSearchParams()
  const status = params.get('status')

  const [postcode, setPostcode] = useState('')
  const [bedrooms, setBedrooms] = useState(3)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const typed = postcode.trim().length > 0
  const eligible = isEligible(postcode)
  const price = priceFor(bedrooms)

  async function buy() {
    setError('')
    // Validate here so the button always DOES something — a disabled primary
    // CTA on an ad landing page reads as a broken destination.
    if (!typed) {
      setError('Please enter your postcode so we can check we cover your area.')
      return
    }
    if (!eligible) {
      setError(
        `We only carry out EPCs in PR and FY postcodes at the moment, so we can't take payment for ${postcode.trim().toUpperCase()}. Give us a call on ${COMPANY.phone} and we'll point you to a local assessor.`,
      )
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product: 'epc', postcode, bedrooms }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.url) throw new Error(data.error || 'Something went wrong. Please try again.')
      window.location.href = data.url
    } catch (e) {
      setError(e.message)
      setLoading(false)
    }
  }

  const showAccreditation =
    COMPANY.accreditationScheme && COMPANY.assessorNumber && !isPlaceholder(COMPANY.accreditationScheme)

  return (
    <>
      {/* ---- Hero + order card (the whole point of the page, above the fold) ---- */}
      <section className="border-b border-ink/10 bg-navy bg-blueprint text-white">
        <div className="container-site grid items-start gap-10 py-14 md:grid-cols-[1.05fr_1fr] md:py-20">
          <div>
            <span className="eyebrow text-ember">Energy Performance Certificates</span>
            <h1 className="mt-4 text-4xl font-extrabold leading-[1.02] tracking-tight md:text-6xl">
              Book your EPC from <span className="text-ember">£{EPC_BASE}</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/70">
              An accredited domestic energy assessor visits your property, carries out the
              assessment and lodges your certificate on the national register. Pay online today and
              we&rsquo;ll call to arrange the visit.
            </p>

            <ul className="mt-7 space-y-2.5">
              {[
                `£${EPC_BASE} for up to ${BEDROOMS_INCLUDED} bedrooms — £${PER_EXTRA_BEDROOM} per extra bedroom`,
                'One payment — no deposit, no fee to pay afterwards',
                'Covering Preston (PR) and Blackpool & Fylde (FY)',
                'Certificate lodged and emailed to you',
              ].map((t) => (
                <li key={t} className="flex items-start gap-2.5 text-[0.98rem] text-white/85">
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-moss-soft" />
                  {t}
                </li>
              ))}
            </ul>

            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/60">
              <a className="inline-flex items-center gap-2 hover:text-white" href={`tel:${COMPANY.phoneHref}`}>
                <Phone size={15} /> {COMPANY.phone}
              </a>
              <a className="inline-flex items-center gap-2 hover:text-white" href={`mailto:${COMPANY.email}`}>
                <Mail size={15} /> {COMPANY.email}
              </a>
              <span className="inline-flex items-center gap-2">
                <MapPin size={15} /> {COMPANY.area}
              </span>
            </div>
          </div>

          {/* Order card */}
          <div className="rounded-xl border border-white/12 bg-white p-6 text-ink shadow-lift sm:p-7">
            <h2 className="text-xl font-bold tracking-tight text-ink">Order your EPC</h2>
            <p className="mt-1 text-sm text-ink-soft">
              Takes a minute. Secure card payment handled by Stripe.
            </p>

            {/* Postcode */}
            <div className="mt-6">
              <label htmlFor="pc" className="spec mb-1.5 block text-ink-faint">
                Property postcode
              </label>
              <input
                id="pc"
                value={postcode}
                onChange={(e) => {
                  setPostcode(e.target.value)
                  setError('')
                }}
                placeholder="e.g. PR1 2AB"
                autoComplete="postal-code"
                className="w-full rounded border border-ink/15 bg-white px-4 py-3 text-sm uppercase text-ink outline-none transition-colors placeholder:normal-case placeholder:text-ink-faint focus:border-ember"
              />
              {typed && !eligible && (
                <p className="mt-2 flex items-start gap-1.5 text-xs leading-relaxed text-ember-deep">
                  <AlertCircle size={14} className="mt-px shrink-0" />
                  <span>
                    We cover PR and FY postcodes.{' '}
                    <Link to="/contact" className="underline underline-offset-2">
                      Contact us
                    </Link>{' '}
                    about other areas.
                  </span>
                </p>
              )}
              {typed && eligible && (
                <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-moss-deep">
                  <CheckCircle2 size={14} /> We cover your area.
                </p>
              )}
            </div>

            {/* Bedrooms */}
            <div className="mt-5">
              <label htmlFor="beds" className="spec mb-1.5 block text-ink-faint">
                Number of bedrooms
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  aria-label="Fewer bedrooms"
                  onClick={() => setBedrooms((b) => Math.max(1, b - 1))}
                  disabled={bedrooms <= 1}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded border border-ink/15 text-ink transition-colors hover:border-ember hover:text-ember disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Minus size={16} />
                </button>
                <input
                  id="beds"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={MAX_BEDROOMS}
                  value={bedrooms}
                  onChange={(e) => {
                    const n = Math.round(Number(e.target.value) || 1)
                    setBedrooms(Math.min(Math.max(n, 1), MAX_BEDROOMS))
                  }}
                  className="w-full rounded border border-ink/15 bg-white px-4 py-3 text-center text-sm font-semibold text-ink outline-none transition-colors focus:border-ember"
                />
                <button
                  type="button"
                  aria-label="More bedrooms"
                  onClick={() => setBedrooms((b) => Math.min(MAX_BEDROOMS, b + 1))}
                  disabled={bedrooms >= MAX_BEDROOMS}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded border border-ink/15 text-ink transition-colors hover:border-ember hover:text-ember disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Price */}
            <div className="mt-6 flex items-end justify-between border-t border-ink/10 pt-5">
              <div>
                <div className="spec text-ink-faint">Total to pay</div>
                <p className="mt-1 text-xs text-ink-faint">
                  {bedrooms <= BEDROOMS_INCLUDED
                    ? `Up to ${BEDROOMS_INCLUDED} bedrooms`
                    : `£${EPC_BASE} + ${bedrooms - BEDROOMS_INCLUDED} × £${PER_EXTRA_BEDROOM}`}
                </p>
              </div>
              <div className="font-mono text-4xl font-semibold leading-none text-ink">£{price}</div>
            </div>

            {error && (
              <p className="mt-4 flex items-start gap-2 rounded border border-ember/30 bg-ember/[0.06] p-3 text-sm leading-relaxed text-ember-deep">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </p>
            )}

            <button
              type="button"
              onClick={buy}
              disabled={loading}
              className="btn-primary mt-5 w-full py-3.5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Redirecting to secure checkout…
                </>
              ) : (
                <>
                  Pay £{price} and book <ArrowRight size={16} />
                </>
              )}
            </button>

            <p className="mt-3 flex items-center justify-center gap-2 font-mono text-[0.68rem] text-ink-faint">
              <Lock size={12} /> Secure checkout by Stripe — your card details never touch our site
            </p>

            {/* Consumer Contracts Regulations 2013: the cancellation right, how
                to use it and where to send it must be given BEFORE the customer
                is bound. Leaving it out stretches the 14 days to 12 months and
                14 days AND removes the right to charge for work already done. */}
            <details className="mt-4 rounded border border-ink/10 bg-paper px-3 py-2.5">
              <summary className="cursor-pointer list-none text-[0.72rem] font-semibold text-ink [&::-webkit-details-marker]:hidden">
                Your 14-day right to cancel →
              </summary>
              <div className="mt-2 space-y-1.5 text-[0.7rem] leading-relaxed text-ink-soft">
                <p>
                  You have <strong>14 days</strong> from the day after you order to cancel for any
                  reason and get a full refund. To cancel, email{' '}
                  <a href={`mailto:${COMPANY.email}`} className="underline underline-offset-2">
                    {COMPANY.email}
                  </a>
                  , call {COMPANY.phone}, or write to us at {COMPANY.registeredOffice} — a clear
                  statement is enough. You can also use our{' '}
                  <Link to="/epc-cancellation-form" className="underline underline-offset-2">
                    cancellation form
                  </Link>
                  .
                </p>
                <p>
                  If you ask us to carry out the EPC <strong>within</strong> those 14 days and then
                  cancel before it is done, you pay a proportionate amount for the work already
                  carried out. Once the assessment is done and the certificate lodged, the right to
                  cancel ends.
                </p>
              </div>
            </details>
            <p className="mt-3 text-center text-[0.7rem] leading-relaxed text-ink-faint">
              By paying you agree to our{' '}
              <Link to="/terms" className="underline underline-offset-2">
                Terms
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="underline underline-offset-2">
                Privacy Policy
              </Link>
              . Full refund if we can&rsquo;t complete your EPC.
            </p>
          </div>
        </div>
      </section>

      {/* ---- Status banners after returning from Stripe ---- */}
      {(status === 'success' || status === 'cancelled') && (
        <section className="container-site pt-10">
          {status === 'success' ? (
            <Banner tone="success" icon={CheckCircle2}>
              <strong className="font-semibold">Payment received — thank you.</strong> You&rsquo;ll get a
              receipt by email, and we&rsquo;ll call you on the number you gave to arrange the visit.
              Any questions in the meantime, ring {COMPANY.phone}.
            </Banner>
          ) : (
            <Banner tone="muted" icon={XCircle}>
              Checkout cancelled — no payment was taken. Your details are still above if you&rsquo;d
              like to try again.
            </Banner>
          )}
        </section>
      )}

      {/* ---- How it works ---- */}
      <section className="container-site py-16 md:py-20">
        <div className="max-w-prose">
          <span className="eyebrow text-ink-faint">What happens next</span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink md:text-4xl">
            Three steps, start to certificate.
          </h2>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {steps.map(([n, title, desc]) => (
            <div key={n} className="card flex flex-col p-7">
              <span className="font-mono text-3xl font-semibold text-ember/80">{n}</span>
              <h3 className="mt-2 text-lg font-bold text-ink">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---- Who carries it out (trust signals) ---- */}
      <section className="border-y border-ink/10 bg-paper-warm/60 py-16 md:py-20">
        <div className="container-site grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div>
            <span className="eyebrow text-ink-faint">Who carries out your assessment</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink md:text-4xl">
              An accredited assessor, not a call centre.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-soft">
              {COMPANY.tradingName} is a {COMPANY.area} based energy assessment and retrofit
              practice. The same assessor who takes your booking carries out the survey and lodges
              the certificate.
            </p>
          </div>
          <div className="card p-7">
            <dl className="divide-y divide-ink/10">
              {showAccreditation && (
                <Row
                  icon={BadgeCheck}
                  label="Accreditation"
                  value={`${COMPANY.accreditationScheme} · Assessor ${COMPANY.assessorNumber}`}
                />
              )}
              <Row icon={MapPin} label="Areas covered" value="Preston (PR) · Blackpool & Fylde (FY)" />
              <Row
                icon={Phone}
                label="Phone"
                value={COMPANY.phone}
                href={`tel:${COMPANY.phoneHref}`}
              />
              <Row icon={Mail} label="Email" value={COMPANY.email} href={`mailto:${COMPANY.email}`} />
              {!isPlaceholder(COMPANY.registeredOffice) && (
                <Row
                  icon={MapPin}
                  label={COMPANY.isLtd ? 'Registered office' : 'Business address'}
                  value={COMPANY.registeredOffice}
                />
              )}
              {COMPANY.isLtd && !isPlaceholder(COMPANY.companyNumber) && (
                <Row
                  icon={FileCheck2}
                  label="Company"
                  value={`${COMPANY.legalName} · No. ${COMPANY.companyNumber} (${COMPANY.placeOfRegistration})`}
                />
              )}
            </dl>
          </div>
        </div>
      </section>

      {/* ---- What an EPC is ---- */}
      <section className="container-site py-16 md:py-20">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {facts.map((f) => (
            <div key={f.title} className="card card-hover p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-ember/10 text-ember">
                <f.icon size={22} />
              </span>
              <h3 className="mt-5 text-lg font-bold text-ink">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{f.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="rounded-xl border border-ink/10 bg-paper-card p-5 shadow-card">
            <div className="mb-3 flex items-center justify-between">
              <span className="spec text-ink-faint">Energy rating</span>
              <span className="font-mono text-xs text-ink-faint">SAP score</span>
            </div>
            <div className="flex flex-col gap-1.5">
              {ratings.map((r) => (
                <div
                  key={r.band}
                  className="flex items-center justify-between rounded px-3 py-2 font-mono text-xs font-semibold"
                  style={{ width: r.width, backgroundColor: r.bg, color: r.text }}
                >
                  <span>
                    {r.band} · {r.range}
                  </span>
                  {r.label && <span className="hidden sm:inline">{r.label}</span>}
                </div>
              ))}
            </div>
          </div>
          <div>
            <span className="eyebrow text-ink-faint">From certificate to plan</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink md:text-4xl">
              An EPC tells you the score. A retrofit assessment tells you what to do about it.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-soft">
              A standard EPC gives a rating and a generic list of improvements. A PAS 2035 retrofit
              assessment goes further — moisture, ventilation, how you actually live in the home, and
              the right sequence of works.
            </p>
            <Link
              to="/retrofit"
              className="mt-6 inline-flex items-center gap-1.5 font-semibold text-ember hover:gap-2.5"
            >
              See how retrofit works <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

function Row({ icon: Icon, label, value, href }) {
  return (
    <div className="flex items-start gap-3 py-3.5 first:pt-0 last:pb-0">
      <Icon size={17} className="mt-0.5 shrink-0 text-ember" />
      <dt className="spec w-32 shrink-0 pt-0.5 text-ink-faint">{label}</dt>
      <dd className="text-sm font-medium text-ink">
        {href ? (
          <a href={href} className="hover:text-ember">
            {value}
          </a>
        ) : (
          value
        )}
      </dd>
    </div>
  )
}

function Banner({ tone, icon: Icon, children }) {
  const tones = {
    success: 'border-moss/30 bg-moss/[0.07] text-moss-deep',
    muted: 'border-ink/15 bg-paper text-ink-soft',
  }
  return (
    <div className={`flex items-start gap-3 rounded-lg border p-4 text-sm leading-relaxed ${tones[tone]}`}>
      <Icon size={18} className="mt-0.5 shrink-0" />
      <p>{children}</p>
    </div>
  )
}
