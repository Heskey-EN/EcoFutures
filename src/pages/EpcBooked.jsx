import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import emailjs from '@emailjs/browser'
import {
  CheckCircle2,
  Loader2,
  AlertCircle,
  CalendarDays,
  Phone,
  MapPin,
  BedDouble,
  Receipt,
} from 'lucide-react'
import { COMPANY } from '../data/company.js'

// Same EmailJS credentials the contact form uses — public client-side ids.
const EMAILJS_SERVICE = import.meta.env.VITE_EMAILJS_SERVICE || 'service_tcu1ci3'
const EMAILJS_TEMPLATE = import.meta.env.VITE_EMAILJS_TEMPLATE || 'template_ldu2ckm'
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'Ew-e7AM5p0vx0GqrC'

const TIME_SLOTS = ['Morning', 'Afternoon', 'Either']

/**
 * /epcs/booked — where Stripe sends the customer after a successful EPC
 * payment. They choose preferred dates; we attach those to the payment in
 * Stripe (so the dashboard entry carries address, phone, bedrooms AND dates)
 * and email George so he knows to ring them.
 *
 * The payment is already complete by the time anyone lands here, so nothing on
 * this page can cost the customer anything. If the email or the metadata write
 * fails we still tell them they're booked — George has the Stripe notification
 * regardless, and the page shows his number.
 */
export default function EpcBooked() {
  const [params] = useSearchParams()
  const sessionId = params.get('session_id') || ''

  const [state, setState] = useState('loading') // loading | form | saving | done | error
  const [order, setOrder] = useState(null)
  const [error, setError] = useState('')

  const [preferredDate, setPreferredDate] = useState('')
  const [altDate, setAltDate] = useState('')
  const [timeSlot, setTimeSlot] = useState('Either')
  const [notes, setNotes] = useState('')
  const emailedRef = useRef(false)

  // Earliest selectable day is tomorrow; latest a year out (matches the API).
  const { min, max } = useMemo(() => {
    const d = new Date()
    d.setDate(d.getDate() + 1)
    const y = new Date()
    y.setFullYear(y.getFullYear() + 1)
    return { min: d.toISOString().slice(0, 10), max: y.toISOString().slice(0, 10) }
  }, [])

  useEffect(() => {
    if (!sessionId) {
      setState('error')
      setError('This page opens automatically after payment. If you have already paid, call us and we’ll book you in.')
      return
    }
    let cancelled = false
    fetch(`/api/booking?session_id=${encodeURIComponent(sessionId)}`)
      .then((r) => r.json().then((d) => ({ ok: r.ok, d })))
      .then(({ ok, d }) => {
        if (cancelled) return
        if (!ok || !d.order) {
          setState('error')
          setError(d.error || 'We couldn’t find that booking.')
          return
        }
        setOrder(d.order)
        setState(d.order.booked ? 'done' : 'form')
      })
      .catch(() => {
        if (cancelled) return
        setState('error')
        setError('We couldn’t reach the booking service. Your payment is safe — please call us.')
      })
    return () => {
      cancelled = true
    }
  }, [sessionId])

  /* Notify George. Reuses the contact-form template (name/email/address/
     message), so there is no new EmailJS template to set up. Best-effort: a
     failure here must never tell a paying customer their booking failed. */
  async function notify(details) {
    if (emailedRef.current) return
    emailedRef.current = true
    const lines = [
      'NEW EPC BOOKING — payment received',
      '',
      `Property:   ${details.propertyAddress || '(not given)'}`,
      `Postcode:   ${details.postcode || '(not given)'}`,
      `Bedrooms:   ${details.bedrooms || '?'}`,
      `Paid:       £${details.amount ?? '?'}`,
      '',
      `Preferred:  ${details.preferredDate}`,
      `Alternative:${details.altDate ? ` ${details.altDate}` : ' (none)'}`,
      `Time:       ${details.timeSlot}`,
      `Notes:      ${details.notes || '(none)'}`,
      '',
      `Customer:   ${details.name || '(not given)'}`,
      `Phone:      ${details.phone || '(not given)'}`,
      `Email:      ${details.email || '(not given)'}`,
      '',
      `Stripe ref: ${sessionId}`,
    ]
    try {
      await emailjs.send(
        EMAILJS_SERVICE,
        EMAILJS_TEMPLATE,
        {
          name: `EPC booking — ${details.name || 'customer'}`,
          email: details.email || COMPANY.email,
          address: `${details.propertyAddress || ''} ${details.postcode || ''}`.trim(),
          message: lines.join('\n'),
        },
        { publicKey: EMAILJS_PUBLIC_KEY },
      )
    } catch (e) {
      // George still gets Stripe's own payment notification, and the dates are
      // on the PaymentIntent — so this is a convenience, not the record.
      console.error('Booking notification email failed:', e)
    }
  }

  async function submit(e) {
    e.preventDefault()
    setError('')
    if (!preferredDate) {
      setError('Please choose a preferred date.')
      return
    }
    setState('saving')
    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, preferredDate, altDate, timeSlot, notes }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Could not save your dates.')
      await notify({ ...order, preferredDate, altDate, timeSlot, notes })
      setOrder(data.order || { ...order, booked: true, preferredDate, altDate, timeSlot })
      setState('done')
    } catch (err) {
      setError(err.message)
      setState('form')
    }
  }

  const fieldCls =
    'w-full rounded border border-ink/15 bg-white px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-ember'
  const lblCls = 'spec mb-1.5 block text-ink-faint'

  return (
    <>
      <section className="border-b border-ink/10 bg-navy bg-blueprint text-white">
        <div className="container-site py-12 md:py-16">
          <span className="eyebrow text-ember">
            <CheckCircle2 size={14} /> Payment received
          </span>
          <h1 className="mt-4 max-w-2xl text-3xl font-extrabold leading-[1.05] tracking-tight md:text-5xl">
            {state === 'done' ? 'You’re booked in.' : 'When suits you?'}
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-white/70">
            {state === 'done'
              ? `Thanks — we’ve got your preferred dates and we’ll ring you to confirm a time.`
              : 'Pick a date or two that work for you and we’ll call to confirm. The assessment takes about 45 minutes.'}
          </p>
        </div>
      </section>

      <section className="container-site py-12 md:py-16">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:gap-12">
          <div>
            {state === 'loading' && (
              <p className="flex items-center gap-2 text-ink-soft">
                <Loader2 size={18} className="animate-spin" /> Loading your order…
              </p>
            )}

            {state === 'error' && (
              <div className="card p-7">
                <p className="flex items-start gap-2.5 text-sm leading-relaxed text-ember-deep">
                  <AlertCircle size={18} className="mt-0.5 shrink-0" />
                  <span>{error}</span>
                </p>
                <p className="mt-4 text-sm text-ink-soft">
                  Call{' '}
                  <a href={`tel:${COMPANY.phoneHref}`} className="font-semibold text-ember">
                    {COMPANY.phone}
                  </a>{' '}
                  or email{' '}
                  <a href={`mailto:${COMPANY.email}`} className="font-semibold text-ember">
                    {COMPANY.email}
                  </a>
                  .
                </p>
                <Link to="/epcs" className="btn-outline mt-6 px-5 py-2.5 text-sm">
                  Back to EPCs
                </Link>
              </div>
            )}

            {(state === 'form' || state === 'saving') && (
              <form onSubmit={submit} className="card p-7">
                <h2 className="text-xl font-bold text-ink">Choose your dates</h2>
                <p className="mt-1 text-sm text-ink-soft">
                  We’ll confirm by phone — nothing is fixed until we speak.
                </p>

                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="pref" className={lblCls}>
                      Preferred date
                    </label>
                    <input
                      id="pref"
                      type="date"
                      required
                      min={min}
                      max={max}
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className={fieldCls}
                    />
                  </div>
                  <div>
                    <label htmlFor="alt" className={lblCls}>
                      Alternative date (optional)
                    </label>
                    <input
                      id="alt"
                      type="date"
                      min={min}
                      max={max}
                      value={altDate}
                      onChange={(e) => setAltDate(e.target.value)}
                      className={fieldCls}
                    />
                  </div>
                </div>

                <fieldset className="mt-5">
                  <legend className={lblCls}>Time of day</legend>
                  <div className="flex flex-wrap gap-2">
                    {TIME_SLOTS.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTimeSlot(t)}
                        aria-pressed={timeSlot === t}
                        className={`rounded border px-4 py-2.5 text-sm font-medium transition-colors ${
                          timeSlot === t
                            ? 'border-ember bg-ember/10 text-ember-deep'
                            : 'border-ink/15 text-ink-soft hover:border-ember/50'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <div className="mt-5">
                  <label htmlFor="notes" className={lblCls}>
                    Anything we should know? (optional)
                  </label>
                  <textarea
                    id="notes"
                    rows={3}
                    maxLength={500}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Access, parking, gate code, best number to reach you…"
                    className={fieldCls}
                  />
                </div>

                {error && (
                  <p className="mt-4 flex items-start gap-2 rounded border border-ember/30 bg-ember/[0.06] p-3 text-sm text-ember-deep">
                    <AlertCircle size={16} className="mt-0.5 shrink-0" />
                    <span>{error}</span>
                  </p>
                )}

                <button
                  type="submit"
                  disabled={state === 'saving'}
                  className="btn-primary mt-6 w-full py-3.5 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {state === 'saving' ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Sending…
                    </>
                  ) : (
                    <>
                      <CalendarDays size={16} /> Request these dates
                    </>
                  )}
                </button>
              </form>
            )}

            {state === 'done' && (
              <div className="card p-7">
                <div className="flex items-start gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-moss/10 text-moss-deep">
                    <CheckCircle2 size={22} />
                  </span>
                  <div>
                    <h2 className="text-xl font-bold text-ink">Dates requested</h2>
                    <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                      We’ll ring you on{' '}
                      <strong className="text-ink">{order?.phone || 'the number you gave'}</strong> to
                      confirm. If you need us sooner, call{' '}
                      <a href={`tel:${COMPANY.phoneHref}`} className="font-semibold text-ember">
                        {COMPANY.phone}
                      </a>
                      .
                    </p>
                  </div>
                </div>

                <dl className="mt-6 divide-y divide-ink/10 border-t border-ink/10 pt-2">
                  <Row icon={CalendarDays} label="Preferred" value={order?.preferredDate || preferredDate} />
                  {(order?.altDate || altDate) && (
                    <Row icon={CalendarDays} label="Alternative" value={order?.altDate || altDate} />
                  )}
                  <Row icon={CalendarDays} label="Time" value={order?.timeSlot || timeSlot} />
                </dl>

                <Link to="/" className="btn-outline mt-6 px-5 py-2.5 text-sm">
                  Back to the site
                </Link>
              </div>
            )}
          </div>

          {/* Order summary */}
          {order && (
            <aside className="card h-fit p-6">
              <h2 className="spec text-ink-faint">Your order</h2>
              <dl className="mt-3 divide-y divide-ink/10">
                <Row icon={MapPin} label="Property" value={order.propertyAddress || order.postcode} />
                <Row icon={BedDouble} label="Bedrooms" value={order.bedrooms} />
                <Row icon={Receipt} label="Paid" value={order.amount != null ? `£${order.amount}` : '—'} />
                <Row icon={Phone} label="Phone" value={order.phone || '—'} />
              </dl>
              <p className="mt-4 font-mono text-[0.65rem] leading-relaxed text-ink-faint">
                A receipt has been emailed to you by Stripe. Your EPC is carried out by{' '}
                {COMPANY.accreditationScheme
                  ? `${COMPANY.accreditationScheme}-accredited assessor ${COMPANY.assessorNumber}`
                  : 'an accredited assessor'}
                .
              </p>
            </aside>
          )}
        </div>
      </section>
    </>
  )
}

function Row({ icon: Icon, label, value }) {
  if (!value) return null
  return (
    <div className="flex items-start gap-3 py-3">
      <Icon size={16} className="mt-0.5 shrink-0 text-ember" />
      <dt className="spec w-24 shrink-0 pt-0.5 text-ink-faint">{label}</dt>
      <dd className="text-sm font-medium text-ink">{value}</dd>
    </div>
  )
}
