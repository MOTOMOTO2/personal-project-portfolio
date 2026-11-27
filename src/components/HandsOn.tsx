import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { site } from '../data/site'
import { demos } from './demos/registry'
import { SectionHeading } from './SectionHeading'

const withDemos = site.projects.filter((project) => project.demo)

const COUNT_WORDS = ['No', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight']
const count = COUNT_WORDS[withDemos.length] ?? String(withDemos.length)

/** The home page's door into the hands-on demos: one card per project that has one. */
export function HandsOn({ query = '' }: { query?: string }) {
  if (withDemos.length === 0) return null

  return (
    <section className="relative overflow-hidden border-t border-border py-20 sm:py-28">
      <div aria-hidden className="hero-grid pointer-events-none absolute inset-0 opacity-50" />
      <div className="container-page relative">
        <SectionHeading
          id="try"
          index="02"
          eyebrow="Try it"
          meta={`${withDemos.length} demos`}
          title="Play with a few of them *yourself*"
          description={`${count} of my projects come down to one tricky problem each. Their pages have a small working version of that problem you can play with right in the browser.`}
        />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {withDemos.map((project, index) => {
            const demo = project.demo!
            const { Icon } = demos[demo.id]
            return (
              <li key={project.slug} className="reveal">
                <Link
                  to={`/projects/${project.slug}${query}#demo`}
                  className="brackets group flex h-full flex-col border border-border bg-surface p-6 transition duration-300 hover:-translate-y-1 hover:border-accent/60"
                >
                  <span className="flex items-center justify-between">
                    <span className="label text-fg-subtle">Demo {String(index + 1).padStart(2, '0')}</span>
                    <Icon className="size-5 text-accent transition-transform duration-300 group-hover:scale-110" aria-hidden />
                  </span>
                  <span className="display mt-8 text-xl leading-tight">{demo.title}</span>
                  <span className="mt-2 flex-1 text-sm leading-relaxed text-fg-muted">{demo.teaser}</span>
                  <span className="label mt-6 flex items-center justify-between border-t border-border pt-4 text-fg-subtle">
                    <span>{project.title}</span>
                    <span className="flex items-center gap-1 text-fg-muted transition-colors group-hover:text-accent">
                      Try it
                      <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
                    </span>
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
