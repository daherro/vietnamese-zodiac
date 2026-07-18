import { useNavigate } from 'react-router-dom'
import { BirthInputForm } from '../components/BirthInputForm'
import { encodeBirthQuery, type BirthQuery } from '../hooks/useBirthChart'
import { Term } from '../components/Term'

export function InputPage() {
  const navigate = useNavigate()

  function submit(q: BirthQuery) {
    navigate(`/result?${encodeBirthQuery(q)}`)
  }

  return (
    <main className="page page-narrow">
      <div style={{ textAlign: 'center', padding: '40px 0 32px' }}>
        <p className="eyebrow">Tử Vi · Vietnamese Zodiac</p>
        <h1 style={{ fontSize: 'clamp(34px, 6vw, 52px)', margin: '0 0 12px' }}>
          Lá số của bạn
        </h1>
        <p style={{ color: 'var(--muted)', maxWidth: 480, margin: '0 auto' }}>
          Twelve animals, five elements, and a sky full of stars. Enter your
          birth date — the <Term k="Âm lịch">âm lịch</Term> does the rest.
        </p>
      </div>
      <BirthInputForm onSubmit={submit} />
      <p style={{ color: 'var(--muted-deep)', fontSize: 12, textAlign: 'center', marginTop: 24 }}>
        Everything is computed in your browser. Nothing is stored.
      </p>
    </main>
  )
}
