import { Bot, CalendarX2, GitMerge, WifiOff, type LucideIcon } from 'lucide-react'
import type { ComponentType } from 'react'
import type { DemoId } from '../../data/types'
import { AgentQueueDemo } from './AgentQueueDemo'
import { DoubleBookingDemo } from './DoubleBookingDemo'
import { OutboxDemo } from './OutboxDemo'
import { SyncMergeDemo } from './SyncMergeDemo'

/**
 * Every demo a project can name in `src/data/site.ts`. The text around each
 * one (title, teaser) lives with the project; the working model lives here.
 */
export const demos: Record<DemoId, { Component: ComponentType; Icon: LucideIcon }> = {
  'double-booking': { Component: DoubleBookingDemo, Icon: CalendarX2 },
  'sync-merge': { Component: SyncMergeDemo, Icon: GitMerge },
  outbox: { Component: OutboxDemo, Icon: WifiOff },
  'agent-queue': { Component: AgentQueueDemo, Icon: Bot },
}
