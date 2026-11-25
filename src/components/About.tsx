import { Fragment } from 'react'
import { site } from '../data/site'
import { useLens } from '../lib/lens'

export function About() {
  const { profile, skills, timeline } = site
  const { lens } = useLens()
  const highlighted = new Set(lens?.skills ?? [])

  return (
    <section className="border-t border-border py-20 sm:py-28">
      <div className="container-page grid gap-12 lg:grid-cols-12 lg:gap-14">
        <div className="reveal lg:col-span-4">
          <p className="eyebrow mb-3">About</p>
          <h2 id="about" className="scroll-mt-24 text-3xl font-semibold sm:text-4xl">
            A bit about me
          </h2>
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
    </section>
  )
}
