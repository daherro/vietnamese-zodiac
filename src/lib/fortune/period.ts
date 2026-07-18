/**
 * Fortune by period (lưu niên / lưu nguyệt influence): the classical
 * popular method — the relationship between the person's year pillar
 * (Chi + nạp âm bản mệnh) and the target period's own Can-Chi.
 *
 * Life areas are differentiated on the Bát Tự Thập Thần (Ten Gods) logic:
 * the DIRECTION of the element relationship, not just its sign, decides
 * which life area it activates —
 *   period sinh mệnh   → Ấn (resource): backing, learning, recovery
 *   mệnh sinh period   → Thực Thương (output): expression, but drains
 *   mệnh khắc period   → Tài (wealth): "what you overcome is your wealth"
 *   period khắc mệnh   → Quan Sát (authority): pressure, tests, strain
 *   same element       → Tỉ Kiếp (peers): allies who also compete
 * The Chi relationship (hợp/xung/hại) governs the interpersonal weather.
 *
 * Honest scope: this is the Can-Chi interaction layer, not the deep Tử Vi
 * Đại Vận/Tiểu Vận transit analysis. The UI labels it as such.
 */

import { yearPillar, monthPillar, type Pillar } from '../canchi/pillars'
import { solarToLunar } from '../calendar/lunarConvert'
import { chiRelation, type ChiRelation } from '../compatibility/relationships'
import { elementRelation, type ElementRelation } from '../compatibility/score'

export type LifeArea = 'career' | 'love' | 'health' | 'wealth'
export type FortuneTier = 'favorable' | 'steady' | 'guarded'

/** The Thập Thần role the period's element plays relative to the person. */
export type ThapThan = 'an' | 'thuc-thuong' | 'tai' | 'quan-sat' | 'ti-kiep' | 'none'

export interface AreaFortune {
  area: LifeArea
  tier: FortuneTier
  /** Which factor pushed this area hardest: a Chi relation or the Thập Thần. */
  driver: ChiRelation | ThapThan
}

export interface PeriodFortune {
  /** The period's own pillar (lunar year or lunar month). */
  period: Pillar
  scope: 'year' | 'month'
  chiRelation: ChiRelation
  elementRelation: ElementRelation
  thapThan: ThapThan
  overall: FortuneTier
  areas: AreaFortune[]
}

const CHI_WEIGHT: Record<ChiRelation, number> = {
  'tam-hop': 2,
  'luc-hop': 1.5,
  same: 0.5,
  neutral: 0,
  'luc-hai': -1.5,
  'tu-hanh-xung': -1.5,
  'luc-xung': -2,
}

const THAP_THAN_FOR: Record<ElementRelation, ThapThan> = {
  'sinh-b-to-a': 'an',
  'sinh-a-to-b': 'thuc-thuong',
  'khac-a-to-b': 'tai',
  'khac-b-to-a': 'quan-sat',
  same: 'ti-kiep',
  neutral: 'none',
}

/** Overall-tier element weight (single number, sign-based, as before). */
function elementWeight(rel: ElementRelation): number {
  switch (rel) {
    case 'sinh-b-to-a':
      return 1.5
    case 'sinh-a-to-b':
      return 0.5
    case 'same':
      return 0.5
    case 'neutral':
      return 0
    case 'khac-a-to-b':
      return 0.5 // Tài: exertion, but classically an opportunity signal
    case 'khac-b-to-a':
      return -1.5
  }
}

/**
 * Per-area Chi weights: the Chi relationship is interpersonal weather, so
 * it lands hardest on love and career (alliances), lighter elsewhere.
 * Lục Hại hits love hardest (the classical marriage-harm reading);
 * Lục Xung means upheaval across the board.
 */
const CHI_AREA: Record<ChiRelation, Record<LifeArea, number>> = {
  'tam-hop': { career: 1, love: 1, health: 0.5, wealth: 0.5 },
  'luc-hop': { career: 0.5, love: 1.5, health: 0.5, wealth: 0.5 },
  same: { career: 0.5, love: 0, health: 0, wealth: -0.5 },
  neutral: { career: 0, love: 0, health: 0, wealth: 0 },
  'tu-hanh-xung': { career: -0.5, love: -1, health: -0.5, wealth: -0.5 },
  'luc-hai': { career: -1, love: -1.5, health: -0.5, wealth: -0.5 },
  'luc-xung': { career: -1, love: -1.5, health: -1, wealth: -0.5 },
}

/**
 * Per-area Thập Thần weights — the directional element logic that actually
 * differentiates the four cards:
 *   Ấn nourishes health/career; Thực Thương favors expression (love,
 *   visible work) but drains the body; Tài activates wealth; Quan Sát
 *   pressures health and wallet hardest; Tỉ Kiếp helps career, splits wealth.
 */
const THAP_THAN_AREA: Record<ThapThan, Record<LifeArea, number>> = {
  an: { career: 1, love: 0.5, health: 1, wealth: 0 },
  'thuc-thuong': { career: 0.5, love: 1, health: -1, wealth: 0.5 },
  tai: { career: 0.5, love: 0, health: -0.5, wealth: 1.5 },
  'quan-sat': { career: -0.5, love: -0.5, health: -1.5, wealth: -1 },
  'ti-kiep': { career: 0.5, love: 0, health: 0.5, wealth: -1 },
  none: { career: 0, love: 0, health: 0, wealth: 0 },
}

function tierFor(score: number): FortuneTier {
  if (score >= 1) return 'favorable'
  if (score > -1) return 'steady'
  return 'guarded'
}

function areaTiers(chiRel: ChiRelation, thapThan: ThapThan): AreaFortune[] {
  const areas: LifeArea[] = ['career', 'love', 'health', 'wealth']
  return areas.map((area) => {
    const chiPart = CHI_AREA[chiRel][area]
    const elPart = THAP_THAN_AREA[thapThan][area]
    const driver = Math.abs(elPart) > Math.abs(chiPart) ? thapThan : chiRel
    return { area, tier: tierFor(chiPart + elPart), driver }
  })
}

/** Fortune for a target lunar year, e.g. 2026 (Bính Ngọ). */
export function yearFortune(person: Pillar, targetLunarYear: number): PeriodFortune {
  const period = yearPillar(targetLunarYear)
  return periodFortune(person, period, 'year')
}

/**
 * Fortune for the lunar month containing a solar date. The month pillar is
 * derived exactly as a birth month pillar would be (ngũ hổ độn off the
 * period year's Can).
 */
export function monthFortune(
  person: Pillar,
  solarDay: number,
  solarMonth: number,
  solarYear: number,
): PeriodFortune {
  const lunar = solarToLunar(solarDay, solarMonth, solarYear)
  const py = yearPillar(lunar.year)
  const period = monthPillar(lunar.month, py.can.index)
  return periodFortune(person, period, 'month')
}

function periodFortune(person: Pillar, period: Pillar, scope: 'year' | 'month'): PeriodFortune {
  const chiRel = chiRelation(person.chi.index, period.chi.index)
  const elRel = elementRelation(person.napAm.element, period.napAm.element)
  const thapThan = THAP_THAN_FOR[elRel]
  const score = CHI_WEIGHT[chiRel] + elementWeight(elRel)
  return {
    period,
    scope,
    chiRelation: chiRel,
    elementRelation: elRel,
    thapThan,
    overall: tierFor(score),
    areas: areaTiers(chiRel, thapThan),
  }
}
