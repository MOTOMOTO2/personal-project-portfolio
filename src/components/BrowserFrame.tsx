import type { ReactNode } from 'react'

/**
 * A screenshot dressed as a browser window: three dots and an address bar,
 * so a project reads as a real thing at a real address.
 */
export function BrowserFrame({ address, children }: { address: string | null; children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-card">
      <div aria-hidden className="flex items-center gap-3 border-b border-border bg-surface-2 px-3.5 py-2.5">
        <span className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-[#ff5f57]/85" />
          <span className="size-2.5 rounded-full bg-[#febc2e]/85" />
          <span className="size-2.5 rounded-full bg-[#28c840]/85" />
        </span>
        {address && (
          <span className="mx-auto max-w-[70%] min-w-0 truncate rounded-md bg-surface px-3 py-0.5 font-mono text-[0.6875rem] text-fg-subtle ring-1 ring-border">
            {address}
          </span>
        )}
      </div>
      <div className="overflow-hidden bg-surface-2">{children}</div>
    </div>
  )
}
