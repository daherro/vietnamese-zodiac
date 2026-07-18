import { useState } from 'react'

/**
 * Read-only link field with a copy button and, where supported, the
 * OS share sheet (navigator.share — iOS/Android/some desktop browsers).
 * Share button only renders when the API actually exists; there's no
 * good fallback for it, so it's progressive enhancement rather than
 * something the page tries to polyfill.
 */
export function ShareLink({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false)
  const canShare = typeof navigator !== 'undefined' && !!navigator.share

  async function copy() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      // Clipboard API can refuse (insecure context, permissions); the
      // input itself remains selectable/copyable by hand as a fallback.
    }
  }

  async function share() {
    try {
      await navigator.share({ title, url })
    } catch {
      // AbortError when the user cancels the share sheet — not an error.
    }
  }

  return (
    <div className="share-line">
      <input readOnly value={url} onFocus={(e) => e.target.select()} aria-label="share link" />
      <button
        type="button"
        className="btn btn-ghost btn-icon"
        onClick={copy}
        aria-label="Copy link"
        title="Copy link"
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
      </button>
      {canShare && (
        <button
          type="button"
          className="btn btn-ghost btn-icon"
          onClick={share}
          aria-label="Share"
          title="Share"
        >
          <ShareIcon />
        </button>
      )}
    </div>
  )
}

function CopyIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="9" y="9" width="12" height="12" rx="2" />
      <path d="M5 15V5a2 2 0 0 1 2-2h10" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 12l6 6L20 6" />
    </svg>
  )
}

function ShareIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3v12" />
      <path d="M7.5 7.5L12 3l4.5 4.5" />
      <rect x="4" y="11" width="16" height="10" rx="2" />
    </svg>
  )
}
