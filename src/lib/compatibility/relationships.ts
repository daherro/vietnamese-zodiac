/**
 * Classical Chi (Earthly Branch) relationship groups. Canonical data —
 * identical across Vietnamese astrology references.
 *
 * Note on Tứ Hành Xung: the popular Vietnamese framing treats each quartet
 * as mutually clashing, but classically the pairs inside a quartet differ —
 * opposite pairs (Tý–Ngọ, Sửu–Mùi, Dần–Thân, Mão–Dậu, Thìn–Tuất, Tỵ–Hợi)
 * are true xung (lục xung); same-parity pairs like Tý–Mão are hình
 * (punishment), a lighter friction. We expose both so the UI can keep the
 * popular framing while being honest about the nuance.
 */

/** Tam Hợp — three-harmony trines (strongest affinity). */
export const TAM_HOP: number[][] = [
  [8, 0, 4], // Thân – Tý – Thìn
  [11, 3, 7], // Hợi – Mão – Mùi
  [2, 6, 10], // Dần – Ngọ – Tuất
  [5, 9, 1], // Tỵ – Dậu – Sửu
]

/** Lục Hợp — six-harmony pairs (secret friends). */
export const LUC_HOP: Array<[number, number]> = [
  [0, 1], // Tý – Sửu
  [2, 11], // Dần – Hợi
  [3, 10], // Mão – Tuất
  [4, 9], // Thìn – Dậu
  [5, 8], // Tỵ – Thân
  [6, 7], // Ngọ – Mùi
]

/** Tứ Hành Xung — the three clashing quartets (popular framing). */
export const TU_HANH_XUNG: number[][] = [
  [0, 3, 6, 9], // Tý – Mão – Ngọ – Dậu
  [1, 4, 7, 10], // Sửu – Thìn – Mùi – Tuất
  [2, 5, 8, 11], // Dần – Tỵ – Thân – Hợi
]

/** Lục xung — the six true opposition pairs (Chi exactly 6 apart). */
export function isLucXung(a: number, b: number): boolean {
  return (a - b + 12) % 12 === 6
}

/**
 * Lục Hại — the six harm pairs (Tý–Mùi, Sửu–Ngọ, Dần–Tỵ, Mão–Thìn,
 * Thân–Hợi, Dậu–Tuất): the quiet, undermining friction, classically the
 * one elders warn about for marriages. Dần–Tỵ and Thân–Hợi also fall in
 * the Dần–Thân–Tỵ–Hợi clash quartet; the quartet check runs first, so in
 * practice this classification surfaces the four pairs the quartets miss.
 */
export const LUC_HAI: Array<[number, number]> = [
  [0, 7], // Tý – Mùi
  [1, 6], // Sửu – Ngọ
  [2, 5], // Dần – Tỵ
  [3, 4], // Mão – Thìn
  [8, 11], // Thân – Hợi
  [9, 10], // Dậu – Tuất
]

export type ChiRelation =
  | 'tam-hop' // same trine — strong harmony
  | 'luc-hop' // secret-friend pair — quiet harmony
  | 'luc-xung' // direct opposition — strongest clash
  | 'tu-hanh-xung' // same clash quartet, not direct opposition (hình-flavored friction)
  | 'luc-hai' // six-harms pair — quiet undermining friction
  | 'same' // same Chi
  | 'neutral'

export function chiRelation(a: number, b: number): ChiRelation {
  if (a === b) return 'same'
  if (TAM_HOP.some((g) => g.includes(a) && g.includes(b))) return 'tam-hop'
  if (LUC_HOP.some(([x, y]) => (x === a && y === b) || (x === b && y === a)))
    return 'luc-hop'
  if (isLucXung(a, b)) return 'luc-xung'
  if (TU_HANH_XUNG.some((g) => g.includes(a) && g.includes(b))) return 'tu-hanh-xung'
  if (LUC_HAI.some(([x, y]) => (x === a && y === b) || (x === b && y === a)))
    return 'luc-hai'
  return 'neutral'
}
