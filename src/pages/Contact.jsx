import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import emailjs from '@emailjs/browser'
import {
  Phone,
  Mail,
  MapPin,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ClipboardCheck,
  ListChecks,
  HardHat,
} from 'lucide-react'

// EmailJS runs in the browser — these are public client-side identifiers
// (overridable via VITE_EMAILJS_* at build time).
const EMAILJS_SERVICE = import.meta.env.VITE_EMAILJS_SERVICE || 'service_tcu1ci3'
const EMAILJS_TEMPLATE = import.meta.env.VITE_EMAILJS_TEMPLATE || 'template_ldu2ckm'
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'Ew-e7AM5p0vx0GqrC'

const contacts = [
  { icon: Phone, label: 'Call', value: '07359 069886', href: 'tel:+447359069886' },
  { icon: Mail, label: 'Email', value: 'Info@ecofutures.uk', href: 'mailto:Info@ecofutures.uk' },
  { icon: MapPin, label: 'Area', value: 'Preston · Blackpool · North West', href: null },
]

const next = [
  { icon: ClipboardCheck, text: 'We arrange a whole-house survey at a time that suits you.' },
  { icon: ListChecks, text: 'You get a clear, costed retrofit plan with grants and savings.' },
  { icon: HardHat, text: 'We facilitate the installs and sign the work off.' },
]

export default function Contact() {
  const formRef = useRef(null)
  const [status, setStatus] = useState('idle')

  const handleSubmit = (e) => {
    e.preventDefault()
    setStatus('sending')
    emailjs
      .sendForm(EMAILJS_SERVICE, EMAILJS_TEMPLATE, formRef.current, {
        publicKey: EMAILJS_PUBLIC_KEY,
      })
      .then(
        () => {
          setStatus('success')
          formRef.current.reset()
        },
        (err) => {
          console.error('EmailJS error:', err)
          setStatus('error')
        },
      )
  }

  const field =
    'w-full rounded border border-ink/15 bg-white px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-ember'
  const lbl = 'spec mb-1.5 block text-ink-soft'

  return (
    <>
      {/* Hero */}
      <section className="border-b border-ink/10 bg-navy bg-blueprint text-white">
        <div className="container-site py-14 md:py-20">
          <span className="eyebrow text-ember">Get started</span>
          <h1 className="mt-4 max-w-2xl text-4xl font-extrabold leading-[1.02] tracking-tight md:text-6xl">
            Book your survey.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/70">
            Tell us about your home and we'll be in touch to arrange an independent PAS 2035 survey.
            No pressure, no product pitch.
          </p>
        </div>
      </section>

      <section className="container-site grid gap-10 py-16 md:py-24 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
        {/* Left: contact + what happens next */}
        <div className="flex flex-col gap-8">
          <div className="grid gap-3">
            {contacts.map((c) => {
              const inner = (
                <>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-ember/10 text-ember">
                    <c.icon size={18} />
                  </span>
                  <div>
                    <div className="spec text-ink-faint">{c.label}</div>
                    <div className="font-semibold text-ink">{c.value}</div>
                  </div>
                </>
              )
              const cls = 'flex items-center gap-4 rounded-lg border border-ink/10 bg-paper-card p-4'
              return c.href ? (
                <a key={c.label} href={c.href} className={`${cls} transition-colors hover:border-ember/40`}>
                  {inner}
                </a>
              ) : (
                <div key={c.label} className={cls}>
                  {inner}
                </div>
              )
            })}
          </div>

          <div className="rounded-xl border border-ink/10 bg-paper-warm/70 p-6">
            <span className="spec text-ink-faint">What happens next</span>
            <ul className="mt-4 flex flex-col gap-4">
              {next.map((s, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy text-white">
                    <s.icon size={15} />
                  </span>
                  <p className="pt-1 text-sm leading-relaxed text-ink-soft">{s.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right: form */}
        <div className="card p-6 md:p-8">
          {status === 'success' ? (
            <div className="flex min-h-[360px] flex-col items-center justify-center gap-4 text-center">
              <CheckCircle2 size={52} className="text-moss" />
              <h2 className="text-2xl font-bold text-ink">Message sent</h2>
              <p className="max-w-sm text-ink-soft">
                Thanks — we'll be in touch shortly to arrange your survey.
              </p>
              <button
                type="button"
                onClick={() => setStatus('idle')}
                className="mt-2 font-semibold text-ember hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-5">
              <h2 className="text-xl font-bold text-ink">Request a survey</h2>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className={lbl} htmlFor="name">
                    Full name
                  </label>
                  <input id="name" name="name" type="text" required placeholder="Jane Smith" className={field} />
                </div>
                <div>
                  <label className={lbl} htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="jane@example.com"
                    className={field}
                  />
                </div>
              </div>
              <div>
                <label className={lbl} htmlFor="address">
                  Property address / postcode
                </label>
                <input id="address" name="address" type="text" placeholder="PR1 2AB" className={field} />
              </div>
              <div>
                <label className={lbl} htmlFor="message">
                  About your home
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  placeholder="Age of property, what you'd like to improve, any damp or cold rooms…"
                  className={`${field} resize-none`}
                />
              </div>

              {status === 'error' && (
                <div className="flex items-center gap-2 rounded border border-ember/30 bg-ember/[0.06] px-3 py-2.5 text-sm text-ember-deep">
                  <AlertCircle size={18} /> Something went wrong. Please try again or email us directly.
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="btn-primary w-full py-3.5 disabled:opacity-70"
              >
                {status === 'sending' ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Sending…
                  </>
                ) : (
                  'Send request'
                )}
              </button>
              <p className="font-mono text-[0.68rem] text-ink-faint">
                We'll only use your details to respond to your enquiry and arrange your survey. See
                our{' '}
                <Link to="/privacy" className="underline underline-offset-2 hover:text-ink">
                  Privacy Policy
                </Link>
                .
              </p>
            </form>
          )}
        </div>
      </section>
    </>
  )
}
