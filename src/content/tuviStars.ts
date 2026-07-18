/**
 * One-to-two-line interpretations per star (shown in palace detail).
 * Standard Tử Vi readings, phrased plainly. The palace the star sits in
 * says where in life this energy concentrates.
 */

import type { AuxStarKey, MainStarKey } from '../lib/tuvi/stars'

export const STAR_MEANINGS: Record<MainStarKey | AuxStarKey, string> = {
  'tu-vi':
    'The Emperor star. Dignity, command, and a center of gravity other people organize around. Where it sits, you are meant to lead rather than wait.',
  'thien-co':
    'The Strategist. A quick, restless intelligence that sees the mechanism inside things. Strong in planning, happiest with a problem to turn over.',
  'thai-duong':
    'The Sun. Visibility, generosity, public life. This energy wants to shine outward and give; it dims when kept indoors.',
  'vu-khuc':
    'The General of Wealth. Discipline, decisiveness, and money earned by resolve rather than luck. A hard-edged star that softens with age.',
  'thien-dong':
    'The Child of Fortune. Ease, optimism, and the gift of starting over lightly. Blessings arrive here with less struggle than they should.',
  'liem-trinh':
    'The Upright One. Principle wound tight with intensity. This star burns through reinventions and holds grudges against injustice.',
  'thien-phu':
    'The Treasurer. Stewardship, stability, and quiet authority. It gathers, keeps, and steadies whatever palace it occupies.',
  'thai-am':
    'The Moon. Intuition, home, and wealth that accumulates quietly. This energy works by night: subtle, receptive, deep.',
  'tham-lang':
    'The Star of Desire. Appetite, charisma, longevity of wanting. The most human star: its gifts and its trouble come from the same hunger.',
  'cu-mon':
    'The Great Gate. Speech, scrutiny, hard questions. Sharp-tongued and truth-hungry; it wins arguments and must watch what those wins cost.',
  'thien-tuong':
    'The Chancellor. Fairness, service, the steady hand that carries out what the Emperor intends. People trust this energy with the keys.',
  'thien-luong':
    'The Elder. Protection, wisdom, medicine, second chances. Where it sits, disasters tend to graze rather than strike.',
  'that-sat':
    'The Marshal. Decisiveness, risk, the clean break. This star does not negotiate with half-measures; it cuts and moves.',
  'pha-quan':
    'The Vanguard. Demolition before renewal. It breaks what is finished so something can be built; turbulent early, formidable once aimed.',
  'ta-phu':
    'The Left Assistant. Allies who arrive when actually needed. A helper star that multiplies whatever main star it accompanies.',
  'huu-bat':
    'The Right Assistant. Quiet support and lifted burdens, often from people who never take credit.',
  'van-xuong':
    'The Scholar. Letters, clarity, examinations. Favors study, writing, and the well-made argument.',
  'van-khuc':
    'The Artist. Eloquence, art, the romance of language. Where Văn Xương writes the treatise, Văn Khúc writes the poem.',
  'loc-ton':
    'The Keeper of Salary. Steady accumulation and security that compounds. Not windfall luck: the slower, surer kind.',
}
