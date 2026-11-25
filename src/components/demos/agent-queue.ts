/**
 * The model behind "Queue more agents than there are slots" (Claude Remote).
 *
 * The rules the fleet screen enforces:
 * - at most `ceiling` agents run at once (you set 1 to 6);
 * - each project gets at most one agent, and its jobs run in the order queued;
 * - with the desktop awake, jobs run there; asleep, they start in a Vercel
 *   Sandbox named after the project instead;
 * - a project that exists only as a folder on the desktop always waits for it;
 * - every waiting job says what it is waiting for, its own project first.
 */

export type ProjectInfo = { id: string; desktopOnly: boolean; prompts: string[] }

export const PROJECTS: ProjectInfo[] = [
  { id: 'revvault', desktopOnly: false, prompts: ['Add a price-history chart', 'Fix the flaky Kijiji test'] },
  { id: 'tally', desktopOnly: false, prompts: ['Add CSV export', 'Show budgets on the home screen'] },
  { id: 'bluffalo', desktopOnly: false, prompts: ['Add a family-friendly question pack', 'Show who wrote each lie'] },
  { id: 'notes', desktopOnly: true, prompts: ['Tidy up the README', 'Sort notes by last edit'] },
]

const byId = new Map(PROJECTS.map((project) => [project.id, project]))

export type Job = {
  id: number
  project: string
  prompt: string
  state: 'waiting' | 'running' | 'done'
  where: 'desktop' | 'cloud' | null
  startedAt: number | null
  finishedAt: number | null
  /** How long it takes once started, in ms. */
  duration: number
}

export type Wait = { kind: 'project' | 'slot' | 'desktop'; text: string }

export type Settings = { ceiling: number; desktopOn: boolean }

/** Finish anything whose time is up. */
export function complete(jobs: Job[], now: number): Job[] {
  return jobs.map((job) =>
    job.state === 'running' && job.startedAt !== null && now - job.startedAt >= job.duration
      ? { ...job, state: 'done', finishedAt: now }
      : job,
  )
}

/**
 * Start every waiting job that may start, and say why each of the rest is
 * waiting. Walks the queue in order, so an earlier job is never overtaken by a
 * later one on the same project.
 */
export function schedule(jobs: Job[], settings: Settings, now: number): { jobs: Job[]; waits: Map<number, Wait> } {
  const running = jobs.filter((job) => job.state === 'running')
  const busy = new Map(running.map((job) => [job.project, 'running' as 'running' | 'queued']))
  let count = running.length
  const waits = new Map<number, Wait>()

  const next = jobs.map((job) => {
    if (job.state !== 'waiting') return job
    const project = byId.get(job.project)
    const ahead = busy.get(job.project)
    busy.set(job.project, ahead ?? 'queued')

    if (ahead) {
      waits.set(job.id, {
        kind: 'project',
        text:
          ahead === 'running'
            ? `Waiting for its own project: ${job.project} already has an agent`
            : `Waiting for its own project: an earlier ${job.project} job goes first`,
      })
      return job
    }
    if (count >= settings.ceiling) {
      waits.set(job.id, { kind: 'slot', text: `Waiting for a free slot: ${count} of ${settings.ceiling} running` })
      return job
    }
    if (project?.desktopOnly && !settings.desktopOn) {
      waits.set(job.id, {
        kind: 'desktop',
        text: `Waiting for the desktop: ${job.project} only exists there, and it's asleep`,
      })
      return job
    }

    count += 1
    busy.set(job.project, 'running')
    return { ...job, state: 'running' as const, where: settings.desktopOn ? ('desktop' as const) : ('cloud' as const), startedAt: now }
  })

  return { jobs: next, waits }
}

/** A plausible line for the tail of a running agent's log. */
export function logLine(job: Job, now: number): string {
  if (job.startedAt === null) return ''
  const progress = Math.min(1, (now - job.startedAt) / job.duration)
  const lines = [
    job.where === 'cloud' ? `Resuming the cr-job-${job.project} snapshot` : `Opening ${job.project} on the desktop`,
    'Reading CLAUDE.md',
    'Editing src/…',
    'Running the tests',
    'Committing',
    'Pushing to GitHub',
  ]
  return lines[Math.min(lines.length - 1, Math.floor(progress * lines.length))]
}

export function newJob(id: number, project: string, queued: Job[], random: () => number = Math.random): Job {
  const info = byId.get(project)
  const sameProject = queued.filter((job) => job.project === project).length
  const prompts = info?.prompts ?? ['Make a change']
  return {
    id,
    project,
    prompt: prompts[sameProject % prompts.length],
    state: 'waiting',
    where: null,
    startedAt: null,
    finishedAt: null,
    duration: 5_000 + Math.round(random() * 4_000),
  }
}
