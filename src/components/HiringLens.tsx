import { ArrowDown, Check, Link2 } from 'lucide-react'
import { useState } from 'react'
import { site } from '../data/site'
import { featuredFor, joinTitles, useLens } from '../lib/lens'

const chipClass = (active: boolean) =>
  `inline-flex h-8 items-center rounded-full border px-3.5 text-sm transition-colors ${
    active
      ? 'border-fg bg-fg font-medium text-bg'
      : 'border-border bg-surface text-fg-muted hover:border-border-strong hover:text-fg'
  }`

/**
 * "What are you hiring for?" Picking an answer swaps the large rows below for
 * the projects that matter most to that kind of role and highlights the
 * matching skills. The choice is in the URL, so it can be sent as a link.
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

  const picks = featuredFor(lens).map((project) => project.title)

  return (
    <div className="rounded-xl border border-border bg-surface/85 p-4 shadow-card backdrop-blur-sm sm:p-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-6">
        <p id="lens-label" className="eyebrow shrink-0">
          What are you hiring for?
        </p>
        <div role="group" aria-labelledby="lens-label" className="flex flex-wrap gap-1.5">
          <button type="button" aria-pressed={!lens} onClick={() => setLens(null)} className={chipClass(!lens)}>
            Everything
          </button>
          {site.lenses.map((option) => (
            <button
              key={option.id}
              type="button"
              aria-pressed={lens?.id === option.id}
              onClick={() => setLens(option.id)}
              className={chipClass(lens?.id === option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border pt-3 text-sm text-fg-muted">
        <p aria-live="polite" className="min-w-0 flex-1 basis-64">
          {lens ? (
            <>
              Showing <span className="font-medium text-fg">{joinTitles(picks)}</span> first.
            </>
          ) : (
            'Pick one and the page puts the projects that matter most for that role first.'
          )}
        </p>
        <div className="flex items-center gap-1">
          <a
            href="#work"
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 transition-colors hover:bg-surface-2 hover:text-fg"
          >
            See the work
            <ArrowDown className="size-3.5" aria-hidden />
          </a>
          {lens && (
            <button
              type="button"
              onClick={copyLink}
              className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 transition-colors hover:bg-surface-2 hover:text-fg"
            >
              {copied ? (
                <Check className="size-3.5 text-success" aria-hidden />
              ) : (
                <Link2 className="size-3.5" aria-hidden />
              )}
              {copied ? 'Link copied' : 'Copy link to this view'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
