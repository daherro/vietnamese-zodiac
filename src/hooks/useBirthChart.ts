/**
 * One result object for the whole app: pillars always; lá số only when a
 * birth hour (and gender) was given. Also owns the URL param encoding so
 * results and comparisons are shareable links.
 */

import { useMemo } from 'react'
import { birthPillars, type BirthInput, type BirthPillars } from '../lib/canchi/pillars'
import { buildChart, type Gender, type TuViChart } from '../lib/tuvi/buildChart'

export interface BirthQuery extends BirthInput {
  gender?: Gender
}

export interface BirthChart {
  input: BirthQuery
  pillars: BirthPillars
  chart?: TuViChart
}

export function computeBirthChart(input: BirthQuery): BirthChart {
  const pillars = birthPillars(input)
  const chart =
    input.hour !== undefined && input.gender
      ? buildChart(pillars, input.gender)
      : undefined
  return { input, pillars, chart }
}

export function useBirthChart(input: BirthQuery | null): BirthChart | null {
  return useMemo(() => (input ? computeBirthChart(input) : null), [input])
}

/** Encode a birth query into URL search params (d=YYYY-MM-DD, t=HH:MM, g=nam|nu). */
export function encodeBirthQuery(q: BirthQuery, prefix = ''): URLSearchParams {
  const p = new URLSearchParams()
  const pad = (n: number) => String(n).padStart(2, '0')
  p.set(`${prefix}d`, `${q.year}-${pad(q.month)}-${pad(q.day)}`)
  if (q.hour !== undefined) p.set(`${prefix}t`, `${pad(q.hour)}:${pad(q.minute ?? 0)}`)
  if (q.gender) p.set(`${prefix}g`, q.gender)
  return p
}

/** Decode a birth query from URL search params; null if absent/invalid. */
export function decodeBirthQuery(params: URLSearchParams, prefix = ''): BirthQuery | null {
  const d = params.get(`${prefix}d`)
  if (!d) return null
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(d)
  if (!m) return null
  const year = Number(m[1])
  const month = Number(m[2])
  const day = Number(m[3])
  if (year < 1800 || year > 2199 || month < 1 || month > 12 || day < 1 || day > 31)
    return null

  const q: BirthQuery = { day, month, year }
  const t = params.get(`${prefix}t`)
  if (t) {
    const tm = /^(\d{2}):(\d{2})$/.exec(t)
    if (tm) {
      const hour = Number(tm[1])
      if (hour >= 0 && hour <= 23) {
        q.hour = hour
        q.minute = Number(tm[2])
      }
    }
  }
  const g = params.get(`${prefix}g`)
  if (g === 'nam' || g === 'nu') q.gender = g
  return q
}
