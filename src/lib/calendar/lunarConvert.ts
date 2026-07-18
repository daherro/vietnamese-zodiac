/**
 * Vietnamese lunar calendar conversion.
 *
 * Port of Hồ Ngọc Đức's astronomical algorithm (the de-facto standard for
 * the Vietnamese lunar calendar), computed at UTC+7. The Vietnamese calendar
 * diverges from the Chinese calendar in some years (e.g. Tết 1985, 2007)
 * because China computes at UTC+8 — always validate against Vietnamese
 * sources.
 *
 * Valid range: ~1800–2199 (astronomical approximations degrade outside it).
 */

export interface LunarDate {
  day: number
  month: number
  year: number
  isLeapMonth: boolean
}

const TZ = 7 // Vietnam, UTC+7

/** Julian day number from a Gregorian calendar date. */
export function jdFromDate(dd: number, mm: number, yy: number): number {
  const a = Math.floor((14 - mm) / 12)
  const y = yy + 4800 - a
  const m = mm + 12 * a - 3
  let jd =
    dd +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  if (jd < 2299161) {
    jd = dd + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - 32083
  }
  return jd
}

/** Gregorian date from a Julian day number. */
export function jdToDate(jd: number): { day: number; month: number; year: number } {
  let a: number, b: number, c: number
  if (jd > 2299160) {
    a = jd + 32044
    b = Math.floor((4 * a + 3) / 146097)
    c = a - Math.floor((b * 146097) / 4)
  } else {
    b = 0
    c = jd + 32082
  }
  const d = Math.floor((4 * c + 3) / 1461)
  const e = c - Math.floor((1461 * d) / 4)
  const m = Math.floor((5 * e + 2) / 153)
  return {
    day: e - Math.floor((153 * m + 2) / 5) + 1,
    month: m + 3 - 12 * Math.floor(m / 10),
    year: b * 100 + d - 4800 + Math.floor(m / 10),
  }
}

/**
 * kth new moon after the new moon of 1900-01-01 (k=0), as a Julian day
 * at local midnight (truncated after timezone shift).
 * Astronomical series from Hồ Ngọc Đức's implementation.
 */
function newMoonDay(k: number): number {
  const T = k / 1236.85
  const T2 = T * T
  const T3 = T2 * T
  const dr = Math.PI / 180
  let Jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3
  Jd1 += 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr)
  const M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3
  const Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3
  const F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3
  let C1 = (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * dr * M)
  C1 = C1 - 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(dr * 2 * Mpr)
  C1 = C1 - 0.0004 * Math.sin(dr * 3 * Mpr)
  C1 = C1 + 0.0104 * Math.sin(dr * 2 * F) - 0.0051 * Math.sin(dr * (M + Mpr))
  C1 = C1 - 0.0074 * Math.sin(dr * (M - Mpr)) + 0.0004 * Math.sin(dr * (2 * F + M))
  C1 = C1 - 0.0004 * Math.sin(dr * (2 * F - M)) - 0.0006 * Math.sin(dr * (2 * F + Mpr))
  C1 = C1 + 0.001 * Math.sin(dr * (2 * F - Mpr)) + 0.0005 * Math.sin(dr * (2 * Mpr + M))
  let deltat: number
  if (T < -11) {
    deltat =
      0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 - 0.000000081 * T * T3
  } else {
    deltat = -0.000278 + 0.000265 * T + 0.000262 * T2
  }
  const JdNew = Jd1 + C1 - deltat
  return Math.floor(JdNew + 0.5 + TZ / 24)
}

/** Ecliptic longitude of the sun (in sixths of the circle, 0..11) at the given Julian day. */
function sunLongitude(jdn: number): number {
  const T = (jdn - 2451545.5 - TZ / 24) / 36525
  const T2 = T * T
  const dr = Math.PI / 180
  const M = 357.5291 + 35999.0503 * T - 0.0001559 * T2 - 0.00000048 * T * T2
  const L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2
  let DL = (1.9146 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M)
  DL += (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) + 0.00029 * Math.sin(dr * 3 * M)
  let L = L0 + DL
  L = L * dr
  L = L - Math.PI * 2 * Math.floor(L / (Math.PI * 2))
  return Math.floor((L / Math.PI) * 6)
}

/** Julian day of the lunar-month-11 start (the month containing the winter solstice) for year yy. */
function getLunarMonth11(yy: number): number {
  const off = jdFromDate(31, 12, yy) - 2415021
  const k = Math.floor(off / 29.530588853)
  let nm = newMoonDay(k)
  const sunLong = sunLongitude(nm)
  if (sunLong >= 9) {
    nm = newMoonDay(k - 1)
  }
  return nm
}

/** Offset (0..12) of the leap month after month 11, or a value from which it's derived. */
function getLeapMonthOffset(a11: number): number {
  const k = Math.floor((a11 - 2415021.076998695) / 29.530588853 + 0.5)
  let last: number
  let i = 1
  let arc = sunLongitude(newMoonDay(k + i))
  do {
    last = arc
    i++
    arc = sunLongitude(newMoonDay(k + i))
  } while (arc !== last && i < 14)
  return i - 1
}

/** Convert a solar (Gregorian) date to the Vietnamese lunar date. */
export function solarToLunar(dd: number, mm: number, yy: number): LunarDate {
  const dayNumber = jdFromDate(dd, mm, yy)
  const k = Math.floor((dayNumber - 2415021.076998695) / 29.530588853)
  let monthStart = newMoonDay(k + 1)
  if (monthStart > dayNumber) {
    monthStart = newMoonDay(k)
  }
  let a11 = getLunarMonth11(yy)
  let b11 = a11
  let lunarYear: number
  if (a11 >= monthStart) {
    lunarYear = yy
    a11 = getLunarMonth11(yy - 1)
  } else {
    lunarYear = yy + 1
    b11 = getLunarMonth11(yy + 1)
  }
  const lunarDay = dayNumber - monthStart + 1
  const diff = Math.floor((monthStart - a11) / 29)
  let lunarMonth = diff + 11
  let isLeapMonth = false
  if (b11 - a11 > 365) {
    const leapMonthDiff = getLeapMonthOffset(a11)
    if (diff >= leapMonthDiff) {
      lunarMonth = diff + 10
      if (diff === leapMonthDiff) {
        isLeapMonth = true
      }
    }
  }
  if (lunarMonth > 12) {
    lunarMonth = lunarMonth - 12
  }
  if (lunarMonth >= 11 && diff < 4) {
    lunarYear -= 1
  }
  return { day: lunarDay, month: lunarMonth, year: lunarYear, isLeapMonth }
}

/** Convert a Vietnamese lunar date to the solar (Gregorian) date. */
export function lunarToSolar(
  lunarDay: number,
  lunarMonth: number,
  lunarYear: number,
  isLeapMonth = false,
): { day: number; month: number; year: number } {
  let a11: number, b11: number
  if (lunarMonth < 11) {
    a11 = getLunarMonth11(lunarYear - 1)
    b11 = getLunarMonth11(lunarYear)
  } else {
    a11 = getLunarMonth11(lunarYear)
    b11 = getLunarMonth11(lunarYear + 1)
  }
  const k = Math.floor(0.5 + (a11 - 2415021.076998695) / 29.530588853)
  let off = lunarMonth - 11
  if (off < 0) {
    off += 12
  }
  if (b11 - a11 > 365) {
    const leapOff = getLeapMonthOffset(a11)
    let leapMonth = leapOff - 2
    if (leapMonth < 0) {
      leapMonth += 12
    }
    if (isLeapMonth && lunarMonth !== leapMonth) {
      return { day: 0, month: 0, year: 0 }
    } else if (isLeapMonth || off >= leapOff) {
      off += 1
    }
  }
  const monthStart = newMoonDay(k + off)
  return jdToDate(monthStart + lunarDay - 1)
}
