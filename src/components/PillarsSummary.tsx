import type { BirthPillars } from '../lib/canchi/pillars'
import { Term } from './Term'

export function PillarsSummary({ pillars }: { pillars: BirthPillars }) {
  const cards = [
    { k: 'Năm · Year', p: pillars.year },
    { k: 'Tháng · Month', p: pillars.month },
    { k: 'Ngày · Day', p: pillars.day },
    ...(pillars.hour ? [{ k: 'Giờ · Hour', p: pillars.hour }] : []),
  ]
  return (
    <section className="panel">
      <h2>
        <Term k="Tứ trụ">Tứ trụ</Term> · Your pillars
      </h2>
      <p className="panel-sub">
        The <Term k="Can Chi">Can-Chi</Term> of your birth year, month, day
        {pillars.hour ? ', and hour' : ' — add a birth time for the hour pillar'}.
        {pillars.dayRolledForward && ' (Born after 23:00 — the day rolls forward to the next Tý hour.)'}
      </p>
      <div className="pillars">
        {cards.map(({ k, p }) => (
          <div className="pillar-card" key={k}>
            <div className="k">{k}</div>
            <div className="v">{p.name}</div>
            <div className="m">
              {p.napAm.name}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
