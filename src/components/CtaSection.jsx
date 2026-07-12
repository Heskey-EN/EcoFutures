import { Link } from 'react-router-dom'
import { ArrowRight, Phone } from 'lucide-react'

// Shared closing call-to-action band.
export default function CtaSection({
  eyebrow = 'Start with a survey',
  title = 'Ready to see what your home needs?',
  body = 'Book an independent PAS 2035 survey and get a clear, costed retrofit plan — the measures, the order, the grants and the savings.',
  primaryLabel = 'Book a survey',
}) {
  return (
    <section className="container-site py-20 md:py-24">
      <div className="relative overflow-hidden rounded-2xl bg-navy bg-blueprint px-6 py-14 text-white md:px-16 md:py-20">
        <div className="relative z-10 max-w-2xl">
          <span className="spec text-ember">{eyebrow}</span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">{title}</h2>
          <p className="mt-4 text-lg leading-relaxed text-white/70">{body}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/contact" className="btn-primary">
              {primaryLabel} <ArrowRight size={18} />
            </Link>
            <a href="tel:+447359069886" className="btn-ghost-light">
              <Phone size={16} /> 07359 069886
            </a>
          </div>
        </div>
        {/* Decorative thermal blocks */}
        <div className="pointer-events-none absolute -right-8 top-0 hidden h-full items-center gap-2 md:flex">
          <div className="h-24 w-3 rounded-full bg-ember/40" />
          <div className="h-40 w-3 rounded-full bg-amber/40" />
          <div className="h-56 w-3 rounded-full bg-moss/50" />
        </div>
      </div>
    </section>
  )
}
