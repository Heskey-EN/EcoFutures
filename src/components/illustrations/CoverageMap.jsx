// Stylised map of the North West service area with coverage rings and pins.
// Light palette so the white info card reads clearly on top of it.
function Pin({ x, y, color, label, sub }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx="0" cy="2" rx="10" ry="3.5" fill="#0d1b2a" opacity="0.15" />
      <path
        d="M0,0 C-10,-16 -13,-22 -13,-29 A13,13 0 1 1 13,-29 C13,-22 10,-16 0,0 Z"
        fill={color}
        stroke="#ffffff"
        strokeWidth="2"
      />
      <circle cx="0" cy="-29" r="5.5" fill="#ffffff" />
      <text x="18" y="-30" fill="#0d1b2a" fontSize="20" fontWeight="700" fontFamily="'Space Grotesk', sans-serif">
        {label}
      </text>
      {sub && (
        <text x="18" y="-12" fill="#64748b" fontSize="13" fontWeight="600" fontFamily="Inter, sans-serif">
          {sub}
        </text>
      )}
    </g>
  )
}

export default function CoverageMap({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 1000 360"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="Map of the North West showing Eco Futures' service coverage"
    >
      <defs>
        <linearGradient id="cm-sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#eef4fa" />
          <stop offset="1" stopColor="#e3ecf5" />
        </linearGradient>
      </defs>

      {/* Sea / base */}
      <rect width="1000" height="360" fill="url(#cm-sea)" />

      {/* Graticule */}
      <g stroke="#cdd9e6" strokeWidth="1" opacity="0.7">
        {Array.from({ length: 11 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 100} y1="0" x2={i * 100} y2="360" />
        ))}
        {Array.from({ length: 4 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 90} x2="1000" y2={i * 90} />
        ))}
      </g>

      {/* Landmass (abstract North West) */}
      <path
        d="M560 360 L548 250 Q560 210 600 196 Q612 150 656 150 Q664 96 720 96 L760 70 Q820 60 860 92 Q940 120 980 100 L1000 120 L1000 360 Z"
        fill="#dbe8da"
        stroke="#bcd2bb"
        strokeWidth="2"
      />

      {/* Coverage rings centred on Preston */}
      <g>
        <circle cx="780" cy="208" r="150" fill="#ff6b00" opacity="0.05" />
        <circle cx="780" cy="208" r="150" stroke="#ff6b00" strokeWidth="1.5" strokeDasharray="4 7" opacity="0.5" />
        <circle cx="780" cy="208" r="100" stroke="#ff6b00" strokeWidth="1.5" strokeDasharray="4 7" opacity="0.6" />
        <circle cx="780" cy="208" r="52" fill="#ff6b00" opacity="0.08" />
      </g>

      {/* Route between Blackpool and Preston */}
      <line x1="624" y1="186" x2="780" y2="208" stroke="#1a365d" strokeWidth="2" strokeDasharray="3 7" opacity="0.6" />

      {/* Reference dots */}
      <g fill="#94a3b8">
        <circle cx="724" cy="104" r="4" />
        <circle cx="884" cy="214" r="4" />
      </g>
      <text x="734" y="100" fill="#64748b" fontSize="13" fontWeight="600" fontFamily="Inter, sans-serif">Lancaster</text>
      <text x="846" y="244" fill="#64748b" fontSize="13" fontWeight="600" fontFamily="Inter, sans-serif">Blackburn</text>

      {/* Pins */}
      <Pin x={780} y={208} color="#ff6b00" label="Preston" sub="Head office" />
      <Pin x={624} y={186} color="#0d1b2a" label="Blackpool" sub="Coverage" />
    </svg>
  )
}
