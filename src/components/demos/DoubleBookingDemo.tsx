import { Play, RotateCcw } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import {
  GUARD_CODE,
  LEO,
  MAYA,
  clock,
  overlaps,
  range,
  simulate,
  type Booking,
  type Guard,
  type SlotChoice,
} from './double-booking'
import { Badge, Segmented, useReducedMotion, type Tone } from './ui'

const GUARDS: { value: Guard; label: string }[] = [
  { value: 'check', label: 'Check, then insert' },
  { value: 'unique', label: 'Unique index' },
  { value: 'exclusion', label: 'Exclusion constraint' },
]

const SLOTS: { value: SlotChoice; label: string }[] = [
  { value: 'same', label: range(LEO.same) },
  { value: 'overlap', label: range(LEO.overlap) },
  { value: 'adjacent', label: range(LEO.adjacent) },
]

const outcomeTone = { 'double-booked': 'danger', refused: 'success', 'both-booked': 'success' } as const

const outcomeBox: Record<Tone, string> = {
  danger: 'border-danger/40 bg-danger/8',
  success: 'border-success/40 bg-success/8',
  warning: '',
  accent: '',
  neutral: '',
}

/** Where a booking sits on the 10:00 to 11:00 axis, as CSS percentages. */
function place(booking: Pick<Booking, 'start' | 'end'>) {
  return { left: `${(booking.start / 60) * 100}%`, width: `${((booking.end - booking.start) / 60) * 100}%` }
}

export function DoubleBookingDemo() {
  const [guard, setGuard] = useState<Guard>('check')
  const [choice, setChoice] = useState<SlotChoice>('overlap')
  /** How many steps are on screen; null until the button is pressed. */
  const [shown, setShown] = useState<number | null>(null)
  const reduced = useReducedMotion()

  const leo = LEO[choice]
  const { steps, outcome } = useMemo(() => simulate(guard, choice), [guard, choice])
  const done = shown !== null && shown >= steps.length
  const rows = shown ? steps[shown - 1].rows : []
  const leoRefused = done && !rows.includes(leo)

  // Play the steps out one at a time, so the interleaving can be followed.
  useEffect(() => {
    if (shown === null || shown >= steps.length) return
    const timer = window.setTimeout(() => setShown((count) => (count ?? 0) + 1), shown === 0 ? 200 : 800)
    return () => window.clearTimeout(timer)
  }, [shown, steps.length])

  function run() {
    setShown(reduced ? steps.length : 0)
  }

  const overlap =
    done && outcome.kind === 'double-booked' && overlaps(MAYA, leo)
      ? { start: Math.max(MAYA.start, leo.start), end: Math.min(MAYA.end, leo.end) }
      : null

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <div>
            <p className="mb-1.5 text-xs text-fg-subtle">How the app stops double-booking</p>
            <Segmented
              label="Guard"
              value={guard}
              options={GUARDS}
              onChange={(value) => {
                setGuard(value)
                setShown(null)
              }}
            />
          </div>
          <div>
            <p className="mb-1.5 text-xs text-fg-subtle">
              Maya asks for {range(MAYA)}. Leo asks for:
            </p>
            <Segmented
              label="Leo's time"
              value={choice}
              options={SLOTS}
              onChange={(value) => {
                setChoice(value)
                setShown(null)
              }}
            />
          </div>
        </div>
        <button type="button" onClick={run} disabled={shown !== null && !done} className="btn btn-primary self-start lg:self-auto">
          {done ? <RotateCcw className="size-4" aria-hidden /> : <Play className="size-4" aria-hidden />}
          {done ? 'Run it again' : 'Both press Book at once'}
        </button>
      </div>

      {/* Dr. Osei's morning: requested times as outlines, stored rows as solid bars. */}
      <figure aria-label="Dr. Osei's calendar from 10:00 to 11:00" className="rounded-lg border border-border bg-bg p-3.5">
        <div className="relative ml-12 h-4 text-[0.6875rem] text-fg-subtle">
          {[0, 15, 30, 45, 60].map((minute) => (
            <span
              key={minute}
              // The last label hangs left of its tick so it stays inside the box.
              className={`absolute font-mono tabular-nums ${minute === 60 ? '-translate-x-full' : '-translate-x-1/2'}`}
              style={{ left: `${(minute / 60) * 100}%` }}
            >
              {clock(minute)}
            </span>
          ))}
        </div>
        <div className="relative mt-2 space-y-2">
          {[MAYA, leo].map((booking) => {
            const stored = rows.includes(booking)
            const refused = booking === leo && leoRefused
            return (
              <div key={booking.patient} className="flex items-center gap-3">
                <span className="w-9 shrink-0 text-xs font-medium">{booking.patient}</span>
                <div className="relative h-8 flex-1 rounded-md bg-surface-2">
                  <div
                    className={`absolute inset-y-0 flex items-center justify-center rounded-md border text-[0.6875rem] font-medium transition-all duration-300 ${
                      refused
                        ? 'border-danger border-dashed text-danger'
                        : stored
                          ? booking.patient === 'Maya'
                            ? 'border-accent bg-accent text-accent-fg'
                            : 'border-fg bg-fg text-bg'
                          : 'border-dashed border-border-strong text-fg-subtle'
                    }`}
                    style={place(booking)}
                  >
                    {refused ? 'refused' : stored ? 'booked' : 'asking'}
                  </div>
                </div>
              </div>
            )
          })}
          {overlap && (
            <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 left-12">
              <div
                className="absolute -inset-y-1 rounded-md border-2 border-danger bg-[repeating-linear-gradient(135deg,transparent_0_6px,var(--danger-soft)_6px_10px)]"
                style={place(overlap)}
              />
            </div>
          )}
        </div>
        <figcaption className="sr-only">
          {done ? outcome.title : 'Nothing has been booked yet.'}
        </figcaption>
      </figure>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
        <div>
          <p className="mb-2 text-xs text-fg-subtle">What the database sees, in order</p>
          {shown === null ? (
            <p className="rounded-lg border border-dashed border-border px-3.5 py-6 text-center text-sm text-fg-subtle">
              Press the button to send both requests at the same moment.
            </p>
          ) : (
            <ol className="space-y-1.5" aria-live="polite">
              {steps.slice(0, shown).map((step, index) => (
                <li
                  key={index}
                  className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1 rounded-lg border border-border bg-bg px-3 py-2 font-mono text-xs"
                >
                  <Badge tone={step.actor === 'A' ? 'accent' : 'neutral'}>{step.actor === 'A' ? 'Maya' : 'Leo'}</Badge>
                  <span className="text-fg">{step.action}</span>
                  <span className={step.ok ? 'text-fg-subtle' : 'font-medium text-danger'}>→ {step.result}</span>
                </li>
              ))}
            </ol>
          )}

          {done && (
            <div className={`mt-3 rounded-lg border px-3.5 py-3 ${outcomeBox[outcomeTone[outcome.kind]]}`}>
              <p className={`text-sm font-semibold ${outcome.kind === 'double-booked' ? 'text-danger' : 'text-success'}`}>
                {outcome.title}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-fg-muted">{outcome.detail}</p>
            </div>
          )}
        </div>

        <div className="min-w-0">
          <p className="mb-2 text-xs text-fg-subtle">
            {guard === 'exclusion'
              ? "The guard: Care Track's migration 0003"
              : guard === 'unique'
                ? 'The guard: the index Care Track started with'
                : 'The guard: a check in application code'}
          </p>
          <pre className="overflow-x-auto rounded-lg border border-border bg-surface-2 p-3.5 font-mono text-[0.75rem] leading-relaxed text-fg-muted">
            <code>{GUARD_CODE[guard]}</code>
          </pre>
        </div>
      </div>
    </div>
  )
}
