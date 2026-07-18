/**
 * Star placement: the 14 main stars (chính tinh), core auxiliary stars,
 * and the Tứ Hóa transformations.
 *
 * School note: Tứ Hóa rows for Canh and Nhâm years vary between schools.
 * We use the table most common in Vietnamese practice
 * (Canh: Dương–Vũ–Âm–Đồng; Nhâm: Lương–Tử–Phủ–Vũ) and mark those rows
 * so the UI can disclose the variant.
 */

export type MainStarKey =
  | 'tu-vi' | 'thien-co' | 'thai-duong' | 'vu-khuc' | 'thien-dong' | 'liem-trinh'
  | 'thien-phu' | 'thai-am' | 'tham-lang' | 'cu-mon' | 'thien-tuong' | 'thien-luong'
  | 'that-sat' | 'pha-quan'

export type AuxStarKey = 'ta-phu' | 'huu-bat' | 'van-xuong' | 'van-khuc' | 'loc-ton'

export const STAR_NAMES: Record<MainStarKey | AuxStarKey, string> = {
  'tu-vi': 'Tử Vi',
  'thien-co': 'Thiên Cơ',
  'thai-duong': 'Thái Dương',
  'vu-khuc': 'Vũ Khúc',
  'thien-dong': 'Thiên Đồng',
  'liem-trinh': 'Liêm Trinh',
  'thien-phu': 'Thiên Phủ',
  'thai-am': 'Thái Âm',
  'tham-lang': 'Tham Lang',
  'cu-mon': 'Cự Môn',
  'thien-tuong': 'Thiên Tướng',
  'thien-luong': 'Thiên Lương',
  'that-sat': 'Thất Sát',
  'pha-quan': 'Phá Quân',
  'ta-phu': 'Tả Phù',
  'huu-bat': 'Hữu Bật',
  'van-xuong': 'Văn Xương',
  'van-khuc': 'Văn Khúc',
  'loc-ton': 'Lộc Tồn',
}

const mod12 = (n: number) => ((n % 12) + 12) % 12

/**
 * The Tử Vi chain runs BACKWARD from the Tử Vi star's branch t:
 * Thiên Cơ t−1, Thái Dương t−3, Vũ Khúc t−4, Thiên Đồng t−5, Liêm Trinh t−8.
 * Thiên Phủ mirrors Tử Vi across the Dần–Thân axis: f = (16 − t) % 12.
 * The Thiên Phủ chain runs FORWARD from f:
 * Thái Âm f+1, Tham Lang f+2, Cự Môn f+3, Thiên Tướng f+4, Thiên Lương f+5,
 * Thất Sát f+6, Phá Quân f+10.
 */
export function mainStarBranches(tuViBranch: number): Record<MainStarKey, number> {
  const t = tuViBranch
  const f = mod12(16 - t)
  return {
    'tu-vi': t,
    'thien-co': mod12(t - 1),
    'thai-duong': mod12(t - 3),
    'vu-khuc': mod12(t - 4),
    'thien-dong': mod12(t - 5),
    'liem-trinh': mod12(t - 8),
    'thien-phu': f,
    'thai-am': mod12(f + 1),
    'tham-lang': mod12(f + 2),
    'cu-mon': mod12(f + 3),
    'thien-tuong': mod12(f + 4),
    'thien-luong': mod12(f + 5),
    'that-sat': mod12(f + 6),
    'pha-quan': mod12(f + 10),
  }
}

/**
 * Core auxiliary stars.
 * Văn Xương: Tuất counted backward by hour branch. Văn Khúc: Thìn forward.
 * Tả Phù: Thìn forward by (month−1). Hữu Bật: Tuất backward by (month−1).
 * Lộc Tồn: fixed palace per year stem.
 */
const LOC_TON_BY_STEM = [2, 3, 5, 6, 5, 6, 8, 9, 11, 0] // Giáp→Dần … Quý→Tý

export function auxStarBranches(
  lunarMonth: number,
  hourChiIdx: number,
  yearCanIdx: number,
): Record<AuxStarKey, number> {
  return {
    'van-xuong': mod12(10 - hourChiIdx),
    'van-khuc': mod12(4 + hourChiIdx),
    'ta-phu': mod12(4 + (lunarMonth - 1)),
    'huu-bat': mod12(10 - (lunarMonth - 1)),
    'loc-ton': LOC_TON_BY_STEM[yearCanIdx],
  }
}

export type HoaKey = 'hoa-loc' | 'hoa-quyen' | 'hoa-khoa' | 'hoa-ky'

export const HOA_NAMES: Record<HoaKey, string> = {
  'hoa-loc': 'Hóa Lộc',
  'hoa-quyen': 'Hóa Quyền',
  'hoa-khoa': 'Hóa Khoa',
  'hoa-ky': 'Hóa Kỵ',
}

type HoaTarget = MainStarKey | 'van-xuong' | 'van-khuc' | 'ta-phu' | 'huu-bat'

/**
 * Tứ Hóa per year stem (Giáp = 0 … Quý = 9): [Lộc, Quyền, Khoa, Kỵ].
 * Canh and Nhâm rows follow the common Vietnamese school (variants exist).
 */
export const TU_HOA_BY_STEM: Array<[HoaTarget, HoaTarget, HoaTarget, HoaTarget]> = [
  ['liem-trinh', 'pha-quan', 'vu-khuc', 'thai-duong'], // Giáp
  ['thien-co', 'thien-luong', 'tu-vi', 'thai-am'], // Ất
  ['thien-dong', 'thien-co', 'van-xuong', 'liem-trinh'], // Bính
  ['thai-am', 'thien-dong', 'thien-co', 'cu-mon'], // Đinh
  ['tham-lang', 'thai-am', 'huu-bat', 'thien-co'], // Mậu
  ['vu-khuc', 'tham-lang', 'thien-luong', 'van-khuc'], // Kỷ
  ['thai-duong', 'vu-khuc', 'thai-am', 'thien-dong'], // Canh (school variant)
  ['cu-mon', 'thai-duong', 'van-khuc', 'van-xuong'], // Tân
  ['thien-luong', 'tu-vi', 'thien-phu', 'vu-khuc'], // Nhâm (school variant)
  ['pha-quan', 'cu-mon', 'thai-am', 'tham-lang'], // Quý
]

export function tuHoa(yearCanIdx: number): Record<HoaKey, HoaTarget> {
  const [loc, quyen, khoa, ky] = TU_HOA_BY_STEM[yearCanIdx]
  return { 'hoa-loc': loc, 'hoa-quyen': quyen, 'hoa-khoa': khoa, 'hoa-ky': ky }
}
