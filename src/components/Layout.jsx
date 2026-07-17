import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import CookieBanner from './CookieBanner.jsx'
import { initAnalytics, trackPageView } from '../lib/analytics.js'

export default function Layout() {
  const location = useLocation()

  // Load analytics once, only if consent was previously granted.
  useEffect(() => {
    initAnalytics()
  }, [])

  // Record SPA page views (GA only auto-fires the first one).
  useEffect(() => {
    trackPageView(location.pathname + location.search)
  }, [location.pathname, location.search])

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CookieBanner />
    </div>
  )
}
