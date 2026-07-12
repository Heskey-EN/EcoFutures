import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import Logo from './Logo.jsx'

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'EPCs', to: '/epcs' },
  { label: 'Retrofit', to: '/retrofit' },
  { label: 'About', to: '/about' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const linkClass = ({ isActive }) =>
    `text-sm font-semibold transition-colors hover:text-white ${
      isActive ? 'text-amber' : 'text-white/80'
    }`

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-navy/95 backdrop-blur">
      <div className="container-site flex h-20 items-center justify-between">
        <Logo />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-10 md:flex">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClass} end={item.to === '/'}>
              {item.label}
            </NavLink>
          ))}
          <Link
            to="/contact"
            className="rounded bg-ember px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-ember-deep"
          >
            Book a Survey
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="text-white md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-white/10 bg-navy md:hidden">
          <nav className="container-site flex flex-col gap-1 py-4">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className="py-2 text-sm font-bold text-white/85 hover:text-white"
              >
                {item.label}
              </NavLink>
            ))}
            <Link
              to="/contact"
              className="mt-2 rounded bg-ember px-6 py-3 text-center text-sm font-semibold text-white"
            >
              Book a Survey
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
