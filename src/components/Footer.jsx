import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin } from 'lucide-react'

const GOV_EPC_SEARCH =
  'https://find-energy-certificate.service.gov.uk/find-a-certificate/search-by-postcode?lang=en&property_type=domestic'
const GOV_ADVICE = 'https://www.gov.uk/improve-energy-efficiency'

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-navy px-6 pb-12 pt-20 text-white md:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-4 md:gap-16">
          {/* Brand */}
          <div>
            <div className="mb-6 flex items-center gap-2">
              <div className="flex h-5 items-end gap-1">
                <div className="h-1.5 w-1.5 bg-accent-orange" />
                <div className="h-2.5 w-1.5 bg-accent-yellow" />
                <div className="h-3.5 w-1.5 bg-accent-green" />
              </div>
              <span className="font-display text-xl font-extrabold uppercase italic tracking-tight">
                Eco Futures
              </span>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              Professional energy performance certification and retrofit assessment services based
              in Preston and Blackpool, serving the North West and beyond.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="mb-6 text-xs font-black uppercase tracking-[0.2em] text-accent-orange">
              Services
            </h4>
            <ul className="space-y-4 text-sm font-medium text-gray-300">
              <li>
                <Link className="transition-colors hover:text-white" to="/contact">
                  Book a Survey
                </Link>
              </li>
              <li>
                <Link className="transition-colors hover:text-white" to="/retrofit">
                  Retrofit Assessments
                </Link>
              </li>
              <li>
                <Link className="transition-colors hover:text-white" to="/epcs">
                  About EPCs
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="mb-6 text-xs font-black uppercase tracking-[0.2em] text-accent-yellow">
              Company
            </h4>
            <ul className="space-y-4 text-sm font-medium text-gray-300">
              <li>
                <Link className="transition-colors hover:text-white" to="/about">
                  About Us
                </Link>
              </li>
              <li>
                <a
                  className="transition-colors hover:text-white"
                  href={GOV_EPC_SEARCH}
                  target="_blank"
                  rel="noreferrer"
                >
                  Check for an EPC
                </a>
              </li>
              <li>
                <a
                  className="transition-colors hover:text-white"
                  href={GOV_ADVICE}
                  target="_blank"
                  rel="noreferrer"
                >
                  Government Advice
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-6 text-xs font-black uppercase tracking-[0.2em] text-accent-green">
              Contact
            </h4>
            <ul className="space-y-4 text-sm font-medium text-gray-300">
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-accent-green" />
                <a className="hover:text-white" href="mailto:Info@ecofutures.uk">
                  Info@ecofutures.uk
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-accent-green" />
                <a className="hover:text-white" href="tel:+447359069886">
                  07359 069886
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MapPin size={16} className="text-accent-green" />
                Preston, North West
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 md:flex-row">
          <p>© {new Date().getFullYear()} Eco Futures Ltd. All rights reserved.</p>
          <p>Preston · Blackpool · North West</p>
        </div>
      </div>
    </footer>
  )
}
