import { RotateCcw, Send, Server, Smartphone, Wifi, WifiOff } from 'lucide-react'
import { useEffect, useReducer, useState } from 'react'
import { nextDue, retry, send, settle, type Conditions, type Report, type ServerRow } from './outbox'
import { Badge, Hint, Panel, Segmented, Switch } from './ui'

const NOTES = ['Debris cleared, flow normal', 'Grate bent, needs a welder', 'Erosion on the east bank', 'Access road flooded']

/** How long a POST takes here, so each send can be watched. */
const LATENCY_MS = 700
/** After a network failure the drain stops; the retry timer tries again after this. */
const RETRY_TICK_MS = 1_500

type State = {
  reports: Report[]
  rows: ServerRow[]
  conditions: Conditions
  invalidNext: boolean
  inFlight: string | null
  pausedUntil: number
  filed: number
}

type Action =
  | { type: 'file'; id: string; now: number }
  | { type: 'start'; id: string }
  | { type: 'finish'; now: number; random: number }
  | { type: 'retry'; id: string; now: number }
  | { type: 'discard'; id: string }
  | { type: 'conditions'; patch: Partial<Conditions> }
  | { type: 'invalid-next'; value: boolean }
  | { type: 'reset' }

const initial: State = {
  reports: [],
  rows: [],
  conditions: { signal: false, serverDown: false, loseResponse: false },
  invalidNext: false,
  inFlight: null,
  pausedUntil: 0,
  filed: 0,
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'file': {
      const report: Report = {
        id: action.id,
        note: NOTES[state.filed % NOTES.length],
        recordedAt: action.now,
        state: 'pending',
        attempts: 0,
        nextAttemptAt: action.now,
        invalid: state.invalidNext,
        message: null,
      }
      return { ...state, reports: [...state.reports, report], invalidNext: false, filed: state.filed + 1 }
    }
    case 'start':
      return {
        ...state,
        inFlight: action.id,
        reports: state.reports.map((report) => (report.id === action.id ? { ...report, state: 'sending' } : report)),
      }
    case 'finish': {
      const report = state.reports.find((candidate) => candidate.id === state.inFlight)
      if (!report) return { ...state, inFlight: null }
      const outcome = send(report, state.rows, state.conditions, action.now)
      const settled = settle(report, outcome, action.now, () => action.random)
      const stopped = outcome.kind === 'no-network' || outcome.kind === 'lost-response'
      return {
        ...state,
        inFlight: null,
        rows: 'rows' in outcome ? outcome.rows : state.rows,
        reports: state.reports.map((candidate) => (candidate.id === report.id ? settled : candidate)),
        // A lost response is a one-off: the next send goes through.
        conditions:
          outcome.kind === 'lost-response' ? { ...state.conditions, loseResponse: false } : state.conditions,
        pausedUntil: stopped ? action.now + RETRY_TICK_MS : state.pausedUntil,
      }
    }
    case 'retry':
      return {
        ...state,
        pausedUntil: 0,
        reports: state.reports.map((report) => (report.id === action.id ? retry(report, action.now) : report)),
      }
    case 'discard':
      return { ...state, reports: state.reports.filter((report) => report.id !== action.id) }
    case 'conditions':
      return {
        ...state,
        conditions: { ...state.conditions, ...action.patch },
        // Coming back online is a trigger in the real app too: send now.
        pausedUntil: action.patch.signal ? 0 : state.pausedUntil,
      }
    case 'invalid-next':
      return { ...state, invalidNext: action.value }
    case 'reset':
      return initial
  }
}

function time(ms: number): string {
  return new Date(ms).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', second: '2-digit' })
}

function shortId(): string {
  return `r-${Math.random().toString(16).slice(2, 6)}`
}

export function OutboxDemo() {
  const [state, dispatch] = useReducer(reducer, initial)
  const [now, setNow] = useState(() => Date.now())
  const { reports, rows, conditions, inFlight, pausedUntil } = state
  const waiting = reports.filter((report) => report.state === 'pending' || report.state === 'sending')
  const active = waiting.length > 0

  // The retry timer: ticks while anything is queued, which also keeps the
  // countdowns current.
  useEffect(() => {
    if (!active) return
    const timer = window.setInterval(() => setNow(Date.now()), 400)
    return () => window.clearInterval(timer)
  }, [active])

  // Start the next due report whenever nothing is in flight and there is signal.
  useEffect(() => {
    const at = Date.now()
    if (inFlight || !conditions.signal || at < pausedUntil) return
    const due = nextDue(reports, at)
    if (due) dispatch({ type: 'start', id: due.id })
  }, [now, reports, inFlight, conditions.signal, pausedUntil])

  // ...and finish it after the round trip.
  useEffect(() => {
    if (!inFlight) return
    const timer = window.setTimeout(
      () => dispatch({ type: 'finish', now: Date.now(), random: Math.random() }),
      LATENCY_MS,
    )
    return () => window.clearTimeout(timer)
  }, [inFlight])

  const strip = !conditions.signal
    ? { tone: 'warning' as const, text: waiting.length ? `No signal · ${waiting.length} waiting to send` : 'No signal' }
    : inFlight
      ? { tone: 'accent' as const, text: 'Sending…' }
      : waiting.length
        ? { tone: 'warning' as const, text: `${waiting.length} waiting to send` }
        : { tone: 'success' as const, text: reports.length ? 'Everything sent' : 'Online, nothing queued' }

  return (
    <div className="space-y-4">
      <Hint>
        The phone starts with <strong className="font-medium text-fg">no signal</strong>. File a couple of reports,
        then turn the signal on. After that, try breaking the server, losing a response, or sending a bad report.
      </Hint>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-3 rounded-lg border border-border bg-bg px-3.5 py-3">
        <Switch checked={conditions.signal} onChange={(signal) => dispatch({ type: 'conditions', patch: { signal } })}>
          {conditions.signal ? <Wifi className="size-3.5" aria-hidden /> : <WifiOff className="size-3.5" aria-hidden />}
          Signal
        </Switch>
        <Segmented
          label="Server"
          value={conditions.serverDown ? 'down' : 'ok'}
          options={[
            { value: 'ok', label: 'Server healthy' },
            { value: 'down', label: 'Server returns 503' },
          ]}
          onChange={(value) => dispatch({ type: 'conditions', patch: { serverDown: value === 'down' } })}
        />
        <Switch
          checked={conditions.loseResponse}
          onChange={(loseResponse) => dispatch({ type: 'conditions', patch: { loseResponse } })}
        >
          Lose the next response
        </Switch>
        <Switch checked={state.invalidNext} onChange={(value) => dispatch({ type: 'invalid-next', value })}>
          Next report is invalid (422)
        </Switch>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Panel title="Phone · Culvert C-14, Mill Rd" icon={<Smartphone className="size-4 text-fg-subtle" aria-hidden />}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Badge tone={strip.tone}>{strip.text}</Badge>
            <button
              type="button"
              onClick={() => dispatch({ type: 'file', id: shortId(), now: Date.now() })}
              className="btn btn-primary h-8 px-3 text-xs"
            >
              <Send className="size-3.5" aria-hidden />
              File a report
            </button>
          </div>

          <p className="mt-3 mb-1.5 text-xs text-fg-subtle">Outbox (saved on the phone before anything is sent)</p>
          {reports.length === 0 ? (
            <p className="text-sm text-fg-subtle">Empty.</p>
          ) : (
            <ul className="space-y-1.5" aria-live="polite">
              {reports.slice(-5).map((report) => {
                const backingOff = report.state === 'pending' && report.nextAttemptAt > now
                return (
                  <li
                    key={report.id}
                    className={`rounded-md border border-border px-2.5 py-2 ${report.state === 'sent' ? 'opacity-60' : ''}`}
                  >
                    <div className="flex items-center gap-2">
                      <Badge
                        tone={
                          report.state === 'sent'
                            ? 'success'
                            : report.state === 'parked'
                              ? 'danger'
                              : report.state === 'sending'
                                ? 'accent'
                                : 'warning'
                        }
                      >
                        {report.state === 'pending' ? (backingOff ? 'backing off' : 'waiting') : report.state}
                      </Badge>
                      <span className="min-w-0 flex-1 truncate text-sm">{report.note}</span>
                    </div>
                    <p className="mt-1 font-mono text-[0.6875rem] text-fg-subtle">
                      {report.id} · written {time(report.recordedAt)}
                      {backingOff && ` · next try in ${Math.ceil((report.nextAttemptAt - now) / 1000)}s`}
                    </p>
                    {report.message && <p className="mt-1 text-xs text-fg-muted">{report.message}</p>}
                    {(report.state === 'parked' || backingOff) && (
                      <div className="mt-1.5 flex gap-1">
                        <button
                          type="button"
                          onClick={() => dispatch({ type: 'retry', id: report.id, now: Date.now() })}
                          className="btn btn-secondary h-6 px-2 text-[0.6875rem]"
                        >
                          Retry now
                        </button>
                        <button
                          type="button"
                          onClick={() => dispatch({ type: 'discard', id: report.id })}
                          className="btn btn-secondary h-6 px-2 text-[0.6875rem]"
                        >
                          Discard
                        </button>
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </Panel>

        <Panel
          title="Server · reports table"
          icon={<Server className="size-4 text-fg-subtle" aria-hidden />}
          aside={<Badge tone="neutral">{rows.length} rows</Badge>}
        >
          {rows.length === 0 ? (
            <p className="text-sm text-fg-subtle">Nothing has arrived yet.</p>
          ) : (
            <ul className="space-y-1.5">
              {rows.slice(-6).map((row) => (
                <li key={row.id} className="rounded-md border border-border px-2.5 py-2">
                  <p className="truncate text-sm">{row.note}</p>
                  <p className="mt-1 font-mono text-[0.6875rem] text-fg-subtle">
                    {row.id} · recorded {time(row.recordedAt)} · arrived {time(row.receivedAt)}
                  </p>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-3 border-t border-border pt-3 text-xs leading-relaxed text-fg-muted">
            The id is made on the phone and used as an idempotency key, so a repeat send returns the stored report
            instead of a second row. The recorded time is kept, so a report that waited hours for a signal can't
            overwrite something newer.
          </p>
        </Panel>
      </div>

      <div className="flex justify-end">
        <button type="button" onClick={() => dispatch({ type: 'reset' })} className="btn btn-secondary h-8 px-3 text-xs">
          <RotateCcw className="size-3.5" aria-hidden />
          Start over
        </button>
      </div>
    </div>
  )
}
