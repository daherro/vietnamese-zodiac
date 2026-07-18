/**
 * Narrative copy per relationship TYPE (not per pair — 144 pairs collapse
 * onto these templates plus the element interaction line).
 * Drafted for review; the framing keeps tradition serious without turning
 * a clash into a verdict. Friction is information, not fate.
 */

import type { ChiRelation } from '../lib/compatibility/relationships'
import type { ElementRelation } from '../lib/compatibility/score'
import type { CompatTier } from '../lib/compatibility/score'

export const CHI_RELATION_COPY: Record<ChiRelation, { label: string; text: string }> = {
  'tam-hop': {
    label: 'Tam Hợp',
    text: 'these two signs belong to the same harmony trine, three animals the tradition says pull in the same direction. Effort compounds here. What one starts, the other instinctively knows how to finish.',
  },
  'luc-hop': {
    label: 'Lục Hợp',
    text: 'a secret-friend pair. The affinity is quieter than a trine but stubborn: these two tend to defend each other in rooms the other is not in, often without ever discussing it.',
  },
  'luc-xung': {
    label: 'Lục Xung',
    text: 'these signs sit directly opposite on the wheel, the strongest classical friction. Same intensity, opposite instincts. Handled badly it is a standoff; handled well, each covers exactly what the other cannot see.',
  },
  'tu-hanh-xung': {
    label: 'Tứ Hành Xung',
    text: 'these signs share a clash quartet. Classically this is hình, a grinding friction of habits rather than head-on opposition: small irritations that need naming before they compound.',
  },
  'luc-hai': {
    label: 'Lục Hại',
    text: 'a six-harms pair, the quiet friction the tradition takes most seriously in marriage matters. Nothing explodes here; things erode. The remedy is the same as the diagnosis: what gets undermined in silence survives when it is said out loud.',
  },
  same: {
    label: 'Cùng tuổi',
    text: 'the same sign twice over. Instant recognition, shared instincts, and the same blind spots doubled. What each dislikes in the other is usually a postcard from the mirror.',
  },
  neutral: {
    label: 'Bình hòa',
    text: 'no classical pull in either direction between these two signs. The wheel stays quiet here, which means the element story between your bản mệnh does the real talking.',
  },
}

export const ELEMENT_RELATION_COPY: Record<ElementRelation, string> = {
  'sinh-a-to-b':
    'your destiny element nourishes theirs. You are the rain to their field: generous, sustaining, and worth watching so the giving does not run one way forever.',
  'sinh-b-to-a':
    'their destiny element nourishes yours. Around this person things tend to grow easier for you, often before you notice why.',
  'khac-a-to-b':
    'your destiny element presses on theirs. You set the terms in this pairing more than you realize; use that weight gently or it becomes the whole story.',
  'khac-b-to-a':
    'their destiny element presses on yours. Not a verdict, but a headwind: this bond asks more of you than it does of them, so pace yourself.',
  same:
    'the same destiny element on both sides. Deep familiarity and shared weather; when it storms, it storms for both of you at once.',
  neutral:
    'the elements neither feed nor fight. A level field: whatever this pairing becomes, you build it yourselves.',
}

export const TIER_COPY: Record<CompatTier, { label: string; text: string }> = {
  'tam-hop': {
    label: 'Tương đắc',
    text: 'An exceptional pairing by the classical reckoning. The wheel and the elements both lean your way; the tradition would call this a match worth keeping close.',
  },
  'hoa-hop': {
    label: 'Hòa hợp',
    text: 'A harmonious pairing. The currents mostly run together, and ordinary goodwill goes further here than it has any right to.',
  },
  'binh-hoa': {
    label: 'Bình hòa',
    text: 'A workable pairing. Nothing in the tradition pushes you together or apart; what you build depends on the building, which is its own kind of freedom.',
  },
  'xung-khac': {
    label: 'Xung khắc',
    text: 'A challenging pairing by the classical measures. The friction is real and worth respecting, but the old reckoning describes the weather, not the harvest. Plenty of strong bonds live here; they just cost more attention.',
  },
  'dai-xung': {
    label: 'Đại xung',
    text: 'The strongest classical friction the wheel can deal. Elders take this one seriously, and the honest reading is: so should you. Then remember that the lá số measures starting winds, not where two people choose to sail.',
  },
}
