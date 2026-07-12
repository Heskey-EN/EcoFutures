import { Link } from 'react-router-dom'
import { ArrowRight, FileCheck2, Scale, CalendarClock, Ruler } from 'lucide-react'
import CtaSection from '../components/CtaSection.jsx'

const facts = [
  {
    icon: FileCheck2,
    title: 'The baseline',
    body: 'An EPC rates energy efficiency from A to G and lists recommended improvements — the starting point for any retrofit plan.',
  },
  {
    icon: Scale,
    title: 'Often a legal must',
    body: 'Required to sell or rent a home, and increasingly tied to minimum standards for landlords.',
  },
  {
    icon: CalendarClock,
    title: 'Valid 10 years',
    body: 'Once lodged, an EPC is valid for a decade — though a retrofit is a good reason to refresh it.',
  },
  {
    icon: Ruler,
    title: 'Measured, not guessed',
    body: 'Our assessors survey the real fabric and services on RdSAP — the same data that drives the retrofit plan.',
  },
]

const ratings = [
  { band: 'A', range: '92–100', label: 'Very efficient', width: '100%', bg: '#2E7D4F', text: '#fff' },
  { band: 'B', range: '81–91', label: '', width: '88%', bg: '#4FA36B', text: '#fff' },
  { band: 'C', range: '69–80', label: '', width: '76%', bg: '#8CC63F', text: '#14200f' },
  { band: 'D', range: '55–68', label: 'Average', width: '64%', bg: '#E8B23A', text: '#241a05' },
  { band: 'E', range: '39–54', label: '', width: '52%', bg: '#E89A2A', text: '#241a05' },
  { band: 'F', range: '21–38', label: '', width: '40%', bg: '#E4572E', text: '#fff' },
  { band: 'G', range: '1–20', label: 'Least efficient', width: '30%', bg: '#B0342A', text: '#fff' },
]

export default function Epcs() {
  return (
    <>
      {/* Hero */}
      <section className="border-b border-ink/10 bg-navy bg-blueprint text-white">
        <div className="container-site grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
          <div>
            <span className="eyebrow text-ember">Assessments &amp; EPCs</span>
            <h1 className="mt-4 text-4xl font-extrabold leading-[1.02] tracking-tight md:text-6xl">
              Know your home's numbers.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/70">
              An Energy Performance Certificate is where retrofit begins — the measured baseline that
              tells us how your home performs today and what will move it forward.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/contact" className="btn-primary">
                Book an assessment <ArrowRight size={18} />
              </Link>
              <a
                href="https://find-energy-certificate.service.gov.uk/find-a-certificate/search-by-postcode?lang=en&property_type=domestic"
                target="_blank"
                rel="noreferrer"
                className="btn-ghost-light"
              >
                Check if you have an EPC
              </a>
            </div>
          </div>

          {/* Rating scale */}
          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
            <div className="mb-3 flex items-center justify-between">
              <span className="spec text-white/60">Energy rating</span>
              <span className="font-mono text-xs text-white/40">SAP score</span>
            </div>
            <div className="flex flex-col gap-1.5">
              {ratings.map((r) => (
                <div
                  key={r.band}
                  className="flex items-center justify-between rounded px-3 py-2 font-mono text-xs font-semibold"
                  style={{ width: r.width, backgroundColor: r.bg, color: r.text }}
                >
                  <span>
                    {r.band} · {r.range}
                  </span>
                  {r.label && <span className="hidden sm:inline">{r.label}</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What it is */}
      <section className="container-site py-20 md:py-28">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {facts.map((f) => (
            <div key={f.title} className="card card-hover p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-ember/10 text-ember">
                <f.icon size={22} />
              </span>
              <h3 className="mt-5 text-lg font-bold text-ink">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it fits retrofit */}
      <section className="border-y border-ink/10 bg-paper-warm/60 py-20 md:py-28">
        <div className="container-site grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <span className="eyebrow text-ink-faint">From certificate to plan</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink md:text-4xl">
              An EPC tells you the score. A retrofit assessment tells you what to do about it.
            </h2>
          </div>
          <div className="text-lg leading-relaxed text-ink-soft">
            <p>
              A standard EPC gives a rating and a generic list of improvements. A PAS 2035 retrofit
              assessment goes further — it looks at moisture, ventilation, how you actually live in
              the home, and the right sequence of works.
            </p>
            <p className="mt-4">
              We do both, so the certificate and the plan come from one consistent survey of your
              home — no contradictions, no repeated visits.
            </p>
            <Link to="/retrofit" className="mt-6 inline-flex items-center gap-1.5 font-semibold text-ember hover:gap-2.5">
              See how retrofit works <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <CtaSection
        eyebrow="Book an assessment"
        title="Start with an accurate baseline."
        body="A fast, professional EPC or full retrofit assessment across Preston, Blackpool and the North West — usually turned around within days."
        primaryLabel="Book an assessment"
      />
    </>
  )
}
