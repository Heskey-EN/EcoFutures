import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Cookie } from 'lucide-react'
import { getConsent, setConsent } from '../lib/analytics.js'

// Fire this event anywhere to reopen the banner (e.g. the footer "Cookie
// settings" button): window.dispatchEvent(new Event('cookie:settings'))
export const COOKIE_SETTINGS_EVENT = 'cookie:settings'

export default function CookieBanner() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    // Show on first visit (no choice recorded yet).
    if (getConsent() === null) setOpen(true)
    const reopen = () => setOpen(true)
    window.addEventListener(COOKIE_SETTINGS_EVENT, reopen)
    return () => window.removeEventListener(COOKIE_SETTINGS_EVENT, reopen)
  }, [])

  if (!open) return null

  const choose = (value) => {
    setConsent(value)
    setOpen(false)
  }

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-title"
      className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-xl rounded-xl border border-white/10 bg-navy bg-blueprint p-5 text-white shadow-lift sm:inset-x-auto sm:left-4 sm:right-auto sm:p-6"
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ember/15 text-ember">
          <Cookie size={17} />
        </span>
        <div>
          <h2 id="cookie-title" className="font-display text-base font-bold">
            We value your privacy
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-white/70">
            We use essential cookies to make the site work. With your consent we'd also like to use
            Google Analytics to understand how the site is used. You can change this any time. See our{' '}
            <Link to="/cookies" className="font-medium text-ember underline underline-offset-2 hover:text-white">
              Cookie Policy
            </Link>
            .
          </p>
          <div className="mt-4 flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={() => choose('granted')}
              className="rounded bg-ember px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-ember-deep"
            >
              Accept all
            </button>
            <button
              type="button"
              onClick={() => choose('denied')}
              className="rounded border border-white/25 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Reject non-essential
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
