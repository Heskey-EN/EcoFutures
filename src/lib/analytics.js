// Consent-gated Google Analytics.
//
// PECR requires prior consent before setting non-essential (analytics) cookies,
// so we do NOT load the GA library at all until the visitor explicitly accepts.
// Withdrawing consent takes effect immediately: GA is disabled and its cookies
// are cleared without needing a reload. Consent is re-asked after 12 months.

const GA_ID = 'G-QXW4DLMERL'
const STORAGE_KEY = 'ecofutures-cookie-consent' // 'granted' | 'denied'
const STORAGE_AT = 'ecofutures-cookie-consent-at' // timestamp (ms)
const CONSENT_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 365 // 12 months

let gaLoaded = false

// Returns 'granted' | 'denied' | null. Expired consent returns null so the
// banner re-appears and the visitor re-confirms.
export function getConsent() {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    if (!value) return null
    const at = Number(localStorage.getItem(STORAGE_AT) || 0)
    if (at && Date.now() - at > CONSENT_MAX_AGE_MS) return null
    return value
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
  window.gtag = function () {
    window.dataLayer.push(arguments)
  }
  window.gtag('js', new Date())
  window.gtag('config', GA_ID, { anonymize_ip: true })
}

// Immediately stop GA and delete the cookies it may have set.
function disableGa() {
  if (typeof window === 'undefined') return
  window[`ga-disable-${GA_ID}`] = true
  const past = 'Thu, 01 Jan 1970 00:00:00 GMT'
  const host = window.location.hostname
  const scopes = ['', `; domain=${host}`, `; domain=.${host}`]
  document.cookie.split(';').forEach((c) => {
    const name = c.split('=')[0].trim()
    if (/^_ga|^_gid|^_gat/.test(name)) {
      scopes.forEach((scope) => {
        document.cookie = `${name}=; expires=${past}; path=/${scope}`
      })
    }
  })
}

// Record a preference and act on it immediately. value: 'granted' | 'denied'
export function setConsent(value) {
  try {
    localStorage.setItem(STORAGE_KEY, value)
    localStorage.setItem(STORAGE_AT, String(Date.now()))
  } catch {
    /* storage unavailable — treat as session-only */
  }
  if (value === 'granted') {
    if (typeof window !== 'undefined') window[`ga-disable-${GA_ID}`] = false
    loadGa()
  } else {
    disableGa()
  }
}

// Call once on app start: load GA only if consent was previously granted.
export function initAnalytics() {
  if (getConsent() === 'granted') loadGa()
}

// SPA page-view tracking (GA only fires the first one automatically).
export function trackPageView(path) {
  if (gaLoaded && typeof window.gtag === 'function') {
    window.gtag('event', 'page_view', { page_path: path })
  }
}
