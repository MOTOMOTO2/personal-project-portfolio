import { ArrowUpRight } from 'lucide-react'
import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { site } from '../data/site'
import type { Principle } from '../data/types'
import { useLens } from '../lib/lens'
import { useSpotlight } from '../lib/pointer'
import { Emphasis } from './Emphasis'

const titles = new Map(site.projects.map((project) => [project.slug, project.title]))

function PrincipleCard({ principle, index, query }: { principle: Principle; index: number; query: string }) {
  const { ref, onPointerMove } = useSpotlight<HTMLLIElement>()
  return (
    <li
      ref={ref}
      onPointerMove={onPointerMove}
      className="reveal card-spotlight flex flex-col rounded-2xl border border-border bg-surface p-6"
    >
      <span aria-hidden className="font-serif text-3xl leading-none text-accent italic">
        {String(index + 1).padStart(2, '0')}
      </span>
      <h4 className="mt-4 text-lg leading-snug font-semibold">{principle.title}</h4>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-fg-muted">{principle.body}</p>
      <p className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-border pt-4 text-xs text-fg-subtle">
        See it in
        {principle.proof.map((slug) => (
          <Link
            key={slug}
            to={`/projects/${slug}${query}`}
            className="inline-flex items-center gap-0.5 font-medium text-fg transition-colors hover:text-accent"
          >
            {titles.get(slug) ?? slug}
            <ArrowUpRight className="size-3" aria-hidden />
          </Link>
        ))}
      </p>
    </li>
  )
}

export function About() {
  const { profile, skills, timeline, principles } = site
  const { lens, query } = useLens()
  const highlighted = new Set(lens?.skills ?? [])

  return (
    <section className="border-t border-border py-20 sm:py-28">
      <div className="container-page">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="reveal lg:col-span-4">
            <p className="eyebrow mb-4 flex items-center gap-3">
              <span className="text-accent">04</span>
              <span aria-hidden className="h-px w-8 bg-border-strong" />
              About
            </p>
            <h2 id="about" className="scroll-mt-24 text-[clamp(2rem,4.2vw,3.25rem)] leading-[1.05] font-semibold">
              <Emphasis text="A bit *about me*" />
            </h2>

            <aside aria-label="At a glance" className="mt-8 rounded-2xl border border-border bg-surface p-6 shadow-card">
              <dl className="divide-y divide-border">
                {profile.facts.map((fact) => (
                  <div key={fact.label} className="py-3 first:pt-0 last:pb-0">
                    <dt className="text-xs text-fg-subtle">{fact.label}</dt>
                    <dd className="mt-1 text-sm font-medium">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </aside>
          </div>

          <div className="lg:col-span-8">
            <div className="reveal space-y-5 text-lg leading-relaxed text-fg-muted">
              {profile.about.map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{paragraph}</p>
              ))}
            </div>

            <div className="reveal mt-14">
              <h3 className="eyebrow mb-4">
                Skills and tools
                {lens && <span className="text-accent normal-case"> · {lens.label} highlighted</span>}
              </h3>
              <dl className="divide-y divide-border border-y border-border">
                {skills.map((group) => (
                  <div key={group.name} className="grid gap-1 py-4 sm:grid-cols-[11rem_1fr] sm:gap-6">
                    <dt className="text-sm font-medium">{group.name}</dt>
                    <dd className="text-sm leading-relaxed text-fg-muted">
                      {group.items.map((item, index) => (
                        <Fragment key={item}>
                          {index > 0 && ' · '}
                          <span
                            className={
                              highlighted.has(item)
                                ? 'rounded bg-accent-soft px-1 py-0.5 font-medium text-accent transition-colors'
                                : 'transition-colors'
                            }
                          >
                            {item}
                          </span>
                        </Fragment>
                      ))}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {timeline.length > 0 && (
              <div className="reveal mt-14">
                <h3 className="eyebrow mb-4">Experience</h3>
                <ol className="divide-y divide-border border-y border-border">
                  {timeline.map((entry) => (
                    <li key={`${entry.org}-${entry.period}`} className="grid gap-1 py-5 sm:grid-cols-[11rem_1fr] sm:gap-6">
                      <p className="text-sm text-fg-subtle">{entry.period}</p>
                      <div>
                        <h4 className="font-medium">
                          {entry.title} <span className="font-normal text-fg-muted">· {entry.org}</span>
                        </h4>
                        <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">{entry.summary}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </div>

        {principles.length > 0 && (
          <div className="mt-20">
            <h3 className="eyebrow reveal mb-6">How I work</h3>
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
