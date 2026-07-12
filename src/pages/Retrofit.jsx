import { Link } from 'react-router-dom'
import {
  ArrowRight,
  ClipboardCheck,
  ListChecks,
  HardHat,
  ShieldCheck,
  PoundSterling,
  Gauge,
  Leaf,
} from 'lucide-react'
import { MEASURES, TONE } from '../components/InteractiveHouse.jsx'
import CtaSection from '../components/CtaSection.jsx'

const PAS_2035_PDF = 'https://retrofitacademy.org/wp-content/uploads/2023/10/PAS2035_2023.pdf'

const stages = [
  {
    n: '01',
    icon: ClipboardCheck,
    title: 'Retrofit survey',
    body: 'A PAS 2035 whole-house assessment: fabric, heating, ventilation, moisture risk and occupancy. We measure, we don’t guess — and we’re independent of any one product.',
    points: ['Heat-loss & fabric survey', 'Ventilation & damp risk', 'EPC / RdSAP assessment'],
  },
  {
    n: '02',
    icon: ListChecks,
    title: 'Medium-term plan',
    body: 'A prioritised, costed plan in the correct fabric-first order, phased to your budget, with the grants you qualify for and the savings you can expect at each step.',
    points: ['Fabric-first sequencing', 'Costs & expected savings', 'Grant eligibility check'],
  },
  {
    n: '03',
    icon: HardHat,
    title: 'Managed installs',
    body: 'We coordinate accredited, insured installers, oversee the work against the plan, and sign it off — so the measures perform as designed and any funding stays valid.',
    points: ['Vetted installers', 'On-site oversight', 'Sign-off & handover'],
  },
]

export default function Retrofit() {
  return (
    <>
      {/* Hero */}
      <section className="border-b border-ink/10 bg-navy bg-blueprint text-white">
        <div className="container-site grid items-center gap-10 py-16 md:grid-cols-[1.3fr_1fr] md:py-24">
          <div>
            <span className="eyebrow text-ember">
              <ShieldCheck size={14} /> PAS 2035 · Fabric-first
            </span>
            <h1 className="mt-4 text-4xl font-extrabold leading-[1.02] tracking-tight md:text-6xl">
              Retrofit, done in the right order.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/70">
              A one-off product rarely fixes a cold, expensive home. We assess the whole house, plan
              the upgrades in the order that actually works, and manage the installs from start to
              finish.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/contact" className="btn-primary">
                Book a survey <ArrowRight size={18} />
              </Link>
              <Link to="/" className="btn-ghost-light">
                Explore the house
              </Link>
            </div>
          </div>
          <dl className="grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10">
            {[
              ['~£1,700', 'typical £/yr saved'],
              ['A–G', 'EPC we lift'],
              ['1', 'accountable team'],
            ].map(([v, l]) => (
              <div key={l} className="bg-navy p-4 text-center">
                <div className="font-mono text-2xl font-semibold text-amber">{v}</div>
                <div className="spec mt-1 text-white/50">{l}</div>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Process */}
      <section className="container-site py-20 md:py-28">
        <div className="max-w-prose">
          <span className="eyebrow text-ink-faint">How it works</span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink md:text-4xl">
            Survey, plan, install — one accountable team.
          </h2>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {stages.map((s) => (
            <div key={s.n} className="card flex flex-col p-7">
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-navy text-white">
                  <s.icon size={22} />
                </span>
                <span className="font-mono text-3xl font-semibold text-ink/10">{s.n}</span>
              </div>
              <h3 className="mt-5 text-xl font-bold text-ink">{s.title}</h3>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-soft">{s.body}</p>
              <ul className="mt-4 space-y-2 border-t border-ink/10 pt-4">
                {s.points.map((p) => (
                  <li key={p} className="flex items-center gap-2 text-sm text-ink-soft">
                    <span className="h-1.5 w-1.5 rounded-full bg-ember" /> {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Measures deep-dive */}
      <section className="border-y border-ink/10 bg-paper-warm/60 py-20 md:py-28">
        <div className="container-site">
          <div className="max-w-prose">
            <span className="eyebrow text-ink-faint">The measures</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink md:text-4xl">
              Every part of the home, explained.
            </h2>
            <p className="mt-4 text-lg text-ink-soft">
              These are the upgrades a survey draws from. Which ones suit your home — and in what
              order — is exactly what the assessment tells you.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {MEASURES.map((m) => (
              <article key={m.id} className="card flex flex-col p-6 sm:flex-row sm:gap-6">
                <div className="mb-4 sm:mb-0">
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-full font-mono text-sm font-bold text-white"
                    style={{ background: TONE[m.tone] }}
                  >
                    {m.n}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-lg font-bold text-ink">{m.label}</h3>
                    <span className="spec text-ink-faint">{m.loss}</span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{m.what}</p>
                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 border-t border-ink/10 pt-3 font-mono text-xs text-ink-soft">
                    <span className="inline-flex items-center gap-1.5">
                      <PoundSterling size={13} className="text-ink-faint" /> {m.cost}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Leaf size={13} className="text-moss" /> £{m.saving}/yr
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Gauge size={13} className="text-ink-faint" /> {m.epc}
                    </span>
                  </div>
                  {m.grant && (
                    <p className="mt-3 inline-block rounded bg-moss/[0.08] px-2.5 py-1 font-mono text-[0.68rem] font-medium text-moss-deep">
                      ✓ {m.grant}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
          <p className="mt-8 text-center font-mono text-xs text-ink-faint">
            Indicative figures for a typical older home — confirmed by your survey.
          </p>
        </div>
      </section>

      {/* Fabric-first explainer */}
      <section className="container-site py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <div>
            <span className="eyebrow text-ink-faint">Why order matters</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink md:text-4xl">
              Fabric first, then systems.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-soft">
              Insulate and seal the building fabric before you size the heating. Do it the other way
              round and you pay for a bigger heat pump than you need — and it never runs at its best.
            </p>
            <a
              href={PAS_2035_PDF}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-1.5 font-semibold text-ember hover:gap-2.5"
            >
              Read about PAS 2035 <ArrowRight size={18} />
            </a>
          </div>
          <ol className="flex flex-col gap-3">
            {[
              ['Insulate the fabric', 'Loft, walls, floor — cut the heat loss first.'],
              ['Sort ventilation', 'Controlled fresh air so a tighter home stays healthy.'],
              ['Upgrade the heat source', 'Size a heat pump to the improved, lower demand.'],
              ['Add generation', 'Solar and battery to cut running costs further.'],
            ].map(([t, b], i) => (
              <li key={t} className="flex items-start gap-4 rounded-lg border border-ink/10 bg-paper-card p-5">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy font-mono text-sm font-semibold text-white">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-bold text-ink">{t}</h3>
                  <p className="mt-0.5 text-sm text-ink-soft">{b}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <CtaSection
        eyebrow="Start with a survey"
        title="Get a plan built for your home."
        body="One survey gives you the whole picture — the measures, the order, the grants and the savings. Then we manage the installs."
      />
    </>
  )
}
