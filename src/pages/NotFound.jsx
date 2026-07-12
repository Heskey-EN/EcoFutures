import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="container-site flex min-h-[62vh] flex-col items-center justify-center gap-6 py-24 text-center">
      <span className="font-mono text-sm uppercase tracking-[0.3em] text-ink-faint">Error 404</span>
      <h1 className="font-display text-6xl font-extrabold text-ink">Page not found</h1>
      <p className="max-w-md text-ink-soft">
        That page doesn't exist or has moved. Let's get you back to your home.
      </p>
      <Link to="/" className="btn-primary">
        Back to home
      </Link>
    </section>
  )
}
