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
    <section className="border-t border-border py-20 sm:py-28">
      <div className="container-page">
        <SectionHeading
          id="try"
          eyebrow="Hands-on"
          title="Don’t take my word for it"
          description={`${count} of these projects hinge on one hard problem. Each write-up has a small working model of it, built from the real project's rules, that you can try to break right in the page.`}
        />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {withDemos.map((project) => {
            const demo = project.demo!
            const { Icon } = demos[demo.id]
            return (
              <li key={project.slug} className="reveal">
                <Link
                  to={`/projects/${project.slug}${query}#demo`}
                  className="group flex h-full flex-col rounded-xl border border-border bg-surface p-5 transition duration-200 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-card"
                >
                  <span className="grid size-10 place-items-center rounded-lg bg-accent-soft text-accent transition-transform duration-300 group-hover:scale-105">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <span className="mt-4 font-semibold leading-snug">{demo.title}</span>
                  <span className="mt-2 flex-1 text-sm leading-relaxed text-fg-muted">{demo.teaser}</span>
                  <span className="mt-5 flex items-center justify-between border-t border-border pt-3 text-xs text-fg-subtle">
                    <span>{project.title}</span>
                    <span className="flex items-center gap-1 font-medium text-fg-muted transition-colors group-hover:text-accent">
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
