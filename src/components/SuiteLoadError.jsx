// Shown when the signed-in user's memberships couldn't be loaded — so a
// network blip never masquerades as "you don't have access".
import { RefreshCw } from 'lucide-react'

export default function SuiteLoadError() {
  return (
    <section className="container-site py-20 md:py-28">
      <div className="mx-auto max-w-md text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-ink/[0.06] text-ink-faint">
          <RefreshCw size={22} />
        </span>
        <h1 className="mt-5 font-display text-2xl font-bold text-ink">
          Couldn't load your account
        </h1>
        <p className="mt-2 text-ink-soft">
          Something went wrong fetching your details — check your connection and try again.
        </p>
        <button type="button" onClick={() => window.location.reload()} className="btn-primary mt-6">
          <RefreshCw size={16} /> Try again
        </button>
      </div>
    </section>
  )
}
