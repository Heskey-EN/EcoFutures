import { Link } from 'react-router-dom'

// Reusable closing call-to-action used across several pages.
export default function CtaBand({
  title = 'Start Your Journey to a Higher Rated Home',
  highlight,
  subtitle = 'Book a certified EPC specialist today for a comprehensive property assessment.',
  primaryLabel = 'Book Your Survey',
  primaryTo = '/contact',
  secondaryLabel,
  secondaryTo = '/contact',
}) {
  return (
    <section className="container-site py-24">
      <div className="relative overflow-hidden border border-slate-200 bg-slate-50 p-12 md:p-20">
        <div className="relative z-10 mx-auto flex max-w-[850px] flex-col items-center gap-8 text-center">
          <h2 className="text-4xl font-bold uppercase leading-tight text-navy md:text-6xl">
            {title} {highlight && <span className="text-brand-blue">{highlight}</span>}
          </h2>
          <p className="max-w-[600px] text-xl text-slate-600">{subtitle}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to={primaryTo} className="btn-primary px-12 py-5 text-base">
              {primaryLabel}
            </Link>
            {secondaryLabel && (
              <Link to={secondaryTo} className="btn-outline px-12 py-5 text-base">
                {secondaryLabel}
              </Link>
            )}
          </div>
        </div>
        {/* Decorative corner blocks */}
        <div className="absolute right-0 top-0 h-32 w-32 bg-accent-orange opacity-10" />
        <div className="absolute bottom-0 left-0 h-32 w-32 bg-accent-green opacity-10" />
      </div>
    </section>
  )
}
