// Technical "retrofit measures" diagram — a labelled house showing the
// upgrades an assessment covers. Designed to sit on a dark panel.
export default function RetrofitDiagram({ className = '' }) {
  const labels = [
    { y: 96, color: '#3b82f6', text: 'Solar PV', fx: 168, fy: 138 },
    { y: 150, color: '#ffcc00', text: 'Loft insulation', fx: 232, fy: 150 },
    { y: 214, color: '#4caf50', text: 'Cavity wall', fx: 120, fy: 250 },
    { y: 268, color: '#38bdf8', text: 'Double glazing', fx: 250, fy: 262 },
    { y: 322, color: '#ff6b00', text: 'Heat pump', fx: 360, fy: 322 },
  ]

  return (
    <svg
      className={className}
      viewBox="0 0 600 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Diagram of a home showing retrofit upgrades"
    >
      {/* Panel background */}
      <rect width="600" height="420" fill="#0f1f33" />
      {/* Subtle grid */}
      <g stroke="#1c324d" strokeWidth="1" opacity="0.6">
        {Array.from({ length: 9 }).map((_, i) => (
          <line key={`v${i}`} x1={40 + i * 40} y1="20" x2={40 + i * 40} y2="360" />
        ))}
        {Array.from({ length: 8 }).map((_, i) => (
          <line key={`h${i}`} x1="30" y1={40 + i * 40} x2="370" y2={40 + i * 40} />
        ))}
      </g>

      {/* Ground */}
      <line x1="30" y1="342" x2="400" y2="342" stroke="#3b5a82" strokeWidth="3" />

      {/* House */}
      <rect x="110" y="190" width="180" height="152" fill="#16273f" stroke="#3b5a82" strokeWidth="3" />
      <path d="M92 192 L200 120 L308 192 Z" fill="#1a365d" stroke="#3b5a82" strokeWidth="3" />

      {/* Loft insulation — dashed band under the roof */}
      <path d="M120 188 L200 134 L280 188" fill="none" stroke="#ffcc00" strokeWidth="6" strokeDasharray="2 8" strokeLinecap="round" />

      {/* Cavity wall insulation — hatched left wall */}
      <rect x="110" y="190" width="14" height="152" fill="#4caf50" opacity="0.25" />
      <g stroke="#4caf50" strokeWidth="2" opacity="0.8">
        {Array.from({ length: 7 }).map((_, i) => (
          <line key={i} x1="110" y1={200 + i * 20} x2="124" y2={192 + i * 20} />
        ))}
      </g>

      {/* Solar panel on the left roof slope */}
      <g transform="translate(120 188) rotate(-33.7)">
        <rect width="86" height="40" rx="2" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="2" />
        <line x1="0" y1="13" x2="86" y2="13" stroke="#3b82f6" strokeWidth="1.5" />
        <line x1="0" y1="27" x2="86" y2="27" stroke="#3b82f6" strokeWidth="1.5" />
        <line x1="29" y1="0" x2="29" y2="40" stroke="#3b82f6" strokeWidth="1.5" />
        <line x1="57" y1="0" x2="57" y2="40" stroke="#3b82f6" strokeWidth="1.5" />
      </g>

      {/* Door */}
      <rect x="150" y="270" width="40" height="72" fill="#1f3553" stroke="#3b5a82" strokeWidth="2" />

      {/* Double-glazed window */}
      <rect x="222" y="232" width="50" height="50" fill="#0c2233" stroke="#38bdf8" strokeWidth="3" />
      <rect x="230" y="240" width="34" height="34" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
      <line x1="247" y1="232" x2="247" y2="282" stroke="#38bdf8" strokeWidth="2" />

      {/* Air-source heat pump */}
      <rect x="330" y="300" width="56" height="42" rx="3" fill="#16273f" stroke="#ff6b00" strokeWidth="3" />
      <circle cx="358" cy="321" r="13" fill="none" stroke="#ff6b00" strokeWidth="2.5" />
      <path d="M358 321 l9 -4 M358 321 l-2 10 M358 321 l-7 -6" stroke="#ff6b00" strokeWidth="2.5" strokeLinecap="round" />

      {/* Callout leader lines + labels */}
      <g>
        {labels.map((l) => (
          <g key={l.text}>
            <line x1={l.fx} y1={l.fy} x2="398" y2={l.y} stroke="#3b5a82" strokeWidth="1.5" />
            <circle cx={l.fx} cy={l.fy} r="4" fill={l.color} />
            <circle cx="402" cy={l.y} r="4" fill={l.color} />
            <text x="414" y={l.y + 5} fill="#cbd5e1" fontSize="18" fontFamily="Inter, sans-serif" fontWeight="600">
              {l.text}
            </text>
          </g>
        ))}
      </g>
    </svg>
  )
}
