import { ArrowUpRight, MousePointerClick } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Project } from '../data/types'
import { StatusPill } from './StatusPill'

type Props = {
  project: Project
  /** The hiring-lens query string, carried onto the project page. */
  query?: string
}

/** A compact card in the "More projects" grid. The whole card links to the write-up. */
export function ProjectCard({ project, query = '' }: Props) {
  return (
    <article className="reveal group relative flex flex-col">
      <div className="relative overflow-hidden rounded-xl border border-border bg-surface-2">
        <img
          src={project.cover.src}
          alt=""
          width={1600}
          height={1000}
          loading="lazy"
          className="aspect-16/10 w-full object-cover transition duration-700 group-hover:scale-[1.03]"
        />
      </div>

      {/* Sits above the stretched link, so it can go straight to the demo. */}
      {project.demo && (
        <Link
          to={`/projects/${project.slug}${query}#demo`}
          aria-label={`Try it: ${project.demo.title}`}
          className="absolute top-3 left-3 z-10 inline-flex items-center gap-1.5 rounded-full border border-border bg-surface/90 px-2.5 py-1 text-xs font-medium shadow-card backdrop-blur-sm transition-colors hover:border-accent hover:text-accent"
        >
          <MousePointerClick className="size-3.5 text-accent" aria-hidden />
          Try it
        </Link>
      )}

      <div className="mt-4 flex items-center justify-between gap-3">
        <h3 className="font-semibold">
          {/* Stretched link: the whole card is the click target. */}
          <Link
            to={`/projects/${project.slug}${query}`}
            className="inline-flex items-center gap-1 transition-colors group-hover:text-accent after:absolute after:inset-0 after:content-['']"
          >
            {project.title}
            <ArrowUpRight
              className="size-4 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100"
              aria-hidden
            />
          </Link>
        </h3>
        <StatusPill status={project.status} />
      </div>

      <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">{project.blurb}</p>
      <p className="mt-3 font-mono text-xs text-fg-subtle">{project.tech.slice(0, 4).join(' · ')}</p>
    </article>
  )
}
