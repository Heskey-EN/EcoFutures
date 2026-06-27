// "Growth journey" chart for the About page — three milestones rising from
// local insulation work to national energy assessment, matching the timeline.
export default function JourneyDiagram({ className = '' }) {
  const nodes = [
    { x: 84, y: 452, color: '#ff6b00', year: '2021', tag: 'Insulation' },
    { x: 244, y: 322, color: '#ffcc00', year: '2023', tag: 'EPC Surveys' },
    { x: 404, y: 168, color: '#4caf50', year: 'Now', tag: 'National Retrofit' },
  ]

  return (
    <svg
      className={className}
      viewBox="0 0 480 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="Chart showing Eco Futures' growth from local insulation to national retrofit"
    >
      <defs>
        <linearGradient id="jd-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4caf50" stopOpacity="0.45" />
          <stop offset="1" stopColor="#4caf50" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="jd-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#13243b" />
          <stop offset="1" stopColor="#0a192f" />
        </linearGradient>
      </defs>

      {/* Panel */}
      <rect width="480" height="600" fill="url(#jd-bg)" />

      {/* Grid */}
      <g stroke="#1c324d" strokeWidth="1" opacity="0.7">
        {Array.from({ length: 6 }).map((_, i) => (
          <line key={`h${i}`} x1="40" y1={120 + i * 80} x2="440" y2={120 + i * 80} />
        ))}
        {Array.from({ length: 5 }).map((_, i) => (
          <line key={`v${i}`} x1={80 + i * 80} y1="100" x2={80 + i * 80} y2="520" />
        ))}
      </g>

      {/* Sun accent */}
      <circle cx="404" cy="96" r="40" fill="#ffcc00" opacity="0.16" />
      <circle cx="404" cy="96" r="22" fill="#ffcc00" opacity="0.85" />

      {/* Area under the trend line */}
      <path d="M84 452 L244 322 L404 168 L404 520 L84 520 Z" fill="url(#jd-area)" />

      {/* Trend line */}
      <polyline
        points="84,452 244,322 404,168"
        fill="none"
        stroke="#aacc00"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Baseline */}
      <line x1="60" y1="520" x2="440" y2="520" stroke="#3b5a82" strokeWidth="3" />

      {/* Milestone nodes */}
      {nodes.map((n) => (
        <g key={n.year}>
          <line x1={n.x} y1={n.y} x2={n.x} y2="520" stroke={n.color} strokeWidth="1.5" strokeDasharray="3 6" opacity="0.6" />
          <circle cx={n.x} cy={n.y} r="14" fill={n.color} opacity="0.2" />
          <circle cx={n.x} cy={n.y} r="8" fill={n.color} stroke="#0a192f" strokeWidth="3" />
          <text x={n.x} y={n.y - 26} fill="#ffffff" fontSize="22" fontWeight="700" textAnchor="middle" fontFamily="'Space Grotesk', sans-serif">
            {n.year}
          </text>
          <text x={n.x} y={n.y - 6} fill="#94a3b8" fontSize="13" textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight="600">
            {n.tag}
          </text>
        </g>
      ))}

      {/* Ascending bars (brand echo) bottom-left */}
      <g>
        <rect x="60" y="556" width="16" height="20" fill="#ff6b00" />
        <rect x="82" y="544" width="16" height="32" fill="#ffcc00" />
        <rect x="104" y="528" width="16" height="48" fill="#4caf50" />
      </g>
    </svg>
  )
}
