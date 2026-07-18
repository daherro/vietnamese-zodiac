import { useMemo } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { BirthInputForm } from '../components/BirthInputForm'
import { Term } from '../components/Term'
import { ZodiacDiagram } from '../components/ZodiacDiagram'
import { CHI_RELATION_COPY, ELEMENT_RELATION_COPY, TIER_COPY } from '../content/relationships'
import { decodeBirthQuery, encodeBirthQuery, useBirthChart, type BirthQuery } from '../hooks/useBirthChart'
import { compareYearPillars } from '../lib/compatibility/score'

/**
 * Two-person compatibility. Two modes:
 * - both birthdays present (a*, b* params) → joint reveal
 * - only person A present → the share flow: B fills in their own birthday
 */
export function ComparePage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const queryA = useMemo(() => decodeBirthQuery(params, 'a'), [params])
  const queryB = useMemo(() => decodeBirthQuery(params, 'b'), [params])
  const chartA = useBirthChart(queryA)
  const chartB = useBirthChart(queryB)

  if (!chartA) {
    return (
      <main className="page page-narrow">
        <Link className="nav-home" to="/">← Tử Vi</Link>
        <p className="eyebrow">Hợp tuổi · Compatibility</p>
        <h1>First, your own birth date</h1>
        <BirthInputForm
          submitLabel="Continue"
          onSubmit={(q) => navigate(`/compare?${encodeBirthQuery(q, 'a')}`)}
        />
      </main>
    )
  }

  if (!chartB) {
    const shareUrl = `${window.location.origin}/compare?${encodeBirthQuery(chartA.input, 'a')}`
    return (
      <main className="page page-narrow">
        <Link className="nav-home" to="/">← Tử Vi</Link>
        <p className="eyebrow">Hợp tuổi · Compatibility</p>
        <h1>
          {chartA.pillars.year.name} — and who else?
        </h1>
        <p style={{ color: 'var(--muted)' }}>
          Enter their birth date yourself, or send them this link and they
          fill in their own for a joint reveal.
        </p>
        <div className="share-line">
          <input readOnly value={shareUrl} onFocus={(e) => e.target.select()} aria-label="share link" />
          <button
            className="btn btn-ghost"
            onClick={() => navigator.clipboard?.writeText(shareUrl)}
          >
            Copy link
          </button>
        </div>
        <hr className="rule" />
        <BirthInputForm
          compact
          submitLabel="Reveal the pairing"
          onSubmit={(q: BirthQuery) =>
            navigate(
              `/compare?${encodeBirthQuery(chartA.input, 'a')}&${encodeBirthQuery(q, 'b')}`,
            )
          }
        />
      </main>
    )
  }

  const result = compareYearPillars(chartA.pillars.year, chartB.pillars.year)
  const rel = CHI_RELATION_COPY[result.chiRelation]
  const tier = TIER_COPY[result.tier]
  const good = result.score >= 1.5
  const bad = result.score <= -1.5

  return (
    <main className="page">
      <Link className="nav-home" to="/">← Tử Vi</Link>

      <div className="compare-heads">
        <ZodiacDiagram year={chartA.pillars.year} />
        <div className={`connector ${good ? 'good' : bad ? 'bad' : 'mid'}`} aria-hidden>
          {good ? '⟡' : bad ? '⚡' : '·'}
        </div>
        <ZodiacDiagram year={chartB.pillars.year} />
      </div>

      <div className="tier-banner">
        <div className="eyebrow">
          <Term k={rel.label}>{rel.label}</Term>
        </div>
        <div className="tier-label">{tier.label}</div>
        <p style={{ color: 'var(--muted)', maxWidth: 520, margin: '10px auto 0' }}>{tier.text}</p>
      </div>

      <section className="panel page-narrow" style={{ margin: '22px auto 0' }}>
        <h2>Why</h2>
        <p>
          {chartA.pillars.year.chi.name} and {chartB.pillars.year.chi.name}:{' '}
          {rel.text}
        </p>
        <p style={{ color: 'var(--ink-soft)' }}>
          {chartA.pillars.year.napAm.name} meets {chartB.pillars.year.napAm.name}:{' '}
          {ELEMENT_RELATION_COPY[result.elementRelation]}
        </p>
      </section>

      <div style={{ textAlign: 'center', marginTop: 24 }}>
        <Link className="btn btn-ghost" to={`/compare?${encodeBirthQuery(chartA.input, 'a')}`}>
          Compare with someone else
        </Link>
      </div>
    </main>
  )
}
