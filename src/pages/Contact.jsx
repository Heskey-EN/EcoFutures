import { useRef, useState } from 'react'
import emailjs from '@emailjs/browser'
import { Phone, Mail, MapPin, BadgeCheck, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import CoverageMap from '../components/illustrations/CoverageMap.jsx'

// EmailJS is designed to run in the browser — these are public client-side
// identifiers (not secrets). They can optionally be overridden with Vite env
// vars (VITE_EMAILJS_*) at build time.
const EMAILJS_SERVICE = import.meta.env.VITE_EMAILJS_SERVICE || 'service_tcu1ci3'
const EMAILJS_TEMPLATE = import.meta.env.VITE_EMAILJS_TEMPLATE || 'template_ldu2ckm'
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'Ew-e7AM5p0vx0GqrC'

const contactCards = [
  {
    icon: Phone,
    bg: 'bg-accent-yellow',
    label: 'Call Us',
    value: '07359 069886',
    href: 'tel:+447359069886',
    accent: 'text-accent-yellow',
    hover: 'hover:border-accent-yellow',
  },
  {
    icon: Mail,
    bg: 'bg-accent-orange',
    label: 'Email Us',
    value: 'Info@ecofutures.uk',
    href: 'mailto:Info@ecofutures.uk',
    accent: 'text-accent-orange',
    hover: 'hover:border-accent-orange',
  },
  {
    icon: MapPin,
    bg: 'bg-accent-green',
    label: 'Our Office',
    value: 'Preston, UK',
    href: null,
    accent: 'text-accent-green',
    hover: 'hover:border-accent-green',
  },
]

export default function Contact() {
  const formRef = useRef(null)
  const [status, setStatus] = useState('idle') // idle | sending | success | error

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
        (error) => {
          console.error('EmailJS error:', error)
          setStatus('error')
        },
      )
  }

  const inputClass =
    'border border-slate-200 bg-gray-50 p-4 text-sm outline-none transition-all placeholder:text-gray-400 focus:border-navy'
  const labelClass = 'text-xs font-bold uppercase tracking-wider text-navy'

  return (
    <div className="container-site py-16">
      {/* Heading */}
      <div className="mb-16 max-w-2xl border-l-4 border-accent-green pl-6">
        <h1 className="mb-4 font-display text-4xl font-bold leading-tight tracking-tight text-navy md:text-5xl">
          Contact Our Experts
        </h1>
        <p className="text-lg text-slate-600">
          Ready to upgrade your property's efficiency? We're here to help with your EPC and Retrofit
          needs. Our experts serve Preston, Blackpool and the North West with professional, reliable
          advice.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Contact details */}
        <div className="flex flex-col gap-6">
          <div className="grid gap-6">
            {contactCards.map((c) => {
              const Inner = (
                <>
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center text-white ${c.bg}`}>
                    <c.icon size={22} />
                  </div>
                  <div>
                    <h3 className={`mb-1 text-xs font-bold uppercase tracking-wider ${c.accent}`}>
                      {c.label}
                    </h3>
                    <p className="break-words text-lg font-bold text-navy sm:text-xl">{c.value}</p>
                  </div>
                </>
              )
              const cardClass = `flex flex-col gap-4 border border-slate-200 bg-white p-6 transition-all sm:flex-row sm:items-center sm:gap-5 sm:p-8 ${c.hover}`
              return c.href ? (
                <a key={c.label} href={c.href} className={cardClass}>
                  {Inner}
                </a>
              ) : (
                <div key={c.label} className={cardClass}>
                  {Inner}
                </div>
              )
            })}
          </div>

          {/* Coverage panel */}
          <div className="mt-2 border-t-4 border-accent-orange bg-slate-50 p-8">
            <div className="mb-3 flex items-center gap-2 text-accent-orange">
              <BadgeCheck size={20} />
              <span className="text-xs font-bold uppercase tracking-[0.15em]">Service Coverage</span>
            </div>
            <h3 className="mb-3 font-display text-2xl font-bold uppercase tracking-tight text-navy">
              Preston &amp; North West
            </h3>
            <p className="text-sm leading-relaxed text-slate-600">
              Our certified assessors are available across all major boroughs and surrounding
              counties for rapid property surveys and EPC assessments.
            </p>
          </div>
        </div>

        {/* Inquiry form */}
        <div className="border border-slate-200 bg-white p-8 md:p-10">
          <h2 className="mb-8 font-display text-2xl font-bold uppercase tracking-tight text-navy">
            Inquiry Form
          </h2>

          {status === 'success' ? (
            <div className="flex flex-col items-center gap-4 py-12 text-center">
              <CheckCircle2 size={56} className="text-accent-green" />
              <h3 className="font-display text-xl font-bold text-navy">Message sent!</h3>
              <p className="text-slate-600">
                Thanks for getting in touch — we'll get back to you as soon as possible.
              </p>
              <button
                type="button"
                onClick={() => setStatus('idle')}
                className="mt-2 text-sm font-bold uppercase tracking-wide text-brand-blue hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label className={labelClass} htmlFor="name">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder="e.g. John Smith"
                    className={inputClass}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className={labelClass} htmlFor="email">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="john@example.com"
                    className={inputClass}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className={labelClass} htmlFor="address">
                  Property Address{' '}
                  <span className="text-[10px] font-normal lowercase italic text-slate-500">
                    (optional)
                  </span>
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  placeholder="e.g. PR1 2AB"
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className={labelClass} htmlFor="message">
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  placeholder="Tell us about your requirements..."
                  className={`${inputClass} resize-none`}
                />
              </div>

              {status === 'error' && (
                <div className="flex items-center gap-2 border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  <AlertCircle size={18} />
                  Something went wrong. Please try again or email us directly.
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="mt-2 flex w-full items-center justify-center gap-2 bg-navy py-5 text-xs font-bold uppercase tracking-[0.2em] text-white transition-all hover:bg-brand-blue disabled:cursor-not-allowed disabled:opacity-70"
              >
                {status === 'sending' ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Sending…
                  </>
                ) : (
                  'Send Inquiry'
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Coverage map band */}
      <div className="relative mt-24 h-[360px] w-full overflow-hidden border border-slate-200 bg-slate-100">
        <CoverageMap className="absolute inset-0 h-full w-full" />
        <div className="relative z-10 flex h-full flex-col justify-center px-6 md:px-12">
          <div className="max-w-md border-t-4 border-accent-orange bg-white p-8 shadow-xl md:p-10">
            <div className="mb-4 flex items-center gap-2 text-accent-orange">
              <BadgeCheck size={20} />
              <span className="text-xs font-bold uppercase tracking-[0.15em]">Service Coverage</span>
            </div>
            <h3 className="mb-4 font-display text-2xl font-bold uppercase tracking-tight text-navy">
              Preston &amp; North West
            </h3>
            <p className="text-sm leading-relaxed text-slate-600">
              Our certified assessors are available across all major boroughs and surrounding
              counties for rapid property surveys and EPC assessments.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
