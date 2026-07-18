import { useState } from 'react'
import { STAR_MEANINGS } from '../content/tuviStars'
import type { Palace, TuViChart as Chart } from '../lib/tuvi/buildChart'
import { HOA_NAMES } from '../lib/tuvi/stars'
import { Term } from './Term'

/**
 * The lá số. Two presentations: the traditional 4×4 grid (authentic
 * layout: 12 palaces around a center box) and a circular wheel. Palaces
 * tap-to-expand into a detail drawer — the mobile answer to a dense chart.
 *
 * Deliberately no opacity-from-zero entrance animations here: chart
 * content must be readable even when JS animation frames never run
 * (background tabs, reduced-motion, snapshots).
 */

/**
 * Traditional lá số layout: branch → [col, row] in the 4×4 grid.
 * Tỵ Ngọ Mùi Thân across the top; Thìn/Dậu, Mão/Tuất on the sides;
 * Dần Sửu Tý Hợi across the bottom.
 */
const GRID_POS: Record<number, [number, number]> = {
  5: [1, 1], 6: [2, 1], 7: [3, 1], 8: [4, 1],
  4: [1, 2], 9: [4, 2],
  3: [1, 3], 10: [4, 3],
  2: [1, 4], 1: [2, 4], 0: [3, 4], 11: [4, 4],
}

export function TuViChartView({ chart, personName }: { chart: Chart; personName: string }) {
  const [mode, setMode] = useState<'grid' | 'wheel'>('grid')
  const [selected, setSelected] = useState<Palace | null>(null)

  return (
    <section className="panel">
      <h2>
        <Term k="Lá số">Lá số</Term> <Term k="Tử Vi Đẩu Số">Tử Vi</Term>
      </h2>
      <p className="panel-sub">
        <Term k="Cung Mệnh">Cung Mệnh</Term> in {chart.palaces[0].branchName} ·{' '}
        <Term k="Ngũ Hành Cục">{chart.cuc.name}</Term> ·{' '}
        <Term k="Đại Vận">Đại Vận</Term> {chart.daiVanForward ? 'thuận (forward)' : 'nghịch (reverse)'}
        {chart.leapMonthAdjusted && ' · leap-month adjusted'}
      </p>

      <div className="laso-toggle" role="tablist">
        <button
          className={mode === 'grid' ? 'btn' : 'btn btn-ghost'}
          onClick={() => setMode('grid')}
          role="tab"
          aria-selected={mode === 'grid'}
        >
          Truyền thống · Grid
        </button>
        <button
          className={mode === 'wheel' ? 'btn' : 'btn btn-ghost'}
          onClick={() => setMode('wheel')}
          role="tab"
          aria-selected={mode === 'wheel'}
        >
          Vòng tròn · Wheel
        </button>
      </div>

      {mode === 'grid' ? (
        <div className="laso-grid">
          {chart.palaces.map((p) => {
            const [col, row] = GRID_POS[p.branch]
            const isMenh = p.branch === chart.cungMenh
            const isThan = p.branch === chart.cungThan
            return (
              <div
                key={p.def.key}
                className={`laso-cell${isMenh ? ' menh' : ''}${isThan ? ' than' : ''}`}
                style={{ gridColumn: col, gridRow: row }}
                onClick={() => setSelected(p)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setSelected(p)}
                aria-label={`${p.def.name} palace, ${p.branchName}`}
              >
                <div className="palace-name">
                  {p.def.name}
                  {isThan && ' (Thân)'}
                </div>
                <div className="branch">
                  {p.stemName} {p.branchName}
                </div>
                <ul className="stars">
                  {p.stars.map((s) => (
                    <li key={s.key} className={s.kind}>
                      {s.name}
                      {s.hoa && <span className="hoa"> {HOA_NAMES[s.hoa]}</span>}
                    </li>
                  ))}
                </ul>
                <div className="dai-van">Đại Vận {p.daiVanStartAge}–{p.daiVanStartAge + 9}</div>
              </div>
            )
          })}
          <div className="laso-center">
            <div className="name">{personName}</div>
            <div className="meta">{chart.cuc.name}</div>
            <div className="meta">
              Mệnh: {chart.palaces[0].branchName} · Thân:{' '}
              {chart.palaces.find((p) => p.branch === chart.cungThan)?.branchName}
            </div>
          </div>
        </div>
      ) : (
        <Wheel chart={chart} onSelect={setSelected} />
      )}

      {selected && <PalaceDetail palace={selected} onClose={() => setSelected(null)} />}

      <p className="reasoning">
        Star placement follows the common Vietnamese school; the Tứ Hóa rows
        for Canh and Nhâm years vary between traditions.
      </p>
    </section>
  )
}

/** Annular sector path between angles a1→a2 (radians), radii r1<r2. */
function sectorPath(cx: number, cy: number, r1: number, r2: number, a1: number, a2: number): string {
  const p = (r: number, a: number) => `${cx + r * Math.cos(a)} ${cy + r * Math.sin(a)}`
  return [
    `M ${p(r1, a1)}`,
    `A ${r1} ${r1} 0 0 1 ${p(r1, a2)}`,
    `L ${p(r2, a2)}`,
    `A ${r2} ${r2} 0 0 0 ${p(r2, a1)}`,
    'Z',
  ].join(' ')
}

function Wheel({ chart, onSelect }: { chart: Chart; onSelect: (p: Palace) => void }) {
  const C = 300
  const R1 = 120
  const R2 = 292
  return (
    <div className="laso-wheel">
      <svg viewBox="0 0 600 600" role="img" aria-label="Tử Vi wheel chart">
        {chart.palaces.map((p) => {
          // Sector centered on the branch position: Tý at the bottom,
          // branches proceeding counterclockwise (traditional orientation).
          const centerDeg = 90 - p.branch * -30
          const a1 = ((centerDeg - 15) * Math.PI) / 180
          const a2 = ((centerDeg + 15) * Math.PI) / 180
          const mid = ((centerDeg) * Math.PI) / 180
          const isMenh = p.branch === chart.cungMenh
          const isThan = p.branch === chart.cungThan
          const labelR = R1 + (R2 - R1) * 0.78
          const starR = R1 + (R2 - R1) * 0.42
          const lx = C + labelR * Math.cos(mid)
          const ly = C + labelR * Math.sin(mid)
          const mains = p.stars.filter((s) => s.kind === 'main')
          return (
            <g key={p.def.key} onClick={() => onSelect(p)} style={{ cursor: 'pointer' }}>
              <path
                d={sectorPath(C, C, R1, R2, a1, a2)}
                fill={isMenh ? 'rgba(224, 180, 92, 0.10)' : 'var(--bg-raised)'}
                stroke={isMenh ? 'var(--gold)' : isThan ? 'var(--celadon-deep)' : 'var(--rule-soft)'}
              />
              <text x={lx} y={ly - 6} textAnchor="middle" fontSize="15" fill="var(--gold-soft)" fontWeight="600">
                {p.def.name}
              </text>
              <text x={lx} y={ly + 10} textAnchor="middle" fontSize="11" fill="var(--muted)">
                {p.stemName} {p.branchName}
              </text>
              {mains.slice(0, 2).map((s, si) => (
                <text
                  key={s.key}
                  x={C + starR * Math.cos(mid)}
                  y={C + starR * Math.sin(mid) + si * 14 - (mains.length > 1 ? 7 : 0)}
                  textAnchor="middle"
                  fontSize="11"
                  fill={s.hoa ? 'var(--vermilion-soft)' : 'var(--ink-bright)'}
                >
                  {s.name}
                </text>
              ))}
              {mains.length > 2 && (
                <text x={C + starR * Math.cos(mid)} y={C + starR * Math.sin(mid) + 21} textAnchor="middle" fontSize="10" fill="var(--muted)">
                  +{mains.length - 2}
                </text>
              )}
            </g>
          )
        })}
        <circle cx={C} cy={C} r={R1 - 4} fill="var(--bg-inset)" stroke="var(--rule)" />
        <text x={C} y={C - 8} textAnchor="middle" fontSize="19" fill="var(--ink-bright)" fontFamily="var(--font-display)">
          {chart.cuc.name}
        </text>
        <text x={C} y={C + 14} textAnchor="middle" fontSize="11" fill="var(--muted)">
          tap a palace for detail
        </text>
      </svg>
    </div>
  )
}

function PalaceDetail({ palace, onClose }: { palace: Palace; onClose: () => void }) {
  return (
    <div className="palace-detail">
      <h3>
        Cung {palace.def.name} · {palace.def.en} — {palace.stemName} {palace.branchName}
      </h3>
      <div className="dai-van" style={{ color: 'var(--muted)', fontSize: 12 }}>
        Governs ages {palace.daiVanStartAge}–{palace.daiVanStartAge + 9} (Đại Vận)
      </div>
      {palace.stars.length === 0 && (
        <p className="star-line">No major stars here — this palace borrows from its opposite.</p>
      )}
      {palace.stars.map((s) => (
        <p className="star-line" key={s.key}>
          <b>{s.name}</b>
          {s.hoa && <span style={{ color: 'var(--vermilion-soft)' }}> · {HOA_NAMES[s.hoa]}</span>}
          <br />
          {STAR_MEANINGS[s.key]}
        </p>
      ))}
      <button className="btn btn-ghost" onClick={onClose}>
        Close
      </button>
    </div>
  )
}
