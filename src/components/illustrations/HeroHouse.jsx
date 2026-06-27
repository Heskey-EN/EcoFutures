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
          <stop offset="0" stopColor="#22456f" />
          <stop offset="1" stopColor="#0d1b2a" />
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect width="480" height="600" fill="url(#hh-sky)" />

      {/* Sun */}
      <circle cx="384" cy="118" r="66" fill="#ffcc00" opacity="0.16" />
      <circle cx="384" cy="118" r="44" fill="#ffcc00" />

      {/* Leaf accent */}
      <g transform="translate(150 158) rotate(-22)">
        <path d="M0 -34 C18 -20 18 14 0 32 C-18 14 -18 -20 0 -34 Z" fill="#4caf50" />
        <path d="M0 -26 L0 26" stroke="#eafaf0" strokeWidth="2" opacity="0.6" strokeLinecap="round" />
      </g>

      {/* Hills */}
      <path d="M0 474 Q140 436 268 466 T480 456 V600 H0 Z" fill="#4caf50" />
      <path d="M0 518 Q160 478 300 508 T480 506 V600 H0 Z" fill="#3d9142" />

      {/* House */}
      <g>
        {/* Body */}
        <rect x="168" y="330" width="168" height="142" fill="#ffffff" stroke="#0d1b2a" strokeWidth="4" />

        {/* Roof */}
        <path d="M148 332 L252 250 L356 332 Z" fill="url(#hh-roof)" />

        {/* Solar panel — seated flush on the right roof slope */}
        <g transform="translate(269 271) rotate(38.3)">
          <rect width="69" height="24" rx="2" fill="#1e3a5f" stroke="#16324f" strokeWidth="1.5" />
          <line x1="0" y1="12" x2="69" y2="12" stroke="#3b5a82" strokeWidth="1.4" />
          <line x1="23" y1="0" x2="23" y2="24" stroke="#3b5a82" strokeWidth="1.4" />
          <line x1="46" y1="0" x2="46" y2="24" stroke="#3b5a82" strokeWidth="1.4" />
        </g>

        {/* Door */}
        <rect x="230" y="396" width="44" height="76" fill="#ff6b00" />
        <circle cx="266" cy="434" r="3.5" fill="#0d1b2a" />

        {/* Left window */}
        <rect x="184" y="360" width="36" height="36" fill="#ffcc00" stroke="#0d1b2a" strokeWidth="3" />
        <line x1="202" y1="360" x2="202" y2="396" stroke="#0d1b2a" strokeWidth="3" />
        <line x1="184" y1="378" x2="220" y2="378" stroke="#0d1b2a" strokeWidth="3" />

        {/* Right window */}
        <rect x="284" y="360" width="36" height="36" fill="#ffcc00" stroke="#0d1b2a" strokeWidth="3" />
        <line x1="302" y1="360" x2="302" y2="396" stroke="#0d1b2a" strokeWidth="3" />
        <line x1="284" y1="378" x2="320" y2="378" stroke="#0d1b2a" strokeWidth="3" />
      </g>
    </svg>
  )
}
