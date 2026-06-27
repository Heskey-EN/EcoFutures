import { Link } from 'react-router-dom'

// The stacked ascending bars from the original Eco Futures branding,
// rebuilt as a crisp inline SVG so it scales perfectly.
export function LogoMark({ className = 'h-8 w-8' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="10" y="60" width="10" height="20" fill="#ff6b00" />
      <rect x="25" y="50" width="10" height="30" fill="#ff9900" />
      <rect x="40" y="40" width="10" height="40" fill="#ffcc00" />
      <rect x="55" y="30" width="10" height="50" fill="#aacc00" />
      <rect x="70" y="20" width="10" height="60" fill="#4caf50" />
    </svg>
  )
}

export default function Logo({ light = false }) {
  return (
    <Link
      to="/"
      className="flex items-center gap-2.5 transition-all hover:opacity-90 active:scale-[0.98]"
      aria-label="Eco Futures — home"
    >
      <LogoMark className="h-8 w-8 shrink-0" />
      <span className="flex flex-col leading-none">
        <span
          className={`font-display text-2xl font-bold uppercase tracking-tight ${
            light ? 'text-white' : 'text-navy'
          }`}
        >
          Eco Futures
        </span>
        <span
          className={`mt-1 text-[10px] font-bold uppercase tracking-[0.2em] ${
            light ? 'text-accent-green' : 'text-brand-blue'
          }`}
        >
          Survey Solutions
        </span>
      </span>
    </Link>
  )
}
