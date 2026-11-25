/* eslint-disable react/only-export-components -- a small kit of demo building
   blocks plus one hook; none of them hold state worth preserving on reload. */
import type { ReactNode } from 'react'
import { useState } from 'react'

/** Small building blocks shared by the hands-on demos, styled from the site palette. */

export function useReducedMotion(): boolean {
  const [reduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true,
  )
  return reduced
}

type Option<T extends string> = { value: T; label: ReactNode }

/** A row of toggle buttons where exactly one is pressed. */
export function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: T
  options: Option<T>[]
  onChange: (value: T) => void
}) {
  return (
    <div role="group" aria-label={label} className="inline-flex flex-wrap gap-0.5 rounded-lg border border-border bg-surface-2 p-0.5">
      {options.map((option) => {
        const active = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors sm:text-[0.8125rem] ${
              active ? 'bg-surface text-fg shadow-sm ring-1 ring-border' : 'text-fg-muted hover:text-fg'
            }`}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

/** An on/off switch with its label inside the button, so it is always announced. */
export function Switch({
  checked,
  onChange,
  children,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="inline-flex items-center gap-2 rounded-lg py-1 pr-1 text-sm text-fg-muted transition-colors hover:text-fg"
    >
      <span
        aria-hidden
        className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border transition-colors ${
          checked ? 'border-accent bg-accent' : 'border-border-strong bg-surface-2'
        }`}
      >
        <span
          className={`absolute top-0.5 size-3.5 rounded-full shadow-sm transition-transform ${
            checked ? 'translate-x-4 bg-accent-fg' : 'translate-x-0.5 bg-fg-subtle'
          }`}
        />
      </span>
      {children}
    </button>
  )
}

export type Tone = 'success' | 'warning' | 'danger' | 'accent' | 'neutral'

const toneClass: Record<Tone, string> = {
  success: 'bg-success/12 text-success',
  warning: 'bg-warning/15 text-warning',
  danger: 'bg-danger/12 text-danger',
  accent: 'bg-accent-soft text-accent',
  neutral: 'bg-surface-2 text-fg-muted',
}

export function Badge({ tone, children }: { tone: Tone; children: ReactNode }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-md px-1.5 py-0.5 font-mono text-[0.6875rem] font-medium whitespace-nowrap ${toneClass[tone]}`}
    >
      {children}
    </span>
  )
}

/** A titled box inside a demo: the phone, the server, the database, etc. */
export function Panel({
  title,
  icon,
  aside,
  children,
  className = '',
}: {
  title: ReactNode
  icon?: ReactNode
  aside?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section className={`flex min-w-0 flex-col rounded-lg border border-border bg-bg ${className}`}>
      <header className="flex items-center justify-between gap-3 border-b border-border px-3.5 py-2.5">
        <h3 className="flex items-center gap-2 text-sm font-medium">
          {icon}
          {title}
        </h3>
        {aside}
      </header>
      <div className="flex-1 p-3.5">{children}</div>
    </section>
  )
}

export function Hint({ children }: { children: ReactNode }) {
  return <p className="rounded-lg bg-surface-2 px-3.5 py-2.5 text-sm leading-relaxed text-fg-muted">{children}</p>
}
