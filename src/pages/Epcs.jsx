import { Link } from 'react-router-dom'
import { Info, Gavel, CalendarDays, BarChart3, CheckCircle2 } from 'lucide-react'

const features = [
  {
    icon: Info,
    color: 'text-accent-green',
    bg: 'bg-accent-green/10',
    title: 'The Definition',
    body: "A professional assessment of your property's fabric, heating, and lighting efficiency.",
  },
  {
    icon: Gavel,
    color: 'text-accent-orange',
    bg: 'bg-accent-orange/10',
    title: 'Legal Requirement',
    body: 'Mandatory whenever a property is built, sold, or rented in the United Kingdom.',
  },
  {
    icon: CalendarDays,
    color: 'text-accent-green',
    bg: 'bg-accent-green/10',
    title: '10 Year Validity',
    body: 'Once issued, your EPC certificate is valid for 10 years for all marketing purposes.',
  },
  {
    icon: BarChart3,
    color: 'text-accent-orange',
    bg: 'bg-accent-orange/10',
    title: 'A–G Rating Scale',
    body: 'Properties are ranked on a standardised colour-coded scale of energy efficiency.',
  },
]

const ratings = [
  { band: 'A', range: '92-100', label: 'Very Efficient', width: '100%', bg: '#008041', text: 'text-white' },
  { band: 'B', range: '81-91', label: '', width: '90%', bg: '#00a651', text: 'text-white' },
  { band: 'C', range: '69-80', label: '', width: '80%', bg: '#8cc63f', text: 'text-white' },
  { band: 'D', range: '55-68', label: 'Average', width: '70%', bg: '#fff200', text: 'text-navy' },
  { band: 'E', range: '39-54', label: '', width: '60%', bg: '#f7941d', text: 'text-white' },
  { band: 'F', range: '21-38', label: '', width: '50%', bg: '#f26522', text: 'text-white' },
  { band: 'G', range: '1-20', label: 'Not Efficient', width: '40%', bg: '#ed1c24', text: 'text-white' },
]

export default function Epcs() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy py-16">
        <div className="container-site">
          <div className="flex min-h-[360px] flex-col items-center justify-center gap-6 overflow-hidden bg-gradient-to-br from-brand-blue/40 to-navy p-8 text-center">
            <span className="rounded-full bg-accent-green/20 px-4 py-1 text-sm font-bold uppercase tracking-widest text-accent-green">
              Educational Resource
            </span>
            <h1 className="max-w-2xl font-display text-4xl font-bold leading-tight tracking-tight text-white md:text-6xl">
              Understanding Your EPC
            </h1>
            <p className="max-w-2xl text-lg font-medium leading-relaxed text-slate-300 md:text-xl">
              Essential energy performance information for UK homeowners, landlords, and property
              sellers.
            </p>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-[800px] px-6 text-center">
          <h2 className="mb-6 font-display text-3xl font-bold text-navy">What is an EPC?</h2>
          <p className="text-lg leading-relaxed text-slate-600">
            An Energy Performance Certificate (EPC) provides an energy efficiency rating (from A to
            G) for a property. It contains information about a property's energy use and typical
            energy costs, alongside recommendations on how to reduce energy use and save money.
          </p>
        </div>
      </section>

      {/* Feature grid */}
      <section className="bg-slate-50 py-16">
        <div className="container-site">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="flex flex-col gap-4 border border-slate-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className={`flex h-14 w-14 items-center justify-center rounded-lg ${f.bg} ${f.color}`}>
                  <f.icon size={32} />
                </div>
                <h3 className="font-display text-xl font-bold text-navy">{f.title}</h3>
                <p className="text-sm leading-normal text-slate-500">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rating scale */}
      <section className="relative overflow-hidden bg-navy py-16 text-white">
        <div className="container-site relative z-10">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 font-display text-3xl font-bold">The Energy Rating Scale</h2>
              <p className="mb-6 text-lg text-slate-300">
                The EPC uses a scale from A to G. Understanding where your property sits is the first
                step toward reducing your carbon footprint and energy bills.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-accent-green" />
                  <span>
                    <strong>A–C:</strong> Highly efficient, modern standard
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-accent-orange" />
                  <span>
                    <strong>D–E:</strong> Average efficiency, potential for upgrade
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  <span>
                    <strong>F–G:</strong> Poor efficiency, urgent improvements needed
                  </span>
                </li>
              </ul>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <div className="flex flex-col gap-2">
                {ratings.map((r) => (
                  <div
                    key={r.band}
                    className={`flex justify-between rounded p-3 text-sm font-bold ${r.text}`}
                    style={{ width: r.width, backgroundColor: r.bg }}
                  >
                    <span>
                      {r.band} ({r.range})
                    </span>
                    {r.label && <span>{r.label}</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking CTA */}
      <section className="border-t border-slate-200 bg-white py-24">
        <div className="mx-auto max-w-[800px] px-6 text-center">
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-accent-green/10 text-accent-green">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="mb-6 font-display text-3xl font-black text-navy md:text-4xl">
            Ready to Book Your EPC Survey?
          </h2>
          <p className="mb-10 text-lg text-slate-600">
            Our accredited energy assessors provide fast, accurate, and professional surveys across
            the region. Get your certificate in as little as 24 hours.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/contact" className="btn-primary min-w-[240px] px-8 py-4 text-base">
              Book EPC Survey Now
            </Link>
            <Link to="/contact" className="btn-outline min-w-[240px] px-8 py-4 text-base">
              Talk to an Expert
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
