// Hub Supabase client — the ONE place the suite's auth session is created.
//
// Uses @supabase/ssr's cookie storage (not localStorage) with the cookie
// scoped to .ecofutures.uk, so the session set here carries to every app on
// a subdomain (jobs.ecofutures.uk, epc.ecofutures.uk, …) — see the decisions
// table in CLAUDE.md §2. On localhost / preview deploys the domain attribute
// is omitted and the cookie is host-only, which is what you want for dev.
//
// Frontend env vars (anon key only — see supabase/hub/README.md):
//   VITE_HUB_SUPABASE_URL, VITE_HUB_SUPABASE_ANON_KEY
import { createBrowserClient } from '@supabase/ssr'

const url = import.meta.env.VITE_HUB_SUPABASE_URL
const anonKey = import.meta.env.VITE_HUB_SUPABASE_ANON_KEY

// The Suite page renders a "not configured yet" state rather than crashing
// when the Supabase project hasn't been wired up (e.g. a fresh clone).
export const isHubConfigured = Boolean(url && anonKey)

const SHARED_COOKIE_DOMAIN = '.ecofutures.uk'
const onSuiteDomain =
  typeof window !== 'undefined' &&
  /(^|\.)ecofutures\.uk$/i.test(window.location.hostname)

export const supabase = isHubConfigured
  ? createBrowserClient(url, anonKey, {
      cookieOptions: {
        // Chunked cookies handled by @supabase/ssr; name them distinctly so
        // they never collide with an app's own storage.
        name: 'ef-suite-auth',
        ...(onSuiteDomain ? { domain: SHARED_COOKIE_DOMAIN } : {}),
        path: '/',
        sameSite: 'lax',
        secure: typeof window !== 'undefined' && window.location.protocol === 'https:',
      },
    })
  : null
