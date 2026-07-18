/**
 * Per-element flavor overlay applied on top of the animal portrait.
 * The element here is the nạp âm bản mệnh element, so the overlay speaks
 * to how the destiny element colors the animal's character.
 */

import type { Element } from '../lib/canchi/tables'

export const ELEMENT_CONTENT: Record<Element, { overlay: string }> = {
  kim: {
    overlay:
      'Kim (metal) gives this nature an edge: cleaner decisions, higher standards, and a spine that does not bend just because the room disagrees. Refined, but built to cut when it must.',
  },
  moc: {
    overlay:
      'Mộc (wood) makes this nature a grower: patient with slow things, generous with shade, always reaching for a little more light. Progress over drama, roots before branches.',
  },
  thuy: {
    overlay:
      'Thủy (water) softens the edges and deepens the current: this nature adapts to any container, wears down stone by returning daily, and holds more underneath than the surface admits.',
  },
  hoa: {
    overlay:
      'Hỏa (fire) turns the volume up: warmth people gather around, urgency that gets stalled things moving, and a light that is hard to ignore. The cost of burning bright is remembering to bank the coals.',
  },
  tho: {
    overlay:
      'Thổ (earth) grounds this nature: steady in storms, loyal past convenience, the place other people plant their trust. Slow to move, and very hard to move once settled.',
  },
}
