import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import Layout from './components/Layout.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import Home from './pages/Home.jsx'
import Epcs from './pages/Epcs.jsx'
import Retrofit from './pages/Retrofit.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import Technology from './pages/Technology.jsx'
import Pricing from './pages/Pricing.jsx'
import Privacy from './pages/Privacy.jsx'
import Cookies from './pages/Cookies.jsx'
import Terms from './pages/Terms.jsx'
import NotFound from './pages/NotFound.jsx'

// Lazy so the Supabase client never loads on marketing pages.
const RetrofitSuite = lazy(() => import('./pages/RetrofitSuite.jsx'))
const RetrofitSuiteTeam = lazy(() => import('./pages/RetrofitSuiteTeam.jsx'))
const RetrofitSuitePlatform = lazy(() => import('./pages/RetrofitSuitePlatform.jsx'))

const suiteFallback = (
  <div className="container-site flex items-center justify-center py-32 text-ink-faint">
    <Loader2 size={22} className="animate-spin" />
  </div>
)

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/epcs" element={<Epcs />} />
          <Route path="/retrofit" element={<Retrofit />} />
          <Route path="/about" element={<About />} />
          <Route path="/technology" element={<Technology />} />
          <Route
            path="/retrofit-suite"
            element={
              <Suspense fallback={suiteFallback}>
                <RetrofitSuite />
              </Suspense>
            }
          />
          <Route
            path="/retrofit-suite/team"
            element={
              <Suspense fallback={suiteFallback}>
                <RetrofitSuiteTeam />
              </Suspense>
            }
          />
          <Route
            path="/retrofit-suite/platform"
            element={
              <Suspense fallback={suiteFallback}>
                <RetrofitSuitePlatform />
              </Suspense>
            }
          />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  )
}
