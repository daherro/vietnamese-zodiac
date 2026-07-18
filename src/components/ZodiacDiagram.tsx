import { motion } from 'motion/react'
import type { Pillar } from '../lib/canchi/pillars'
import { ELEMENT_NAMES } from '../lib/canchi/tables'
import { Term } from './Term'

const ART = import.meta.glob<{ default: string }>('../assets/animals/*.png', { eager: true })

function artFor(chiIndex: number): string | null {
  const keys = ['ty', 'suu', 'dan', 'mao', 'thin', 'ti', 'ngo', 'mui', 'than', 'dau', 'tuat', 'hoi']
  const hit = Object.entries(ART).find(([path]) => path.includes(`/${keys[chiIndex]}.png`))
  return hit ? hit[1].default : null
}

export function ZodiacDiagram({ year }: { year: Pillar }) {
  const art = artFor(year.chi.index)
  const el = ELEMENT_NAMES[year.napAm.element]

  return (
    <div className="zodiac-hero">
      <motion.div
        className="medallion"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        {art ? (
          <img src={art} alt={`${year.chi.animal} — ${year.chi.animalEn}`} />
        ) : (
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(56px, 10vw, 84px)',
              color: 'var(--gold)',
            }}
          >
            {year.chi.name}
          </span>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.6 }}
      >
        <h1>
          {year.chi.name} — {year.chi.animal}
        </h1>
        <p className="sub">
          Year of the {year.chi.animalEn} · <Term k="Can Chi">{year.name}</Term>
        </p>
        <p style={{ marginTop: 10 }}>
          <span className={`chip el-${year.napAm.element}`}>
            <Term k="Bản mệnh">
              {year.napAm.name} · {el.en}
            </Term>
          </span>
        </p>
      </motion.div>
    </div>
  )
}
