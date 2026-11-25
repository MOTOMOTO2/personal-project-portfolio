import type { ReactNode } from 'react'

type Props = {
  /** Anchor target used by the nav links. */
  id: string
  eyebrow: string
  title: string
  description?: string
  /** Extra content under the description, such as a reset link. */
  children?: ReactNode
}

export function SectionHeading({ id, eyebrow, title, description, children }: Props) {
  return (
    <div className="reveal mb-12 max-w-2xl">
      <p className="eyebrow mb-3">{eyebrow}</p>
      {/* The heading owns the anchor id so deep links land on the title. */}
      <h2 id={id} className="scroll-mt-24 text-3xl font-semibold sm:text-4xl">
        {title}
      </h2>
      {description && <p className="mt-4 text-lg leading-relaxed text-fg-muted">{description}</p>}
      {children}
    </div>
  )
}
