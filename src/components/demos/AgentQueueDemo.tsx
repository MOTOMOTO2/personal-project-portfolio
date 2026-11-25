import { Cloud, Hourglass, Layers, Minus, Monitor, MonitorOff, Plus, RotateCcw, Zap } from 'lucide-react'
import { useEffect, useReducer } from 'react'
import { PROJECTS, complete, logLine, newJob, schedule, type Job, type Settings, type Wait } from './agent-queue'
import { Badge, Hint, Panel, Switch } from './ui'

type State = { jobs: Job[]; settings: Settings; nextId: number; now: number }

type Action =
  | { type: 'tick'; now: number }
  /** `randoms` sets each job's duration; drawn outside so the reducer stays pure. */
  | { type: 'queue'; projects: string[]; randoms: number[]; now: number }
  | { type: 'ceiling'; delta: number; now: number }
  | { type: 'desktop'; on: boolean; now: number }
  | { type: 'reset' }

const initial: State = { jobs: [], settings: { ceiling: 2, desktopOn: true }, nextId: 1, now: 0 }

/** Every action ends the same way: finish what's due, then start what may start. */
function advance(state: State, now: number): State {
  return { ...state, now, jobs: schedule(complete(state.jobs, now), state.settings, now).jobs }
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'tick':
      return advance(state, action.now)
    case 'queue': {
      let { jobs, nextId } = state
      action.projects.forEach((project, index) => {
        jobs = [...jobs, newJob(nextId, project, jobs, () => action.randoms[index] ?? 0.5)]
        nextId += 1
      })
      return advance({ ...state, jobs, nextId }, action.now)
    }
    case 'ceiling': {
      const ceiling = Math.min(6, Math.max(1, state.settings.ceiling + action.delta))
      return advance({ ...state, settings: { ...state.settings, ceiling } }, action.now)
    }
    case 'desktop':
      return advance({ ...state, settings: { ...state.settings, desktopOn: action.on } }, action.now)
    case 'reset':
      return initial
  }
}

const RUSH = ['revvault', 'tally', 'revvault', 'bluffalo', 'notes', 'tally']

/** Clock and dice are read here, at the click, so the reducer stays pure. */
function queueAction(projects: string[]): Action {
  return { type: 'queue', projects, randoms: projects.map(() => Math.random()), now: Date.now() }
}

const waitIcon: Record<Wait['kind'], typeof Layers> = { project: Layers, slot: Hourglass, desktop: MonitorOff }

export function AgentQueueDemo() {
  const [state, dispatch] = useReducer(reducer, initial)
  const { jobs, settings, now } = state

  const running = jobs.filter((job) => job.state === 'running')
  const waiting = jobs.filter((job) => job.state === 'waiting')
  const done = jobs.filter((job) => job.state === 'done')
  const active = running.length > 0 || waiting.length > 0
  const { waits } = schedule(jobs, settings, now)

  useEffect(() => {
    if (!active) return
    const timer = window.setInterval(() => dispatch({ type: 'tick', now: Date.now() }), 300)
    return () => window.clearInterval(timer)
  }, [active])

  return (
    <div className="space-y-4">
      <Hint>
        Queue a rush, then lower the ceiling or put the desktop to sleep. Jobs that can't start yet say exactly what
        they are waiting for: a free slot, their own project, or a desktop that isn't there.
      </Hint>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 rounded-lg border border-border bg-bg px-3.5 py-3">
        <div className="flex items-center gap-2 text-sm text-fg-muted">
          <span id="ceiling-label">Agents at once</span>
          <div role="group" aria-labelledby="ceiling-label" className="inline-flex items-center rounded-lg border border-border">
            <button
              type="button"
              aria-label="Fewer agents at once"
              disabled={settings.ceiling <= 1}
              onClick={() => dispatch({ type: 'ceiling', delta: -1, now: Date.now() })}
              className="grid size-8 place-items-center text-fg-muted transition-colors hover:text-fg disabled:opacity-40"
            >
              <Minus className="size-3.5" aria-hidden />
            </button>
            <output aria-live="polite" className="w-6 text-center font-mono text-sm font-medium text-fg tabular-nums">
              {settings.ceiling}
            </output>
            <button
              type="button"
              aria-label="More agents at once"
              disabled={settings.ceiling >= 6}
              onClick={() => dispatch({ type: 'ceiling', delta: 1, now: Date.now() })}
              className="grid size-8 place-items-center text-fg-muted transition-colors hover:text-fg disabled:opacity-40"
            >
              <Plus className="size-3.5" aria-hidden />
            </button>
          </div>
        </div>
        <Switch checked={settings.desktopOn} onChange={(on) => dispatch({ type: 'desktop', on, now: Date.now() })}>
          {settings.desktopOn ? <Monitor className="size-3.5" aria-hidden /> : <MonitorOff className="size-3.5" aria-hidden />}
          Desktop {settings.desktopOn ? 'awake' : 'asleep'}
        </Switch>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <span className="mr-1 text-xs text-fg-subtle">Queue a job on</span>
        {PROJECTS.map((project) => (
          <button
            key={project.id}
            type="button"
            onClick={() => dispatch(queueAction([project.id]))}
            className="btn btn-secondary h-8 px-2.5 font-mono text-xs"
          >
            <Plus className="size-3" aria-hidden />
            {project.id}
            {project.desktopOnly && <span className="font-sans text-fg-subtle">(desktop only)</span>}
          </button>
        ))}
        <button
          type="button"
          onClick={() => dispatch(queueAction(RUSH))}
          className="btn btn-primary h-8 px-3 text-xs"
        >
          <Zap className="size-3.5" aria-hidden />
          Queue a rush of 6
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <Panel title="Running" aside={<Badge tone="accent">{running.length} of {settings.ceiling}</Badge>}>
          {running.length === 0 ? (
            <p className="text-sm text-fg-subtle">No agents running.</p>
          ) : (
            <ul className="space-y-2" aria-live="polite">
              {running.map((job) => {
                const progress = job.startedAt === null ? 0 : Math.min(1, (now - job.startedAt) / job.duration)
                return (
                  <li key={job.id} className="rounded-md border border-border px-3 py-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs font-medium">{job.project}</span>
                      {job.where === 'cloud' ? (
                        <Badge tone="accent">
                          <Cloud className="mr-1 size-3" aria-hidden />
                          cr-job-{job.project}
                        </Badge>
                      ) : (
                        <Badge tone="neutral">
                          <Monitor className="mr-1 size-3" aria-hidden />
                          desktop
                        </Badge>
                      )}
                    </div>
                    <p className="mt-1 truncate text-sm">{job.prompt}</p>
                    <div className="mt-2 h-1 overflow-hidden rounded-full bg-surface-2">
                      <div className="h-full rounded-full bg-accent transition-[width] duration-300" style={{ width: `${progress * 100}%` }} />
                    </div>
                    <p className="mt-1.5 truncate font-mono text-[0.6875rem] text-fg-subtle">› {logLine(job, now)}</p>
                  </li>
                )
              })}
            </ul>
          )}
        </Panel>

        <div className="space-y-4">
          <Panel title="Waiting" aside={<Badge tone={waiting.length ? 'warning' : 'neutral'}>{waiting.length}</Badge>}>
            {waiting.length === 0 ? (
              <p className="text-sm text-fg-subtle">Nothing waiting.</p>
            ) : (
              <ul className="space-y-1.5">
                {waiting.map((job) => {
                  const wait = waits.get(job.id)
                  const Icon = wait ? waitIcon[wait.kind] : Hourglass
                  return (
                    <li key={job.id} className="flex gap-2.5 rounded-md border border-border px-3 py-2">
                      <Icon className="mt-0.5 size-3.5 shrink-0 text-warning" aria-hidden />
                      <div className="min-w-0">
                        <p className="truncate text-sm">
                          <span className="font-mono text-xs font-medium">{job.project}</span> · {job.prompt}
                        </p>
                        <p className="mt-0.5 text-xs text-fg-muted">{wait?.text ?? 'Starting…'}</p>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </Panel>

          <Panel title="Done" aside={<Badge tone={done.length ? 'success' : 'neutral'}>{done.length}</Badge>}>
            {done.length === 0 ? (
              <p className="text-sm text-fg-subtle">Nothing finished yet.</p>
            ) : (
              <ul className="space-y-1">
                {done
                  .slice(-4)
                  .reverse()
                  .map((job) => (
                    <li key={job.id} className="flex items-baseline gap-2 text-sm">
                      <span className="font-mono text-xs font-medium">{job.project}</span>
                      <span className="min-w-0 flex-1 truncate text-fg-muted">{job.prompt}</span>
                      <span className="shrink-0 text-xs text-fg-subtle">
                        pushed · {job.where === 'cloud' ? 'cloud' : 'desktop'}
                      </span>
                    </li>
                  ))}
              </ul>
            )}
          </Panel>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-fg-subtle">
          A job the cloud has started finishes in the cloud, even if the desktop wakes up.
        </p>
        <button type="button" onClick={() => dispatch({ type: 'reset' })} className="btn btn-secondary h-8 px-3 text-xs">
          <RotateCcw className="size-3.5" aria-hidden />
          Start over
        </button>
      </div>
    </div>
  )
}
