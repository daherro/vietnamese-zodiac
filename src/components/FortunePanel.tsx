import { useState } from 'react'
import { AREA_LABELS, DRIVER_LABELS, FORTUNE_COPY, TIER_LABELS } from '../content/fortune'
import { CHI_RELATION_COPY } from '../content/relationships'
import type { Pillar } from '../lib/canchi/pillars'
import { monthFortune, yearFortune, type PeriodFortune } from '../lib/fortune/period'
import { Term } from './Term'

/**
 * Fortune with the period picker and — crucially — the reasoning shown in
 * the open: "this month is Ất Mùi, Mùi forms Lục Hợp with your Ngọ…"
 */
export function FortunePanel({ year }: { year: Pillar }) {
  const now = new Date()
  const [scope, setScope] = useState<'month' | 'year'>('month')
  const [offset, setOffset] = useState(0)

  let fortune: PeriodFortune
  let periodLabel: string
  if (scope === 'year') {
    const target = now.getFullYear() + offset
    fortune = yearFortune(year, target)
    periodLabel = `${target}`
  } else {
    const d = new Date(now.getFullYear(), now.getMonth() + offset, 15)
    fortune = monthFortune(year, d.getDate(), d.getMonth() + 1, d.getFullYear())
    periodLabel = d.toLocaleString('en', { month: 'long', year: 'numeric' })
  }

  const rel = CHI_RELATION_COPY[fortune.chiRelation]

  return (
    <section className="panel">
      <h2>Vận hạn · Fortune</h2>
      <p className="panel-sub">
        Reckoned from the Can-Chi interaction between your năm sinh and the period:
        the classical lưu niên method, not a random horoscope.
      </p>

      <div className="laso-toggle">
        <button className={scope === 'month' ? 'btn' : 'btn btn-ghost'} onClick={() => { setScope('month'); setOffset(0) }}>
          Tháng · Month
        </button>
        <button className={scope === 'year' ? 'btn' : 'btn btn-ghost'} onClick={() => { setScope('year'); setOffset(0) }}>
          Năm · Year
        </button>
        <button className="btn btn-ghost" onClick={() => setOffset((o) => o - 1)} aria-label="previous period">
          ←
        </button>
        <button className="btn btn-ghost" onClick={() => setOffset((o) => o + 1)} aria-label="next period">
          →
        </button>
      </div>

      <div className="tier-banner">
        <div className="eyebrow">{periodLabel} · {fortune.period.name}</div>
        <div className={`tier-label t ${fortune.overall}`}>
          {TIER_LABELS[fortune.overall].vi} · {TIER_LABELS[fortune.overall].en}
        </div>
      </div>

      <div className="fortune-areas">
        {fortune.areas.map((a) => (
          <div className="fortune-area" key={a.area}>
            <div className="a">
              {AREA_LABELS[a.area].vi} · {AREA_LABELS[a.area].en}
            </div>
            <div className={`t ${a.tier}`}>{TIER_LABELS[a.tier].en}</div>
            {DRIVER_LABELS[a.driver] && (
              <div className="eyebrow" style={{ fontSize: 10, marginTop: 2 }}>
                {DRIVER_LABELS[a.driver]}
              </div>
            )}
            <p style={{ fontSize: 13, color: 'var(--muted)', margin: '6px 0 0' }}>
              {FORTUNE_COPY[a.area][a.tier]}
            </p>
          </div>
        ))}
      </div>

      <p className="reasoning">
        Why: this period is <b>{fortune.period.name}</b>. {fortune.period.chi.name} forms{' '}
        <Term k={rel.label}>{rel.label}</Term> with your {year.chi.name}, and its element (
        {fortune.period.napAm.name}) {describeElement(fortune.elementRelation)} your bản mệnh (
        {year.napAm.name}).
      </p>
    </section>
  )
}

function describeElement(rel: PeriodFortune['elementRelation']): string {
  switch (rel) {
    case 'sinh-b-to-a':
      return 'nourishes'
    case 'sinh-a-to-b':
      return 'is fed by'
    case 'khac-b-to-a':
      return 'presses on'
    case 'khac-a-to-b':
      return 'is held in check by'
    case 'same':
      return 'mirrors'
    case 'neutral':
      return 'sits neutrally beside'
  }
}
