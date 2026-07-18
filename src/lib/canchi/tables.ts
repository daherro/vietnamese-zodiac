/**
 * Canonical Can-Chi constants. These tables are identical across every
 * Bát Tự / Tử Vi reference — transcription, not interpretation.
 */

export type Element = 'kim' | 'moc' | 'thuy' | 'hoa' | 'tho'

export interface Can {
  index: number // 0 = Giáp
  name: string
  element: Element
  yang: boolean // dương (true) / âm (false)
}

export interface Chi {
  index: number // 0 = Tý
  name: string
  animal: string // Vietnamese animal name
  animalEn: string
  yang: boolean
  /** Two-hour block start (local hour, inclusive). Tý = 23:00–00:59. */
  hourStart: number
}

export const CAN: Can[] = [
  { index: 0, name: 'Giáp', element: 'moc', yang: true },
  { index: 1, name: 'Ất', element: 'moc', yang: false },
  { index: 2, name: 'Bính', element: 'hoa', yang: true },
  { index: 3, name: 'Đinh', element: 'hoa', yang: false },
  { index: 4, name: 'Mậu', element: 'tho', yang: true },
  { index: 5, name: 'Kỷ', element: 'tho', yang: false },
  { index: 6, name: 'Canh', element: 'kim', yang: true },
  { index: 7, name: 'Tân', element: 'kim', yang: false },
  { index: 8, name: 'Nhâm', element: 'thuy', yang: true },
  { index: 9, name: 'Quý', element: 'thuy', yang: false },
]

export const CHI: Chi[] = [
  { index: 0, name: 'Tý', animal: 'Chuột', animalEn: 'Rat', yang: true, hourStart: 23 },
  { index: 1, name: 'Sửu', animal: 'Trâu', animalEn: 'Water Buffalo', yang: false, hourStart: 1 },
  { index: 2, name: 'Dần', animal: 'Hổ', animalEn: 'Tiger', yang: true, hourStart: 3 },
  { index: 3, name: 'Mão', animal: 'Mèo', animalEn: 'Cat', yang: false, hourStart: 5 },
  { index: 4, name: 'Thìn', animal: 'Rồng', animalEn: 'Dragon', yang: true, hourStart: 7 },
  { index: 5, name: 'Tỵ', animal: 'Rắn', animalEn: 'Snake', yang: false, hourStart: 9 },
  { index: 6, name: 'Ngọ', animal: 'Ngựa', animalEn: 'Horse', yang: true, hourStart: 11 },
  { index: 7, name: 'Mùi', animal: 'Dê', animalEn: 'Goat', yang: false, hourStart: 13 },
  { index: 8, name: 'Thân', animal: 'Khỉ', animalEn: 'Monkey', yang: true, hourStart: 15 },
  { index: 9, name: 'Dậu', animal: 'Gà', animalEn: 'Rooster', yang: false, hourStart: 17 },
  { index: 10, name: 'Tuất', animal: 'Chó', animalEn: 'Dog', yang: true, hourStart: 19 },
  { index: 11, name: 'Hợi', animal: 'Heo', animalEn: 'Pig', yang: false, hourStart: 21 },
]

export const ELEMENT_NAMES: Record<Element, { vi: string; en: string }> = {
  kim: { vi: 'Kim', en: 'Metal' },
  moc: { vi: 'Mộc', en: 'Wood' },
  thuy: { vi: 'Thủy', en: 'Water' },
  hoa: { vi: 'Hỏa', en: 'Fire' },
  tho: { vi: 'Thổ', en: 'Earth' },
}

/**
 * Nạp âm (60-cycle "melodic element") — the bản mệnh element used in
 * Vietnamese popular compatibility and in deriving the Tử Vi Cục.
 * Keyed by cycle index 0–59 (0 = Giáp Tý). Each nạp âm name spans two
 * consecutive cycle entries, so the table lists 30 pairs.
 */
export interface NapAm {
  element: Element
  name: string // e.g. "Hải Trung Kim"
  meaning: string // e.g. "gold in the sea"
}

const NAP_AM_PAIRS: NapAm[] = [
  { element: 'kim', name: 'Hải Trung Kim', meaning: 'gold under the sea' }, // Giáp Tý, Ất Sửu
  { element: 'hoa', name: 'Lư Trung Hỏa', meaning: 'fire in the furnace' }, // Bính Dần, Đinh Mão
  { element: 'moc', name: 'Đại Lâm Mộc', meaning: 'great forest wood' }, // Mậu Thìn, Kỷ Tỵ
  { element: 'tho', name: 'Lộ Bàng Thổ', meaning: 'earth beside the road' }, // Canh Ngọ, Tân Mùi
  { element: 'kim', name: 'Kiếm Phong Kim', meaning: 'sword-edge metal' }, // Nhâm Thân, Quý Dậu
  { element: 'hoa', name: 'Sơn Đầu Hỏa', meaning: 'fire on the mountain peak' }, // Giáp Tuất, Ất Hợi
  { element: 'thuy', name: 'Giản Hạ Thủy', meaning: 'water beneath the stream' }, // Bính Tý, Đinh Sửu
  { element: 'tho', name: 'Thành Đầu Thổ', meaning: 'earth atop the citadel wall' }, // Mậu Dần, Kỷ Mão
  { element: 'kim', name: 'Bạch Lạp Kim', meaning: 'white candle metal' }, // Canh Thìn, Tân Tỵ
  { element: 'moc', name: 'Dương Liễu Mộc', meaning: 'willow wood' }, // Nhâm Ngọ, Quý Mùi
  { element: 'thuy', name: 'Tuyền Trung Thủy', meaning: 'spring water' }, // Giáp Thân, Ất Dậu
  { element: 'tho', name: 'Ốc Thượng Thổ', meaning: 'earth on the rooftop' }, // Bính Tuất, Đinh Hợi
  { element: 'hoa', name: 'Tích Lịch Hỏa', meaning: 'thunderbolt fire' }, // Mậu Tý, Kỷ Sửu
  { element: 'moc', name: 'Tùng Bách Mộc', meaning: 'pine and cypress wood' }, // Canh Dần, Tân Mão
  { element: 'thuy', name: 'Trường Lưu Thủy', meaning: 'long flowing water' }, // Nhâm Thìn, Quý Tỵ
  { element: 'kim', name: 'Sa Trung Kim', meaning: 'gold in the sand' }, // Giáp Ngọ, Ất Mùi
  { element: 'hoa', name: 'Sơn Hạ Hỏa', meaning: 'fire below the mountain' }, // Bính Thân, Đinh Dậu
  { element: 'moc', name: 'Bình Địa Mộc', meaning: 'plains wood' }, // Mậu Tuất, Kỷ Hợi
  { element: 'tho', name: 'Bích Thượng Thổ', meaning: 'earth on the wall' }, // Canh Tý, Tân Sửu
  { element: 'kim', name: 'Kim Bạch Kim', meaning: 'gold leaf metal' }, // Nhâm Dần, Quý Mão
  { element: 'hoa', name: 'Phú Đăng Hỏa', meaning: 'lamp-light fire' }, // Giáp Thìn, Ất Tỵ
  { element: 'thuy', name: 'Thiên Hà Thủy', meaning: 'water of the heavenly river' }, // Bính Ngọ, Đinh Mùi
  { element: 'tho', name: 'Đại Trạch Thổ', meaning: 'earth of the great homestead' }, // Mậu Thân, Kỷ Dậu
  { element: 'kim', name: 'Thoa Xuyến Kim', meaning: 'hairpin and bracelet gold' }, // Canh Tuất, Tân Hợi
  { element: 'moc', name: 'Tang Đố Mộc', meaning: 'mulberry wood' }, // Nhâm Tý, Quý Sửu
  { element: 'thuy', name: 'Đại Khê Thủy', meaning: 'great stream water' }, // Giáp Dần, Ất Mão
  { element: 'tho', name: 'Sa Trung Thổ', meaning: 'earth in the sand' }, // Bính Thìn, Đinh Tỵ
  { element: 'hoa', name: 'Thiên Thượng Hỏa', meaning: 'fire in the sky' }, // Mậu Ngọ, Kỷ Mùi
  { element: 'moc', name: 'Thạch Lựu Mộc', meaning: 'pomegranate wood' }, // Canh Thân, Tân Dậu
  { element: 'thuy', name: 'Đại Hải Thủy', meaning: 'great ocean water' }, // Nhâm Tuất, Quý Hợi
]

/** Nạp âm for a 60-cycle index (0 = Giáp Tý … 59 = Quý Hợi). */
export function napAm(cycleIndex: number): NapAm {
  return NAP_AM_PAIRS[Math.floor(((cycleIndex % 60) + 60) % 60 / 2)]
}

/** 60-cycle index from can + chi indices. Throws if the pair is invalid (parity mismatch). */
export function cycleIndex(canIdx: number, chiIdx: number): number {
  if (canIdx % 2 !== chiIdx % 2) {
    throw new Error(`Invalid Can-Chi pair: can=${canIdx}, chi=${chiIdx}`)
  }
  // CRT over mod 10 / mod 12: find x in 0..59 with x≡can (10), x≡chi (12)
  for (let x = chiIdx; x < 60; x += 12) {
    if (x % 10 === canIdx) return x
  }
  throw new Error(`No cycle index for can=${canIdx}, chi=${chiIdx}`)
}

/**
 * Ngũ hành sinh/khắc — element generating and overcoming cycles.
 * sinh: kim→thủy→mộc→hỏa→thổ→kim; khắc: kim→mộc→thổ→thủy→hỏa→kim.
 */
export const SINH: Record<Element, Element> = {
  kim: 'thuy',
  thuy: 'moc',
  moc: 'hoa',
  hoa: 'tho',
  tho: 'kim',
}

export const KHAC: Record<Element, Element> = {
  kim: 'moc',
  moc: 'tho',
  tho: 'thuy',
  thuy: 'hoa',
  hoa: 'kim',
}

/**
 * Month Can rule ("ngũ hổ độn"): the Can of lunar month 1 (Dần month)
 * is determined by the year Can; months then increment.
 * Giáp/Kỷ years → month 1 starts Bính; Ất/Canh → Mậu; Bính/Tân → Canh;
 * Đinh/Nhâm → Nhâm; Mậu/Quý → Giáp.
 */
export const MONTH1_CAN_BY_YEAR_CAN: number[] = [2, 4, 6, 8, 0, 2, 4, 6, 8, 0]

/**
 * Hour Can rule ("ngũ thử độn"): the Can of the Tý hour is determined by
 * the day Can; hours then increment.
 * Giáp/Kỷ days → Tý hour starts Giáp; Ất/Canh → Bính; Bính/Tân → Mậu;
 * Đinh/Nhâm → Canh; Mậu/Quý → Nhâm.
 */
export const TY_HOUR_CAN_BY_DAY_CAN: number[] = [0, 2, 4, 6, 8, 0, 2, 4, 6, 8]
