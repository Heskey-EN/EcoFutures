import { Link } from 'react-router-dom'
import { BadgeCheck, Clock, Leaf } from 'lucide-react'
import JourneyDiagram from '../components/illustrations/JourneyDiagram.jsx'

const timeline = [
  {
    num: '01',
    period: '2021 — 2023',
    accent: 'text-accent-orange',
    border: 'border-accent-orange',
    title: 'Our Roots: Blackpool Beginnings',
    body: 'Starting in Blackpool, we focused on practical solutions. Our team worked on the front lines, installing loft and cavity wall insulation to help local families reduce their heating bills and carbon footprint. This hands-on experience remains the foundation of our technical knowledge.',
  },
  {
    num: '02',
    period: '2023 — 2025',
    accent: 'text-accent-yellow',
    border: 'border-accent-yellow',
    title: 'The Transition to Surveys',
    body: 'As the energy landscape changed, we realised that installation was only half the battle. We began investing in certifications, moving into Domestic Energy Assessment and detailed EPC surveys to provide deeper insights for homeowners looking to future-proof their properties.',
  },
  {
    num: '03',
    period: 'Present Day',
    accent: 'text-accent-green',
    border: 'border-accent-green',
    title: 'Our Evolution: Professional Retrofit',
    body: 'Today, Eco Futures is a leader in Retrofit Assessments and EPCs. We bridge the gap between complex energy requirements and practical home improvements, serving homeowners and local authorities with professional, data-driven advice at a national scale.',
  },
]

const stats = [
  { value: '10k+', label: 'Surveys Completed', color: 'text-accent-orange' },
  { value: '15%', label: 'Avg. Energy Saving', color: 'text-accent-yellow' },
  { value: '100%', label: 'Trustpilot Rated', color: 'text-accent-green' },
]

export default function About() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy py-20 text-white md:py-32">
        <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 md:grid-cols-2 md:px-12">
          <div>
            <div className="mb-6 flex items-center gap-4">
              <span className="h-px w-12 bg-accent-orange" />
              <span className="text-sm font-bold uppercase tracking-[0.2em] text-accent-orange">
                Established 2021
              </span>
            </div>
            <h1 className="mb-8 font-display text-5xl font-extrabold leading-[1.1] md:text-7xl">
              From Insulation to National Energy{' '}
              <span className="text-accent-green">Excellence.</span>
            </h1>
            <p className="mb-10 max-w-xl text-xl leading-relaxed text-gray-300">
              Our journey began with a simple ladder and a passion for warmer homes. Today, we lead
              the charge in professional Retrofit and EPC assessments across the UK.
            </p>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-3">
                <BadgeCheck size={22} className="text-accent-yellow" />
                <span className="text-sm font-bold tracking-wide">ACCREDITED ASSESSORS</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock size={22} className="text-accent-green" />
                <span className="text-sm font-bold tracking-wide">Fast Reliable Service</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/5] overflow-hidden shadow-2xl ring-1 ring-white/10">
              <JourneyDiagram className="h-full w-full" />
            </div>
            <div className="absolute -bottom-6 -left-6 -z-10 hidden h-48 w-48 bg-accent-orange md:block" />
          </div>
        </div>
      </section>

      {/* Our story */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-4xl px-6">
          <div className="mb-20">
            <h2 className="mb-4 font-display text-4xl font-extrabold uppercase tracking-tight text-navy">
              Our Story
            </h2>
            <div className="h-2 w-24 bg-accent-yellow" />
          </div>
          <div className="space-y-24">
            {timeline.map((t) => (
              <div key={t.num} className="flex flex-col gap-12 md:flex-row">
                <div className="md:w-1/4">
                  <span className="mb-2 block text-5xl font-black text-slate-100">{t.num}</span>
                  <span className={`text-sm font-extrabold uppercase tracking-widest ${t.accent}`}>
                    {t.period}
                  </span>
                </div>
                <div className={`border-l-4 pl-8 md:w-3/4 md:pl-12 ${t.border}`}>
                  <h3 className="mb-4 font-display text-2xl font-extrabold text-navy">{t.title}</h3>
                  <p className="text-lg leading-relaxed text-slate-500">{t.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission + stats */}
      <section className="relative overflow-hidden bg-navy py-24 text-white">
        <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12">
          <div className="mx-auto mb-20 flex max-w-4xl flex-col items-center text-center">
            <Leaf size={56} className="mb-8 text-accent-green" />
            <h2 className="mb-8 font-display text-4xl font-extrabold uppercase tracking-tight md:text-5xl">
              Our Mission
            </h2>
            <p className="text-2xl font-light italic leading-relaxed text-gray-300 md:text-3xl">
              "To empower every homeowner with the professional data and expert guidance needed to
              create energy-efficient, sustainable, and future-proof living spaces, reducing
              national carbon output one home at a time."
            </p>
          </div>
          <div className="grid grid-cols-1 border-y border-white/10 md:grid-cols-3">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={`p-12 text-center ${i < stats.length - 1 ? 'md:border-r md:border-white/10' : ''}`}
              >
                <div className={`mb-4 text-6xl font-black ${s.color}`}>{s.value}</div>
                <div className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/3 -skew-x-12 translate-x-1/2 bg-accent-orange opacity-[0.03]" />
      </section>

      {/* CTA */}
      <section className="border-t border-slate-100 bg-white py-24">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <h2 className="mb-8 font-display text-4xl font-extrabold uppercase tracking-tight text-navy md:text-5xl">
            Ready to improve your home's efficiency?
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-xl text-slate-500">
            Whether you need an EPC for a sale or a full Retrofit Assessment for government funding,
            our expert team is here to help.
          </p>
          <div className="flex flex-col justify-center gap-6 sm:flex-row">
            <Link
              to="/contact"
              className="bg-accent-green px-10 py-5 text-base font-black uppercase tracking-widest text-white transition-colors hover:bg-[#3d9142]"
            >
              Book a Survey
            </Link>
            <Link
              to="/contact"
              className="border-4 border-navy px-10 py-5 text-base font-black uppercase tracking-widest text-navy transition-all hover:bg-navy hover:text-white"
            >
              Contact Specialist
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
