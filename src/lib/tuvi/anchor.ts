/**
 * Cung Mệnh (Life palace) and Cung Thân (Body palace) anchors.
 *
 * Classical rule: start at the Dần palace, count FORWARD (lunar month − 1)
 * palaces, then from there count BACKWARD by the hour branch for Mệnh, and
 * FORWARD by the hour branch for Thân.
 */

const DAN = 2 // Dần branch index — palace counting always starts here

export function cungMenhBranch(lunarMonth: number, hourChiIdx: number): number {
  return (((DAN + (lunarMonth - 1) - hourChiIdx) % 12) + 12) % 12
}

export function cungThanBranch(lunarMonth: number, hourChiIdx: number): number {
  return (DAN + (lunarMonth - 1) + hourChiIdx) % 12
}

/**
 * Stem of the palace at a given branch (ngũ hổ độn): the Dần palace's stem
 * is fixed by the year stem — same table as the month rule — and stems
 * increment around the wheel from Dần.
 */
import { MONTH1_CAN_BY_YEAR_CAN } from '../canchi/tables'

export function palaceStem(palaceBranch: number, yearCanIdx: number): number {
  const danStem = MONTH1_CAN_BY_YEAR_CAN[yearCanIdx]
  const stepsFromDan = (((palaceBranch - DAN) % 12) + 12) % 12
  return (danStem + stepsFromDan) % 10
}
