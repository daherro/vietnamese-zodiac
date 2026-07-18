/**
 * Fortune copy templates per life area × tier. Written to pair with the
 * transparent reasoning line the panel shows underneath (the Can-Chi
 * relationship that produced the tier), so the copy stays concrete and
 * never pretends to know specifics it cannot know.
 */

import type { FortuneTier, LifeArea, ThapThan } from '../lib/fortune/period'
import type { ChiRelation } from '../lib/compatibility/relationships'

export const AREA_LABELS: Record<LifeArea, { vi: string; en: string }> = {
  career: { vi: 'Sự nghiệp', en: 'Career' },
  love: { vi: 'Tình duyên', en: 'Love' },
  health: { vi: 'Sức khỏe', en: 'Health' },
  wealth: { vi: 'Tài lộc', en: 'Wealth' },
}

export const TIER_LABELS: Record<FortuneTier, { vi: string; en: string }> = {
  favorable: { vi: 'Thuận lợi', en: 'Favorable' },
  steady: { vi: 'Bình ổn', en: 'Steady' },
  guarded: { vi: 'Cẩn trọng', en: 'Guarded' },
}

/**
 * Short label shown on each area card naming the factor that drove its
 * tier — the Thập Thần role of the period's element, or the Chi relation.
 * This is the "show your work" line that keeps the four cards honest.
 */
export const DRIVER_LABELS: Record<ThapThan | ChiRelation, string> = {
  // Thập Thần (element direction)
  an: 'Ấn · the period nourishes you',
  'thuc-thuong': 'Thực Thương · you pour outward',
  tai: 'Tài · the wealth signal',
  'quan-sat': 'Quan Sát · pressure from the period',
  'ti-kiep': 'Tỉ Kiếp · peers and rivals',
  none: '',
  // Chi relations
  'tam-hop': 'Tam Hợp · allied signs',
  'luc-hop': 'Lục Hợp · secret-friend pair',
  'luc-xung': 'Lục Xung · direct opposition',
  'tu-hanh-xung': 'Tứ Hành Xung · clashing quartet',
  'luc-hai': 'Lục Hại · quiet undermining',
  same: 'Cùng Chi · mirrored sign',
  neutral: '',
}

export const FORTUNE_COPY: Record<LifeArea, Record<FortuneTier, string>> = {
  career: {
    favorable:
      'The winds favor visible moves. Ask for the thing you have been circling: the meeting, the raise, the harder project. Doors give more easily than usual this period.',
    steady:
      'A period for the quiet middle of the work: sharpen the craft, finish what is open, bank goodwill. Nothing needs forcing and nothing rewards it.',
    guarded:
      'Hold your position rather than launching. Read contracts twice, put agreements in writing, and let a provocation at work go unanswered once. The period passes; reputations outlast it.',
  },
  love: {
    favorable:
      'Connections warm easily now. Say the generous thing out loud instead of assuming it is known; this is a period where small gestures land at full weight.',
    steady:
      'The heart keeps ordinary time. Tend what you have with ordinary care: shared meals, kept promises. Sparks are not owed this period, but neither is trouble.',
    guarded:
      'Misunderstandings travel faster than clarifications this period. Ask before assuming, cool off before replying, and do not make permanent decisions from a temporary mood.',
  },
  health: {
    favorable:
      'Energy runs higher than usual. Spend some of it on the body on purpose: start the routine now and this period will help it stick.',
    steady:
      'The body asks only for maintenance: sleep kept regular, meals kept honest. Boring advice, which is exactly why it works.',
    guarded:
      'The reserves run thinner than they feel. Guard sleep first, book the checkup you deferred, and treat fatigue as information rather than an opponent to push through.',
  },
  wealth: {
    favorable:
      'Money finds fewer obstacles this period. A sensible opportunity is worth taking seriously; just let the favorable wind fill sails you already built, not schemes invented for the occasion.',
    steady:
      'Cash flows level. A good period for the unglamorous work of wealth: clear a debt, automate a saving, know your numbers cold.',
    guarded:
      'Keep the purse strings short. Defer the big purchase, be slow to lend, and be properly suspicious of anything urgent and too good. Wealth kept is wealth earned this period.',
  },
}
