/**
 * Can-Chi pillar derivation for year, month, day, and hour.
 *
 * Year boundary is Tết (lunar new year) — the standard for the Vietnamese
 * zodiac and Tử Vi. (Strict Bát Tự would use Lập Xuân, ~Feb 4; deliberate
 * divergence, documented here.) A birth on Jan 15 1996 is therefore Ất Hợi
 * (Pig), not Bính Tý — the pillar is computed from the LUNAR year of the
 * converted birth date, never from the Gregorian year directly.
 */

import { jdFromDate, jdToDate, solarToLunar, type LunarDate } from '../calendar/lunarConvert'
import {
  CAN,
  CHI,
  MONTH1_CAN_BY_YEAR_CAN,
  TY_HOUR_CAN_BY_DAY_CAN,
  cycleIndex,
  napAm,
  type Can,
  type Chi,
  type NapAm,
} from './tables'

export interface Pillar {
  can: Can
  chi: Chi
  /** 60-cycle index, 0 = Giáp Tý */
  cycle: number
  napAm: NapAm
  /** e.g. "Bính Tý" */
  name: string
}

export interface BirthPillars {
  lunar: LunarDate
  year: Pillar
  month: Pillar
  day: Pillar
  /** Present only when birth time was provided. */
  hour?: Pillar
  /**
   * True when a 23:00–23:59 birth rolled the day pillar forward to the
   * next day's Tý hour (the majority-school convention).
   */
  dayRolledForward: boolean
}

function makePillar(canIdx: number, chiIdx: number): Pillar {
  const cycle = cycleIndex(canIdx, chiIdx)
  return {
    can: CAN[canIdx],
    chi: CHI[chiIdx],
    cycle,
    napAm: napAm(cycle),
    name: `${CAN[canIdx].name} ${CHI[chiIdx].name}`,
  }
}

/** Year pillar from a LUNAR year (call with lunar.year, not the Gregorian year). */
export function yearPillar(lunarYear: number): Pillar {
  const canIdx = (((lunarYear - 4) % 10) + 10) % 10
  const chiIdx = (((lunarYear - 4) % 12) + 12) % 12
  return makePillar(canIdx, chiIdx)
}

/**
 * Month pillar from the lunar month + year Can (ngũ hổ độn rule).
 * Keyed off the lunar month for v1; strict Bát Tự keys months off solar
 * terms (tiết khí) instead — flagged follow-up, not silently wrong.
 * Month Chi is fixed: month 1 = Dần (index 2), incrementing from there.
 */
export function monthPillar(lunarMonth: number, yearCanIdx: number): Pillar {
  const chiIdx = (lunarMonth + 1) % 12
  const month1Can = MONTH1_CAN_BY_YEAR_CAN[yearCanIdx]
  const canIdx = (month1Can + (lunarMonth - 1)) % 10
  return makePillar(canIdx, chiIdx)
}

/**
 * Day pillar from the Gregorian date via Julian day number (mod 60 from a
 * known Giáp Tý epoch). Independent of the lunar calendar entirely.
 * JDN 2415021 (1900-01-01) was a Giáp Tuất day, cycle index 10; hence
 * the (jd + 9) % 60 + 1 style anchor below, verified against almanacs:
 * 1900-01-01 = Giáp Tuất → (2415021 + 49) % 60 = 10 ✓
 */
export function dayPillar(dd: number, mm: number, yy: number): Pillar {
  const jd = jdFromDate(dd, mm, yy)
  const cycle = (jd + 49) % 60
  return makePillar(cycle % 10, cycle % 12)
}

/** Hour Chi index from a local hour (0–23). Tý spans 23:00–00:59. */
export function hourChiIndex(hour: number): number {
  return Math.floor(((hour + 1) % 24) / 2)
}

/**
 * Hour pillar from the local birth hour + the (possibly rolled) day Can
 * (ngũ thử độn rule).
 */
export function hourPillar(hour: number, dayCanIdx: number): Pillar {
  const chiIdx = hourChiIndex(hour)
  const tyCan = TY_HOUR_CAN_BY_DAY_CAN[dayCanIdx]
  const canIdx = (tyCan + chiIdx) % 10
  return makePillar(canIdx, chiIdx)
}

export interface BirthInput {
  day: number
  month: number
  year: number
  /** Local hour 0–23; omit if birth time unknown. */
  hour?: number
  /** Minutes, defaults 0; only used to keep the input shape honest. */
  minute?: number
}

/** Build all pillars for a birth moment. The one entry point the app uses. */
export function birthPillars(input: BirthInput): BirthPillars {
  let { day, month, year } = input
  let dayRolledForward = false

  // 23:00–23:59 births belong to the NEXT day's Tý hour: roll the civil
  // date forward before computing day pillar and lunar date.
  if (input.hour !== undefined && input.hour === 23) {
    const jd = jdFromDate(day, month, year) + 1
    const next = jdToDate(jd)
    day = next.day
    month = next.month
    year = next.year
    dayRolledForward = true
  }

  const lunar = solarToLunar(day, month, year)
  const yp = yearPillar(lunar.year)
  const mp = monthPillar(lunar.month, yp.can.index)
  const dp = dayPillar(day, month, year)
  const hp = input.hour !== undefined ? hourPillar(input.hour, dp.can.index) : undefined

  return { lunar, year: yp, month: mp, day: dp, hour: hp, dayRolledForward }
}
