import { describe, expect, it } from 'vitest'
import { yearPillar } from '../canchi/pillars'
import { CHI } from '../canchi/tables'
import {
  LUC_HAI,
  LUC_HOP,
  TAM_HOP,
  TU_HANH_XUNG,
  chiRelation,
  isLucXung,
} from './relationships'
import { compareYearPillars, elementRelation } from './score'

describe('relationship table invariants', () => {
  it('every Chi appears in exactly one Tam Hợp trine', () => {
    for (let chi = 0; chi < 12; chi++) {
      const count = TAM_HOP.filter((g) => g.includes(chi)).length
      expect(count).toBe(1)
    }
  })

  it('every Chi appears in exactly one Lục Hợp pair', () => {
    for (let chi = 0; chi < 12; chi++) {
      const count = LUC_HOP.filter((p) => p.includes(chi)).length
      expect(count).toBe(1)
    }
  })

  it('every Chi appears in exactly one Tứ Hành Xung quartet', () => {
    for (let chi = 0; chi < 12; chi++) {
      const count = TU_HANH_XUNG.filter((g) => g.includes(chi)).length
      expect(count).toBe(1)
    }
  })

  it('chiRelation is symmetric and never undefined across all 12×12 pairs', () => {
    for (let a = 0; a < 12; a++) {
      for (let b = 0; b < 12; b++) {
        const rel = chiRelation(a, b)
        expect(rel).toBeDefined()
        expect(chiRelation(b, a)).toBe(rel)
      }
    }
  })

  it('direct oppositions are lục xung, not diluted into the quartet bucket', () => {
    expect(isLucXung(0, 6)).toBe(true) // Tý – Ngọ
    expect(chiRelation(0, 6)).toBe('luc-xung')
    expect(chiRelation(0, 3)).toBe('tu-hanh-xung') // Tý – Mão (hình-flavored)
  })

  it('known classical pairs land where tradition says', () => {
    expect(chiRelation(2, 6)).toBe('tam-hop') // Dần – Ngọ (same trine)
    expect(chiRelation(0, 1)).toBe('luc-hop') // Tý – Sửu
    expect(chiRelation(3, 11)).toBe('tam-hop') // Mão – Hợi
  })

  it('every Chi appears in exactly one Lục Hại pair', () => {
    for (let chi = 0; chi < 12; chi++) {
      const count = LUC_HAI.filter((p) => p.includes(chi)).length
      expect(count).toBe(1)
    }
  })

  it('the four Lục Hại pairs outside the clash quartets surface as luc-hai', () => {
    expect(chiRelation(0, 7)).toBe('luc-hai') // Tý – Mùi
    expect(chiRelation(1, 6)).toBe('luc-hai') // Sửu – Ngọ
    expect(chiRelation(3, 4)).toBe('luc-hai') // Mão – Thìn
    expect(chiRelation(9, 10)).toBe('luc-hai') // Dậu – Tuất
    // Dần–Tỵ and Thân–Hợi are also hại but sit inside the Dần–Thân–Tỵ–Hợi
    // quartet, which the popular framing (and our precedence) reports first.
    expect(chiRelation(2, 5)).toBe('tu-hanh-xung')
    expect(chiRelation(8, 11)).toBe('tu-hanh-xung')
  })

  it('no pair is both a hợp and a hại', () => {
    for (const [a, b] of LUC_HAI) {
      expect(LUC_HOP.some(([x, y]) => (x === a && y === b) || (x === b && y === a))).toBe(false)
      expect(TAM_HOP.some((g) => g.includes(a) && g.includes(b))).toBe(false)
    }
  })
})

describe('element relation (nạp âm sinh/khắc)', () => {
  it('covers the full sinh cycle', () => {
    expect(elementRelation('kim', 'thuy')).toBe('sinh-a-to-b')
    expect(elementRelation('thuy', 'moc')).toBe('sinh-a-to-b')
    expect(elementRelation('moc', 'kim')).toBe('khac-b-to-a')
  })
})

describe('compareYearPillars', () => {
  it('scores a Tam Hợp + sinh pair as exceptional', () => {
    // 1996 Bính Tý (Giản Hạ Thủy) × 1992 Nhâm Thân (Kiếm Phong Kim):
    // Tý–Thân same trine, Kim sinh Thủy → top tier
    const a = yearPillar(1996)
    const b = yearPillar(1992)
    const r = compareYearPillars(a, b)
    expect(r.chiRelation).toBe('tam-hop')
    expect(r.elementRelation).toBe('sinh-b-to-a')
    expect(r.tier).toBe('tam-hop')
  })

  it('scores a lục xung pair as strongly challenging', () => {
    // 1996 Bính Tý (Thủy) × 1990 Canh Ngọ (Lộ Bàng Thổ): Tý–Ngọ opposition,
    // Thổ khắc Thủy → bottom tier
    const r = compareYearPillars(yearPillar(1996), yearPillar(1990))
    expect(r.chiRelation).toBe('luc-xung')
    expect(r.tier).toBe('dai-xung')
  })

  it('is symmetric in tier for any pair of years', () => {
    for (let y1 = 1990; y1 < 2002; y1++) {
      for (let y2 = 1990; y2 < 2002; y2++) {
        const ab = compareYearPillars(yearPillar(y1), yearPillar(y2))
        const ba = compareYearPillars(yearPillar(y2), yearPillar(y1))
        expect(ab.tier).toBe(ba.tier)
        expect(ab.score).toBe(ba.score)
      }
    }
  })

  it('produces a defined tier for all 144 Chi pairings', () => {
    for (let y1 = 1984; y1 < 1996; y1++) {
      for (let y2 = 1984; y2 < 1996; y2++) {
        const r = compareYearPillars(yearPillar(y1), yearPillar(y2))
        expect(r.tier).toBeDefined()
        expect(CHI[yearPillar(y1).chi.index]).toBeDefined()
      }
    }
  })
})
