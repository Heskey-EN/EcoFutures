import { Link } from 'react-router-dom'
import {
  BarChart3,
  Wrench,
  Check,
  ArrowRight,
  Coins,
  TrendingUp,
  Leaf,
} from 'lucide-react'
import CtaBand from '../components/CtaBand.jsx'
import HeroHouse from '../components/illustrations/HeroHouse.jsx'

const GOV_EPC_SEARCH =
  'https://find-energy-certificate.service.gov.uk/find-a-certificate/search-by-postcode?lang=en&property_type=domestic'

const services = [
  {
    icon: BarChart3,
    iconBg: 'bg-navy',
    title: 'EPC Solutions',
    body: 'Accredited Energy Performance Certificates required for all property transactions. We provide precise analysis and official certification.',
    points: ['Certified Domestic & Commercial', '10-Year Certificate Validity'],
    pointColor: 'text-accent-orange',
    to: '/epcs',
    cta: 'Get Certified',
  },
  {
    icon: Wrench,
    iconBg: 'bg-brand-blue',
    title: 'Retrofit Surveys',
    body: 'In-depth technical surveys following PAS 2035 standards to provide a clear pathway for deep-energy renovation projects.',
    points: ['PAS 2035 Compliant Assessments', 'Cost-Saving Improvement Plans'],
    pointColor: 'text-accent-green',
    to: '/retrofit',
    cta: 'Explore Retrofit',
  },
]

const impacts = [
  {
    icon: Coins,
    color: 'text-accent-orange',
    title: 'Reduced Utility Bills',
    body: 'High EPC ratings translate directly into lower energy costs, saving the average household up to 35% annually.',
  },
  {
    icon: TrendingUp,
    color: 'text-accent-yellow',
    title: 'Market Valuation',
    body: 'Energy efficient properties command a significant premium, often increasing sale price by 5–10% in the current market.',
  },
  {
    icon: Leaf,
    color: 'text-accent-green',
    title: 'Environmental Goal',
    body: "Contribute to the UK's Net Zero targets by drastically reducing your property's operational carbon footprint.",
  },
]

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="container-site py-16 md:py-24">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          <div className="flex flex-col gap-8 animate-fade-up">
            <div className="flex flex-col gap-6">
              <span className="inline-flex w-fit items-center gap-2 border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-widest text-navy">
                <span className="h-2 w-2 bg-accent-orange" />
                EPC Solutions Specialist
              </span>
              <h1 className="font-display text-5xl font-bold uppercase leading-tight tracking-tight text-navy md:text-6xl">
                Future-Proof Your Property with{' '}
                <span className="text-brand-blue">Expert EPC Solutions</span>
              </h1>
              <p className="max-w-[540px] text-lg leading-relaxed text-slate-600">
                Professional EPC assessments and Retrofit surveys designed to maximise efficiency,
                reduce costs, and elevate your property's environmental rating.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link to="/contact" className="btn-primary px-10 py-4 text-base">
                Book a Survey
              </Link>
              <a
                href={GOV_EPC_SEARCH}
                target="_blank"
                rel="noreferrer"
                className="btn-outline px-10 py-4 text-base"
              >
                Check if you have an EPC
              </a>
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <div className="flex -space-x-3">
                <span className="flex h-10 w-10 items-center justify-center border-2 border-white bg-brand-blue text-xs font-bold text-white">
                  EF
                </span>
                <span className="flex h-10 w-10 items-center justify-center border-2 border-white bg-accent-green text-xs font-bold text-white">
                  A+
                </span>
              </div>
              <span className="font-medium uppercase tracking-tight">
                Trusted by over <span className="font-bold text-navy">2,000+</span> UK property
                owners
              </span>
            </div>
          </div>

          {/* Hero image + rating badge */}
          <div className="relative animate-fade-in">
            <div className="relative aspect-[4/5] overflow-hidden bg-slate-200 shadow-xl">
              <HeroHouse className="h-full w-full" />
            </div>
            <div className="absolute -bottom-6 -left-6 hidden border-t-4 border-accent-orange bg-navy p-8 shadow-2xl md:block">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <span className="text-5xl font-black text-white">C+</span>
                  <div className="flex gap-1">
                    <div className="h-10 w-1 bg-accent-orange" />
                    <div className="h-10 w-1 bg-accent-yellow" />
                    <div className="h-10 w-1 bg-accent-green" />
                  </div>
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-slate-300">
                  Efficiency Goal
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core services */}
      <section className="bg-slate-50 py-24">
        <div className="container-site">
          <div className="mb-16 flex flex-col items-center gap-4 text-center">
            <h2 className="font-display text-4xl font-bold uppercase tracking-tight text-navy md:text-5xl">
              Our Core Services
            </h2>
            <div className="heading-rule" />
            <p className="mt-4 max-w-[700px] text-lg text-slate-600">
              We provide accredited EPC solutions and comprehensive assessments to define your
              building's energy performance.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {services.map((s) => (
              <div
                key={s.title}
                className="group flex flex-col gap-8 border border-slate-200 bg-white p-10 transition-all hover:border-brand-blue hover:shadow-lg"
              >
                <div className={`flex h-16 w-16 items-center justify-center text-white ${s.iconBg}`}>
                  <s.icon size={32} />
                </div>
                <div className="flex flex-col gap-4">
                  <h3 className="font-display text-3xl font-bold uppercase text-navy">{s.title}</h3>
                  <p className="text-lg leading-relaxed text-slate-600">{s.body}</p>
                  <ul className="mt-4 flex flex-col gap-3">
                    {s.points.map((p) => (
                      <li
                        key={p}
                        className="flex items-center gap-3 text-xs font-bold uppercase tracking-wide"
                      >
                        <Check size={18} className={s.pointColor} />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link
                  to={s.to}
                  className="mt-4 flex items-center gap-2 text-sm font-bold uppercase text-navy transition-colors hover:text-brand-blue"
                >
                  {s.cta} <ArrowRight size={16} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact */}
      <section className="bg-navy py-24 text-white">
        <div className="container-site">
          <div className="flex flex-col gap-16">
            <div className="flex flex-col gap-3">
              <h2 className="font-display text-4xl font-bold uppercase tracking-tight">
                The Impact of Efficiency
              </h2>
              <div className="h-1 w-20 bg-accent-orange" />
              <p className="mt-2 text-lg text-slate-400">
                Smarter decisions for a high-performance home.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {impacts.map((i) => (
                <div
                  key={i.title}
                  className="flex flex-col gap-6 border border-white/10 bg-white/5 p-10 transition-all hover:bg-white/10"
                >
                  <i.icon size={44} className={i.color} />
                  <h3 className="font-display text-2xl font-bold uppercase tracking-tight">
                    {i.title}
                  </h3>
                  <p className="leading-relaxed text-slate-400">{i.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        title="Start Your Journey to a"
        highlight="Higher Rated Home"
        subtitle="Book a certified EPC specialist today for a comprehensive property assessment."
      />
    </>
  )
}
