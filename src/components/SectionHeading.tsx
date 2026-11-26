import type { ReactNode } from 'react'
import { Emphasis } from './Emphasis'

type Props = {
  /** Anchor target used by the nav links. */
  id: string
  /** Section number shown before the eyebrow, e.g. "01". */
  index?: string
  eyebrow: string
  /** Words in *asterisks* are set in the accent face. */
  title: string
  description?: string
  /** Extra content under the description, such as a reset link. */
  children?: ReactNode
}

export function SectionHeading({ id, index, eyebrow, title, description, children }: Props) {
  return (
    <div className="reveal mb-12 max-w-3xl sm:mb-14">
      <p className="eyebrow mb-4 flex items-center gap-3">
        {index && (
          <>
            <span className="text-accent">{index}</span>
            <span aria-hidden className="h-px w-8 bg-border-strong" />
          </>
        )}
        {eyebrow}
      </p>
      {/* The heading owns the anchor id so deep links land on the title. */}
      <h2 id={id} className="scroll-mt-24 text-[clamp(2rem,4.2vw,3.25rem)] leading-[1.05] font-semibold">
        <Emphasis text={title} />
      </h2>
      {description && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-fg-muted">{description}</p>}
      {children}
    </div>
  )
}
