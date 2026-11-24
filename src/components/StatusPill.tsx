import type { ProjectStatus } from '../data/types'

const dot: Record<ProjectStatus, string> = {
  Live: 'bg-success',
  'In progress': 'bg-warning',
  Complete: 'bg-fg-subtle',
}

/** A coloured dot and the status in words, so colour is never the only signal. */
export function StatusPill({ status }: { status: ProjectStatus }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium whitespace-nowrap text-fg-muted">
      <span aria-hidden className={`size-1.5 rounded-full ${dot[status]}`} />
      {status}
    </span>
  )
}
