import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { site } from '../data/site'
import type { ConsoleLine } from '../data/types'
import { useLens } from '../lib/lens'

const toneClass: Record<ConsoleLine['tone'], string> = {
  ok: 'text-emerald-400',
  refused: 'text-rose-400',
  merged: 'text-sky-400',
  waiting: 'text-amber-300',
}

const toneMark: Record<ConsoleLine['tone'], string> = { ok: '✓', refused: '✕', merged: '⇄', waiting: '…' }

const titles = new Map(site.projects.map((project) => [project.slug, project.title]))

/** How long each phase of a line takes, in ms. */
const TYPE_MS = 26
const RESULT_PAUSE_MS = 380
const NEXT_LINE_MS = 900
const VISIBLE = 5

/**
 * The hero's terminal: one line per project, each a thing that project really
 * does, typed out in turn. A line links to its project. With reduced motion
 * the lines are simply listed.
 */
export function LiveConsole() {
  const lines = site.console
  const [reduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true,
  )
  // Which line is being typed, and how much of it is on screen. It starts a
  // few lines in, so the console is already full on first sight.
  const [current, setCurrent] = useState(VISIBLE - 1)
  const [typed, setTyped] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const { query } = useLens()

  const line = lines[current % lines.length]

  useEffect(() => {
    if (reduced || lines.length === 0) return
    let timer: number
    if (typed < line.command.length) {
      timer = window.setTimeout(() => setTyped((count) => count + 1), TYPE_MS)
    } else if (!showResult) {
      timer = window.setTimeout(() => setShowResult(true), RESULT_PAUSE_MS)
    } else {
      timer = window.setTimeout(() => {
        setCurrent((index) => index + 1)
        setTyped(0)
        setShowResult(false)
      }, NEXT_LINE_MS)
    }
    return () => window.clearTimeout(timer)
  }, [reduced, typed, showResult, line, lines.length])

  if (lines.length === 0) return null

  // Finished lines scroll up; the newest stays at the bottom.
  const finished = reduced
    ? lines
    : Array.from({ length: Math.min(current, VISIBLE - 1) }, (_, back) => lines[(current - 1 - back) % lines.length]).reverse()

  const row = (entry: ConsoleLine, key: string, partial?: { typed: number; result: boolean }) => {
    const done = !partial || partial.result
    return (
      <li key={key} className="group">
        <Link
          to={`/projects/${entry.slug}${query}`}
          className="-mx-2 block rounded-md px-2 py-1.5 transition-colors hover:bg-white/5"
          aria-label={`${titles.get(entry.slug)}: ${entry.command}, ${entry.result}`}
        >
          <span className="flex items-baseline gap-2">
            <span className="shrink-0 text-[#ff8a5c]">{entry.slug}</span>
            <span className="text-white/35">$</span>
            <span className="min-w-0 text-white/85">
              {partial ? entry.command.slice(0, partial.typed) : entry.command}
              {partial && !partial.result && (
                <span aria-hidden className="ml-0.5 inline-block h-3.5 w-1.5 translate-y-0.5 animate-caret bg-white/70" />
              )}
            </span>
          </span>
          {done && (
            <span className={`mt-0.5 block pl-4 ${toneClass[entry.tone]}`}>
              {toneMark[entry.tone]} {entry.result}
            </span>
          )}
        </Link>
      </li>
    )
  }

  return (
    <figure
      aria-label="What my projects do, as a terminal"
      className="overflow-hidden rounded-2xl border border-ink-border bg-ink text-[0.8125rem] shadow-[0_30px_80px_-30px_rgb(0_0_0/0.6)] ring-1 ring-white/5"
    >
      <figcaption className="flex items-center gap-2 border-b border-ink-border bg-ink-2 px-4 py-2.5">
        <span aria-hidden className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full bg-[#febc2e]" />
          <span className="size-2.5 rounded-full bg-[#28c840]" />
        </span>
        <span className="ml-2 font-mono text-xs text-white/45">~/projects · what they do</span>
        <span className="ml-auto flex items-center gap-1.5 font-mono text-[0.6875rem] text-emerald-400/90">
          <span aria-hidden className="size-1.5 rounded-full bg-emerald-400" />
          {site.projects.filter((project) => project.status === 'Live').length} live
        </span>
      </figcaption>
      <ol className="min-h-[19.5rem] space-y-0.5 px-4 py-3 font-mono leading-relaxed" aria-live="off">
        {finished.map((entry, index) => row(entry, `done-${current}-${index}`))}
        {!reduced && row(line, `typing-${current}`, { typed, result: showResult })}
      </ol>
    </figure>
  )
}
