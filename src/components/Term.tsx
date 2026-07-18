import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { GLOSSARY } from '../content/glossary'

const EDGE_MARGIN = 12

/**
 * Inline glossary term with a hover (desktop) / tap (touch) tooltip.
 *
 * Click sets open to true rather than toggling: a mouse click is preceded
 * by a synthetic mouseenter (which already opened it), and most mobile
 * browsers fire the same synthetic mouseenter before a tap's click — a
 * toggle there would close the tooltip in the same gesture that opened it.
 * Tapping/clicking outside closes it instead.
 */
export function Term({ children, k }: { children: React.ReactNode; k: string }) {
  const [open, setOpen] = useState(false)
  const [shift, setShift] = useState(0)
  const rootRef = useRef<HTMLSpanElement>(null)
  const tipRef = useRef<HTMLSpanElement>(null)
  const def = GLOSSARY[k]

  useLayoutEffect(() => {
    if (!open || !tipRef.current) return
    const rect = tipRef.current.getBoundingClientRect()
    let delta = 0
    if (rect.left < EDGE_MARGIN) delta = EDGE_MARGIN - rect.left
    else if (rect.right > window.innerWidth - EDGE_MARGIN) {
      delta = window.innerWidth - EDGE_MARGIN - rect.right
    }
    if (delta !== 0) setShift(delta)
  }, [open])

  useEffect(() => {
    if (!open) return
    const close = (e: MouseEvent | TouchEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false)
        setShift(0)
      }
    }
    document.addEventListener('click', close, true)
    document.addEventListener('touchstart', close, true)
    return () => {
      document.removeEventListener('click', close, true)
      document.removeEventListener('touchstart', close, true)
    }
  }, [open])

  if (!def) return <>{children}</>
  return (
    <span
      className="term"
      ref={rootRef}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => { setOpen(false); setShift(0) }}
      onClick={() => setOpen(true)}
      role="button"
      tabIndex={0}
      aria-label={`${k}: ${def}`}
    >
      {children}
      {open && (
        <span
          className="tip"
          ref={tipRef}
          style={shift ? { transform: `translateX(calc(-50% + ${shift}px))` } : undefined}
        >
          {def}
        </span>
      )}
    </span>
  )
}
