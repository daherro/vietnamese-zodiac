import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { FortunePanel } from '../components/FortunePanel'
import { PillarsSummary } from '../components/PillarsSummary'
import { Reveal } from '../components/Reveal'
import { TraitsPanel } from '../components/TraitsPanel'
import { TuViChartView } from '../components/TuViChart'
import { ZodiacDiagram } from '../components/ZodiacDiagram'
import { decodeBirthQuery, encodeBirthQuery, useBirthChart } from '../hooks/useBirthChart'

export function ResultPage() {
  const [params] = useSearchParams()
  const query = useMemo(() => decodeBirthQuery(params), [params])
  const chart = useBirthChart(query)
  const [revealed, setRevealed] = useState(false)

  if (!chart) {
    return (
      <main className="page page-narrow">
        <p>That link is missing a birth date.</p>
        <Link className="btn" to="/">
          Start over
        </Link>
      </main>
    )
  }

  if (!revealed) {
    return (
      <main className="page page-narrow">
        <Reveal chart={chart} onDone={() => setRevealed(true)} />
      </main>
    )
  }

  const compareLink = `/compare?${encodeBirthQuery(chart.input, 'a')}`

  return (
    <main className="page page-narrow">
      <Link className="nav-home" to="/">
        ← Tử Vi
      </Link>

      <ZodiacDiagram year={chart.pillars.year} />
      <PillarsSummary pillars={chart.pillars} />

      {chart.chart ? (
        <TuViChartView chart={chart.chart} personName={chart.pillars.year.name} />
      ) : (
        <section className="panel">
          <div className="unlock-note">
            Add your birth time to unlock the full lá số Tử Vi — the hour
            branch anchors the whole chart, so without it the 12 palaces
            can't be cast. <Link to="/" style={{ color: 'var(--gold-soft)' }}>Re-enter with a time →</Link>
          </div>
        </section>
      )}

      <TraitsPanel year={chart.pillars.year} />
      <FortunePanel year={chart.pillars.year} />

      <section className="panel" style={{ textAlign: 'center' }}>
        <h2>Hợp tuổi · Compatibility</h2>
        <p className="panel-sub">
          See how your sign sits with someone else's: Tam Hợp allies, Tứ Hành
          Xung frictions, and the element story between your bản mệnh.
        </p>
        <Link className="btn" to={compareLink}>
          Compare with someone
        </Link>
      </section>
    </main>
  )
}
