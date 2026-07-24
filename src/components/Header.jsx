import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Menu, X, Phone } from 'lucide-react'
import Logo from './Logo.jsx'

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Suite', to: '/retrofit-suite' },
  { label: 'EPCs', to: '/epcs' },
  { label: 'Retrofit', to: '/retrofit' },
  { label: 'About', to: '/about' },
]

const PHONE = '07359 069886'
const PHONE_HREF = 'tel:+447359069886'

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
    `relative py-1 font-mono text-[0.82rem] font-medium uppercase tracking-[0.12em] transition-colors ${
      isActive ? 'text-white' : 'text-white/65 hover:text-white'
    } after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:rounded-full after:bg-ember after:transition-all after:duration-300 ${
      isActive ? 'after:w-full' : 'after:w-0 hover:after:w-full'
    }`

  const mobileLinkClass = ({ isActive }) =>
    `flex items-center justify-between border-b border-white/5 py-4 font-mono text-sm font-medium uppercase tracking-[0.12em] transition-colors ${
      isActive ? 'text-ember' : 'text-white/85 hover:text-white'
    }`

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-navy/95 bg-blueprint backdrop-blur transition-shadow duration-300 ${
        scrolled ? 'border-white/10 shadow-lift' : 'border-white/[0.06]'
      }`}
    >
      <div className="container-site flex h-[4.5rem] items-center justify-between md:h-20">
        <Logo />

        {/* Desktop nav + contact */}
        <div className="hidden items-center md:flex">
          <nav className="flex items-center gap-6 lg:gap-8">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={linkClass} end={item.to === '/'}>
                {item.label}
              </NavLink>
            ))}
          </nav>
          <a
            href={PHONE_HREF}
            className="ml-7 hidden items-center gap-2 border-l border-white/15 pl-7 text-white/70 transition-colors hover:text-white lg:flex"
          >
            <Phone size={15} className="text-ember" />
            <span className="font-mono text-[0.8rem] tracking-tight tabular-nums">{PHONE}</span>
          </a>
        </div>

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
        <div className="border-t border-white/10 bg-navy bg-blueprint md:hidden">
          <nav className="container-site flex flex-col pt-2">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.to === '/'} className={mobileLinkClass}>
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="container-site pb-5 pt-5">
            <a
              href={PHONE_HREF}
              className="flex items-center justify-center gap-2 rounded border border-white/20 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/5"
            >
              <Phone size={16} className="text-ember" /> {PHONE}
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
