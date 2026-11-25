import { RotateCcw, Server, Smartphone, Wifi, WifiOff } from 'lucide-react'
import { useReducer } from 'react'
import { FIELDS, FIELD_LABEL, initialState, reducer, type LogItem } from './sync-merge'
import { Badge, Hint, Panel, Switch, type Tone } from './ui'

const statusTone: Record<NonNullable<LogItem['status']>, Tone> = {
  applied: 'success',
  merged: 'accent',
  conflict: 'danger',
  replayed: 'neutral',
  queued: 'warning',
}

export function SyncMergeDemo() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const { phone, server, log } = state
  const conflict = phone.conflict
  const pending = phone.outbox

  return (
    <div className="space-y-4">
      <Hint>
        Try this: switch the phone <strong className="font-medium text-fg">offline</strong>, change the note on it,
        change the <em>amount</em> on the other device, then come back online. Then do it again, changing the{' '}
        <em>same</em> field on both.
      </Hint>

      <div className="grid gap-4 md:grid-cols-2">
        <Panel
          title="Your phone"
          icon={<Smartphone className="size-4 text-fg-subtle" aria-hidden />}
          aside={
            <Switch checked={phone.online} onChange={() => dispatch({ type: 'toggle-online' })}>
              {phone.online ? (
                <Wifi className="size-3.5" aria-hidden />
              ) : (
                <WifiOff className="size-3.5 text-warning" aria-hidden />
              )}
              {phone.online ? 'Online' : 'Offline'}
            </Switch>
          }
        >
          <dl className="divide-y divide-border">
            {FIELDS.map((field) => {
              const unsent = pending?.patch[field] !== undefined || conflict?.op.patch[field] !== undefined
              return (
                <div key={field} className="flex items-center gap-3 py-2 first:pt-0">
                  <dt className="w-18 shrink-0 text-xs text-fg-subtle">{FIELD_LABEL[field]}</dt>
                  <dd className="flex min-w-0 flex-1 items-center gap-2 text-sm font-medium">
                    <span className="truncate">{phone.entry[field]}</span>
                    {unsent && (
                      <span className="size-1.5 shrink-0 rounded-full bg-warning" title="Not on the server yet" />
                    )}
                  </dd>
                  <button
                    type="button"
                    disabled={Boolean(conflict)}
                    onClick={() => dispatch({ type: 'phone-edit', field })}
                    aria-label={`Change ${FIELD_LABEL[field].toLowerCase()} on the phone`}
                    className="btn btn-secondary h-7 shrink-0 px-2.5 text-xs disabled:opacity-50"
                  >
                    Change
                  </button>
                </div>
              )
            })}
          </dl>

          <p className="mt-3 border-t border-border pt-3 text-xs text-fg-muted">
            {pending ? (
              <>
                <span className="font-medium text-warning">Outbox: 1 op</span>
                {pending.edits > 1 && ` (${pending.edits} edits compacted)`} · {pending.opId} based on rev{' '}
                {pending.baseRev}
              </>
            ) : (
              <>Outbox empty · last saw rev {phone.seenRev}</>
            )}
          </p>

          {conflict && (
            <div role="alert" className="mt-3 rounded-lg border border-danger/40 bg-danger/8 p-3">
              <p className="text-sm font-semibold text-danger">Changed on both devices</p>
              <p className="mt-0.5 text-xs text-fg-muted">Nothing was overwritten. Which one should stay?</p>
              {conflict.fields.map((field) => (
                <div key={field} className="mt-2.5">
                  <p className="mb-1.5 text-xs text-fg-subtle">{FIELD_LABEL[field]}</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {(['mine', 'theirs'] as const).map((side) => (
                      <button
                        key={side}
                        type="button"
                        onClick={() => dispatch({ type: 'resolve', field, pick: side })}
                        className="rounded-md border border-border bg-surface px-2.5 py-2 text-left transition-colors hover:border-accent"
                      >
                        <span className="block text-[0.6875rem] text-fg-subtle">
                          {side === 'mine' ? 'This phone' : 'Other device'}
                        </span>
                        <span className="block truncate text-sm font-medium">
                          {side === 'mine' ? conflict.mine[field] : conflict.theirs[field]}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Panel>

        <Panel
          title="Server"
          icon={<Server className="size-4 text-fg-subtle" aria-hidden />}
          aside={<Badge tone="neutral">rev {server.rev}</Badge>}
        >
          <dl className="divide-y divide-border">
            {FIELDS.map((field) => (
              <div key={field} className="flex items-center gap-3 py-2 first:pt-0">
                <dt className="w-18 shrink-0 text-xs text-fg-subtle">{FIELD_LABEL[field]}</dt>
                <dd className="min-w-0 flex-1 truncate text-sm font-medium">{server.entry[field]}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-3 border-t border-border pt-3">
            <p className="mb-1.5 text-xs text-fg-subtle">Meanwhile, on another device, change the…</p>
            <div className="flex flex-wrap gap-1.5">
              {FIELDS.map((field) => (
                <button
                  key={field}
                  type="button"
                  onClick={() => dispatch({ type: 'other-edit', field })}
                  aria-label={`Change ${FIELD_LABEL[field].toLowerCase()} on the other device`}
                  className="btn btn-secondary h-7 px-2.5 text-xs"
                >
                  {FIELD_LABEL[field].toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-3 border-t border-border pt-3">
            <p className="mb-1.5 text-xs text-fg-subtle">Field change log (what moved at each revision)</p>
            {server.log.length === 0 ? (
              <p className="text-xs text-fg-subtle">No changes since rev 3.</p>
            ) : (
              <ul className="space-y-1 font-mono text-xs">
                {server.log
                  .slice(-4)
                  .reverse()
                  .map((change) => (
                    <li key={change.rev} className="flex gap-2 text-fg-muted">
                      <span className="text-fg">rev {change.rev}</span>
                      <span>{change.fields.join(', ')}</span>
                      <span className="text-fg-subtle">· {change.by === 'phone' ? 'phone' : 'other device'}</span>
                    </li>
                  ))}
              </ul>
            )}
          </div>
        </Panel>
      </div>

      <div className="rounded-lg border border-border bg-bg">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-3.5 py-2">
          <p className="text-xs text-fg-subtle">Sync log, newest first</p>
          <div className="flex gap-1">
            <button
              type="button"
              disabled={!phone.lastPushed || !phone.online}
              onClick={() => dispatch({ type: 'replay' })}
              className="btn btn-secondary h-7 px-2.5 text-xs disabled:opacity-50"
            >
              Retry last push (lost response)
            </button>
            <button
              type="button"
              onClick={() => dispatch({ type: 'reset' })}
              className="btn btn-secondary h-7 px-2.5 text-xs"
            >
              <RotateCcw className="size-3.5" aria-hidden />
              Start over
            </button>
          </div>
        </div>
        <ol aria-live="polite" className="max-h-60 space-y-1.5 overflow-y-auto p-3.5">
          {log.length === 0 && <li className="text-sm text-fg-subtle">Nothing yet. Change something.</li>}
          {log.map((item) => (
            <li key={item.id} className="flex items-start gap-2.5 text-sm">
              <Badge tone={item.status ? statusTone[item.status] : 'neutral'}>
                {item.status ?? (item.who === 'other' ? 'other' : 'phone')}
              </Badge>
              <span className="leading-snug text-fg-muted">{item.text}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
