import { Link } from 'react-router-dom'
import {
  ArrowRight,
  ClipboardCheck,
  ListChecks,
  HardHat,
  House,
  BrickWall,
  Rows3,
  AppWindow,
  Fan,
  Wind,
  Sun,
  Thermometer,
  PoundSterling,
  Leaf,
  TrendingUp,
  ShieldCheck,
  FileCheck2,
  Scale,
} from 'lucide-react'
import EpcBandLadder from '../components/EpcBandLadder.jsx'
import { EPC_BASE_PRICE, MEES, MEES_NATIONS } from '../data/epcFacts.js'

const steps = [
  {
    n: '01',
    icon: FileCheck2,
    title: 'Start with the certificate',
    body: `A £${EPC_BASE_PRICE} EPC from an accredited assessor tells you the band you are on now and the measures that would lift it. Book it online and we come to you.`,
    href: '/epcs',
    cta: 'Book an EPC',
  },
  {
    n: '02',
    icon: ListChecks,
    title: 'Get the plan to C',
    body: 'A PAS 2035 whole-house assessment turns that rating into a costed, prioritised plan — fabric first, in the right order, with the grants you qualify for.',
    href: '/retrofit',
    cta: 'How retrofit works',
  },
  {
    n: '03',
    icon: HardHat,
    title: 'We see the work through',
    body: 'We coordinate accredited, insured installers, oversee the work to standard and sign it off — then re-assess so the new band is on record.',
    href: '/contact',
    cta: 'Talk to us',
  },
]

const measures = [
  { icon: House, name: 'Loft & roof', blurb: 'Ceiling or rafter insulation, warm loft.' },
  { icon: BrickWall, name: 'Walls', blurb: 'Cavity fill, internal or external solid-wall.' },
  { icon: Rows3, name: 'Floors', blurb: 'Underfloor insulation, sealed perimeters.' },
  { icon: AppWindow, name: 'Windows & doors', blurb: 'A-rated glazing, draught-proofing.' },
  { icon: Fan, name: 'Heat pump', blurb: 'Low-carbon heating, sized & controlled.' },
  { icon: Wind, name: 'Ventilation', blurb: 'Trickle vents, extract fans, MVHR.' },
  { icon: Sun, name: 'Solar & battery', blurb: 'Generate and store your own power.' },
  { icon: ShieldCheck, name: 'Airtightness', blurb: 'Seal the draughts you can’t see.' },
]

const reasons = [
  {
    icon: Scale,
    title: 'Landlords: the standard is rising to C',
    body: `Privately rented homes in ${MEES_NATIONS} must be at least band ${MEES.currentMinimumBand} today. The government has confirmed band ${MEES.futureBand} by ${MEES.futureDeadline} for ${MEES.futureAppliesTo}. Get to C on a certificate lodged before ${MEES.earlyCertificateGrace.lodgedBefore} and it counts until that certificate expires.`,
  },
  {
    icon: Thermometer,
    title: 'A warmer, healthier home',
    body: 'Even heat, no cold spots, and controlled ventilation that ends condensation, mould and damp.',
  },
  {
    icon: PoundSterling,
    title: 'Lower running costs',
    body: 'Insulate first and a well-sized heat pump costs far less to run. A whole-house plan targets the measures that actually move the bill.',
  },
  {
    icon: TrendingUp,
    title: 'A better-rated asset',
    body: 'The band is on the public register and buyers, tenants and lenders look at it. A higher rating protects resale and rental value.',
  },
]

// Verified 8 Aug 2026 — see src/data/epcFacts.js for sources.
// GBIS is NOT listed: it closed on 31 March 2026.
const funding = [
  { tag: 'BUS', title: 'Boiler Upgrade Scheme', body: '£7,500 towards an air-source heat pump, funded to 2029/30.' },
  { tag: 'ECO4', title: 'Insulation grants', body: 'Wall, loft and floor funding for eligible homes, running to the end of 2026.' },
  { tag: 'Warm Homes', title: 'Local Grant', body: 'Council-delivered insulation and low-carbon heating for eligible households.' },
  { tag: '0% VAT', title: 'Zero-rated measures', body: 'No VAT on insulation, heat pumps, solar and battery storage until 31 March 2027.' },
]

export default function Home() {
  return (
    <>
      {/* ---- Hero: the band you're on, and the band you want ---- */}
      <section className="border-b border-ink/10 bg-navy bg-blueprint text-white">
        <div className="container-site grid items-center gap-10 py-14 md:grid-cols-[1.15fr_1fr] md:py-20">
          <div className="animate-fade-up">
            <span className="eyebrow text-ember">
              <span className="h-1.5 w-1.5 rounded-full bg-ember" />
              EPCs &amp; PAS 2035 retrofit · Preston, Blackpool &amp; the North West
            </span>
            <h1 className="mt-4 text-[2.6rem] font-extrabold leading-[1.0] tracking-tight sm:text-6xl">
              Get your property
              <br />
              to <span className="text-ember">EPC band C.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/70">
              We assess the home, tell you exactly what it takes to move up the scale, and manage the
              work that gets you there. Start with the certificate — everything else follows from it.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/epcs" className="btn-primary">
                Book your EPC — £{EPC_BASE_PRICE} <ArrowRight size={18} />
              </Link>
              <Link to="/retrofit" className="btn-ghost-light">
                How retrofit works
              </Link>
            </div>
            <p className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-1.5 font-mono text-xs text-white/45">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck size={13} /> Accredited domestic energy assessor
              </span>
              <span className="inline-flex items-center gap-1.5">
                <FileCheck2 size={13} /> Lodged on the national register
              </span>
            </p>
          </div>

          <EpcBandLadder className="animate-fade-in" />
        </div>
      </section>

      {/* ---- The route to C ---- */}
      <section className="container-site py-20 md:py-28">
        <div className="max-w-prose">
          <span className="eyebrow text-ink-faint">The Eco Futures approach</span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink md:text-4xl">
            Three steps from where you are to where you need to be.
          </h2>
          <p className="mt-4 text-lg text-ink-soft">
            Most &ldquo;free surveys&rdquo; are a route to selling one product. We start from the
            measured performance of your whole home — then see the work through.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="card card-hover flex flex-col p-7">
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-navy text-white">
                  <s.icon size={22} />
                </span>
                <span className="font-mono text-3xl font-semibold text-ink/10">{s.n}</span>
              </div>
              <h3 className="mt-5 text-xl font-bold text-ink">{s.title}</h3>
              <p className="mt-2 flex-1 text-[0.95rem] leading-relaxed text-ink-soft">{s.body}</p>
              <Link
                to={s.href}
                className="mt-5 inline-flex items-center gap-1.5 font-semibold text-ember hover:gap-2.5"
              >
                {s.cta} <ArrowRight size={16} />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ---- Why the band matters ---- */}
      <section className="border-y border-ink/10 bg-paper-warm/60 py-20 md:py-28">
        <div className="container-site grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div>
            <span className="eyebrow text-ink-faint">Why the band matters</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink md:text-4xl">
              C is the number everyone is aiming at.
            </h2>
            <p className="mt-4 text-lg text-ink-soft">
              For landlords it is about meeting the standard. For owners it is about bills, comfort
              and what the home is worth. The work to get there is much the same.
            </p>
            <Link to="/epcs" className="btn-dark mt-6">
              Book your EPC <ArrowRight size={18} />
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {reasons.map((r) => (
              <div key={r.title} className="rounded-lg border-l-2 border-ember/50 bg-paper-card p-5">
                <r.icon size={24} className="text-ember" />
                <h3 className="mt-3 text-lg font-bold text-ink">{r.title}</h3>
                <p className="mt-1.5 text-[0.95rem] leading-relaxed text-ink-soft">{r.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- What moves the rating ---- */}
      <section className="container-site py-20 md:py-28">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-prose">
            <span className="eyebrow text-ink-faint">What moves the rating</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink md:text-4xl">
              A whole-house toolkit.
            </h2>
            <p className="mt-4 text-lg text-ink-soft">
              No single measure gets a home to C on its own. The assessment works out which
              combination does it for the least disruption and cost.
            </p>
          </div>
          <Link
            to="/retrofit"
            className="inline-flex items-center gap-1.5 font-semibold text-ember hover:gap-2.5"
          >
            See every measure <ArrowRight size={18} />
          </Link>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {measures.map((m) => (
            <div
              key={m.name}
              className="card-hover group flex items-start gap-4 rounded-lg border border-ink/10 bg-paper-card p-5"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-ember/10 text-ember">
                <m.icon size={20} />
              </span>
              <div>
                <h3 className="font-bold text-ink">{m.name}</h3>
                <p className="mt-0.5 text-sm text-ink-soft">{m.blurb}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---- Funding ---- */}
      <section className="bg-navy bg-blueprint py-20 text-white md:py-28">
        <div className="container-site">
          <div className="flex items-center gap-3">
            <PoundSterling className="text-amber" size={26} />
            <span className="spec text-white/60">Funding &amp; standards</span>
          </div>
          <h2 className="mt-4 max-w-2xl text-3xl font-bold tracking-tight md:text-4xl">
            There&rsquo;s real money on the table — we help you claim it.
          </h2>
          <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {funding.map((f) => (
              <div key={f.title} className="bg-navy p-6">
                <span className="font-mono text-xs font-semibold uppercase tracking-widest text-amber">
                  {f.tag}
                </span>
                <h3 className="mt-3 text-lg font-bold">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-white/60">{f.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 font-mono text-xs leading-relaxed text-white/40">
            Eligibility and amounts vary by property, income and scheme, and change over time — we
            check what you qualify for during the survey. See GOV.UK for the current figures and
            closing dates.
          </p>
        </div>
      </section>

      {/* ---- Closing CTA ---- */}
      <section className="container-site py-20 md:py-28">
        <div className="overflow-hidden rounded-2xl border border-ink/10 bg-paper-card shadow-card">
          <div className="grid gap-8 p-8 md:grid-cols-[1.4fr_1fr] md:items-center md:p-12">
            <div>
              <div className="flex items-center gap-2.5 text-sm font-medium text-ink-soft">
                <Leaf size={18} className="text-moss" />
                Independent, fabric-first assessments across the North West
              </div>
              <h2 className="mt-5 text-3xl font-bold tracking-tight text-ink md:text-4xl">
                Find out what band you&rsquo;re on.
              </h2>
              <p className="mt-3 max-w-prose text-lg text-ink-soft">
                Book an EPC online for £{EPC_BASE_PRICE} and we&rsquo;ll come and measure it
                properly. If you want the full route to C, we&rsquo;ll quote for a whole-house
                retrofit assessment on the same visit.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/epcs" className="btn-primary">
                  Book your EPC — £{EPC_BASE_PRICE} <ArrowRight size={18} />
                </Link>
                <a href="tel:+447359069886" className="btn-outline">
                  07359 069886
                </a>
              </div>
            </div>
            <ul className="flex flex-col gap-3 rounded-xl bg-paper p-6">
              {[
                'Accredited assessor, lodged on the national register',
                'Independent PAS 2035 whole-house survey',
                'Fabric-first, prioritised & costed plan',
                'Grant eligibility checked for you',
                'Accredited installs, managed & signed off',
              ].map((point) => (
                <li key={point} className="flex items-start gap-2.5 text-[0.95rem] text-ink">
                  <ShieldCheck size={18} className="mt-0.5 shrink-0 text-moss" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}
