import { describe, expect, it } from 'vitest'
import { birthPillars } from '../canchi/pillars'
import { CHI } from '../canchi/tables'
import { cungMenhBranch, cungThanBranch, palaceStem } from './anchor'
import { tuViBranch } from './cuc'
import { PALACES } from './palaces'
import { mainStarBranches, tuHoa } from './stars'
import { buildChart } from './buildChart'

const branchName = (i: number) => CHI[i].name

describe('Cung Mệnh / Cung Thân anchors', () => {
  it('month 1, hour Tý puts both at Dần', () => {
    expect(branchName(cungMenhBranch(1, 0))).toBe('Dần')
    expect(branchName(cungThanBranch(1, 0))).toBe('Dần')
  })

  it('counts month forward, hour backward for Mệnh', () => {
    // Month 7 → Thân; hour Mùi (7) backward 7 → Sửu
    expect(branchName(cungMenhBranch(7, 7))).toBe('Sửu')
    // Thân: month 7 forward, hour 7 forward → Mão
    expect(branchName(cungThanBranch(7, 7))).toBe('Mão')
  })
})

describe('palace stems (ngũ hổ độn)', () => {
  it('Giáp year: Dần palace is Bính Dần, Tý palace is Bính Tý', () => {
    expect(palaceStem(2, 0)).toBe(2) // Bính
    expect(palaceStem(0, 0)).toBe(2) // wraps the decade: also Bính
  })
})

describe('Tử Vi star position — canonical day-1 column', () => {
  // Every textbook publishes this table; day 1 per Cục:
  it.each([
    [2, 'Sửu'], // Thủy nhị cục
    [3, 'Thìn'], // Mộc tam cục
    [4, 'Hợi'], // Kim tứ cục
    [5, 'Ngọ'], // Thổ ngũ cục
    [6, 'Dậu'], // Hỏa lục cục
  ])('cục %d, day 1 → %s', (cuc, expected) => {
    expect(branchName(tuViBranch(cuc, 1))).toBe(expected)
  })

  it('matches the published Thủy nhị cục column for days 1–6', () => {
    const expected = ['Sửu', 'Dần', 'Dần', 'Mão', 'Mão', 'Thìn']
    for (let d = 1; d <= 6; d++) {
      expect(branchName(tuViBranch(2, d))).toBe(expected[d - 1])
    }
  })

  it('stays within 1–30 day range without wrapping errors', () => {
    for (const cuc of [2, 3, 4, 5, 6]) {
      for (let d = 1; d <= 30; d++) {
        const b = tuViBranch(cuc, d)
        expect(b).toBeGreaterThanOrEqual(0)
        expect(b).toBeLessThan(12)
      }
    }
  })
})

describe('main star chains', () => {
  it('Thiên Phủ mirrors Tử Vi across the Dần–Thân axis', () => {
    expect(mainStarBranches(2)['thien-phu']).toBe(2) // both at Dần
    expect(mainStarBranches(8)['thien-phu']).toBe(8) // both at Thân
    expect(mainStarBranches(3)['thien-phu']).toBe(1) // Mão ↔ Sửu
  })

  it('places all 14 stars with the fixed chain gaps', () => {
    const m = mainStarBranches(6) // Tử Vi at Ngọ
    expect(branchName(m['thien-co'])).toBe('Tỵ') // t−1
    expect(branchName(m['thai-duong'])).toBe('Mão') // t−3
    expect(branchName(m['liem-trinh'])).toBe('Tuất') // t−8
    const f = m['thien-phu'] // (16−6)%12 = 10 = Tuất
    expect(branchName(f)).toBe('Tuất')
    expect(branchName(m['pha-quan'])).toBe('Thân') // f+10
    expect(Object.keys(m)).toHaveLength(14)
  })
})

describe('Tứ Hóa', () => {
  it('Giáp year: Liêm–Phá–Vũ–Dương', () => {
    const h = tuHoa(0)
    expect(h['hoa-loc']).toBe('liem-trinh')
    expect(h['hoa-ky']).toBe('thai-duong')
  })

  it('every stem transforms four distinct stars', () => {
    for (let stem = 0; stem < 10; stem++) {
      const h = tuHoa(stem)
      const targets = Object.values(h)
      expect(new Set(targets).size).toBe(4)
    }
  })
})

describe('buildChart — full lá số', () => {
  // 15 Aug 1996 14:30, male: lunar 2/7/Bính Tý, hour Mùi.
  const pillars = birthPillars({ day: 15, month: 8, year: 1996, hour: 14 })

  it('derives Mệnh, Cục, and star set coherently', () => {
    const chart = buildChart(pillars, 'nam')
    // Month 7, hour Mùi (7): Mệnh at Sửu, Thân at Mão
    expect(branchName(chart.cungMenh)).toBe('Sửu')
    expect(branchName(chart.cungThan)).toBe('Mão')
    // Bính year → Dần palace stem Canh; Sửu is 11 steps from Dần → stem Tân.
    // Tân Sửu nạp âm = Bích Thượng Thổ → Thổ ngũ cục.
    expect(chart.cuc.name).toBe('Thổ ngũ cục')
    expect(chart.cuc.number).toBe(5)

    // All 14 main stars land exactly once across the 12 palaces
    const mainCount = chart.palaces.flatMap((p) => p.stars).filter((s) => s.kind === 'main')
    expect(mainCount).toHaveLength(14)

    // Đại Vận: Bính = yang stem, male → forward; first decade at Mệnh, age 5
    expect(chart.daiVanForward).toBe(true)
    const menhPalace = chart.palaces[0]
    expect(menhPalace.def.key).toBe('menh')
    expect(menhPalace.daiVanStartAge).toBe(5)
    expect(chart.palaces[1].daiVanStartAge).toBe(15) // Phụ Mẫu next decade
  })

  it('reverses Đại Vận for a female with the same yang-stem year', () => {
    const chart = buildChart(pillars, 'nu')
    expect(chart.daiVanForward).toBe(false)
    expect(chart.palaces[11].daiVanStartAge).toBe(15) // Huynh Đệ next decade
  })

  it('throws without a birth hour', () => {
    const noHour = birthPillars({ day: 15, month: 8, year: 1996 })
    expect(() => buildChart(noHour, 'nam')).toThrow()
  })

  it('keeps the 12 palace definitions in order', () => {
    const chart = buildChart(pillars, 'nam')
    expect(chart.palaces.map((p) => p.def.key)).toEqual(PALACES.map((p) => p.key))
  })
})
