// Consent-gated Google Analytics.
//
// PECR requires prior consent before setting non-essential (analytics) cookies,
// so we do NOT load the GA library at all until the visitor explicitly accepts.
// On rejection, nothing from Google is loaded and no GA cookies are ever set.

const GA_ID = 'G-QXW4DLMERL'
const STORAGE_KEY = 'ecofutures-cookie-consent' // 'granted' | 'denied'

let gaLoaded = false

export function getConsent() {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

function loadGa() {
  if (gaLoaded || typeof window === 'undefined') return
  gaLoaded = true

  const s = document.createElement('script')
  s.async = true
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
  document.head.appendChild(s)

  window.dataLayer = window.dataLayer || []
  // eslint-disable-next-line prefer-rest-params
  window.gtag = function () {
    window.dataLayer.push(arguments)
  }
  window.gtag('js', new Date())
  // IP anonymisation + no ad personalisation signals
  window.gtag('config', GA_ID, { anonymize_ip: true })
}

// Record a preference and act on it. value: 'granted' | 'denied'
export function setConsent(value) {
  try {
    localStorage.setItem(STORAGE_KEY, value)
  } catch {
    /* storage unavailable — treat as session-only */
  }
  if (value === 'granted') loadGa()
  // 'denied' → nothing loads; if GA was already loaded this session the choice
  // takes effect on next page load (no cookies persist a rejected state).
}

// Call once on app start: load GA only if consent was previously granted.
export function initAnalytics() {
  if (getConsent() === 'granted') loadGa()
}

// SPA page-view tracking (GA only fires the first automatically).
export function trackPageView(path) {
  if (gaLoaded && typeof window.gtag === 'function') {
    window.gtag('event', 'page_view', { page_path: path })
  }
}
