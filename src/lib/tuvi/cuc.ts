/**
 * Ngũ Hành Cục — the chart's "element bureau", the central mechanism that
 * links the Mệnh palace to the Tử Vi star's position.
 *
 * Derivation: Mệnh palace stem + branch → nạp âm element → Cục number:
 * Thủy nhị cục (2), Mộc tam cục (3), Kim tứ cục (4), Thổ ngũ cục (5),
 * Hỏa lục cục (6).
 */

import { cycleIndex, napAm, type Element } from '../canchi/tables'

export const CUC_NUMBER: Record<Element, number> = {
  thuy: 2,
  moc: 3,
  kim: 4,
  tho: 5,
  hoa: 6,
}

export const CUC_NAME: Record<Element, string> = {
  thuy: 'Thủy nhị cục',
  moc: 'Mộc tam cục',
  kim: 'Kim tứ cục',
  tho: 'Thổ ngũ cục',
  hoa: 'Hỏa lục cục',
}

export interface Cuc {
  element: Element
  number: number
  name: string
}

export function cucFromMenh(menhStem: number, menhBranch: number): Cuc {
  const element = napAm(cycleIndex(menhStem, menhBranch)).element
  return { element, number: CUC_NUMBER[element], name: CUC_NAME[element] }
}

/**
 * Tử Vi star's palace branch from Cục number + lunar day.
 *
 * Classical rule: find the smallest multiple of Cục ≥ day. Count that many
 * steps minus one forward from Dần, then adjust by the shortfall (delta):
 * even delta steps forward, odd delta steps backward.
 * Verified against the canonical position table: day 1 → Sửu (thủy),
 * Thìn (mộc), Hợi (kim), Ngọ (thổ), Dậu (hỏa).
 */
export function tuViBranch(cucNumber: number, lunarDay: number): number {
  const n = Math.ceil(lunarDay / cucNumber)
  const delta = n * cucNumber - lunarDay
  const base = 2 + (n - 1) // count forward from Dần
  const pos = delta % 2 === 0 ? base + delta : base - delta
  return ((pos % 12) + 12) % 12
}
