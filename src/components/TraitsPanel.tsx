import { ANIMAL_CONTENT } from '../content/animals'
import { ELEMENT_CONTENT } from '../content/elements'
import type { Pillar } from '../lib/canchi/pillars'

export function TraitsPanel({ year }: { year: Pillar }) {
  const animal = ANIMAL_CONTENT[year.chi.index]
  const element = ELEMENT_CONTENT[year.napAm.element]
  return (
    <section className="panel">
      <h2>Tính cách · Character</h2>
      <p className="panel-sub">{animal.essence}</p>
      <p>{animal.portrait}</p>
      <p style={{ color: 'var(--ink-soft)' }}>{element.overlay}</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
        <div>
          <p className="eyebrow">Điểm mạnh · Strengths</p>
          <ul className="trait-list">
            {animal.strengths.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="eyebrow">Điểm nghịch · Frictions</p>
          <ul className="trait-list">
            {animal.frictions.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
