/**
 * The EPC band ladder — the homepage's hero graphic, replacing the old
 * interactive house cross-section.
 *
 * It earns its place by carrying the page's argument rather than decorating it:
 * the bands are the real SAP ranges, D is marked because that is where most
 * older UK housing sits, and C is marked because that is the band the whole
 * service exists to reach. The gap between the two IS the product.
 *
 * Colours are the conventional EPC scale (A green → G red). That is a
 * deliberate exception to the site palette: people recognise it from their own
 * certificate, and inventing our own colours for a regulated rating would be
 * confusing at best.
 */

// SAP point ranges as published on an EPC.
const BANDS = [
  { band: 'A', range: '92–100', width: 100, bg: '#008054', text: '#fff' },
  { band: 'B', range: '81–91', width: 92, bg: '#19b459', text: '#fff' },
  { band: 'C', range: '69–80', width: 84, bg: '#8dce46', text: '#14200f' },
  { band: 'D', range: '55–68', width: 74, bg: '#ffd500', text: '#241a05' },
  { band: 'E', range: '39–54', width: 64, bg: '#fcaa65', text: '#241a05' },
  { band: 'F', range: '21–38', width: 54, bg: '#ef8023', text: '#fff' },
  { band: 'G', range: '1–20', width: 44, bg: '#e9153b', text: '#fff' },
]

export default function EpcBandLadder({ className = '' }) {
  return (
    <figure
      className={`rounded-xl border border-white/10 bg-white/[0.04] p-5 ${className}`}
      aria-labelledby="ladder-caption"
    >
      <figcaption id="ladder-caption" className="mb-4 flex items-center justify-between">
        <span className="spec text-white/60">Energy rating</span>
        <span className="font-mono text-xs text-white/40">SAP score</span>
      </figcaption>

      <div className="flex flex-col gap-1.5">
        {BANDS.map((b) => {
          const isTarget = b.band === 'C'
          const isTypical = b.band === 'D'
          return (
            <div key={b.band} className="flex items-center gap-3">
              <div
                className={`flex items-center justify-between rounded px-3 py-2 font-mono text-xs font-semibold transition-all ${
                  isTarget ? 'ring-2 ring-white ring-offset-2 ring-offset-navy' : ''
                }`}
                style={{
                  width: `${b.width}%`,
                  backgroundColor: b.bg,
                  color: b.text,
                  opacity: isTarget || isTypical ? 1 : 0.55,
                }}
              >
                <span>
                  {b.band} · {b.range}
                </span>
              </div>

              {isTarget && (
                <span className="shrink-0 whitespace-nowrap font-mono text-[0.68rem] font-bold uppercase tracking-widest text-white">
                  ← Target
                </span>
              )}
              {isTypical && (
                <span className="shrink-0 whitespace-nowrap font-mono text-[0.68rem] uppercase tracking-widest text-white/50">
                  ← Typical older home
                </span>
              )}
            </div>
          )
        })}
      </div>

      <p className="mt-4 border-t border-white/10 pt-3 text-xs leading-relaxed text-white/50">
        Most homes built before 1990 sit at D or below. Moving up to C is usually a fabric-first
        job — insulation and draught-proofing before new heating.
      </p>
    </figure>
  )
}
