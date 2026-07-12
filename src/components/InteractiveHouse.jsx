import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Check, PoundSterling, Leaf, Gauge, Clock, ArrowRight } from 'lucide-react'

/**
 * The interactive house — the centrepiece of the site.
 * Click any part of the home to see how it can be insulated / upgraded:
 * what the measure is, indicative cost, annual £ and carbon saving, EPC uplift.
 * Added measures build a running "retrofit plan" (we survey, then facilitate installs).
 *
 * All figures are INDICATIVE for a typical older UK home and are confirmed by survey.
 */

export const TONE = {
  peak: '#B0342A',
  hot: '#E4572E',
  warm: '#E8B23A',
  cool: '#2C6E9C',
}

export const MEASURES = [
  {
    id: 'loft',
    n: 1,
    label: 'Loft & roof insulation',
    tone: 'hot',
    loss: '~25% of heat',
    tagline: 'The cheapest big win in most homes.',
    what: 'Top up to 270mm of mineral wool at ceiling level, or insulate at the rafters for a warm loft or room-in-roof. Warm air rises, so an uninsulated roof is where you lose it fastest.',
    cost: '£400 – £1,500',
    saving: 355,
    carbon: 720,
    epc: '+4 to +8 pts',
    disruption: 'Low · ~1 day',
    grant: null,
    pin: { x: 340, y: 150 },
  },
  {
    id: 'walls',
    n: 2,
    label: 'Wall insulation',
    tone: 'peak',
    loss: '~35% of heat',
    tagline: 'Your biggest single heat-loss area.',
    what: 'Cavity walls are filled with mineral-wool or bonded bead. Solid walls are insulated internally (IWI) or externally (EWI) with a new render finish. The survey confirms which wall type you have.',
    cost: '£1,000 – £15,000',
    saving: 330,
    carbon: 690,
    epc: '+5 to +15 pts',
    disruption: 'Low–High · 1–10 days',
    grant: 'ECO4 / GBIS grants may apply',
    pin: { x: 161, y: 300 },
  },
  {
    id: 'floor',
    n: 3,
    label: 'Underfloor insulation',
    tone: 'warm',
    loss: '~10% of heat',
    tagline: 'Ends cold floors and floor-level draughts.',
    what: 'Insulation is fitted beneath suspended timber floors, or laid over a solid floor during renovation. Often combined with sealing the perimeter gap where floor meets skirting.',
    cost: '£1,200 – £5,000',
    saving: 110,
    carbon: 230,
    epc: '+2 to +4 pts',
    disruption: 'Medium · 1–3 days',
    grant: null,
    pin: { x: 300, y: 430 },
  },
  {
    id: 'glazing',
    n: 4,
    label: 'Windows, doors & draughts',
    tone: 'hot',
    loss: '~20% of heat',
    tagline: 'Comfort you feel the same day.',
    what: 'A-rated double or triple glazing and insulated doors, plus draught-proofing to gaps, letterboxes and floorboards. Secondary glazing is used where windows are protected or listed.',
    cost: '£300 – £12,000',
    saving: 175,
    carbon: 330,
    epc: '+3 to +8 pts',
    disruption: 'Low–Medium',
    grant: null,
    pin: { x: 446, y: 246 },
  },
  {
    id: 'heating',
    n: 5,
    label: 'Heat pump & controls',
    tone: 'cool',
    loss: 'Heat source',
    tagline: 'Low-carbon heat, sized to your home.',
    what: 'Replace a gas or oil boiler with an air-source heat pump — sized to the improved fabric, with correctly-sized radiators and smart controls. Most efficient once insulation is in place.',
    cost: '£7,000 – £13,000',
    saving: 250,
    carbon: 1500,
    epc: '+ up to 10 pts',
    disruption: 'Medium · 2–4 days',
    grant: '£7,500 Boiler Upgrade Scheme grant',
    pin: { x: 586, y: 404 },
  },
  {
    id: 'ventilation',
    n: 6,
    label: 'Ventilation & airtightness',
    tone: 'warm',
    loss: '~15% of heat',
    tagline: 'Fresh air, no condensation, no damp.',
    what: 'Seal uncontrolled draughts, then add controlled ventilation — trickle vents, humidity-sensing extract fans, or whole-house MVHR. Essential whenever a home is made more airtight (PAS 2035).',
    cost: '£500 – £6,000',
    saving: 90,
    carbon: 180,
    epc: '—',
    disruption: 'Low–Medium',
    grant: null,
    pin: { x: 558, y: 246 },
  },
  {
    id: 'solar',
    n: 7,
    label: 'Solar PV & battery',
    tone: 'cool',
    loss: 'Generation',
    tagline: 'Make your own electricity.',
    what: 'Roof-mounted solar panels with an optional battery to generate and store low-carbon electricity — a natural pairing with a heat pump to cut running costs further.',
    cost: '£5,000 – £11,000',
    saving: 400,
    carbon: 900,
    epc: '+ up to 12 pts',
    disruption: 'Low · 1–2 days',
    grant: '0% VAT until 2027',
    pin: { x: 206, y: 116 },
  },
]

const byId = Object.fromEntries(MEASURES.map((m) => [m.id, m]))

export default function InteractiveHouse() {
  const [selectedId, setSelectedId] = useState('walls')
  const [hovered, setHovered] = useState(null)
  const [planned, setPlanned] = useState(() => new Set())

  const selected = selectedId ? byId[selectedId] : null

  const togglePlan = (id) =>
    setPlanned((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  const plannedList = MEASURES.filter((m) => planned.has(m.id))
  const totalSaving = plannedList.reduce((s, m) => s + m.saving, 0)
  const totalCarbon = plannedList.reduce((s, m) => s + m.carbon, 0)

  const styleFor = (id) => {
    const m = byId[id]
    const isPlanned = planned.has(id)
    const isSel = selectedId === id
    const isHov = hovered === id
    const color = isPlanned ? '#3E9A63' : TONE[m.tone]
    const fillOpacity = isPlanned ? 0.45 : isSel ? 0.42 : isHov ? 0.3 : 0.17
    const strokeWidth = isSel ? 2.6 : isHov ? 2 : 1.4
    return { fill: color, fillOpacity, stroke: color, strokeWidth, strokeLinejoin: 'round' }
  }

  const labelFor = hovered || selectedId

  return (
    <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr] lg:gap-8">
      {/* ---- The house panel ---- */}
      <div className="relative overflow-hidden rounded-xl border border-white/10 bg-navy bg-blueprint shadow-lift">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-3">
          <span className="spec text-white/70">Fig. 01 — Heat loss in a typical UK home</span>
          <span className="hidden items-center gap-2 text-[0.7rem] text-white/50 sm:flex">
            <span className="h-2 w-2 rounded-full" style={{ background: TONE.peak }} /> High loss
            <span className="ml-2 h-2 w-2 rounded-full bg-moss-soft" /> Upgraded
          </span>
        </div>

        <HouseSvg
          styleFor={styleFor}
          onSelect={setSelectedId}
          onHover={setHovered}
          selectedId={selectedId}
          planned={planned}
          labelFor={labelFor}
        />

        <p className="px-5 pb-4 text-center text-xs text-white/50">
          Tap a part of the house to see how it can be upgraded.
        </p>
      </div>

      {/* ---- Detail + plan panel ---- */}
      <div className="flex flex-col gap-4">
        <div className="card flex min-h-[320px] flex-col p-6">
          {selected ? (
            <div key={selected.id} className="flex flex-1 flex-col animate-fade-in">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="spec text-ember">
                    {String(selected.n).padStart(2, '0')} · {selected.loss}
                  </span>
                  <h3 className="mt-1 text-2xl font-bold leading-tight text-ink">
                    {selected.label}
                  </h3>
                  <p className="mt-0.5 text-sm font-medium text-ink-soft">{selected.tagline}</p>
                </div>
                <span
                  className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ background: planned.has(selected.id) ? '#2E7D4F' : TONE[selected.tone] }}
                >
                  {planned.has(selected.id) ? <Check size={18} /> : selected.n}
                </span>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-ink-soft">{selected.what}</p>

              <dl className="mt-5 grid grid-cols-2 gap-3">
                <Stat icon={PoundSterling} label="Indicative cost" value={selected.cost} />
                <Stat icon={Gauge} label="EPC uplift" value={selected.epc} />
                <Stat
                  icon={Leaf}
                  label="Typical saving"
                  value={`£${selected.saving}/yr`}
                  sub={`${selected.carbon} kg CO₂/yr`}
                />
                <Stat icon={Clock} label="Disruption" value={selected.disruption} />
              </dl>

              {selected.grant && (
                <p className="mt-4 rounded border border-moss/30 bg-moss/[0.07] px-3 py-2 font-mono text-[0.72rem] font-medium text-moss-deep">
                  ✓ {selected.grant}
                </p>
              )}

              <div className="mt-auto flex flex-wrap gap-2 pt-5">
                <button
                  type="button"
                  onClick={() => togglePlan(selected.id)}
                  className={
                    planned.has(selected.id)
                      ? 'btn border border-moss/40 bg-moss/10 px-4 py-2.5 text-sm text-moss-deep'
                      : 'btn-primary px-4 py-2.5 text-sm'
                  }
                >
                  {planned.has(selected.id) ? (
                    <>
                      <Check size={16} /> Added to plan
                    </>
                  ) : (
                    <>
                      <Plus size={16} /> Add to my plan
                    </>
                  )}
                </button>
                <Link to="/contact" className="btn-outline px-4 py-2.5 text-sm">
                  Book a survey
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex flex-1 flex-col items-start justify-center">
              <h3 className="text-2xl font-bold text-ink">Explore your home</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                Tap any part of the house to see how it can be insulated or upgraded — what it is,
                what it costs, and what you'll save.
              </p>
            </div>
          )}
        </div>

        {/* Running plan */}
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <span className="spec text-ink-faint">My retrofit plan</span>
            <span className="font-mono text-xs text-ink-faint">
              {plannedList.length} {plannedList.length === 1 ? 'measure' : 'measures'}
            </span>
          </div>

          {plannedList.length === 0 ? (
            <p className="mt-3 text-sm text-ink-soft">
              Add measures from the house to build a plan. We survey the whole home, then facilitate
              the installs.
            </p>
          ) : (
            <>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {plannedList.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedId(m.id)}
                    className="inline-flex items-center gap-1 rounded-full border border-moss/30 bg-moss/[0.08] px-2.5 py-1 text-xs font-medium text-moss-deep hover:bg-moss/15"
                  >
                    {m.label}
                  </button>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-paper px-3 py-2.5">
                  <div className="font-mono text-lg font-semibold tabular-nums text-ink">
                    £{totalSaving.toLocaleString()}
                    <span className="text-xs font-normal text-ink-faint">/yr</span>
                  </div>
                  <div className="spec mt-0.5 text-ink-faint">Est. saving</div>
                </div>
                <div className="rounded-lg bg-paper px-3 py-2.5">
                  <div className="font-mono text-lg font-semibold tabular-nums text-ink">
                    {(totalCarbon / 1000).toFixed(1)}
                    <span className="text-xs font-normal text-ink-faint"> t CO₂/yr</span>
                  </div>
                  <div className="spec mt-0.5 text-ink-faint">Carbon cut</div>
                </div>
              </div>
              <Link to="/contact" className="btn-primary mt-4 w-full py-3 text-sm">
                Book a survey for these measures <ArrowRight size={16} />
              </Link>
            </>
          )}
          <p className="mt-3 font-mono text-[0.65rem] leading-relaxed text-ink-faint">
            Indicative figures for a typical older home — your survey confirms the numbers.
          </p>
        </div>
      </div>
    </div>
  )
}

function Stat({ icon: Icon, label, value, sub }) {
  return (
    <div className="rounded-lg bg-paper px-3 py-2.5">
      <div className="flex items-center gap-1.5 text-ink-faint">
        <Icon size={13} />
        <span className="spec">{label}</span>
      </div>
      <div className="mt-1 text-sm font-semibold text-ink">{value}</div>
      {sub && <div className="font-mono text-[0.68rem] text-ink-faint">{sub}</div>}
    </div>
  )
}

/* ---------------------------------------------------------------- */
/* The SVG cross-section                                            */
/* ---------------------------------------------------------------- */

function Zone({ id, label, planned, onSelect, onHover, style, children }) {
  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={`${label}${planned ? ' — added to plan' : ''}`}
      className="cursor-pointer outline-none [&>*]:transition-all [&>*]:duration-200"
      onClick={() => onSelect(id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect(id)
        }
      }}
      onMouseEnter={() => onHover(id)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(id)}
      onBlur={() => onHover(null)}
    >
      <title>{label}</title>
      {typeof children === 'function' ? children(style) : children}
    </g>
  )
}

function HouseSvg({ styleFor, onSelect, onHover, selectedId, planned, labelFor }) {
  const stroke = '#B7C9DA'
  const label = labelFor ? byId[labelFor] : null

  return (
    <svg
      viewBox="0 0 680 500"
      className="w-full"
      role="group"
      aria-label="Cross-section of a house. Select a part to see how it can be upgraded."
    >
      {/* Base drawing (non-interactive) */}
      <g fill="none" stroke={stroke} strokeWidth="2" pointerEvents="none">
        {/* Ground + hatch */}
        <line x1="44" y1="440" x2="636" y2="440" strokeWidth="2.5" />
        <g strokeWidth="1" opacity="0.32">
          {Array.from({ length: 12 }).map((_, i) => (
            <line key={i} x1={58 + i * 48} y1="440" x2={46 + i * 48} y2="452" />
          ))}
        </g>

        {/* Roof + chimney (decorative — nothing vents through it) */}
        <path d="M132 192 L340 88 L548 192" strokeLinejoin="round" />
        <path d="M460 148 L460 114 L480 114 L480 158" strokeLinejoin="round" opacity="0.8" />
        <rect x="455" y="106" width="30" height="8" rx="1.5" opacity="0.8" />

        {/* Shell */}
        <rect x="150" y="190" width="380" height="250" />
        {/* inner wall faces */}
        <line x1="172" y1="190" x2="172" y2="440" opacity="0.5" />
        <line x1="508" y1="190" x2="508" y2="440" opacity="0.5" />
        {/* mid floor between storeys */}
        <line x1="172" y1="294" x2="508" y2="294" />
        <line x1="172" y1="306" x2="508" y2="306" opacity="0.4" />
        {/* ground-floor slab top */}
        <line x1="172" y1="424" x2="508" y2="424" opacity="0.65" />

        {/* room labels */}
        <text x="196" y="252" fill={stroke} stroke="none" fontSize="10.5" fontFamily="'IBM Plex Mono', monospace" opacity="0.42">
          BEDROOM
        </text>
        <text x="360" y="290" fill={stroke} stroke="none" fontSize="10.5" fontFamily="'IBM Plex Mono', monospace" opacity="0.42">
          BATHROOM
        </text>
        <text x="292" y="376" fill={stroke} stroke="none" fontSize="10.5" fontFamily="'IBM Plex Mono', monospace" opacity="0.42">
          LIVING ROOM
        </text>

        {/* window mullions (show through the translucent glazing tint) */}
        <g strokeWidth="1.5" opacity="0.5">
          <line x1="234" y1="220" x2="234" y2="272" />
          <line x1="210" y1="246" x2="258" y2="246" />
          <line x1="446" y1="220" x2="446" y2="272" />
          <line x1="422" y1="246" x2="470" y2="246" />
          <line x1="446" y1="336" x2="446" y2="398" />
          <line x1="422" y1="367" x2="470" y2="367" />
        </g>
        {/* door handle */}
        <circle cx="252" cy="390" r="2.5" fill={stroke} stroke="none" opacity="0.7" />

        {/* radiators (under the windows) */}
        <rect x="431" y="278" width="30" height="14" rx="1.5" opacity="0.55" />
        <rect x="300" y="406" width="34" height="16" rx="1.5" opacity="0.55" />
        {/* heat-pump flow/return to wall */}
        <line x1="530" y1="406" x2="548" y2="406" opacity="0.55" />
      </g>

      {/* ---- Interactive zones (tinted over the drawing) ---- */}

      {/* Floor */}
      <Zone id="floor" label="Underfloor insulation" planned={planned.has('floor')} onSelect={onSelect} onHover={onHover} style={styleFor('floor')}>
        {(s) => <rect x="172" y="424" width="336" height="16" {...s} />}
      </Zone>

      {/* Walls (two side strips) */}
      <Zone id="walls" label="Wall insulation" planned={planned.has('walls')} onSelect={onSelect} onHover={onHover} style={styleFor('walls')}>
        {(s) => (
          <g {...s} fillOpacity={Math.min(s.fillOpacity + 0.12, 0.6)}>
            <rect x="150" y="190" width="22" height="250" />
            <rect x="508" y="190" width="22" height="250" />
          </g>
        )}
      </Zone>

      {/* Loft: soft heat glow across the roof space + insulation batt at ceiling level */}
      <Zone id="loft" label="Loft & roof insulation" planned={planned.has('loft')} onSelect={onSelect} onHover={onHover} style={styleFor('loft')}>
        {(s) => (
          <g>
            <path d="M140 192 L340 90 L540 192 Z" {...s} strokeWidth="1.2" />
            <rect x="172" y="172" width="336" height="16" rx="2" {...s} fillOpacity={Math.min(s.fillOpacity + 0.22, 0.68)} />
          </g>
        )}
      </Zone>

      {/* Windows, doors & draughts */}
      <Zone id="glazing" label="Windows, doors & draughts" planned={planned.has('glazing')} onSelect={onSelect} onHover={onHover} style={styleFor('glazing')}>
        {(s) => (
          <g {...s} fillOpacity={Math.min(s.fillOpacity + 0.08, 0.55)}>
            <rect x="210" y="220" width="48" height="52" />
            <rect x="422" y="220" width="48" height="52" />
            <rect x="422" y="336" width="48" height="62" />
            <rect x="212" y="352" width="50" height="72" />
          </g>
        )}
      </Zone>

      {/* Heat pump (outdoor unit beside the house) */}
      <Zone id="heating" label="Heat pump & controls" planned={planned.has('heating')} onSelect={onSelect} onHover={onHover} style={styleFor('heating')}>
        {(s) => <rect x="548" y="388" width="74" height="52" rx="3" {...s} fillOpacity={Math.min(s.fillOpacity + 0.08, 0.55)} />}
      </Zone>

      {/* Ventilation: extract fan through the bathroom wall + trickle vents above windows */}
      <Zone id="ventilation" label="Ventilation & airtightness" planned={planned.has('ventilation')} onSelect={onSelect} onHover={onHover} style={styleFor('ventilation')}>
        {(s) => (
          <g>
            {/* generous invisible hit areas */}
            <rect x="498" y="224" width="56" height="44" fill="transparent" stroke="none" />
            <rect x="214" y="204" width="40" height="18" fill="transparent" stroke="none" />
            <rect x="426" y="204" width="40" height="18" fill="transparent" stroke="none" />
            <rect x="426" y="320" width="40" height="18" fill="transparent" stroke="none" />
            {/* extract fan mounted through the external wall */}
            <rect x="508" y="232" width="22" height="28" rx="2" {...s} fillOpacity={Math.min(s.fillOpacity + 0.1, 0.55)} />
            <circle cx="519" cy="246" r="8.5" {...s} fillOpacity={Math.min(s.fillOpacity + 0.22, 0.7)} />
            {/* trickle vents sitting on the window heads */}
            <rect x="222" y="213" width="24" height="5" rx="1.5" {...s} fillOpacity={Math.min(s.fillOpacity + 0.25, 0.75)} />
            <rect x="434" y="213" width="24" height="5" rx="1.5" {...s} fillOpacity={Math.min(s.fillOpacity + 0.25, 0.75)} />
            <rect x="434" y="329" width="24" height="5" rx="1.5" {...s} fillOpacity={Math.min(s.fillOpacity + 0.25, 0.75)} />
          </g>
        )}
      </Zone>

      {/* Solar (sitting just above the left roof plane) */}
      <Zone id="solar" label="Solar PV & battery" planned={planned.has('solar')} onSelect={onSelect} onHover={onHover} style={styleFor('solar')}>
        {(s) => (
          <g transform="translate(176.4 150.8) rotate(-26.57)">
            <rect x="-6" y="-8" width="122" height="30" fill="transparent" stroke="none" />
            <rect x="0" y="0" width="110" height="14" rx="1.5" {...s} fillOpacity={Math.min(s.fillOpacity + 0.18, 0.62)} />
          </g>
        )}
      </Zone>

      {/* ---- Detail decoration on top (non-interactive) ---- */}
      {/* solar cell dividers + mounting feet */}
      <g pointerEvents="none" transform="translate(176.4 150.8) rotate(-26.57)" stroke="#0D1B2A" strokeWidth="1" opacity="0.3">
        <line x1="27.5" y1="0" x2="27.5" y2="14" />
        <line x1="55" y1="0" x2="55" y2="14" />
        <line x1="82.5" y1="0" x2="82.5" y2="14" />
      </g>
      <g pointerEvents="none" transform="translate(176.4 150.8) rotate(-26.57)" stroke={stroke} strokeWidth="1.6" opacity="0.6">
        <line x1="18" y1="14" x2="18" y2="18" />
        <line x1="92" y1="14" x2="92" y2="18" />
      </g>
      {/* extract-fan blades + louvre grille outside the wall */}
      <g pointerEvents="none" stroke={stroke} strokeWidth="1.3" fill="none" opacity="0.8">
        <path d="M519 246 l6 -2 M519 246 l-2 6 M519 246 l-5 -5" strokeLinecap="round" />
        <g opacity="0.6">
          <line x1="534" y1="240" x2="545" y2="240" />
          <line x1="534" y1="246" x2="545" y2="246" />
          <line x1="534" y1="252" x2="545" y2="252" />
        </g>
      </g>
      {/* heat-pump fan + louvres */}
      <g pointerEvents="none" stroke={stroke} strokeWidth="1.4" fill="none" opacity="0.7">
        <circle cx="572" cy="405" r="15" />
        <path d="M572 405 l10 -3 M572 405 l-3 11 M572 405 l-8 -8" strokeLinecap="round" />
        <g opacity="0.5">
          <line x1="594" y1="398" x2="616" y2="398" />
          <line x1="594" y1="405" x2="616" y2="405" />
          <line x1="594" y1="412" x2="616" y2="412" />
        </g>
      </g>

      {/* ---- Pins ---- */}
      {MEASURES.map((m) => {
        const isPlanned = planned.has(m.id)
        const isSel = selectedId === m.id
        const color = isPlanned ? '#3E9A63' : TONE[m.tone]
        return (
          <g key={m.id} pointerEvents="none" transform={`translate(${m.pin.x} ${m.pin.y})`}>
            {isSel && (
              <circle r="11" fill="none" stroke={color} strokeWidth="2" className="origin-center animate-pulse-ring" />
            )}
            <circle r="11" fill={color} stroke="#0D1B2A" strokeWidth="2" />
            {isPlanned ? (
              <path d="M-4 0 l3 3 l6 -6" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            ) : (
              <text textAnchor="middle" y="4" fontSize="12" fontWeight="700" fill="#fff" fontFamily="'IBM Plex Mono', monospace">
                {m.n}
              </text>
            )}
          </g>
        )
      })}

      {/* ---- Floating label for hovered / selected ---- */}
      {label && (
        <FloatingLabel
          x={label.pin.x}
          y={label.pin.y}
          text={label.label}
          color={planned.has(label.id) ? '#3E9A63' : TONE[label.tone]}
        />
      )}
    </svg>
  )
}

function FloatingLabel({ x, y, text, color }) {
  const w = text.length * 7.6 + 22
  const below = y < 90
  const ly = below ? y + 22 : y - 40
  let lx = x - w / 2
  lx = Math.max(8, Math.min(lx, 680 - w - 8))
  return (
    <g pointerEvents="none" className="animate-fade-in">
      <rect x={lx} y={ly} width={w} height="26" rx="5" fill="#0D1B2A" stroke={color} strokeWidth="1.5" />
      <text x={lx + w / 2} y={ly + 17} textAnchor="middle" fontSize="12.5" fontWeight="600" fill="#fff" fontFamily="'Hanken Grotesk', sans-serif">
        {text}
      </text>
    </g>
  )
}
