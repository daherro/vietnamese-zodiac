import { useState } from 'react'
import { GLOSSARY } from '../content/glossary'

/** Inline glossary term with a tap/hover tooltip definition. */
export function Term({ children, k }: { children: React.ReactNode; k: string }) {
  const [open, setOpen] = useState(false)
  const def = GLOSSARY[k]
  if (!def) return <>{children}</>
  return (
    <span
      className="term"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onClick={() => setOpen((o) => !o)}
      role="button"
      tabIndex={0}
      aria-label={`${k}: ${def}`}
    >
      {children}
      {open && <span className="tip">{def}</span>}
    </span>
  )
}
