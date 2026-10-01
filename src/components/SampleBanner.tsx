import { X } from 'lucide-react'
import { useState } from 'react'
import { SHOW_SAMPLE_BANNER } from '../data/site'

/**
 * Reminder that the shipped content is sample data. Set SHOW_SAMPLE_BANNER to
 * false in `src/data/site.ts` once you have replaced it with your own.
 */
export function SampleBanner() {
  const [dismissed, setDismissed] = useState(false)
  if (!SHOW_SAMPLE_BANNER || dismissed) return null

  return (
    <div className="bg-accent text-accent-fg">
      <div className="container-page flex items-center gap-3 py-2 text-sm">
        <p className="flex-1">
          <strong className="font-semibold">Sample content.</strong> Edit{' '}
          <code className="font-mono">src/data/site.ts</code> to make this yours, then set{' '}
          <code className="font-mono">SHOW_SAMPLE_BANNER</code> to <code className="font-mono">false</code>.
        </p>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss notice"
          className="rounded p-1 transition hover:bg-black/10"
        >
          <X className="size-4" aria-hidden />
        </button>
      </div>
    </div>
  )
}
