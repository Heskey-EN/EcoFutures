import { Link } from 'react-router-dom'
import { ArrowUpRight, ArrowRight, Check, Cpu, FileSearch, PencilRuler, Home } from 'lucide-react'
import CtaSection from '../components/CtaSection.jsx'

const featured = [
  {
    url: 'epc-checker.com',
    href: 'https://epc-checker.com',
    tag: 'Live · Free to try',
    icon: FileSearch,
    name: 'EPC Checker',
    tagline: 'Look up any UK property — energy rating, fabric, heating and heritage constraints.',
    points: [
      'Free basic EPC summary for any address',
      'Pro reports: full certificate, measures & costs',
      'Bulk spreadsheet uploads & saved searches',
      'Built for DEA and retrofit assessors',
    ],
  },
]

const also = [
  {
    icon: PencilRuler,
    name: 'Cavity Wall Survey Creator',
    body: 'Our in-house tool for drawing to-scale elevation diagrams — windows, doors and untreatable areas — with AI auto-drafting from floor plans and a print-ready CWI survey PDF. We use it on our own surveys.',
  },
  {
    icon: Home,
    name: 'This interactive house',
    body: 'The thermal retrofit explorer on our home page is our own build — no template, just a house you can actually take apart.',
  },
]

function BrowserCard({ p }) {
  return (
    <article className="card card-hover flex flex-col overflow-hidden">
      {/* Browser chrome */}
      <div className="flex items-center gap-2 border-b border-ink/10 bg-paper px-4 py-2.5">
        <span className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-ember/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-moss/60" />
        </span>
        <span className="ml-2 truncate rounded bg-white px-3 py-1 font-mono text-xs text-ink-faint">
          {p.url}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6 md:p-7">
        <div className="flex items-center justify-between">
          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-navy text-white">
            <p.icon size={22} />
          </span>
          <span className="spec text-moss-deep">{p.tag}</span>
        </div>
        <h3 className="mt-5 text-2xl font-bold text-ink">{p.name}</h3>
        <p className="mt-1.5 text-[0.95rem] leading-relaxed text-ink-soft">{p.tagline}</p>
        <ul className="mt-5 flex flex-col gap-2.5 border-t border-ink/10 pt-5">
          {p.points.map((pt) => (
            <li key={pt} className="flex items-start gap-2.5 text-sm text-ink">
              <Check size={17} className="mt-0.5 shrink-0 text-moss" /> {pt}
            </li>
          ))}
        </ul>
        <a
          href={p.href}
          target="_blank"
          rel="noreferrer"
          className="btn-outline mt-6 w-full"
        >
          Visit {p.url} <ArrowUpRight size={16} />
        </a>
      </div>
    </article>
  )
}

export default function Technology() {
  return (
    <>
      {/* Hero */}
      <section className="border-b border-ink/10 bg-navy bg-blueprint text-white">
        <div className="container-site grid items-center gap-10 py-16 md:grid-cols-[1.3fr_1fr] md:py-24">
          <div>
            <span className="eyebrow text-ember">
              <Cpu size={14} /> Technology
            </span>
            <h1 className="mt-4 text-4xl font-extrabold leading-[1.02] tracking-tight md:text-6xl">
              We build the tools we wish existed.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/70">
              Eco Futures isn't only a survey company — we build software for the EPC and retrofit
              industry. The same tools we use on your job are ones we've designed ourselves, so
              surveys are faster, data is cleaner, and nothing gets lost in translation.
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-6">
            <span className="spec text-white/50">Why it matters for you</span>
            <ul className="mt-4 flex flex-col gap-3">
              {[
                'Accurate, measured data — not guesswork',
                'Faster turnaround from survey to plan',
                'Tools purpose-built for UK retrofit',
              ].map((t) => (
                <li key={t} className="flex items-start gap-2.5 text-sm text-white/85">
                  <Check size={17} className="mt-0.5 shrink-0 text-moss-soft" /> {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Featured tools */}
      <section className="container-site py-20 md:py-28">
        <div className="max-w-prose">
          <span className="eyebrow text-ink-faint">In production</span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink md:text-4xl">
            Live tools, used every day.
          </h2>
        </div>
        <div className="mt-12 max-w-2xl">
          {featured.map((p) => (
            <BrowserCard key={p.url} p={p} />
          ))}
        </div>
      </section>

      {/* Also building */}
      <section className="border-y border-ink/10 bg-paper-warm/60 py-20 md:py-28">
        <div className="container-site">
          <div className="max-w-prose">
            <span className="eyebrow text-ink-faint">Also in the workshop</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink md:text-4xl">
              Always building.
            </h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {also.map((a) => (
              <div key={a.name} className="card-hover flex items-start gap-4 rounded-lg border border-ink/10 bg-paper-card p-6">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-ember/10 text-ember">
                  <a.icon size={22} />
                </span>
                <div>
                  <h3 className="text-lg font-bold text-ink">{a.name}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{a.body}</p>
                </div>
              </div>
            ))}
          </div>
          <Link
            to="/"
            className="mt-10 inline-flex items-center gap-1.5 font-semibold text-ember hover:gap-2.5"
          >
            Try the interactive house <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <CtaSection
        eyebrow="Survey + software"
        title="Retrofit expertise, backed by our own tools."
        body="Book a survey and you get the benefit of both — experienced assessors and purpose-built software working on your home."
      />
    </>
  )
}
