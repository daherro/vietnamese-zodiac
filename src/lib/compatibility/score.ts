/**
 * Compatibility scoring between two people, the way Vietnamese popular
 * astrology actually reckons it: the Chi relationship (Tam Hợp / Lục Hợp /
 * xung) combined with the nạp âm bản mệnh element interaction (sinh/khắc
 * on the 60-cycle "destiny element", NOT the raw stem element — e.g. a
 * Bính Tý 1996 person is Giản Hạ Thủy, water, even though Bính is a fire
 * stem).
 */

import { KHAC, SINH, type Element } from '../canchi/tables'
import type { Pillar } from '../canchi/pillars'
import { chiRelation, type ChiRelation } from './relationships'

export type ElementRelation =
  | 'sinh-a-to-b' // A's element nourishes B's
  | 'sinh-b-to-a' // B's element nourishes A's
  | 'khac-a-to-b' // A's element overcomes B's
  | 'khac-b-to-a' // B's element overcomes A's
  | 'same'
  | 'neutral'

export function elementRelation(a: Element, b: Element): ElementRelation {
  if (a === b) return 'same'
  if (SINH[a] === b) return 'sinh-a-to-b'
  if (SINH[b] === a) return 'sinh-b-to-a'
  if (KHAC[a] === b) return 'khac-a-to-b'
  if (KHAC[b] === a) return 'khac-b-to-a'
  return 'neutral'
}

export type CompatTier =
  | 'tam-hop' // exceptional
  | 'hoa-hop' // harmonious
  | 'binh-hoa' // neutral / workable
  | 'xung-khac' // challenging
  | 'dai-xung' // strongest friction

export interface CompatibilityResult {
  tier: CompatTier
  /** -4 … +4 raw score, for ordering/visual intensity only (never shown as a %) */
  score: number
  chiRelation: ChiRelation
  elementRelation: ElementRelation
  /** Machine-readable reasoning parts the UI turns into transparent copy. */
  reasons: string[]
}

const CHI_SCORE: Record<ChiRelation, number> = {
  'tam-hop': 3,
  'luc-hop': 2,
  same: 1,
  neutral: 0,
  'luc-hai': -1.5, // insidious but less violent than an outright xung
  'tu-hanh-xung': -2,
  'luc-xung': -3,
}

function elementScore(rel: ElementRelation): number {
  switch (rel) {
    case 'sinh-a-to-b':
    case 'sinh-b-to-a':
      return 1
    case 'same':
      return 0.5
    case 'neutral':
      return 0
    case 'khac-a-to-b':
    case 'khac-b-to-a':
      return -1
  }
}

function tierFor(score: number): CompatTier {
  if (score >= 3) return 'tam-hop'
  if (score >= 1.5) return 'hoa-hop'
  if (score > -1.5) return 'binh-hoa'
  if (score > -3) return 'xung-khac'
  return 'dai-xung'
}

/** Compare two people by their YEAR pillars (the popular bản mệnh basis). */
export function compareYearPillars(a: Pillar, b: Pillar): CompatibilityResult {
  const chiRel = chiRelation(a.chi.index, b.chi.index)
  const elRel = elementRelation(a.napAm.element, b.napAm.element)
  const score = CHI_SCORE[chiRel] + elementScore(elRel)

  const reasons: string[] = []
  reasons.push(`chi:${chiRel}:${a.chi.name}:${b.chi.name}`)
  reasons.push(`napam:${elRel}:${a.napAm.name}:${b.napAm.name}`)

  return { tier: tierFor(score), score, chiRelation: chiRel, elementRelation: elRel, reasons }
}
