import { site } from '../data/site'
import { heroStats } from '../lib/stats'
import { CountUp } from './CountUp'
import { Emphasis } from './Emphasis'
import { LiveConsole } from './LiveConsole'
import { Scramble } from './Scramble'

const stats = heroStats(site.projects)

/**
 * Right under the hero: the numbers, counted from the content, beside the
 * terminal that replays one real behaviour from each project.
 */
export function Telemetry() {
  return (
    <section aria-labelledby="telemetry" className="border-b border-border">
      <div className="container-page grid items-center gap-12 py-20 sm:py-28 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-16">
        <div className="reveal">
          <p className="label flex items-center gap-4 text-fg-subtle">
            <span className="text-accent">[00]</span>
            <Scramble text="Telemetry" />
            <span aria-hidden className="h-px flex-1 bg-border" />
          </p>
          <h2 id="telemetry" className="display mt-7 text-[clamp(2rem,4.2vw,3.5rem)] leading-[1]">
            <Emphasis text="Real systems, *doing their jobs*." />
          </h2>
          <p className="mt-5 max-w-md leading-relaxed text-fg-muted">
            The terminal replays one thing each project really does. Click a line to open that project.
          </p>

          <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden border border-border bg-border">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-bg p-5 sm:p-6">
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="display block text-4xl sm:text-5xl">
                    <CountUp value={stat.value} />
                  </span>
                  <span aria-hidden className="label mt-3 block leading-relaxed text-fg-subtle">
                    {stat.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="reveal">
          <LiveConsole />
        </div>
      </div>
    </section>
  )
}
