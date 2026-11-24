import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Project } from '../data/types'
import { StatusPill } from './StatusPill'

/** A compact card in the "More projects" grid. The whole card links to the write-up. */
export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="reveal group relative flex flex-col">
      <div className="overflow-hidden rounded-xl border border-border bg-surface-2">
        <img
          src={project.cover.src}
          alt=""
          width={1600}
          height={1000}
          loading="lazy"
          className="aspect-16/10 w-full object-cover transition duration-700 group-hover:scale-[1.03]"
        />
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <h3 className="font-semibold">
          {/* Stretched link: the whole card is the click target. */}
          <Link
            to={`/projects/${project.slug}`}
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
