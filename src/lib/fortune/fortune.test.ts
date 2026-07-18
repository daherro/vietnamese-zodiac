import { describe, expect, it } from 'vitest'
import { yearPillar } from '../canchi/pillars'
import { monthFortune, yearFortune } from './period'

describe('yearFortune', () => {
  it('flags a lục xung year as guarded', () => {
    // Bính Tý person (Tý) vs lunar 2026 Bính Ngọ (Ngọ) — direct opposition
    const f = yearFortune(yearPillar(1996), 2026)
    expect(f.period.name).toBe('Bính Ngọ')
    expect(f.chiRelation).toBe('luc-xung')
    expect(f.overall).toBe('guarded')
  })

  it('flags a tam hợp year favorably', () => {
    // Tý person vs Giáp Thìn 2024 — Thân–Tý–Thìn trine
    const f = yearFortune(yearPillar(1996), 2024)
    expect(f.chiRelation).toBe('tam-hop')
    expect(f.overall).toBe('favorable')
  })

  it('always yields all four life areas with defined tiers and drivers', () => {
    for (let y = 2024; y < 2036; y++) {
      const f = yearFortune(yearPillar(1996), y)
      expect(f.areas).toHaveLength(4)
      for (const a of f.areas) {
        expect(a.tier).toBeDefined()
        expect(a.driver).toBeDefined()
      }
    }
  })

  it('differentiates life areas — tiers are not uniform across a 12-year cycle', () => {
    // The old engine stamped one tier on all four areas nearly every period.
    // Across a full Chi cycle, at least some periods must show mixed tiers.
    let mixedPeriods = 0
    for (let y = 2024; y < 2036; y++) {
      const f = yearFortune(yearPillar(1996), y)
      const tiers = new Set(f.areas.map((a) => a.tier))
      if (tiers.size > 1) mixedPeriods++
    }
    expect(mixedPeriods).toBeGreaterThanOrEqual(4)
  })

  it('mệnh khắc period reads as the Tài (wealth) signal, concentrated in wealth', () => {
    // Person: 1996 Bính Tý, Giản Hạ Thủy (water). Find a year whose nạp âm
    // is fire (thủy khắc hỏa) with a neutral-or-better Chi relation, and the
    // wealth card should lead the four areas.
    const f = yearFortune(yearPillar(1996), 2024) // Giáp Thìn, Phú Đăng Hỏa; Tý–Thìn tam hợp
    expect(f.thapThan).toBe('tai')
    const wealth = f.areas.find((a) => a.area === 'wealth')!
    expect(wealth.tier).toBe('favorable')
    expect(wealth.driver).toBe('tai')
  })

  it('classifies a Lục Hại period correctly (Tý person vs Mùi month)', () => {
    // 18 Jul 2026 = lunar month 6 (Ất Mùi) — Tý–Mùi is a six-harms pair,
    // previously misreported as neutral.
    const f = monthFortune(yearPillar(1996), 18, 7, 2026)
    expect(f.chiRelation).toBe('luc-hai')
    const love = f.areas.find((a) => a.area === 'love')!
    const health = f.areas.find((a) => a.area === 'health')!
    expect(love.tier).toBe('guarded') // hại lands hardest on relationships
    expect(health.tier).toBe('steady') // Ấn (Kim sinh Thủy) cushions the body
  })
})

describe('monthFortune', () => {
  it('derives the period month pillar from the lunar calendar', () => {
    // 18 Jul 2026 = lunar month 6 of Bính Ngọ: Bính year → month 1 Canh,
    // month 6 → Ất; month-6 chi = Mùi
    const f = monthFortune(yearPillar(1996), 18, 7, 2026)
    expect(f.scope).toBe('month')
    expect(f.period.name).toBe('Ất Mùi')
    expect(f.overall).toBeDefined()
  })

  it('is deterministic', () => {
    const a = monthFortune(yearPillar(1990), 1, 3, 2027)
    const b = monthFortune(yearPillar(1990), 1, 3, 2027)
    expect(a).toEqual(b)
  })
})
