import { useState } from 'react'
import type { BirthQuery } from '../hooks/useBirthChart'
import type { Gender } from '../lib/tuvi/buildChart'

interface Props {
  onSubmit: (q: BirthQuery) => void
  submitLabel?: string
  /** Compact mode for the compare page's second form. */
  compact?: boolean
}

export function BirthInputForm({ onSubmit, submitLabel = 'Xem lá số · Reveal my chart', compact }: Props) {
  const [date, setDate] = useState('')
  const [knowsTime, setKnowsTime] = useState(false)
  const [time, setTime] = useState('')
  const [gender, setGender] = useState<Gender | ''>('')
  const [error, setError] = useState<string | null>(null)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date)
    if (!m) {
      setError('Enter your birth date.')
      return
    }
    const year = Number(m[1])
    if (year < 1800 || year > 2199) {
      setError('Dates between 1800 and 2199 are supported.')
      return
    }
    const q: BirthQuery = { year, month: Number(m[2]), day: Number(m[3]) }
    if (knowsTime && time) {
      const tm = /^(\d{2}):(\d{2})$/.exec(time)
      if (tm) {
        q.hour = Number(tm[1])
        q.minute = Number(tm[2])
        if (!gender) {
          setError('Gender is needed to cast the full lá số (it sets the Đại Vận direction).')
          return
        }
        q.gender = gender
      }
    }
    setError(null)
    onSubmit(q)
  }

  return (
    <form className="birth-form" onSubmit={submit}>
      <label>
        Ngày sinh · Birth date (dương lịch / solar calendar)
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          min="1800-01-01"
          max="2199-12-31"
          required
        />
      </label>

      <div className="toggle-line">
        <input
          id={compact ? 'knows-time-b' : 'knows-time'}
          type="checkbox"
          checked={knowsTime}
          onChange={(e) => setKnowsTime(e.target.checked)}
        />
        <label htmlFor={compact ? 'knows-time-b' : 'knows-time'}>
          I know my birth time (unlocks the full Tử Vi chart)
        </label>
      </div>

      {knowsTime && (
        <div className="row">
          <label>
            Giờ sinh · Birth time
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </label>
          <label>
            Giới tính · Gender (sets the Đại Vận direction)
            <select value={gender} onChange={(e) => setGender(e.target.value as Gender | '')}>
              <option value="">—</option>
              <option value="nam">Nam · Male</option>
              <option value="nu">Nữ · Female</option>
            </select>
          </label>
        </div>
      )}

      {error && <p style={{ color: 'var(--vermilion-soft)', margin: 0, fontSize: 14 }}>{error}</p>}

      <button className="btn" type="submit">
        {submitLabel}
      </button>
    </form>
  )
}
