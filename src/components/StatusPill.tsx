import type { Project } from '../data/types'

const styles: Record<Project['status'], string> = {
  Shipped: 'bg-emerald-500/12 text-emerald-700 dark:text-emerald-300',
  'In progress': 'bg-amber-500/12 text-amber-700 dark:text-amber-300',
  Prototype: 'bg-sky-500/12 text-sky-700 dark:text-sky-300',
  Archived: 'bg-zinc-500/12 text-zinc-600 dark:text-zinc-400',
}

export function StatusPill({ status }: { status: Project['status'] }) {
  return (
    <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${styles[status]}`}>
      {status}
    </span>
  )
}
