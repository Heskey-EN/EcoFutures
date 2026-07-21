// Vercel serverless function — adds a user to an organisation.
//
// This is the ONE place the Hub's service_role key is used, because adding a
// team member may mean creating an auth user (admin API) — something RLS can
// never allow from the browser. Everything else on the team page (changing
// levels, deactivating, removing) goes straight through the client under RLS.
//
// Because service_role bypasses RLS, this function re-implements the
// authority checks itself: the caller's JWT must belong to an ACTIVE
// level-3+ member of the target org (or the master admin), the requested
// level must be 1–3, and an existing level-4 membership can never be touched.
//
// Required env vars (Vercel → Settings → Environment Variables):
//   HUB_SUPABASE_URL                (or reuses VITE_HUB_SUPABASE_URL)
//   HUB_SUPABASE_SERVICE_ROLE_KEY   service_role key — server-only, NEVER VITE_*
import { createClient } from '@supabase/supabase-js'

const SITE = 'https://ecofutures.uk'
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const url = process.env.HUB_SUPABASE_URL || process.env.VITE_HUB_SUPABASE_URL
  const serviceKey = process.env.HUB_SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) {
    return res.status(503).json({ error: 'Team invites aren’t configured yet.' })
  }

  const authHeader = req.headers.authorization || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
  if (!token) return res.status(401).json({ error: 'Not signed in.' })

  let body = req.body
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body)
    } catch {
      body = {}
    }
  }
  const email = String(body?.email || '').trim().toLowerCase()
  const fullName = String(body?.fullName || '').trim().slice(0, 120)
  const orgId = String(body?.orgId || '')
  const level = Number(body?.level)

  if (!EMAIL_RE.test(email)) return res.status(400).json({ error: 'Enter a valid email address.' })
  if (!UUID_RE.test(orgId)) return res.status(400).json({ error: 'Invalid organisation.' })
  if (!Number.isInteger(level) || level < 1 || level > 3) {
    return res.status(400).json({ error: 'Access level must be between 1 and 3.' })
  }

  const admin = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  // Whose JWT is this?
  const { data: callerData, error: callerErr } = await admin.auth.getUser(token)
  if (callerErr || !callerData?.user) {
    return res.status(401).json({ error: 'Session expired — sign in again.' })
  }
  const caller = callerData.user

  // Authority: active level-3+ in the target org, or master admin anywhere.
  const { data: callerRows, error: rowsErr } = await admin
    .from('memberships')
    .select('org_id, access_level, organisations ( is_platform_owner )')
    .eq('user_id', caller.id)
    .eq('is_active', true)
  if (rowsErr) return res.status(500).json({ error: 'Could not check permissions.' })

  const isMaster = (callerRows || []).some(
    (r) => r.access_level === 4 && r.organisations?.is_platform_owner
  )
  const orgLevel = Math.max(
    0,
    ...(callerRows || []).filter((r) => r.org_id === orgId).map((r) => r.access_level)
  )
  if (!isMaster && orgLevel < 3) {
    return res.status(403).json({ error: 'Only organisation admins can add users.' })
  }

  // Find or create the auth user. inviteUserByEmail also sends the invite
  // email; if they're already registered we just look them up quietly.
  let userId = null
  let invited = false
  const { data: inviteData, error: inviteErr } = await admin.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${SITE}/retrofit-suite`,
    data: fullName ? { full_name: fullName } : undefined,
  })
  if (!inviteErr && inviteData?.user) {
    userId = inviteData.user.id
    invited = true
  } else {
    const { data: linkData, error: linkErr } = await admin.auth.admin.generateLink({
      type: 'magiclink', // lookup only — the link is never sent to anyone
      email,
    })
    if (linkErr || !linkData?.user) {
      // Raw GoTrue messages stay in the logs, not in the browser.
      console.error('[team-invite] invite failed:', inviteErr?.message, '| lookup:', linkErr?.message)
      return res.status(400).json({ error: 'Could not invite that address — check it and try again.' })
    }
    userId = linkData.user.id
  }

  if (userId === caller.id) {
    return res.status(400).json({ error: 'You already belong to this organisation.' })
  }

  // Never let this path touch a level-4 (master admin) membership.
  const { data: existing, error: existErr } = await admin
    .from('memberships')
    .select('id, access_level')
    .eq('org_id', orgId)
    .eq('user_id', userId)
    .maybeSingle()
  if (existErr) return res.status(500).json({ error: 'Could not check existing membership.' })
  if (existing?.access_level === 4) {
    return res.status(403).json({ error: 'That user is the master admin.' })
  }

  // Conditional write, not a blind upsert: the update refuses to touch a
  // level-4 row even if one appeared after the check above (the DB trigger
  // in 0001 backstops this too).
  let writeErr = null
  if (existing) {
    const { data: updated, error } = await admin
      .from('memberships')
      .update({ access_level: level, is_active: true })
      .eq('id', existing.id)
      .neq('access_level', 4)
      .select('id')
    writeErr = error || (!updated?.length ? new Error('membership row was not updatable') : null)
  } else {
    const { error } = await admin
      .from('memberships')
      .insert({ org_id: orgId, user_id: userId, access_level: level, is_active: true })
    writeErr = error
  }
  if (writeErr) {
    console.error('[team-invite] membership write failed:', writeErr.message)
    return res.status(500).json({ error: 'Could not add the membership — please try again.' })
  }

  return res.status(200).json({ ok: true, invited })
}
