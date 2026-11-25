/**
 * The model behind "Edit the same expense on two devices" (Tally).
 *
 * A cut-down copy of Tally's sync protocol (backend/app/sync.py):
 * - every op carries `baseRev`, the newest revision the phone had seen;
 * - the server logs which fields changed at each revision, so for a stale op
 *   it can intersect "what moved since baseRev" with "what this op changes";
 * - empty intersection: `merged`, both edits kept. Otherwise `conflict`,
 *   nothing applied, both values returned for a person to choose;
 * - every result is stored per op id, so a retried push is replayed, never
 *   applied twice;
 * - offline edits to one entry are compacted into a single op.
 */

export type Field = 'amount' | 'category' | 'note'
export type Entry = Record<Field, string>

export const FIELDS: Field[] = ['amount', 'category', 'note']
export const FIELD_LABEL: Record<Field, string> = { amount: 'Amount', category: 'Category', note: 'Note' }

export type Op = { opId: string; baseRev: number; patch: Partial<Entry>; edits: number }

export type PushResult =
  | { status: 'applied' | 'merged'; rev: number }
  | { status: 'conflict'; rev: number; fields: Field[]; theirs: Partial<Entry> }

export type Server = {
  entry: Entry
  rev: number
  /** Which fields changed at each revision, newest last. */
  log: { rev: number; fields: Field[]; by: 'phone' | 'other' }[]
  /** Stored result per op id: the idempotency ledger. */
  ledger: Record<string, PushResult>
}

export type Conflict = {
  op: Op
  rev: number
  fields: Field[]
  mine: Partial<Entry>
  theirs: Partial<Entry>
  choices: Partial<Record<Field, 'mine' | 'theirs'>>
}

export type LogItem = {
  id: number
  who: 'phone' | 'other'
  text: string
  status?: PushResult['status'] | 'replayed' | 'queued'
}

export type State = {
  server: Server
  phone: {
    online: boolean
    entry: Entry
    seenRev: number
    outbox: Op | null
    conflict: Conflict | null
    lastPushed: Op | null
  }
  log: LogItem[]
  nextId: number
}

export type Action =
  | { type: 'toggle-online' }
  | { type: 'phone-edit'; field: Field }
  | { type: 'other-edit'; field: Field }
  | { type: 'resolve'; field: Field; pick: 'mine' | 'theirs' }
  | { type: 'replay' }
  | { type: 'reset' }

const START: Entry = { amount: '$42.10', category: 'Groceries', note: 'Costco run' }

const PHONE_VALUES: Record<Field, string[]> = {
  amount: ['$45.00', '$39.99'],
  category: ['Household', 'Food'],
  note: ['Split with Sam', 'Costco + gas'],
}

const OTHER_VALUES: Record<Field, string[]> = {
  amount: ['$48.50', '$41.25'],
  category: ['Bulk buy', 'Errands'],
  note: ['Receipt in email', 'Monthly stock-up'],
}

export const initialState: State = {
  server: { entry: START, rev: 3, log: [], ledger: {} },
  phone: { online: true, entry: START, seenRev: 3, outbox: null, conflict: null, lastPushed: null },
  log: [],
  nextId: 1,
}

/** The next value in a field's cycle, never the one it already has. */
export function nextValue(values: string[], current: string): string {
  const index = values.indexOf(current)
  return values[(index + 1) % values.length]
}

function keys(patch: Partial<Entry>): Field[] {
  return FIELDS.filter((field) => field in patch)
}

function pick(entry: Partial<Entry>, fields: Field[]): Partial<Entry> {
  return Object.fromEntries(fields.map((field) => [field, entry[field]]))
}

/** The server's side of a push. Pure: returns the new server and the result. */
export function push(server: Server, op: Op): { server: Server; result: PushResult; replayed: boolean } {
  const stored = server.ledger[op.opId]
  if (stored) return { server, result: stored, replayed: true }

  const changing = keys(op.patch)
  const moved = new Set(server.log.filter((change) => change.rev > op.baseRev).flatMap((change) => change.fields))
  const clashing = changing.filter((field) => moved.has(field))

  let result: PushResult
  let next = server
  if (clashing.length > 0) {
    result = { status: 'conflict', rev: server.rev, fields: clashing, theirs: pick(server.entry, clashing) }
  } else {
    const rev = server.rev + 1
    result = { status: op.baseRev === server.rev ? 'applied' : 'merged', rev }
    next = {
      ...server,
      entry: { ...server.entry, ...op.patch },
      rev,
      log: [...server.log, { rev, fields: changing, by: 'phone' }],
    }
  }
  return { server: { ...next, ledger: { ...next.ledger, [op.opId]: result } }, result, replayed: false }
}

function describe(patch: Partial<Entry>): string {
  return keys(patch)
    .map((field) => FIELD_LABEL[field].toLowerCase())
    .join(' + ')
}

function addLog(state: State, item: Omit<LogItem, 'id'>): State {
  return { ...state, log: [{ ...item, id: state.nextId }, ...state.log].slice(0, 12), nextId: state.nextId + 1 }
}

function newOpId(state: State): [string, State] {
  return [`op-${state.nextId}`, { ...state, nextId: state.nextId + 1 }]
}

/** Send the outbox if the phone can, then pull if nothing is pending. */
function settle(state: State): State {
  let next = state
  const { phone } = next
  if (!phone.online || phone.conflict) return next

  if (phone.outbox) {
    const op = phone.outbox
    const { server, result } = push(next.server, op)
    next = { ...next, server, phone: { ...next.phone, outbox: null, lastPushed: op } }
    const what = `Pushed ${op.opId} (${describe(op.patch)}) based on rev ${op.baseRev}`
    if (result.status === 'conflict') {
      next = {
        ...next,
        phone: {
          ...next.phone,
          conflict: {
            op,
            rev: result.rev,
            fields: result.fields,
            mine: pick(op.patch, result.fields),
            theirs: result.theirs,
            choices: {},
          },
        },
      }
      return addLog(next, {
        who: 'phone',
        status: 'conflict',
        text: `${what}: ${describe(result.theirs)} changed on both devices, so nothing was applied`,
      })
    }
    next = addLog(next, {
      who: 'phone',
      status: result.status,
      text:
        result.status === 'merged'
          ? `${what}: the other device changed different fields, so both edits are kept (rev ${result.rev})`
          : `${what}: rev ${result.rev}`,
    })
  }

  return { ...next, phone: { ...next.phone, entry: next.server.entry, seenRev: next.server.rev } }
}

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'reset':
      return initialState

    case 'toggle-online': {
      const online = !state.phone.online
      const next = addLog(
        { ...state, phone: { ...state.phone, online } },
        { who: 'phone', text: online ? 'Phone is back online' : 'Phone went offline' },
      )
      return settle(next)
    }

    case 'phone-edit': {
      // The conflict card has to be answered first; the UI says so too.
      if (state.phone.conflict) return state
      const { field } = action
      const value = nextValue(PHONE_VALUES[field], state.phone.entry[field])
      const current = state.phone.outbox
      let next = state
      let op: Op
      if (current) {
        op = { ...current, patch: { ...current.patch, [field]: value }, edits: current.edits + 1 }
      } else {
        const [opId, withId] = newOpId(state)
        next = withId
        op = { opId, baseRev: state.phone.seenRev, patch: { [field]: value }, edits: 1 }
      }
      next = { ...next, phone: { ...next.phone, entry: { ...next.phone.entry, [field]: value }, outbox: op } }
      if (!next.phone.online || next.phone.conflict) {
        next = addLog(next, {
          who: 'phone',
          status: 'queued',
          text:
            op.edits > 1
              ? `Changed ${FIELD_LABEL[field].toLowerCase()} to ${value}: still one op in the outbox (${op.edits} edits compacted)`
              : `Changed ${FIELD_LABEL[field].toLowerCase()} to ${value}: queued in the outbox`,
        })
      }
      return settle(next)
    }

    case 'other-edit': {
      const { field } = action
      const value = nextValue(OTHER_VALUES[field], state.server.entry[field])
      const rev = state.server.rev + 1
      const server: Server = {
        ...state.server,
        entry: { ...state.server.entry, [field]: value },
        rev,
        log: [...state.server.log, { rev, fields: [field], by: 'other' }],
      }
      const next = addLog(
        { ...state, server },
        { who: 'other', text: `Other device changed ${FIELD_LABEL[field].toLowerCase()} to ${value} (rev ${rev})` },
      )
      return settle(next)
    }

    case 'resolve': {
      const conflict = state.phone.conflict
      if (!conflict) return state
      const choices = { ...conflict.choices, [action.field]: action.pick }
      if (conflict.fields.some((field) => !choices[field])) {
        return { ...state, phone: { ...state.phone, conflict: { ...conflict, choices } } }
      }

      // Everything is decided: build a fresh op against the revision the
      // server reported, so it lands first time.
      const kept = conflict.fields.filter((field) => choices[field] === 'mine')
      const untouched = keys(conflict.op.patch).filter((field) => !conflict.fields.includes(field))
      const patch = pick(conflict.op.patch, [...untouched, ...kept])
      const local = { ...state.phone.entry, ...conflict.theirs, ...patch }
      let next: State = { ...state, phone: { ...state.phone, conflict: null, entry: local } }

      if (keys(patch).length === 0) {
        next = { ...next, phone: { ...next.phone, seenRev: conflict.rev } }
        next = addLog(next, { who: 'phone', text: "Kept the other device's values: nothing left to send" })
        return settle(next)
      }
      const [opId, withId] = newOpId(next)
      next = { ...withId, phone: { ...withId.phone, outbox: { opId, baseRev: conflict.rev, patch, edits: 1 } } }
      next = addLog(next, {
        who: 'phone',
        text: kept.length
          ? `Kept this phone's ${kept.map((field) => FIELD_LABEL[field].toLowerCase()).join(' + ')}`
          : "Kept the other device's values",
      })
      return settle(next)
    }

    case 'replay': {
      const op = state.phone.lastPushed
      if (!op || !state.phone.online) return state
      const { server, result, replayed } = push(state.server, op)
      return addLog(
        { ...state, server },
        {
          who: 'phone',
          status: 'replayed',
          text: replayed
            ? `Retried ${op.opId} as if its response was lost: the server replayed its stored answer (${result.status}) and applied nothing twice`
            : `Retried ${op.opId}`,
        },
      )
    }
  }
}
