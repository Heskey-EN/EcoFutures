// Flat geometric illustration of an energy-efficient home.
// Pure SVG (no raster images) so it stays crisp and self-contained.
export default function HeroHouse({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 480 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="Illustration of an energy-efficient home with solar panels"
    >
      <defs>
        <linearGradient id="hh-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#dbeafe" />
          <stop offset="1" stopColor="#f4f9fd" />
        </linearGradient>
        <linearGradient id="hh-roof" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1a365d" />
          <stop offset="1" stopColor="#0d1b2a" />
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect width="480" height="600" fill="url(#hh-sky)" />

      {/* Sun */}
      <circle cx="378" cy="116" r="70" fill="#ffcc00" opacity="0.18" />
      <circle cx="378" cy="116" r="46" fill="#ffcc00" />

      {/* Floating leaves */}
      <g fill="#4caf50" opacity="0.9">
        <path d="M96 150c22-26 56-26 70-22-2 22-22 48-44 50-14 1-28-12-26-28Z" />
      </g>
      <g fill="#aacc00" opacity="0.85">
        <path d="M150 96c-4 18-22 34-38 34 0-18 14-38 38-34Z" />
      </g>

      {/* Hills */}
      <path d="M0 472 Q140 432 268 462 T480 452 V600 H0 Z" fill="#4caf50" />
      <path d="M0 516 Q160 476 300 506 T480 504 V600 H0 Z" fill="#3d9142" />

      {/* House */}
      <g>
        {/* Body */}
        <rect x="150" y="300" width="180" height="172" fill="#ffffff" stroke="#0d1b2a" strokeWidth="4" />
        {/* Roof */}
        <path d="M132 302 L240 222 L348 302 Z" fill="url(#hh-roof)" />
        {/* Chimney */}
        <rect x="300" y="250" width="22" height="40" fill="#1a365d" />
        {/* Solar panel on right roof slope */}
        <g transform="translate(252 250) rotate(36.5)">
          <rect width="92" height="42" rx="2" fill="#1e3a5f" stroke="#0d1b2a" strokeWidth="2" />
          <line x1="0" y1="14" x2="92" y2="14" stroke="#3b5a82" strokeWidth="1.5" />
          <line x1="0" y1="28" x2="92" y2="28" stroke="#3b5a82" strokeWidth="1.5" />
          <line x1="31" y1="0" x2="31" y2="42" stroke="#3b5a82" strokeWidth="1.5" />
          <line x1="61" y1="0" x2="61" y2="42" stroke="#3b5a82" strokeWidth="1.5" />
        </g>
        {/* Door */}
        <rect x="200" y="384" width="48" height="88" fill="#ff6b00" />
        <circle cx="240" cy="430" r="3.5" fill="#0d1b2a" />
        {/* Windows */}
        <rect x="270" y="332" width="44" height="44" fill="#ffcc00" stroke="#0d1b2a" strokeWidth="3" />
        <line x1="292" y1="332" x2="292" y2="376" stroke="#0d1b2a" strokeWidth="3" />
        <line x1="270" y1="354" x2="314" y2="354" stroke="#0d1b2a" strokeWidth="3" />
        <rect x="270" y="396" width="44" height="44" fill="#ffcc00" stroke="#0d1b2a" strokeWidth="3" />
        <line x1="292" y1="396" x2="292" y2="440" stroke="#0d1b2a" strokeWidth="3" />
        <line x1="270" y1="418" x2="314" y2="418" stroke="#0d1b2a" strokeWidth="3" />
      </g>

      {/* Ascending energy bars (echoes the logo) */}
      <g>
        <rect x="86" y="392" width="20" height="40" fill="#ff6b00" />
        <rect x="112" y="372" width="20" height="60" fill="#ffcc00" />
        <rect x="138" y="348" width="20" height="84" fill="#4caf50" />
      </g>
    </svg>
  )
}
