/**
 * The 12 palaces (cung), arranged counterclockwise from Cung Mệnh in the
 * classical order. Palace i sits at branch (mệnh + i) % 12 going FORWARD
 * through the branches; the traditional listing order Mệnh → Phụ Mẫu →
 * Phúc Đức → … runs one branch forward each step.
 */

export interface PalaceDef {
  key: string
  name: string
  en: string
}

/** Traditional order counting FORWARD one branch per palace from Mệnh. */
export const PALACES: PalaceDef[] = [
  { key: 'menh', name: 'Mệnh', en: 'Life' },
  { key: 'phu-mau', name: 'Phụ Mẫu', en: 'Parents' },
  { key: 'phuc-duc', name: 'Phúc Đức', en: 'Fortune & Virtue' },
  { key: 'dien-trach', name: 'Điền Trạch', en: 'Property' },
  { key: 'quan-loc', name: 'Quan Lộc', en: 'Career' },
  { key: 'no-boc', name: 'Nô Bộc', en: 'Friends & Allies' },
  { key: 'thien-di', name: 'Thiên Di', en: 'Travel' },
  { key: 'tat-ach', name: 'Tật Ách', en: 'Health' },
  { key: 'tai-bach', name: 'Tài Bạch', en: 'Wealth' },
  { key: 'tu-tuc', name: 'Tử Tức', en: 'Children' },
  { key: 'phu-the', name: 'Phu Thê', en: 'Marriage' },
  { key: 'huynh-de', name: 'Huynh Đệ', en: 'Siblings' },
]

/**
 * Branch of the i-th palace given the Mệnh branch. The palace sequence
 * proceeds one branch FORWARD per step in the order above.
 */
export function palaceBranch(menhBranch: number, palaceIndex: number): number {
  return (menhBranch + palaceIndex) % 12
}
