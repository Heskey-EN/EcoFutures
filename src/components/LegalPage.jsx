import { COMPANY } from '../data/company.js'

// Shared shell for the legal pages: navy hero + prose body (styled by
// the .prose-legal rules in index.css).
export default function LegalPage({ eyebrow = 'Legal', title, intro, children }) {
  return (
    <>
      <section className="border-b border-ink/10 bg-navy bg-blueprint text-white">
        <div className="container-site py-14 md:py-20">
          <span className="eyebrow text-ember">{eyebrow}</span>
          <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-[1.05] tracking-tight md:text-5xl">
            {title}
          </h1>
          {intro && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/70">{intro}</p>}
          <p className="mt-6 font-mono text-xs uppercase tracking-widest text-white/45">
            Last updated: {COMPANY.lastUpdated}
          </p>
        </div>
      </section>

      <section className="container-site py-14 md:py-20">
        <div className="prose-legal max-w-prose">{children}</div>
      </section>
    </>
  )
}
