// Vercel serverless function — creates a Stripe Checkout Session and returns
// its hosted URL. The Stripe SECRET key is read from an environment variable
// and never reaches the browser; card details are handled entirely by Stripe.
//
// Required env var (set in Vercel → Settings → Environment Variables):
//   STRIPE_SECRET_KEY = sk_test_... (test) / sk_live_... (live)
import Stripe from 'stripe'

// ── EPC pricing ────────────────────────────────────────────────────────────
// £65 for up to 3 bedrooms, then £5 for each additional bedroom.
//   3 bed → £65 · 4 bed → £70 · 5 bed → £75 · 6 bed → £80
// The customer pays the FULL price online — there is no deposit and no
// separate final fee, so the price shown on the landing page is the price
// charged. (Google disapproves ads whose landing page hides part of the cost.)
export const EPC_BASE_PENCE = 6500
export const EPC_PER_EXTRA_BEDROOM_PENCE = 500
export const EPC_BEDROOMS_INCLUDED = 3
export const EPC_MAX_BEDROOMS = 10

/** Price in pence for a given bedroom count. Always recomputed server-side —
 *  the browser sends the bedroom count, never an amount. */
export function epcPricePence(bedrooms) {
  const n = Math.min(Math.max(Math.round(Number(bedrooms) || 0), 1), EPC_MAX_BEDROOMS)
  const extra = Math.max(0, n - EPC_BEDROOMS_INCLUDED)
  return { bedrooms: n, amount: EPC_BASE_PENCE + extra * EPC_PER_EXTRA_BEDROOM_PENCE }
}

// Product catalogue. Amounts are in pence. Edit here to change prices.
const PRODUCTS = {
  epc: {
    mode: 'payment',
    name: 'Energy Performance Certificate',
    description: 'A domestic EPC carried out at your property and lodged on the national register.',
    dynamic: 'epc', // amount comes from epcPricePence(bedrooms)
    postcodeGated: true,
  },
  'epc-checker': {
    mode: 'subscription',
    name: 'EPC Checker membership',
    description: 'Monthly membership for epc-checker.com.',
    amount: 2000, // £20.00 / month
    interval: 'month',
  },
  cavwall: {
    mode: 'subscription',
    name: 'Cavwall membership',
    description: 'Monthly membership for cavwall.com.',
    amount: 1000, // £10.00 / month
    interval: 'month',
  },
}

// Deposits are only offered in the Preston (PR) and Fylde/Blackpool (FY) areas.
const isEligiblePostcode = (raw) => /^(PR|FY)\d/i.test(String(raw || '').trim().replace(/\s+/g, ''))

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    return res.status(503).json({
      error: 'Payments aren’t set up yet. Please contact us and we’ll take your order directly.',
    })
  }

  let body = req.body
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body)
    } catch {
      body = {}
    }
  }
  const { product, postcode, bedrooms } = body || {}

  const cfg = PRODUCTS[product]
  if (!cfg) return res.status(400).json({ error: 'Unknown product.' })

  if (cfg.postcodeGated && !isEligiblePostcode(postcode)) {
    return res.status(400).json({
      error:
        'We only cover PR (Preston) and FY (Blackpool & Fylde) postcodes at the moment. Please contact us and we’ll point you to a local assessor.',
    })
  }

  // Dynamic products price themselves from validated inputs. The browser never
  // sends an amount, so a tampered request cannot change what is charged.
  let amount = cfg.amount
  let name = cfg.name
  let beds = null
  if (cfg.dynamic === 'epc') {
    const priced = epcPricePence(bedrooms)
    beds = priced.bedrooms
    amount = priced.amount
    name = `Energy Performance Certificate — ${beds} bedroom${beds === 1 ? '' : 's'}`
  }

  // The EPC page is a Google Ads landing page: the return URL must stay on the
  // same origin the ad points at, with no cross-domain hop.
  const returnPath = cfg.dynamic === 'epc' ? '/epcs' : '/pricing'
  const origin = req.headers.origin || `https://${req.headers.host}`
  const stripe = new Stripe(secretKey)

  try {
    const session = await stripe.checkout.sessions.create({
      mode: cfg.mode,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'gbp',
            unit_amount: amount,
            product_data: { name, description: cfg.description },
            ...(cfg.interval ? { recurring: { interval: cfg.interval } } : {}),
          },
        },
      ],
      success_url: `${origin}${returnPath}?status=success`,
      cancel_url: `${origin}${returnPath}?status=cancelled`,
      billing_address_collection: cfg.postcodeGated ? 'required' : 'auto',
      allow_promotion_codes: cfg.mode === 'subscription',
      // We need to know where to go and how to reach them to book the visit.
      ...(cfg.dynamic === 'epc'
        ? {
            phone_number_collection: { enabled: true },
            custom_fields: [
              {
                key: 'propertyaddress',
                label: { type: 'custom', custom: 'Property address for the EPC' },
                type: 'text',
                text: { maximum_length: 255 },
                optional: false,
              },
            ],
          }
        : {}),
      metadata: {
        product,
        ...(cfg.postcodeGated ? { postcode: String(postcode || '').toUpperCase() } : {}),
        ...(beds ? { bedrooms: String(beds) } : {}),
      },
      // Stamp the product on the subscription too, so lifecycle webhooks
      // (renewal / cancel / failed payment) can route to the right app.
      ...(cfg.mode === 'subscription' ? { subscription_data: { metadata: { product } } } : {}),
    })

    return res.status(200).json({ url: session.url })
  } catch (err) {
    console.error('Stripe checkout error:', err)
    return res.status(500).json({ error: 'Could not start checkout. Please try again or contact us.' })
  }
}
