import { Star } from 'lucide-react'

// Small 5-star trust indicator.
export default function Stars({ size = 18, className = '' }) {
  return (
    <div className={`flex gap-0.5 ${className}`} role="img" aria-label="Rated 5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={size} className="text-accent-yellow" fill="#ffcc00" strokeWidth={1.5} />
      ))}
    </div>
  )
}
