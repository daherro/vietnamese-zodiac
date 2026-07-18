import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import type { BirthChart } from '../hooks/useBirthChart'
import { CHI } from '../lib/canchi/tables'

/**
 * The wow moment: the lunar conversion narrated line by line before the
 * chart resolves. Showing the conversion IS showing our work.
 */
export function Reveal({ chart, onDone }: { chart: BirthChart; onDone: () => void }) {
  const [step, setStep] = useState(0)
  const { pillars } = chart
  const hourName = pillars.hour ? CHI[pillars.hour.chi.index].name : null

  const lines = [
    <>
      Born on the <strong>{ordinal(pillars.lunar.day)} day</strong> of the{' '}
      <strong>
        {pillars.lunar.isLeapMonth ? 'leap ' : ''}
        {ordinal(pillars.lunar.month)} lunar month
      </strong>
      …
    </>,
    <>
      …in the year of <strong>{pillars.year.name}</strong>
      {hourName && (
        <>
          , in the hour of <strong>{hourName}</strong>
        </>
      )}
      …
    </>,
    <>
      Your bản mệnh: <strong>{pillars.year.napAm.name}</strong> —{' '}
      {pillars.year.napAm.meaning}.
    </>,
  ]

  useEffect(() => {
    // step 0: initial pause before the first line. Steps 1..lines.length:
    // each line shows for the same 1500ms. One extra step past the last
    // line lets it fade out (matching the others) before onDone fires,
    // instead of cutting straight to the result page mid-line.
    if (step > lines.length) {
      const t = setTimeout(onDone, 500)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setStep((s) => s + 1), step === 0 ? 400 : 1500)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])

  return (
    <div className="reveal">
      <AnimatePresence mode="wait">
        {step > 0 && step <= lines.length && (
          <motion.p
            key={step}
            className="line"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
          >
            {lines[step - 1]}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}
