import { Link } from 'react-router-dom'
import { ClipboardList, Settings2, DraftingCompass, ShieldCheck, ArrowRight } from 'lucide-react'
import RetrofitDiagram from '../components/illustrations/RetrofitDiagram.jsx'

const PAS_2035_PDF =
  'https://retrofitacademy.org/wp-content/uploads/2023/10/PAS2035_2023.pdf'

const steps = [
  {
    icon: ClipboardList,
    title: 'Initial Assessment',
    body: "A comprehensive on-site energy evaluation conducted by our certified professionals. We map out your property's current performance and identify key areas for improvement.",
  },
  {
    icon: Settings2,
    title: 'Coordination & Planning',
    body: 'Managing the logistics and creating a tailored retrofit plan. We ensure all recommendations align with your goals, budget, and local building regulations.',
  },
  {
    icon: DraftingCompass,
    title: 'Technical Design',
    body: 'Delivery of detailed technical specifications and design documents. This roadmap provides the blueprints for contractors to execute high-quality energy improvements.',
  },
]

export default function Retrofit() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy py-16">
        <div className="container-site grid items-center gap-12 md:grid-cols-2">
          <div className="flex flex-col gap-6">
            <h1 className="font-display text-4xl font-black leading-tight tracking-tight text-white lg:text-5xl">
              Expert Retrofit Surveys for a Sustainable Future
            </h1>
            <p className="max-w-[500px] text-lg leading-relaxed text-slate-300">
              Professional home evaluations designed to drive energy efficiency, reduce costs, and
              ensure your property meets modern sustainability standards.
            </p>
            <div>
              <Link
                to="/contact"
                className="inline-flex bg-accent-orange px-8 py-4 text-base font-bold uppercase tracking-wide text-white transition-all hover:brightness-110"
              >
                Book Your Survey
              </Link>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="h-[400px] overflow-hidden rounded-xl bg-[#0f1f33] ring-1 ring-white/10">
              <RetrofitDiagram className="h-full w-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="container-site pb-8 pt-16">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold uppercase tracking-widest text-accent-green">
            How we work
          </span>
          <h2 className="font-display text-3xl font-bold text-navy">Our Retrofit Process</h2>
          <div className="mt-2 h-1 w-16 bg-accent-orange" />
        </div>
      </section>

      <section className="container-site py-8">
        <div className="flex flex-col gap-0">
          {steps.map((step, i) => (
            <div key={step.title} className="grid grid-cols-[48px_1fr] gap-x-6 md:grid-cols-[60px_1fr]">
              {/* Number + connector */}
              <div className="flex flex-col items-center">
                <div className="z-10 flex h-12 w-12 items-center justify-center rounded-full bg-accent-green text-xl font-bold text-white shadow-lg">
                  {i + 1}
                </div>
                {i < steps.length - 1 && (
                  <div className="-mt-1 hidden h-full w-1 bg-slate-200 md:block" />
                )}
              </div>
              <div
                className={`rounded-xl border border-slate-100 bg-white p-8 shadow-sm transition-colors hover:border-accent-green/50 ${
                  i < steps.length - 1 ? 'mb-8' : ''
                }`}
              >
                <div className="mb-2 flex items-center gap-3">
                  <step.icon size={24} className="text-accent-green" />
                  <h3 className="font-display text-xl font-bold text-navy">{step.title}</h3>
                </div>
                <p className="text-lg leading-relaxed text-slate-600">{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PAS 2035 compliance panel */}
      <section className="container-site py-16">
        <div className="flex flex-col items-center gap-8 rounded-2xl border border-slate-700 bg-navy p-8 shadow-2xl md:flex-row md:p-12">
          <div className="rounded-xl bg-accent-green/20 p-6">
            <ShieldCheck size={64} className="text-accent-green" />
          </div>
          <div className="flex flex-1 flex-col gap-4 text-center md:text-left">
            <h3 className="font-display text-2xl font-black text-white">
              PAS 2035 Compliant Surveys
            </h3>
            <p className="text-lg leading-relaxed text-slate-300">
              All our surveys meet the industry standard for high-quality energy efficiency
              retrofits. This ensures your project is eligible for government funding and adheres to
              the highest safety and performance criteria.
            </p>
          </div>
          <div className="flex flex-col items-center gap-4 md:items-end">
            <a
              href={PAS_2035_PDF}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-2 font-bold text-white transition-colors hover:text-accent-orange"
            >
              Learn more about compliance
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </a>
            <div className="rounded bg-white/10 px-4 py-2 text-xs font-medium uppercase tracking-widest text-slate-300">
              Industry Standard Verified
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-slate-200 bg-slate-100 py-20">
        <div className="mx-auto flex max-w-[800px] flex-col items-center gap-8 px-6 text-center">
          <h2 className="font-display text-4xl font-black leading-tight text-navy">
            Ready to improve your property's efficiency?
          </h2>
          <p className="text-xl leading-relaxed text-slate-600">
            Join hundreds of homeowners who have transformed their living spaces with Eco Futures.
            Get your professional survey booked today.
          </p>
          <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
            <Link
              to="/contact"
              className="bg-accent-orange px-12 py-5 text-center text-base font-black uppercase tracking-wide text-white shadow-lg transition-all hover:scale-[1.02]"
            >
              Book a Survey Now
            </Link>
            <Link
              to="/epcs"
              className="border-2 border-slate-300 bg-white px-12 py-5 text-center text-base font-bold uppercase tracking-wide text-navy transition-all hover:bg-slate-50"
            >
              Learn About EPCs
            </Link>
          </div>
          <div className="mt-4 flex items-center gap-6">
            <div className="flex -space-x-3">
              {['JM', 'SK', 'RP'].map((initials, i) => (
                <span
                  key={initials}
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 border-white text-xs font-bold text-white ${
                    ['bg-brand-blue', 'bg-accent-green', 'bg-accent-orange'][i]
                  }`}
                >
                  {initials}
                </span>
              ))}
            </div>
            <p className="text-sm font-medium text-slate-500">Trusted by 500+ homeowners</p>
          </div>
        </div>
      </section>
    </>
  )
}
