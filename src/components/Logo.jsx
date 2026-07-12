import { Link } from 'react-router-dom'

// The official Eco Futures logo (white-on-transparent — designed for dark
// backgrounds). Used in the navy header and footer.
export default function Logo({ className = 'h-11 sm:h-12' }) {
  return (
    <Link
      to="/"
      className="flex items-center transition-all hover:opacity-90 active:scale-[0.98]"
      aria-label="Eco Futures — home"
    >
      <img
        src="/eco-futures-logo.png"
        width="307"
        height="183"
        alt="Eco Futures"
        className={`${className} w-auto`}
      />
    </Link>
  )
}
