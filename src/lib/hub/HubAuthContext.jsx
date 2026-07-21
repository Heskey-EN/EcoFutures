// Suite auth state — session + memberships in one context.
//
// This is the one shared auth layer from CLAUDE.md §6: every suite surface
// reads sign-in state and the caller's access level from here, never from
// its own Supabase wiring.
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { supabase, isHubConfigured } from './supabase.js'

const HubAuthContext = createContext(null)

export function HubAuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [memberships, setMemberships] = useState([])
  // 'loading' until both the session and (if signed in) memberships resolve.
  const [status, setStatus] = useState(isHubConfigured ? 'loading' : 'unconfigured')

  // Memberships + org names for the signed-in user (RLS scopes the query).
  // Throws on failure so callers can tell "no orgs" from "couldn't load".
  const loadMemberships = useCallback(async () => {
    const { data, error } = await supabase
      .from('memberships')
      .select('id, org_id, access_level, is_active, organisations ( id, name, is_platform_owner )')
      .eq('is_active', true)
      .order('access_level', { ascending: false })
    if (error) throw new Error(error.message)
    return data ?? []
  }, [])

  useEffect(() => {
    if (!isHubConfigured) return undefined
    let cancelled = false
    // Auth events can arrive while an earlier apply() is still awaiting its
    // memberships query; the sequence number makes the latest event win.
    let seq = 0

    const apply = async (nextSession) => {
      const mySeq = ++seq
      setSession(nextSession)
      let rows = []
      if (nextSession) {
        try {
          rows = await loadMemberships()
        } catch (err) {
          console.error('[suite] memberships load failed:', err.message)
        }
      }
      if (cancelled || mySeq !== seq) return // superseded by a newer event
      setMemberships(rows)
      setStatus('ready')
    }

    // supabase-js emits INITIAL_SESSION to every new subscriber, so this one
    // listener covers boot too — no separate getSession() call racing it.
    const { data: sub } = supabase.auth.onAuthStateChange((event, nextSession) => {
      // TOKEN_REFRESHED fires on every refresh; memberships haven't changed.
      if (event === 'TOKEN_REFRESHED') {
        setSession(nextSession)
        return
      }
      apply(nextSession)
    })

    return () => {
      cancelled = true
      sub.subscription.unsubscribe()
    }
  }, [loadMemberships])

  // Active org = the highest-level membership (switcher can come later).
  const active = memberships[0] ?? null

  // Heartbeat for the Tier-4 "active users" view.
  useEffect(() => {
    if (!active) return
    supabase.rpc('touch_last_seen', { target_org: active.org_id }).then(({ error }) => {
      if (error) console.error('[suite] touch_last_seen failed:', error.message)
    })
  }, [active?.org_id]) // eslint-disable-line react-hooks/exhaustive-deps

  const value = useMemo(
    () => ({
      status, // 'unconfigured' | 'loading' | 'ready'
      session,
      user: session?.user ?? null,
      memberships,
      org: active?.organisations ?? null,
      accessLevel: active?.access_level ?? 0,

      signIn: (email, password) =>
        supabase.auth.signInWithPassword({ email: email.trim(), password }),

      signUp: (email, password, fullName) =>
        supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: { full_name: fullName.trim() },
            emailRedirectTo: `${window.location.origin}/retrofit-suite`,
          },
        }),

      signOut: () => supabase.auth.signOut(),

      resetPassword: (email) =>
        supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: `${window.location.origin}/retrofit-suite`,
        }),

      createOrganisation: async (name) => {
        const { data, error } = await supabase.rpc('create_organisation', { org_name: name })
        if (error) return { data, error }
        try {
          setMemberships(await loadMemberships())
        } catch {
          // The org WAS created — don't leave the user on the create form
          // thinking it failed and re-submitting into "already belongs".
          return {
            data,
            error: new Error('Organisation created — please refresh the page to continue.'),
          }
        }
        return { data, error: null }
      },
    }),
    [status, session, memberships, active, loadMemberships]
  )

  return <HubAuthContext.Provider value={value}>{children}</HubAuthContext.Provider>
}

export function useHubAuth() {
  const ctx = useContext(HubAuthContext)
  if (!ctx) throw new Error('useHubAuth must be used inside <HubAuthProvider>')
  return ctx
}
