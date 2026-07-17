import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react'
import { COMPANY } from '../data/company.js'
import { COOKIE_SETTINGS_EVENT } from './CookieBanner.jsx'

const GOV_EPC_SEARCH =
  'https://find-energy-certificate.service.gov.uk/find-a-certificate/search-by-postcode?lang=en&property_type=domestic'
const GOV_ADVICE = 'https://www.gov.uk/improve-energy-efficiency'

const columns = [
  {
    heading: 'Retrofit',
    accent: 'text-ember',
    links: [
      { label: 'How it works', to: '/retrofit' },
      { label: 'Assessments & EPCs', to: '/epcs' },
      { label: 'Book a survey', to: '/contact' },
    ],
  },
  {
    heading: 'Company',
    accent: 'text-amber',
    links: [
      { label: 'About us', to: '/about' },
      { label: 'Technology', to: '/technology' },
      { label: 'Check for an EPC', href: GOV_EPC_SEARCH },
      { label: 'Government advice', href: GOV_ADVICE },
    ],
  },
]

export default function Footer() {
  const openCookieSettings = () => window.dispatchEvent(new Event(COOKIE_SETTINGS_EVENT))

  return (
    <footer className="bg-navy bg-blueprint px-5 pb-10 pt-16 text-white sm:px-8">
      <div className="mx-auto max-w-site">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4 md:gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <img
              src="/eco-futures-logo.png"
              width="307"
              height="183"
              alt="Eco Futures"
              className="h-14 w-auto"
            />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/60">
              Independent PAS 2035 retrofit surveys and whole-house upgrades across Preston,
              Blackpool and the North West.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.heading}>
              <h4 className={`spec mb-5 ${col.accent}`}>{col.heading}</h4>
              <ul className="space-y-3 text-sm text-white/75">
                {col.links.map((l) => (
                  <li key={l.label}>
                    {l.to ? (
                      <Link className="transition-colors hover:text-white" to={l.to}>
                        {l.label}
                      </Link>
                    ) : (
                      <a
                        className="inline-flex items-center gap-1 transition-colors hover:text-white"
                        href={l.href}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {l.label} <ArrowUpRight size={13} className="opacity-60" />
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div>
            <h4 className="spec mb-5 text-moss-soft">Contact</h4>
            <ul className="space-y-3 text-sm text-white/75">
              <li>
                <a className="inline-flex items-center gap-2.5 hover:text-white" href="mailto:Info@ecofutures.uk">
                  <Mail size={15} className="text-moss-soft" /> Info@ecofutures.uk
                </a>
              </li>
              <li>
                <a className="inline-flex items-center gap-2.5 hover:text-white" href="tel:+447359069886">
                  <Phone size={15} className="text-moss-soft" /> 07359 069886
                </a>
              </li>
              <li className="inline-flex items-center gap-2.5">
                <MapPin size={15} className="text-moss-soft" /> Preston, North West
              </li>
            </ul>
          </div>
        </div>

        {/* Legal */}
        <div className="mt-14 border-t border-white/10 pt-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="max-w-lg space-y-1 text-xs leading-relaxed text-white/45">
              <p className="font-semibold text-white/65">{COMPANY.legalName}</p>
              {COMPANY.isLtd && (
                <p>
                  Registered in {COMPANY.placeOfRegistration} · Company no. {COMPANY.companyNumber}
                </p>
              )}
              <p>Registered office: {COMPANY.registeredOffice}</p>
              {COMPANY.vatNumber && <p>VAT no. {COMPANY.vatNumber}</p>}
            </div>
            <nav className="flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-white/60">
              <Link to="/privacy" className="transition-colors hover:text-white">
                Privacy Policy
              </Link>
              <Link to="/cookies" className="transition-colors hover:text-white">
                Cookie Policy
              </Link>
              <Link to="/terms" className="transition-colors hover:text-white">
                Terms of Use
              </Link>
              <button
                type="button"
                onClick={openCookieSettings}
                className="transition-colors hover:text-white"
              >
                Cookie settings
              </button>
            </nav>
          </div>
          <div className="mt-7 flex flex-col items-center justify-between gap-3 font-mono text-[0.7rem] uppercase tracking-[0.15em] text-white/35 sm:flex-row">
            <p>© {new Date().getFullYear()} {COMPANY.legalName}. All rights reserved.</p>
            <p>Preston · Blackpool · North West</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
