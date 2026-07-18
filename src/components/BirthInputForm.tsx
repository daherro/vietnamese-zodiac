import { useMemo, useState } from 'react'
import type { BirthQuery } from '../hooks/useBirthChart'
import type { Gender } from '../lib/tuvi/buildChart'

interface Props {
  onSubmit: (q: BirthQuery) => void
  submitLabel?: string
  /** Compact mode for the compare page's second form. */
  compact?: boolean
}

const MIN_YEAR = 1800
const MAX_YEAR = 2199

const MONTH_NAMES = [
  'T1 · Jan', 'T2 · Feb', 'T3 · Mar', 'T4 · Apr',
  'T5 · May', 'T6 · Jun', 'T7 · Jul', 'T8 · Aug',
  'T9 · Sep', 'T10 · Oct', 'T11 · Nov', 'T12 · Dec',
]

function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate()
}

/**
 * Three plain <select>s instead of <input type="date">. Native date pickers
 * hand month/year navigation entirely to the OS — on some mobile browsers,
 * changing the month or year closes the picker and snaps the day back to
 * a default, with no way for the page to fix that behavior. Separate
 * dropdowns sidestep the native widget altogether and are also just faster
 * for a birth year that's often decades back from today.
 */
export function BirthInputForm({ onSubmit, submitLabel = 'Xem lá số · Reveal my chart', compact }: Props) {
  const currentYear = new Date().getFullYear()
  const [day, setDay] = useState('')
  const [month, setMonth] = useState('')
  const [year, setYear] = useState('')
  const [knowsTime, setKnowsTime] = useState(false)
  const [time, setTime] = useState('')
  const [gender, setGender] = useState<Gender | ''>('')
  const [error, setError] = useState<string | null>(null)

  const yearOptions = useMemo(() => {
    const years: number[] = []
    for (let y = Math.min(currentYear, MAX_YEAR); y >= MIN_YEAR; y--) years.push(y)
    return years
  }, [currentYear])

  const maxDay = month && year ? daysInMonth(Number(year), Number(month)) : 31
  const dayOptions = useMemo(() => Array.from({ length: maxDay }, (_, i) => i + 1), [maxDay])

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!day || !month || !year) {
      setError('Enter your birth date.')
      return
    }
    const q: BirthQuery = { year: Number(year), month: Number(month), day: Math.min(Number(day), maxDay) }
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
      <div className="dob-field">
        <label className="dob-label">Ngày sinh · Birth date (dương lịch / solar calendar)</label>
        <div className="dob-row">
          <select
            aria-label="Day"
            value={day}
            onChange={(e) => setDay(e.target.value)}
            required
          >
            <option value="" disabled>Ngày · Day</option>
            {dayOptions.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <select
            aria-label="Month"
            value={month}
            onChange={(e) => {
              const m = e.target.value
              setMonth(m)
              if (day && year && Number(day) > daysInMonth(Number(year), Number(m))) {
                setDay(String(daysInMonth(Number(year), Number(m))))
              }
            }}
            required
          >
            <option value="" disabled>Tháng · Month</option>
            {MONTH_NAMES.map((name, i) => (
              <option key={i} value={i + 1}>{name}</option>
            ))}
          </select>
          <select
            aria-label="Year"
            value={year}
            onChange={(e) => {
              const y = e.target.value
              setYear(y)
              if (day && month && Number(day) > daysInMonth(Number(y), Number(month))) {
                setDay(String(daysInMonth(Number(y), Number(month))))
              }
            }}
            required
          >
            <option value="" disabled>Năm · Year</option>
            {yearOptions.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

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
