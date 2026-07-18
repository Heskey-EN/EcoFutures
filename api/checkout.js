// Vercel serverless function — creates a Stripe Checkout Session and returns
// its hosted URL. The Stripe SECRET key is read from an environment variable
// and never reaches the browser; card details are handled entirely by Stripe.
//
// Required env var (set in Vercel → Settings → Environment Variables):
//   STRIPE_SECRET_KEY = sk_test_... (test) / sk_live_... (live)
import Stripe from 'stripe'

// Product catalogue. Amounts are in pence. Edit here to change prices.
const PRODUCTS = {
  'epc-deposit': {
    mode: 'payment',
    name: 'EPC survey deposit',
    description: 'Deposit towards your Energy Performance Certificate, deducted from the final fee.',
    amount: 2000, // £20.00
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
  const { product, postcode } = body || {}

  const cfg = PRODUCTS[product]
  if (!cfg) return res.status(400).json({ error: 'Unknown product.' })

  if (cfg.postcodeGated && !isEligiblePostcode(postcode)) {
    return res.status(400).json({
      error: 'Online EPC deposits are only available for PR and FY postcodes. Please contact us for other areas.',
    })
  }

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
            unit_amount: cfg.amount,
            product_data: { name: cfg.name, description: cfg.description },
            ...(cfg.interval ? { recurring: { interval: cfg.interval } } : {}),
          },
        },
      ],
      success_url: `${origin}/pricing?status=success`,
      cancel_url: `${origin}/pricing?status=cancelled`,
      billing_address_collection: cfg.postcodeGated ? 'required' : 'auto',
      allow_promotion_codes: cfg.mode === 'subscription',
      metadata: {
        product,
        ...(cfg.postcodeGated ? { postcode: String(postcode || '').toUpperCase() } : {}),
      },
    })

    return res.status(200).json({ url: session.url })
  } catch (err) {
    console.error('Stripe checkout error:', err)
    return res.status(500).json({ error: 'Could not start checkout. Please try again or contact us.' })
  }
}
