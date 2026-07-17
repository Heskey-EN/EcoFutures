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
} from 'lucide-react'
import InteractiveHouse from '../components/InteractiveHouse.jsx'

const steps = [
  {
    n: '01',
    icon: ClipboardCheck,
    title: 'We survey',
    body: 'An independent, PAS 2035 whole-house assessment. We measure heat loss, fabric and ventilation — no guesswork, no sales pitch dressed up as advice.',
  },
  {
    n: '02',
    icon: ListChecks,
    title: 'We plan',
    body: 'A prioritised, costed retrofit plan in the right order (fabric first), with the grants you qualify for and the savings you can expect.',
  },
  {
    n: '03',
    icon: HardHat,
    title: 'We facilitate the install',
    body: 'We coordinate accredited, insured installers, oversee the work to standard, and sign it off — so your upgrades actually perform.',
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
    icon: Thermometer,
    title: 'A warmer, healthier home',
    body: 'Even heat, no cold spots, and controlled ventilation that ends condensation, mould and damp.',
  },
  {
    icon: PoundSterling,
    title: 'Lower running costs',
    body: 'Insulate first and a well-sized heat pump costs far less to run. Typical whole-house plans cut bills substantially.',
  },
  {
    icon: Leaf,
    title: 'Lower carbon',
    body: 'Home heating is a major slice of UK emissions. A fabric-first retrofit is the biggest cut most households can make.',
  },
  {
    icon: TrendingUp,
    title: 'A better-rated asset',
    body: 'Higher EPC bands protect resale and rental value as minimum-standard rules tighten.',
  },
]

const funding = [
  { tag: 'BUS', title: 'Boiler Upgrade Scheme', body: '£7,500 grant towards an air-source heat pump.' },
  { tag: 'ECO4 / GBIS', title: 'Insulation grants', body: 'Wall, loft and floor funding for eligible homes.' },
  { tag: '0% VAT', title: 'Zero-rated measures', body: 'No VAT on insulation, heat pumps and solar until 2027.' },
  { tag: 'PAS 2035', title: 'Done to standard', body: 'The framework that keeps grant-funded retrofit safe and effective.' },
]

export default function Home() {
  return (
    <>
      {/* ---- Hero ---- */}
      <section className="container-site pt-12 md:pt-16">
        <div className="grid items-end gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div className="animate-fade-up">
            <span className="eyebrow">
              <span className="h-1.5 w-1.5 rounded-full bg-ember" />
              PAS 2035 Retrofit · North West
            </span>
            <h1 className="mt-4 text-[2.6rem] font-extrabold leading-[0.98] tracking-tight text-ink sm:text-6xl md:text-[4.2rem]">
              See how your home
              <br />
              can be <span className="text-ember">upgraded.</span>
            </h1>
          </div>
          <div className="animate-fade-up lg:pb-2">
            <p className="max-w-md text-lg leading-relaxed text-ink-soft">
              Explore your house below — every part of it can be insulated or improved. We survey the
              whole home, plan the upgrades in the right order, and facilitate the installs.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link to="/contact" className="btn-primary">
                Book a survey <ArrowRight size={18} />
              </Link>
              <Link to="/retrofit" className="btn-outline">
                How retrofit works
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 animate-fade-in md:mt-12">
          <InteractiveHouse />
        </div>
      </section>

      {/* ---- How we work ---- */}
      <section className="container-site py-20 md:py-28">
        <div className="max-w-prose">
          <span className="eyebrow text-ink-faint">The Eco Futures approach</span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink md:text-4xl">
            Independent advice, then upgrades that actually perform.
          </h2>
          <p className="mt-4 text-lg text-ink-soft">
            Most "free surveys" are a route to a single product. We start from your whole home and
            what it needs — then see the work through.
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
              <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-soft">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---- Measures strip ---- */}
      <section className="border-y border-ink/10 bg-paper-warm/60 py-20 md:py-28">
        <div className="container-site">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-prose">
              <span className="eyebrow text-ink-faint">What we can upgrade</span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink md:text-4xl">
                A whole-house toolkit.
              </h2>
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
        </div>
      </section>

      {/* ---- Why retrofit ---- */}
      <section className="container-site py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div>
            <span className="eyebrow text-ink-faint">Why retrofit</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink md:text-4xl">
              Four reasons it pays off.
            </h2>
            <p className="mt-4 text-lg text-ink-soft">
              A good retrofit isn't only about bills — it's about how the home feels to live in, and
              what it's worth.
            </p>
            <Link to="/contact" className="btn-dark mt-6">
              Book a survey <ArrowRight size={18} />
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

      {/* ---- Funding ---- */}
      <section className="bg-navy bg-blueprint py-20 text-white md:py-28">
        <div className="container-site">
          <div className="flex items-center gap-3">
            <PoundSterling className="text-amber" size={26} />
            <span className="spec text-white/60">Funding &amp; standards</span>
          </div>
          <h2 className="mt-4 max-w-2xl text-3xl font-bold tracking-tight md:text-4xl">
            There's real money on the table — we help you claim it.
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
          <p className="mt-5 font-mono text-xs text-white/40">
            Eligibility varies by property and income — we check what you qualify for during the
            survey. Amounts are correct at the time of writing; see GOV.UK for current figures and
            dates.
          </p>
        </div>
      </section>

      {/* ---- Proof + CTA ---- */}
      <section className="container-site py-20 md:py-28">
        <div className="overflow-hidden rounded-2xl border border-ink/10 bg-paper-card shadow-card">
          <div className="grid gap-8 p-8 md:grid-cols-[1.4fr_1fr] md:items-center md:p-12">
            <div>
              <div className="flex items-center gap-2.5 text-sm font-medium text-ink-soft">
                <ShieldCheck size={18} className="text-moss" />
                Independent, fabric-first retrofit surveys across the North West
              </div>
              <h2 className="mt-5 text-3xl font-bold tracking-tight text-ink md:text-4xl">
                Ready to see what your home needs?
              </h2>
              <p className="mt-3 max-w-prose text-lg text-ink-soft">
                Book a survey and get a clear, costed retrofit plan — the measures, the order, the
                grants and the savings. Then we handle the installs.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/contact" className="btn-primary">
                  Book a survey <ArrowRight size={18} />
                </Link>
                <a href="tel:+447359069886" className="btn-outline">
                  07359 069886
                </a>
              </div>
            </div>
            <ul className="flex flex-col gap-3 rounded-xl bg-paper p-6">
              {[
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
