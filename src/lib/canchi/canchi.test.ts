import { describe, expect, it } from 'vitest'
import { lunarToSolar, solarToLunar } from '../calendar/lunarConvert'
import { birthPillars, dayPillar, hourChiIndex, yearPillar } from './pillars'
import { CHI, cycleIndex, napAm } from './tables'

describe('lunar conversion (Vietnamese calendar, UTC+7)', () => {
  // Tết = lunar 1/1. Public, verifiable Vietnamese dates.
  it.each([
    [10, 2, 2024], // Tết Giáp Thìn
    [29, 1, 2025], // Tết Ất Tỵ
    [19, 2, 1996], // Tết Bính Tý
    [21, 1, 1985], // Tết Ất Sửu — diverges from the Chinese calendar (Feb 20 there)
  ])('%d/%d/%d is lunar New Year day', (d, m, y) => {
    const lunar = solarToLunar(d, m, y)
    expect({ day: lunar.day, month: lunar.month }).toEqual({ day: 1, month: 1 })
    expect(lunar.year).toBe(y)
  })

  it('round-trips solar → lunar → solar', () => {
    for (const [d, m, y] of [
      [15, 8, 1996],
      [1, 1, 2000],
      [31, 12, 2023],
      [5, 6, 1985],
    ] as const) {
      const lunar = solarToLunar(d, m, y)
      const back = lunarToSolar(lunar.day, lunar.month, lunar.year, lunar.isLeapMonth)
      expect(back).toEqual({ day: d, month: m, year: y })
    }
  })

  it('detects the 2023 leap month 2', () => {
    // 2023 had a leap 2nd month (Mar 22 – Apr 19 2023)
    const lunar = solarToLunar(1, 4, 2023)
    expect(lunar.month).toBe(2)
    expect(lunar.isLeapMonth).toBe(true)
  })
})

describe('year pillar — Tết boundary', () => {
  it.each([
    [1996, 'Bính Tý'],
    [2000, 'Canh Thìn'],
    [2024, 'Giáp Thìn'],
    [2026, 'Bính Ngọ'],
  ])('lunar year %d = %s', (y, name) => {
    expect(yearPillar(y).name).toBe(name)
  })

  it('maps an early-January birth to the PRIOR lunar year animal', () => {
    // Jan 15 1996 is before Tết (Feb 19 1996) → lunar year 1995 = Ất Hợi (Pig)
    const p = birthPillars({ day: 15, month: 1, year: 1996 })
    expect(p.year.name).toBe('Ất Hợi')
    expect(p.year.chi.animalEn).toBe('Pig')
  })

  it('maps a post-Tết birth to the new year animal', () => {
    const p = birthPillars({ day: 1, month: 3, year: 1996 })
    expect(p.year.name).toBe('Bính Tý')
    expect(p.year.chi.animalEn).toBe('Rat')
  })
})

describe('day pillar', () => {
  it('1900-01-01 was Giáp Tuất', () => {
    expect(dayPillar(1, 1, 1900).name).toBe('Giáp Tuất')
  })

  it('a 23:30 birth rolls to the next civil day', () => {
    const before = birthPillars({ day: 10, month: 6, year: 1990, hour: 22 })
    const rolled = birthPillars({ day: 10, month: 6, year: 1990, hour: 23 })
    expect(rolled.dayRolledForward).toBe(true)
    expect(rolled.day.cycle).toBe((before.day.cycle + 1) % 60)
    expect(rolled.hour?.chi.name).toBe('Tý')
  })
})

describe('hour pillar', () => {
  it('maps hours to the 12 two-hour blocks', () => {
    expect(CHI[hourChiIndex(23)].name).toBe('Tý')
    expect(CHI[hourChiIndex(0)].name).toBe('Tý')
    expect(CHI[hourChiIndex(1)].name).toBe('Sửu')
    expect(CHI[hourChiIndex(12)].name).toBe('Ngọ')
    expect(CHI[hourChiIndex(14)].name).toBe('Mùi')
    expect(CHI[hourChiIndex(21)].name).toBe('Hợi')
  })

  it('is omitted when no birth time given', () => {
    expect(birthPillars({ day: 15, month: 8, year: 1996 }).hour).toBeUndefined()
  })
})

describe('nạp âm', () => {
  it('Bính Tý (1996) = Giản Hạ Thủy', () => {
    const p = yearPillar(1996)
    expect(p.napAm.name).toBe('Giản Hạ Thủy')
    expect(p.napAm.element).toBe('thuy')
  })

  it('Giáp Tý = Hải Trung Kim, Quý Hợi = Đại Hải Thủy (cycle bounds)', () => {
    expect(napAm(0).name).toBe('Hải Trung Kim')
    expect(napAm(59).name).toBe('Đại Hải Thủy')
  })

  it('rejects parity-mismatched Can-Chi pairs', () => {
    expect(() => cycleIndex(0, 1)).toThrow()
  })
})

describe('month pillar', () => {
  it('full pillar set for a known chart: 15 Aug 1996 (lunar 2/7/Bính Tý)', () => {
    const p = birthPillars({ day: 15, month: 8, year: 1996, hour: 14 })
    expect(p.lunar).toMatchObject({ day: 2, month: 7, year: 1996 })
    expect(p.year.name).toBe('Bính Tý')
    // Bính year → month 1 Can = Canh; month 7 → Canh+6 = Bính; chi = Thân
    expect(p.month.name).toBe('Bính Thân')
    expect(p.hour?.chi.name).toBe('Mùi')
  })
})
