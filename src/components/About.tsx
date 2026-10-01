import { site } from '../data/site'
import { SectionHeading } from './SectionHeading'

export function About() {
  const { profile, skills, timeline } = site

  return (
    <section className="py-16 sm:py-20">
      <div className="container-page">
        <SectionHeading id="about" eyebrow="Background" title="About me" />

        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr]">
          <div className="reveal space-y-4 text-[1.0625rem] leading-relaxed text-fg-muted">
            {profile.about.map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
          </div>

          <div className="reveal">
            <h3 className="mb-4 text-sm font-semibold tracking-wide uppercase">Skills</h3>
            <dl className="space-y-4">
              {skills.map((group) => (
                <div key={group.name}>
                  <dt className="mb-2 text-sm font-medium text-fg-muted">{group.name}</dt>
                  <dd>
                    <ul className="flex flex-wrap gap-1.5">
                      {group.items.map((item) => (
                        <li
                          key={item}
                          className="rounded-md border border-border bg-surface px-2 py-1 font-mono text-[11px]"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {timeline.length > 0 && (
          <div className="reveal mt-16">
            <h3 className="mb-6 text-sm font-semibold tracking-wide uppercase">Experience</h3>
            <ol className="relative border-l border-border pl-6">
              {timeline.map((entry) => (
                <li key={`${entry.org}-${entry.period}`} className="relative pb-8 last:pb-0">
                  <span
                    aria-hidden
                    className="absolute top-1.5 -left-[1.9375rem] size-2.5 rounded-full border-2 border-bg bg-accent"
                  />
                  <p className="font-mono text-xs text-fg-muted">{entry.period}</p>
                  <h4 className="mt-1 font-semibold">
                    {entry.title} <span className="font-normal text-fg-muted">· {entry.org}</span>
                  </h4>
                  <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-fg-muted">{entry.summary}</p>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </section>
  )
}
