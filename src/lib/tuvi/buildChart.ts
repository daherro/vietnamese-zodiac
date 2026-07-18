/**
 * Orchestrates a full lá số: anchor → Cục → palaces → stars → Tứ Hóa →
 * Đại Vận. Requires birth time (the hour branch anchors the whole chart);
 * callers must not invoke this without one.
 */

import type { BirthPillars } from '../canchi/pillars'
import { CAN, CHI } from '../canchi/tables'
import { cungMenhBranch, cungThanBranch, palaceStem } from './anchor'
import { cucFromMenh, tuViBranch, type Cuc } from './cuc'
import { PALACES, palaceBranch, type PalaceDef } from './palaces'
import {
  auxStarBranches,
  mainStarBranches,
  tuHoa,
  STAR_NAMES,
  type AuxStarKey,
  type HoaKey,
  type MainStarKey,
} from './stars'

export type Gender = 'nam' | 'nu'

export interface PlacedStar {
  key: MainStarKey | AuxStarKey
  name: string
  kind: 'main' | 'aux'
  /** Tứ Hóa transformation riding on this star, if any. */
  hoa?: HoaKey
}

export interface Palace {
  def: PalaceDef
  branch: number
  branchName: string
  stem: number
  stemName: string
  stars: PlacedStar[]
  /** Age (tuổi mụ) at which this palace's Đại Vận decade begins. */
  daiVanStartAge: number
}

export interface TuViChart {
  cungMenh: number
  cungThan: number
  cuc: Cuc
  palaces: Palace[]
  /** True when Đại Vận runs forward (dương nam / âm nữ). */
  daiVanForward: boolean
  /** Leap-month adjustment applied (day 1–15 → current month, 16+ → next). */
  leapMonthAdjusted: boolean
}

export function buildChart(pillars: BirthPillars, gender: Gender): TuViChart {
  if (!pillars.hour) {
    throw new Error('Tử Vi chart requires a birth hour')
  }

  // Leap-month rule: day 1–15 counts as the current month, 16+ as the next.
  let month = pillars.lunar.month
  let leapMonthAdjusted = false
  if (pillars.lunar.isLeapMonth) {
    leapMonthAdjusted = true
    if (pillars.lunar.day >= 16) {
      month = (month % 12) + 1
    }
  }

  const hourChi = pillars.hour.chi.index
  const yearCan = pillars.year.can.index

  const menh = cungMenhBranch(month, hourChi)
  const than = cungThanBranch(month, hourChi)
  const menhStem = palaceStem(menh, yearCan)
  const cuc = cucFromMenh(menhStem, menh)

  const tuVi = tuViBranch(cuc.number, pillars.lunar.day)
  const mains = mainStarBranches(tuVi)
  const auxes = auxStarBranches(month, hourChi, yearCan)
  const hoa = tuHoa(yearCan)

  // Đại Vận: dương nam / âm nữ run forward, âm nam / dương nữ run backward.
  // First decade starts at the Mệnh palace at age = Cục number (tuổi mụ).
  const yearYang = pillars.year.can.yang
  const daiVanForward = (yearYang && gender === 'nam') || (!yearYang && gender === 'nu')

  const hoaByStar = new Map<string, HoaKey>()
  for (const [k, star] of Object.entries(hoa) as Array<[HoaKey, string]>) {
    hoaByStar.set(star, k)
  }

  const palaces: Palace[] = PALACES.map((def, i) => {
    const branch = palaceBranch(menh, i)
    const stem = palaceStem(branch, yearCan)
    const stars: PlacedStar[] = []
    for (const [key, b] of Object.entries(mains) as Array<[MainStarKey, number]>) {
      if (b === branch)
        stars.push({ key, name: STAR_NAMES[key], kind: 'main', hoa: hoaByStar.get(key) })
    }
    for (const [key, b] of Object.entries(auxes) as Array<[AuxStarKey, number]>) {
      if (b === branch)
        stars.push({ key, name: STAR_NAMES[key], kind: 'aux', hoa: hoaByStar.get(key) })
    }
    // Palace i sits i branches forward of Mệnh. Thuận (forward) walks the
    // branches in increasing order (Mệnh → Phụ Mẫu → …), nghịch the reverse
    // (Mệnh → Huynh Đệ → …); each step is one decade from age = Cục number.
    const steps = daiVanForward ? i : (12 - i) % 12
    const daiVanStartAge = cuc.number + 10 * steps
    return {
      def,
      branch,
      branchName: CHI[branch].name,
      stem,
      stemName: CAN[stem].name,
      stars,
      daiVanStartAge,
    }
  })

  return { cungMenh: menh, cungThan: than, cuc, palaces, daiVanForward, leapMonthAdjusted }
}
