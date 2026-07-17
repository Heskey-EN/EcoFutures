import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X, ArrowRight, Phone } from 'lucide-react'
import Logo from './Logo.jsx'

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Retrofit', to: '/retrofit' },
  { label: 'EPCs', to: '/epcs' },
  { label: 'Technology', to: '/technology' },
  { label: 'About', to: '/about' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
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

  // Add depth once the page is scrolled past the header.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Desktop link: ember underline that fills for the active route and on hover.
  const linkClass = ({ isActive }) =>
    `relative py-1 text-sm font-semibold transition-colors ${
      isActive ? 'text-white' : 'text-white/70 hover:text-white'
    } after:absolute after:-bottom-0.5 after:left-0 after:h-[2px] after:rounded-full after:bg-ember after:transition-all after:duration-300 ${
      isActive ? 'after:w-full' : 'after:w-0 hover:after:w-full'
    }`

  const mobileLinkClass = ({ isActive }) =>
    `border-b border-white/5 py-3.5 text-base font-semibold transition-colors ${
      isActive ? 'text-ember' : 'text-white/85 hover:text-white'
    }`

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-navy/95 backdrop-blur transition-shadow duration-300 ${
        scrolled ? 'border-white/10 shadow-lift' : 'border-white/[0.06]'
      }`}
    >
      <div className="container-site flex h-[4.5rem] items-center justify-between md:h-20">
        <Logo />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex lg:gap-8">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClass} end={item.to === '/'}>
              {item.label}
            </NavLink>
          ))}
          <span className="h-5 w-px bg-white/15" />
          <Link
            to="/contact"
            className="group inline-flex items-center gap-1.5 rounded bg-ember px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-ember-deep"
          >
            Book a Survey
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="-mr-1 p-1 text-white md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-white/10 bg-navy md:hidden">
          <nav className="container-site flex flex-col py-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={mobileLinkClass}
              >
                {item.label}
              </NavLink>
            ))}
            <div className="mt-4 flex flex-col gap-3 pb-4">
              <a
                href="tel:+447359069886"
                className="inline-flex items-center justify-center gap-2 rounded border border-white/20 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/5"
              >
                <Phone size={16} /> 07359 069886
              </a>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-1.5 rounded bg-ember py-3.5 text-sm font-semibold text-white"
              >
                Book a Survey <ArrowRight size={16} />
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
