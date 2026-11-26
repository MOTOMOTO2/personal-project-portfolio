import { site } from '../data/site'

const items = site.skills.flatMap((group) => group.items)

/**
 * A slow ticker of everything in the skills list, under the hero. The list is
 * drawn twice so the loop is seamless; the copy is hidden from screen readers,
 * and reduced motion stops it in place.
 */
export function TechMarquee() {
  if (items.length === 0) return null
  const run = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center gap-10 pr-10">
      {items.map((item) => (
        <li key={item} className="flex items-center gap-10 font-mono text-sm whitespace-nowrap text-fg-subtle">
          {item}
          <span aria-hidden className="size-1 rounded-full bg-accent/60" />
        </li>
      ))}
    </ul>
  )
  return (
    <section aria-label="Languages and tools I use" className="border-b border-border bg-surface/50 py-5">
      <div className="edge-fade flex overflow-hidden">
        <div className="flex animate-marquee hover:[animation-play-state:paused]">
          {run(false)}
          {run(true)}
        </div>
      </div>
    </section>
  )
}
