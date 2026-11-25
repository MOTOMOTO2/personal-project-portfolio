/**
 * The model behind "Try to double-book a clinic" (Care Track).
 *
 * Two patients press Book for overlapping times at the same moment. Each guard
 * is played out step by step, interleaved the way two real requests can be.
 * The three guards are the history of Care Track's booking table: a check in
 * application code, the unique index it started with, and the exclusion
 * constraint that replaced it (drizzle/0003_appointment_no_overlap.sql).
 */

export type Guard = 'check' | 'unique' | 'exclusion'
export type SlotChoice = 'same' | 'overlap' | 'adjacent'

/** Minutes after 10:00, as a half-open range [start, end). */
export type Booking = { patient: 'Maya' | 'Leo'; start: number; end: number }

export type Step = {
  /** A is Maya's request, B is Leo's. */
  actor: 'A' | 'B'
  action: string
  result: string
  ok: boolean
  /** The appointments table after this step. */
  rows: Booking[]
}

export type Outcome = {
  kind: 'double-booked' | 'refused' | 'both-booked'
  title: string
  detail: string
}

export const MAYA: Booking = { patient: 'Maya', start: 0, end: 30 }

export const LEO: Record<SlotChoice, Booking> = {
  same: { patient: 'Leo', start: 0, end: 30 },
  overlap: { patient: 'Leo', start: 15, end: 45 },
  adjacent: { patient: 'Leo', start: 30, end: 60 },
}

export const GUARD_CODE: Record<Guard, string> = {
  check: `// Look first, then write
const clash = await findOverlapping(practitioner, slot)
if (!clash) await db.insert(appointments).values(slot)`,
  unique: `CREATE UNIQUE INDEX appointments_active_slot_unique
  ON appointments (practitioner_id, starts_at)
  WHERE status IN ('pending', 'confirmed');`,
  exclusion: `ALTER TABLE appointments ADD CONSTRAINT appointments_no_overlap
  EXCLUDE USING gist (
    practitioner_id WITH =,
    tstzrange(starts_at, ends_at, '[)') WITH &&
  ) WHERE (status NOT IN ('cancelled', 'declined'));`,
}

export function clock(minutes: number): string {
  const total = 10 * 60 + minutes
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`
}

export function range(booking: Booking): string {
  return `${clock(booking.start)}–${clock(booking.end)}`
}

/** Half-open ranges: 10:00–10:30 and 10:30–11:00 touch but do not overlap. */
export function overlaps(a: Booking, b: Booking): boolean {
  return a.start < b.end && b.start < a.end
}

function overlapText(a: Booking, b: Booking): string {
  return `${clock(Math.max(a.start, b.start))}–${clock(Math.min(a.end, b.end))}`
}

const inserted = 'INSERT 0 1'

export function simulate(guard: Guard, choice: SlotChoice): { steps: Step[]; outcome: Outcome } {
  const leo = LEO[choice]
  const clash = overlaps(MAYA, leo)
  const steps: Step[] = []

  if (guard === 'check') {
    // Both reads run before either write: the interleaving that breaks it.
    steps.push(
      { actor: 'A', action: `SELECT overlapping ${range(MAYA)}`, result: '0 rows: looks free', ok: true, rows: [] },
      { actor: 'B', action: `SELECT overlapping ${range(leo)}`, result: '0 rows: looks free', ok: true, rows: [] },
      { actor: 'A', action: `INSERT Maya ${range(MAYA)}`, result: inserted, ok: true, rows: [MAYA] },
      { actor: 'B', action: `INSERT Leo ${range(leo)}`, result: inserted, ok: true, rows: [MAYA, leo] },
    )
    return {
      steps,
      outcome: clash
        ? {
            kind: 'double-booked',
            title: `Double-booked: two patients at ${overlapText(MAYA, leo)}`,
            detail:
              'Both requests checked before either one wrote, so both saw a free slot. Any check in application code has this gap, however carefully it is written.',
          }
        : bothBooked,
    }
  }

  steps.push({ actor: 'A', action: `INSERT Maya ${range(MAYA)}`, result: inserted, ok: true, rows: [MAYA] })

  if (guard === 'unique') {
    const sameStart = leo.start === MAYA.start
    steps.push(
      sameStart
        ? {
            actor: 'B',
            action: `INSERT Leo ${range(leo)}`,
            result: 'ERROR 23505: duplicate key violates "appointments_active_slot_unique"',
            ok: false,
            rows: [MAYA],
          }
        : { actor: 'B', action: `INSERT Leo ${range(leo)}`, result: inserted, ok: true, rows: [MAYA, leo] },
    )
    return {
      steps,
      outcome: sameStart
        ? {
            kind: 'refused',
            title: 'Caught, this time',
            detail:
              'Both bookings start at 10:00, so the index sees the same key twice. It only compares start times, though. Try the overlapping slot.',
          }
        : clash
          ? {
              kind: 'double-booked',
              title: `Double-booked: two patients at ${overlapText(MAYA, leo)}`,
              detail:
                'The start times differ, so the index sees two different slots. This is what happens after a practitioner changes their slot length, which is why Care Track replaced it.',
            }
          : bothBooked,
    }
  }

  steps.push(
    clash
      ? {
          actor: 'B',
          action: `INSERT Leo ${range(leo)}`,
          result: 'ERROR 23P01: conflicting key violates "appointments_no_overlap"',
          ok: false,
          rows: [MAYA],
        }
      : { actor: 'B', action: `INSERT Leo ${range(leo)}`, result: inserted, ok: true, rows: [MAYA, leo] },
  )
  return {
    steps,
    outcome: clash
      ? {
          kind: 'refused',
          title: 'Refused by the database',
          detail:
            'Postgres compares the two time ranges itself, so only one insert can win, whatever the timing. Leo sees "Someone just booked this time. Pick another time."',
        }
      : {
          kind: 'both-booked',
          title: 'Both booked, correctly',
          detail:
            'The ranges are half-open, [10:00, 10:30) and [10:30, 11:00), so back-to-back appointments touch without overlapping.',
        },
  }
}

const bothBooked: Outcome = {
  kind: 'both-booked',
  title: 'Both booked, correctly',
  detail: 'The slots only touch at 10:30, so there is nothing to stop.',
}
