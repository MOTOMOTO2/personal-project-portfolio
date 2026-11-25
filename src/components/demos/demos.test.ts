import { describe, expect, it } from 'vitest'
import { PROJECTS, complete, newJob, schedule, type Job } from './agent-queue'
import { LEO, MAYA, overlaps, simulate, type Guard, type SlotChoice } from './double-booking'
import { MAX_ATTEMPTS, backoffMs, nextDue, retry, send, settle, type Conditions, type Report } from './outbox'
import { initialState, push, reducer, type Action, type State } from './sync-merge'

describe('double-booking model (Care Track)', () => {
  it('treats ranges as half-open, so back-to-back slots do not overlap', () => {
    expect(overlaps(MAYA, LEO.same)).toBe(true)
    expect(overlaps(MAYA, LEO.overlap)).toBe(true)
    expect(overlaps(MAYA, LEO.adjacent)).toBe(false)
  })

  it('lets a check in application code double-book when both reads come first', () => {
    const { steps, outcome } = simulate('check', 'overlap')
    expect(steps.map((step) => step.action.split(' ')[0])).toEqual(['SELECT', 'SELECT', 'INSERT', 'INSERT'])
    expect(outcome.kind).toBe('double-booked')
  })

  it('shows the unique index catching an identical start but missing an overlap', () => {
    expect(simulate('unique', 'same').outcome.kind).toBe('refused')
    expect(simulate('unique', 'same').steps[1].result).toContain('23505')
    expect(simulate('unique', 'overlap').outcome.kind).toBe('double-booked')
  })

  it('never double-books with the exclusion constraint, and still allows adjacent slots', () => {
    for (const choice of ['same', 'overlap'] as SlotChoice[]) {
      const { steps, outcome } = simulate('exclusion', choice)
      expect(outcome.kind, choice).toBe('refused')
      expect(steps.at(-1)?.result, choice).toContain('23P01')
      expect(steps.at(-1)?.rows, choice).toEqual([MAYA])
    }
    expect(simulate('exclusion', 'adjacent').outcome.kind).toBe('both-booked')
  })

  it('never calls an adjacent booking a double booking, whatever the guard', () => {
    for (const guard of ['check', 'unique', 'exclusion'] as Guard[]) {
      expect(simulate(guard, 'adjacent').outcome.kind, guard).toBe('both-booked')
    }
  })
})

describe('sync model (Tally)', () => {
  const run = (...actions: Action[]): State => actions.reduce(reducer, initialState)
  const offline: Action = { type: 'toggle-online' }
  const online: Action = { type: 'toggle-online' }

  it('applies an edit made online straight away', () => {
    const state = run({ type: 'phone-edit', field: 'note' })
    expect(state.server.rev).toBe(4)
    expect(state.server.entry.note).toBe(state.phone.entry.note)
    expect(state.log[0].status).toBe('applied')
  })

  it('merges stale edits to different fields, keeping both', () => {
    const state = run(offline, { type: 'phone-edit', field: 'note' }, { type: 'other-edit', field: 'amount' }, online)
    expect(state.log.find((item) => item.status)?.status).toBe('merged')
    expect(state.server.entry.note).toBe('Split with Sam')
    expect(state.server.entry.amount).toBe('$48.50')
    expect(state.phone.entry).toEqual(state.server.entry)
    expect(state.phone.conflict).toBeNull()
  })

  it('stops on stale edits to the same field and applies nothing', () => {
    const before = run(offline, { type: 'phone-edit', field: 'amount' }, { type: 'other-edit', field: 'amount' })
    const state = reducer(before, online)
    expect(state.phone.conflict?.fields).toEqual(['amount'])
    expect(state.server.rev).toBe(before.server.rev)
    expect(state.server.entry.amount).toBe('$48.50')
    expect(state.phone.conflict?.mine.amount).toBe('$45.00')
  })

  it('resolves a conflict with a fresh op that lands first time', () => {
    const conflicted = run(offline, { type: 'phone-edit', field: 'amount' }, { type: 'other-edit', field: 'amount' }, online)
    const mine = reducer(conflicted, { type: 'resolve', field: 'amount', pick: 'mine' })
    expect(mine.phone.conflict).toBeNull()
    expect(mine.server.entry.amount).toBe('$45.00')
    expect(mine.log[0].status).toBe('applied')

    const theirs = reducer(conflicted, { type: 'resolve', field: 'amount', pick: 'theirs' })
    expect(theirs.server.rev).toBe(conflicted.server.rev)
    expect(theirs.phone.entry.amount).toBe('$48.50')
  })

  it('keeps the untouched fields of a conflicted op when resolving', () => {
    const state = run(
      offline,
      { type: 'phone-edit', field: 'amount' },
      { type: 'phone-edit', field: 'note' },
      { type: 'other-edit', field: 'amount' },
      online,
      { type: 'resolve', field: 'amount', pick: 'theirs' },
    )
    expect(state.server.entry.amount).toBe('$48.50')
    expect(state.server.entry.note).toBe('Split with Sam')
  })

  it('compacts repeated offline edits into one op', () => {
    const state = run(
      offline,
      { type: 'phone-edit', field: 'note' },
      { type: 'phone-edit', field: 'note' },
      { type: 'phone-edit', field: 'amount' },
    )
    expect(state.phone.outbox?.edits).toBe(3)
    expect(Object.keys(state.phone.outbox?.patch ?? {})).toEqual(['note', 'amount'])
  })

  it('replays a retried push from the ledger instead of applying it twice', () => {
    const state = run({ type: 'phone-edit', field: 'note' })
    const op = state.phone.lastPushed!
    const again = push(state.server, op)
    expect(again.replayed).toBe(true)
    expect(again.server.rev).toBe(state.server.rev)
    expect(reducer(state, { type: 'replay' }).server.rev).toBe(state.server.rev)
  })
})

describe('outbox model (Field Reports)', () => {
  const report = (overrides: Partial<Report> = {}): Report => ({
    id: 'r-1',
    note: 'Grate bent',
    recordedAt: 1_000,
    state: 'pending',
    attempts: 0,
    nextAttemptAt: 0,
    invalid: false,
    message: null,
    ...overrides,
  })
  const ok: Conditions = { signal: true, serverDown: false, loseResponse: false }

  it('backs off exponentially with ±25% jitter, capped at five minutes', () => {
    expect(backoffMs(1, () => 0.5)).toBe(2_000)
    expect(backoffMs(3, () => 0.5)).toBe(8_000)
    expect(backoffMs(1, () => 0)).toBe(1_500)
    expect(backoffMs(1, () => 1)).toBe(2_500)
    expect(backoffMs(30, () => 0.5)).toBe(300_000)
  })

  it('does not count a dead network as a try', () => {
    const outcome = send(report(), [], { ...ok, signal: false }, 5_000)
    expect(outcome.kind).toBe('no-network')
    expect(settle(report(), outcome, 5_000).attempts).toBe(0)
  })

  it('stores a report once, keeps its recorded time, and answers a replay as a duplicate', () => {
    const lost = send(report(), [], { ...ok, loseResponse: true }, 9_000)
    expect(lost.kind).toBe('lost-response')
    const rows = 'rows' in lost ? lost.rows : []
    expect(rows).toEqual([{ id: 'r-1', note: 'Grate bent', recordedAt: 1_000, receivedAt: 9_000 }])

    const replay = send(report(), rows, ok, 12_000)
    expect(replay.kind).toBe('duplicate')
    expect('rows' in replay && replay.rows).toHaveLength(1)
  })

  it('parks a report the server refuses, because retrying cannot help', () => {
    const outcome = send(report({ invalid: true }), [], ok, 0)
    expect(outcome.kind).toBe('rejected')
    expect(settle(report(), outcome, 0).state).toBe('parked')
  })

  it('retries a 503 with backoff and gives up after the last try', () => {
    let current = report()
    for (let attempt = 1; attempt < MAX_ATTEMPTS; attempt++) {
      current = settle(current, { kind: 'server-error' }, 0, () => 0.5)
      expect(current.state).toBe('pending')
      expect(nextDue([current], 0)).toBeUndefined()
    }
    current = settle(current, { kind: 'server-error' }, 0)
    expect(current.state).toBe('parked')
    expect(nextDue([retry(current, 0)], 0)?.id).toBe('r-1')
  })
})

describe('agent queue model (Claude Remote)', () => {
  const queue = (projects: string[]): Job[] =>
    projects.reduce<Job[]>((jobs, project, index) => [...jobs, newJob(index + 1, project, jobs, () => 0)], [])

  it('runs no more agents than the ceiling', () => {
    const { jobs, waits } = schedule(queue(['revvault', 'tally', 'bluffalo']), { ceiling: 2, desktopOn: true }, 0)
    expect(jobs.filter((job) => job.state === 'running')).toHaveLength(2)
    expect(waits.get(3)?.kind).toBe('slot')
  })

  it('gives each project one agent, and later jobs on it wait their turn', () => {
    const { jobs, waits } = schedule(queue(['tally', 'tally', 'revvault']), { ceiling: 6, desktopOn: true }, 0)
    expect(jobs.map((job) => job.state)).toEqual(['running', 'waiting', 'running'])
    expect(waits.get(2)?.kind).toBe('project')
  })

  it('names the project before the slot when both hold a job back', () => {
    const { waits } = schedule(queue(['tally', 'tally']), { ceiling: 1, desktopOn: true }, 0)
    expect(waits.get(2)?.kind).toBe('project')
  })

  it('moves to the cloud when the desktop sleeps, except for desktop-only projects', () => {
    const desktopOnly = PROJECTS.find((project) => project.desktopOnly)!.id
    const { jobs, waits } = schedule(queue(['revvault', desktopOnly]), { ceiling: 4, desktopOn: false }, 0)
    expect(jobs[0]).toMatchObject({ state: 'running', where: 'cloud' })
    expect(jobs[1].state).toBe('waiting')
    expect(waits.get(2)?.kind).toBe('desktop')
  })

  it('frees a slot when a job finishes', () => {
    const first = schedule(queue(['revvault', 'tally']), { ceiling: 1, desktopOn: true }, 0).jobs
    const later = schedule(complete(first, 60_000), { ceiling: 1, desktopOn: true }, 60_000).jobs
    expect(later.map((job) => job.state)).toEqual(['done', 'running'])
  })
})
