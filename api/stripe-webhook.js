// Stripe webhook — keeps each app's membership in sync with the subscription.
//
// On a new/updated/cancelled subscription it upserts an entitlement row into
// the RIGHT app's Supabase (routed by the `product` metadata), and emails a
// magic-link invite to brand-new customers so they can set up their login.
// Access follows the live subscription: cancel or a failed payment flips the
// row's status, so the app can lock Pro features accordingly.
//
// Required env vars (Vercel → Settings → Environment Variables):
//   STRIPE_SECRET_KEY            sk_live_... / sk_test_...
//   STRIPE_WEBHOOK_SECRET        whsec_...  (from the Stripe webhook you create)
//   EPC_SUPABASE_URL             https://<project>.supabase.co
//   EPC_SUPABASE_SERVICE_ROLE_KEY   service_role key (server-only!)
//   CAVWALL_SUPABASE_URL
//   CAVWALL_SUPABASE_SERVICE_ROLE_KEY
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

// Stripe must receive the raw body to verify the signature.
export const config = { api: { bodyParser: false } }

// product → the app's Supabase project + where the invite link should land.
const APPS = {
  'epc-checker': {
    url: process.env.EPC_SUPABASE_URL,
    key: process.env.EPC_SUPABASE_SERVICE_ROLE_KEY,
    redirectTo: 'https://epc-checker.com/welcome',
  },
  cavwall: {
    url: process.env.CAVWALL_SUPABASE_URL,
    key: process.env.CAVWALL_SUPABASE_SERVICE_ROLE_KEY,
    redirectTo: 'https://cavwall.com/welcome',
  },
}

function supaFor(product) {
  const a = APPS[product]
  if (!a || !a.url || !a.key) return null
  return {
    client: createClient(a.url, a.key, { auth: { persistSession: false, autoRefreshToken: false } }),
    redirectTo: a.redirectTo,
  }
}

const mapStatus = (s) => {
  if (s === 'active' || s === 'trialing') return 'active'
  if (s === 'past_due' || s === 'unpaid' || s === 'incomplete') return 'past_due'
  return 'canceled'
}

async function readRawBody(req) {
  if (Buffer.isBuffer(req.body)) return req.body
  if (typeof req.body === 'string') return Buffer.from(req.body)
  const chunks = []
  for await (const chunk of req) chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  return Buffer.concat(chunks)
}

// Create/refresh the entitlement row (keyed on the Stripe subscription id).
async function upsertMembership(product, row) {
  const s = supaFor(product)
  if (!s) {
    console.warn(`[webhook] no Supabase config for "${product}" — skipping provisioning`)
    return
  }
  const { error } = await s.client
    .from('memberships')
    .upsert({ product, ...row, updated_at: new Date().toISOString() }, { onConflict: 'stripe_subscription_id' })
  if (error) throw new Error(`memberships upsert failed (${product}): ${error.message}`)
}

// Invite a brand-new customer (magic link). No-op if they already have a login.
async function inviteUser(product, email) {
  const s = supaFor(product)
  if (!s || !email) return
  try {
    await s.client.auth.admin.inviteUserByEmail(email, { redirectTo: s.redirectTo })
  } catch (e) {
    console.log(`[webhook] invite skipped for ${email} (${product}): ${e.message}`)
  }
}

async function customerEmail(stripe, customerId) {
  if (!customerId) return null
  try {
    const c = await stripe.customers.retrieve(customerId)
    return c && !c.deleted ? c.email : null
  } catch {
    return null
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).end()
  }

  const secretKey = process.env.STRIPE_SECRET_KEY
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secretKey || !webhookSecret) {
    console.error('[webhook] missing STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET')
    return res.status(503).json({ error: 'Webhook not configured' })
  }

  const stripe = new Stripe(secretKey)

  let event
  try {
    const raw = await readRawBody(req)
    event = stripe.webhooks.constructEvent(raw, req.headers['stripe-signature'], webhookSecret)
  } catch (err) {
    console.error('[webhook] signature verification failed:', err.message)
    return res.status(400).json({ error: `Webhook Error: ${err.message}` })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const s = event.data.object
        if (s.mode !== 'subscription') break // one-off deposits: nothing to provision
        const product = s.metadata?.product
        const email = s.customer_details?.email || s.customer_email
        if (!product || !email) break
        await upsertMembership(product, {
          email,
          status: 'active',
          stripe_customer_id: s.customer,
          stripe_subscription_id: s.subscription,
        })
        await inviteUser(product, email)
        break
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const sub = event.data.object
        const product = sub.metadata?.product
        if (!product) break
        const email = await customerEmail(stripe, sub.customer)
        if (!email) break // can't key the row without an email
        await upsertMembership(product, {
          email,
          status: event.type === 'customer.subscription.deleted' ? 'canceled' : mapStatus(sub.status),
          stripe_customer_id: sub.customer,
          stripe_subscription_id: sub.id,
          current_period_end: sub.current_period_end
            ? new Date(sub.current_period_end * 1000).toISOString()
            : null,
        })
        break
      }

      default:
        // Other events are acknowledged and ignored.
        break
    }
    return res.status(200).json({ received: true })
  } catch (err) {
    console.error('[webhook] handler error:', err)
    // 500 → Stripe retries (good for transient Supabase errors).
    return res.status(500).json({ error: 'Handler error' })
  }
}
