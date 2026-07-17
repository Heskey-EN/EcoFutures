import { Link } from 'react-router-dom'
import { ArrowRight, Compass, Layers, UserCheck, MapPin } from 'lucide-react'
import CtaSection from '../components/CtaSection.jsx'

const values = [
  {
    icon: UserCheck,
    title: 'Independent',
    body: 'We’re paid to assess your home, not to sell one product. The plan reflects what your house needs — nothing more, nothing less.',
  },
  {
    icon: Layers,
    title: 'Fabric-first',
    body: 'We insulate and seal before we size heating. It’s the order that delivers real comfort and the lowest running costs.',
  },
  {
    icon: Compass,
    title: 'End to end',
    body: 'Survey, plan and managed install under one roof — one team accountable for the result, not a chain of subcontractors.',
  },
]

const stats = [
  ['2020', 'Founded in the North West'],
  ['PAS 2035', 'Assessment framework'],
  ['A–G', 'Improvements for any band'],
  ['1', 'Accountable team'],
]

export default function About() {
  return (
    <>
      {/* Hero */}
      <section className="border-b border-ink/10 bg-navy bg-blueprint text-white">
        <div className="container-site grid items-center gap-10 py-16 md:grid-cols-[1.3fr_1fr] md:py-24">
          <div>
            <span className="eyebrow text-ember">About Eco Futures</span>
            <h1 className="mt-4 text-4xl font-extrabold leading-[1.02] tracking-tight md:text-6xl">
              Independent by design.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/70">
              We started in Blackpool fitting insulation, and saw the same thing again and again:
              homes upgraded piecemeal, in the wrong order, by whoever knocked first. Eco Futures
              exists to do it properly — assess the whole home, plan it, and see the work through.
            </p>
            <div className="mt-7 flex items-center gap-2 text-sm text-white/60">
              <MapPin size={16} className="text-moss-soft" /> Preston · Blackpool · North West
            </div>
          </div>
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10">
            {stats.map(([v, l]) => (
              <div key={l} className="bg-navy p-5">
                <div className="font-mono text-2xl font-semibold text-amber">{v}</div>
                <div className="spec mt-1 text-white/50">{l}</div>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Values */}
      <section className="container-site py-20 md:py-28">
        <div className="max-w-prose">
          <span className="eyebrow text-ink-faint">What we stand for</span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink md:text-4xl">
            The way retrofit should be done.
          </h2>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {values.map((v) => (
            <div key={v.title} className="card card-hover p-7">
              <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-navy text-white">
                <v.icon size={24} />
              </span>
              <h3 className="mt-5 text-xl font-bold text-ink">{v.title}</h3>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-soft">{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="border-y border-ink/10 bg-paper-warm/60 py-20 md:py-28">
        <div className="container-site max-w-4xl">
          <span className="spec text-ember">Our mission</span>
          <p className="mt-6 text-2xl font-medium leading-snug text-ink md:text-4xl md:leading-[1.15]">
            To make the UK's older homes{' '}
            <span className="text-moss">warm, healthy and low-carbon</span> — with honest advice and
            work that actually performs, one home at a time.
          </p>
          <Link to="/retrofit" className="mt-8 inline-flex items-center gap-1.5 font-semibold text-ember hover:gap-2.5">
            See how we work <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <CtaSection
        eyebrow="Work with us"
        title="Warmer home. Lower bills. Less carbon."
        body="Book an independent survey and get a straight answer on what your home needs — and what it’s worth doing first."
      />
    </>
  )
}
