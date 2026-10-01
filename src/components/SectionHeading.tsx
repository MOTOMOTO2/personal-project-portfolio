type Props = {
  /** Anchor target used by the nav links. */
  id: string
  eyebrow: string
  title: string
  description?: string
}

export function SectionHeading({ id, eyebrow, title, description }: Props) {
  return (
    <div className="reveal mb-10">
      <p className="mb-2 font-mono text-xs font-semibold tracking-[0.18em] text-accent uppercase">
        {eyebrow}
      </p>
      {/* The heading owns the anchor id so deep links land on the title. */}
      <h2 id={id} className="scroll-mt-24 text-3xl font-bold sm:text-4xl">
        {title}
      </h2>
      {description && <p className="mt-3 max-w-2xl text-fg-muted">{description}</p>}
    </div>
  )
}
