import { Check, Link2 } from 'lucide-react'
import { useState } from 'react'
import { site } from '../data/site'
import { featuredFor, joinTitles, useLens } from '../lib/lens'

/**
 * "Hiring for" in the Selected work header: one row of choices that swaps the
 * large cards below for the projects that matter most to that kind of role.
 * The choice is in the URL, so it can be sent as a link.
 */
export function HiringLens() {
  const { lens, setLens } = useLens()
  const [copied, setCopied] = useState(false)

  if (site.lenses.length === 0) return null

  async function copyLink() {
    if (!lens) return
    const url = new URL(`${import.meta.env.BASE_URL}?for=${lens.id}`, window.location.origin)
    try {
      await navigator.clipboard.writeText(url.href)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard can be blocked; the address bar already holds the same link.
    }
  }

  const options = [{ id: null, label: 'Everything' }, ...site.lenses.map((option) => ({ id: option.id, label: option.label }))]

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
      <span id="lens-label" className="label text-fg-subtle">
        Hiring for
      </span>
      <div role="group" aria-labelledby="lens-label" className="inline-flex flex-wrap gap-0.5 border border-border bg-surface p-0.5">
        {options.map((option) => {
          const active = (lens?.id ?? null) === option.id
          return (
            <button
              key={option.label}
              type="button"
              aria-pressed={active}
              onClick={() => setLens(option.id)}
              className={`h-8 px-3 font-mono text-[0.75rem] tracking-wide transition-colors ${
                active ? 'bg-fg text-bg' : 'text-fg-muted hover:bg-surface-2 hover:text-fg'
              }`}
            >
              {option.label}
            </button>
          )
        })}
      </div>
      {lens && (
        <button
          type="button"
          onClick={copyLink}
          className="inline-flex h-8 items-center gap-1.5 px-2 font-mono text-[0.75rem] text-fg-muted transition-colors hover:text-fg"
        >
          {copied ? <Check className="size-3.5 text-success" aria-hidden /> : <Link2 className="size-3.5" aria-hidden />}
          {copied ? 'Copied' : 'Copy link'}
        </button>
      )}
      <p aria-live="polite" className="sr-only">
        {lens ? `Showing ${joinTitles(featuredFor(lens).map((project) => project.title))} first.` : ''}
      </p>
    </div>
  )
}
