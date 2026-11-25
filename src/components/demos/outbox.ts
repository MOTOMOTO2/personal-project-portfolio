/**
 * The model behind "File a report with no signal" (Field Reports).
 *
 * Mirrors flushOutbox in web/src/lib/outbox.ts:
 * - a report is written to the outbox first, with an id made on the phone;
 * - the server treats that id as an idempotency key: 201 the first time,
 *   200 ("already had it") on a replay;
 * - no network (or a response that never arrives) stops the drain without
 *   counting a try, because the rest would fail the same way;
 * - a 4xx other than 408/429 parks the report, since retrying can't help;
 * - a 5xx backs off exponentially with jitter, and parks after 8 tries.
 */

export const MAX_ATTEMPTS = 8

/** Exponential backoff with jitter: about 2s, 4s, 8s... capped at 5 minutes. */
export function backoffMs(attempts: number, random: () => number = Math.random): number {
  const base = Math.min(2 ** Math.max(0, attempts - 1) * 2_000, 5 * 60_000)
  return Math.round(base * (0.75 + random() * 0.5))
}

export type Report = {
  id: string
  note: string
  /** When it was written on the phone; the server keeps this, not arrival time. */
  recordedAt: number
  state: 'pending' | 'sending' | 'parked' | 'sent'
  attempts: number
  nextAttemptAt: number
  /** Filed with a value the server will refuse (422). */
  invalid: boolean
  message: string | null
}

export type ServerRow = { id: string; note: string; recordedAt: number; receivedAt: number }

export type Conditions = {
  signal: boolean
  serverDown: boolean
  /** The server stores the next report but its response never reaches the phone. */
  loseResponse: boolean
}

export type SendOutcome =
  | { kind: 'no-network' }
  | { kind: 'lost-response'; rows: ServerRow[] }
  | { kind: 'created' | 'duplicate'; rows: ServerRow[] }
  | { kind: 'rejected' }
  | { kind: 'server-error' }

/** The next report due to be sent, in the order they were filed. */
export function nextDue(reports: Report[], now: number): Report | undefined {
  return reports.find((report) => report.state === 'pending' && report.nextAttemptAt <= now)
}

/** What one POST does, given the conditions at the moment it is made. */
export function send(report: Report, rows: ServerRow[], conditions: Conditions, now: number): SendOutcome {
  if (!conditions.signal) return { kind: 'no-network' }
  if (conditions.serverDown) return { kind: 'server-error' }
  if (report.invalid) return { kind: 'rejected' }

  const known = rows.some((row) => row.id === report.id)
  const stored = known
    ? rows
    : [...rows, { id: report.id, note: report.note, recordedAt: report.recordedAt, receivedAt: now }]
  if (conditions.loseResponse) return { kind: 'lost-response', rows: stored }
  return { kind: known ? 'duplicate' : 'created', rows: stored }
}

/** The report after an outcome, following the same rules as the real outbox. */
export function settle(report: Report, outcome: SendOutcome, now: number, random?: () => number): Report {
  switch (outcome.kind) {
    case 'created':
      return { ...report, state: 'sent', message: '201 Created' }
    case 'duplicate':
      return { ...report, state: 'sent', message: '200: the server already had it, so no duplicate' }
    case 'no-network':
      return { ...report, state: 'pending', message: 'No signal: waiting, not counted as a try' }
    case 'lost-response':
      return {
        ...report,
        state: 'pending',
        message: "Sent, but the response was lost. The phone can't tell it arrived, so it keeps it",
      }
    case 'rejected':
      return { ...report, state: 'parked', message: "422: the server refused it. Retrying won't help" }
    case 'server-error': {
      const attempts = report.attempts + 1
      if (attempts >= MAX_ATTEMPTS) {
        return { ...report, state: 'parked', attempts, message: `503 (gave up after ${attempts} tries)` }
      }
      return {
        ...report,
        state: 'pending',
        attempts,
        nextAttemptAt: now + backoffMs(attempts, random),
        message: `503: try ${attempts} of ${MAX_ATTEMPTS}`,
      }
    }
  }
}

/** Put a parked report back in the queue and clear its backoff. */
export function retry(report: Report, now: number): Report {
  return { ...report, state: 'pending', attempts: 0, nextAttemptAt: now, message: null }
}
