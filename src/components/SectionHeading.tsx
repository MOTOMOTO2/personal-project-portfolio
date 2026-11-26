import type { ReactNode } from 'react'
import { Emphasis } from './Emphasis'
import { Scramble } from './Scramble'

type Props = {
  /** Anchor target used by the nav links. */
  id: string
  /** Section number, shown as [01]. */
  index?: string
  eyebrow: string
  /** Right end of the rule, e.g. "4 projects". */
  meta?: string
  /** Words in *asterisks* are set in the accent face. */
  title: string
  description?: string
  /** Extra content under the description, such as the hiring lens. */
  children?: ReactNode
}

/** A datasheet header: [01] LABEL ———— META, then a big title. */
export function SectionHeading({ id, index, eyebrow, meta, title, description, children }: Props) {
  return (
    <div className="reveal mb-12 sm:mb-16">
      <p className="label flex items-center gap-4 text-fg-subtle">
        {index && <span className="text-accent">[{index}]</span>}
        <Scramble text={eyebrow} />
        <span aria-hidden className="h-px flex-1 bg-border" />
        {meta && <span>{meta}</span>}
      </p>
      {/* The heading owns the anchor id so deep links land on the title. */}
      <h2 id={id} className="display mt-7 max-w-4xl scroll-mt-24 text-[clamp(2.25rem,5vw,4.25rem)] leading-[1]">
        <Emphasis text={title} />
      </h2>
      {description && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-fg-muted">{description}</p>}
      {children}
    </div>
  )
}
