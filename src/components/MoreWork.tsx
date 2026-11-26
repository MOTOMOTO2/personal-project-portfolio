import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Project } from '../data/types'
import { Emphasis } from './Emphasis'

const COUNT_WORDS = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve']

/**
 * The door from the home page to the All work index: how many more projects
 * there are, and a fanned stack of their covers. One link, nothing to read twice.
 */
export function MoreWork({ others, query = '' }: { others: Project[]; query?: string }) {
  if (others.length === 0) return null
  const count = COUNT_WORDS[others.length] ?? String(others.length)
  const thumbs = others.slice(0, 5)

  return (
    <section aria-labelledby="more-work" className="pb-20 sm:pb-28">
      <div className="container-page">
        <Link
          to={`/work${query}`}
          className="brackets reveal group relative flex flex-col gap-10 overflow-hidden border border-border bg-surface p-6 transition-colors hover:border-accent/60 sm:p-10 md:flex-row md:items-center md:justify-between"
        >
          <div className="max-w-md">
            <p className="label text-fg-subtle">
              <span className="text-accent">[→]</span> Index
            </p>
            <h2 id="more-work" className="display mt-4 text-3xl leading-[1.05] sm:text-4xl">
              <Emphasis text={`And ${count} more: games, offline apps and *tools*`} />
            </h2>
            <p className="mt-3 text-fg-muted">Everything I've built, newest first, with a filter for each kind.</p>
            <span className="label mt-7 inline-flex items-center gap-2 text-accent">
              Browse all work
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
            </span>
          </div>

          <div aria-hidden className="flex shrink-0 justify-center -space-x-12 pr-2 sm:-space-x-16 md:pr-6">
            {thumbs.map((project, index) => (
              <img
                key={project.slug}
                src={project.cover.src}
                alt=""
                loading="lazy"
                className="aspect-16/10 w-32 rounded-md border border-border-strong object-cover shadow-card transition duration-500 ease-out group-hover:-translate-y-1.5 sm:w-44"
                style={{
                  rotate: `${(index - (thumbs.length - 1) / 2) * 5}deg`,
                  transitionDelay: `${index * 45}ms`,
                  zIndex: index,
                }}
              />
            ))}
          </div>
        </Link>
      </div>
    </section>
  )
}
