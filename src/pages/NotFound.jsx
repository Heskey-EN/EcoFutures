import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="container-site flex min-h-[60vh] flex-col items-center justify-center gap-6 py-24 text-center">
      <span className="font-display text-7xl font-black text-navy">404</span>
      <div className="heading-rule" />
      <h1 className="font-display text-2xl font-bold uppercase text-navy">Page Not Found</h1>
      <p className="max-w-md text-slate-600">
        Sorry, the page you're looking for doesn't exist or has moved.
      </p>
      <Link to="/" className="btn-primary px-8 py-4">
        Back to Home
      </Link>
    </section>
  )
}
