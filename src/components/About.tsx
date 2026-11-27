import { ArrowUpRight } from 'lucide-react'
import { Fragment, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { site } from '../data/site'
import type { Principle } from '../data/types'
import { useLens } from '../lib/lens'
import { useSpotlight } from '../lib/pointer'
import { Scramble } from './Scramble'
import { SectionHeading } from './SectionHeading'

const titles = new Map(site.projects.map((project) => [project.slug, project.title]))

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-1 border-b border-border py-3.5 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-5">
      <dt className="label pt-0.5 text-fg-subtle">{label}</dt>
      <dd className="text-sm leading-relaxed">{children}</dd>
    </div>
  )
}

function PrincipleCard({ principle, index, query }: { principle: Principle; index: number; query: string }) {
  const { ref, onPointerMove } = useSpotlight<HTMLLIElement>()
  return (
    <li
      ref={ref}
      onPointerMove={onPointerMove}
      className="brackets reveal card-spotlight flex flex-col border border-border bg-surface p-6"
    >
      <span aria-hidden className="font-serif text-4xl leading-none text-accent italic">
        {String(index + 1).padStart(2, '0')}
      </span>
      <h4 className="display mt-5 text-lg leading-snug">{principle.title}</h4>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-fg-muted">{principle.body}</p>
      <p className="label mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-border pt-4 text-fg-subtle">
        Proof
        {principle.proof.map((slug) => (
          <Link
            key={slug}
            to={`/projects/${slug}${query}`}
            className="inline-flex items-center gap-0.5 text-fg transition-colors hover:text-accent"
          >
            {titles.get(slug) ?? slug}
            <ArrowUpRight className="size-3" aria-hidden />
          </Link>
        ))}
      </p>
    </li>
  )
}

/** About as a spec sheet: the story on the left, the facts and stack on the right. */
export function About() {
  const { profile, skills, timeline, principles } = site
  const { lens, query } = useLens()
  const highlighted = new Set(lens?.skills ?? [])
  // "Main languages" repeats the Languages row of the stack, so it is left out here.
  const facts = profile.facts.filter((fact) => !/languages/i.test(fact.label))

  return (
    <section className="border-t border-border py-20 sm:py-28">
      <div className="container-page">
        <SectionHeading id="about" index="03" eyebrow="About" meta="Quick facts" title="A bit about *me*" />

        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="reveal space-y-5 text-lg leading-relaxed text-fg-muted lg:col-span-6">
            {profile.about.map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
          </div>

          <dl className="reveal self-start border-t border-border lg:col-span-6">
            {facts.map((fact) => (
              <Row key={fact.label} label={fact.label}>
                {fact.value}
              </Row>
            ))}
            {profile.availability && (
              <Row label="Status">
                <span className="inline-flex items-center gap-2">
                  <span aria-hidden className="size-1.5 rounded-full bg-success" />
                  {profile.availability}
                </span>
              </Row>
            )}
            {skills.map((group) => (
              <Row key={group.name} label={group.name}>
                <span className="text-fg-muted">
                  {group.items.map((item, index) => (
                    <Fragment key={item}>
                      {index > 0 && ' · '}
                      <span
                        className={
                          highlighted.has(item) ? 'bg-accent-soft px-1 py-0.5 font-medium text-accent' : undefined
                        }
                      >
                        {item}
                      </span>
                    </Fragment>
                  ))}
                </span>
              </Row>
            ))}
            {timeline.map((entry) => (
              <Row key={`${entry.org}-${entry.period}`} label={entry.period}>
                <span className="font-medium">{entry.title}</span>
                <span className="text-fg-muted"> · {entry.org}. {entry.summary}</span>
              </Row>
            ))}
          </dl>
        </div>
        {lens && (
          <p className="label mt-4 text-right text-accent">
            Highlighted: what {lens.label.toLowerCase()} roles ask for
          </p>
        )}

        {principles.length > 0 && (
          <div className="mt-24">
            <p className="label reveal mb-8 flex items-center gap-4 text-fg-subtle">
              <Scramble text="How I like to build" />
              <span aria-hidden className="h-px flex-1 bg-border" />
            </p>
            <ul className="grid gap-4 md:grid-cols-3">
              {principles.map((principle, index) => (
                <PrincipleCard key={principle.title} principle={principle} index={index} query={query} />
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}
