import { ArrowUpRight, MousePointerClick } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Project } from '../data/types'
import { GithubIcon } from '../lib/icons'
import { useSpotlight } from '../lib/pointer'
import { StatusPill } from './StatusPill'

type Props = {
  project: Project
  /** The hiring-lens query string, carried onto the project page. */
  query?: string
}

/** A card in the "More projects" grid. The whole card links to the write-up. */
export function ProjectCard({ project, query = '' }: Props) {
  const { ref, onPointerMove } = useSpotlight<HTMLElement>()

  return (
    <article
      ref={ref}
      onPointerMove={onPointerMove}
      className="reveal group card-spotlight relative flex flex-col rounded-2xl border border-border bg-surface p-3 transition duration-300 hover:-translate-y-1 hover:border-border-strong hover:shadow-card"
    >
      <div className="relative overflow-hidden rounded-xl border border-border bg-surface-2">
        <img
          src={project.cover.src}
          alt=""
          width={1600}
          height={1000}
          loading="lazy"
          className="aspect-16/10 w-full object-cover transition duration-700 group-hover:scale-[1.04]"
        />
      </div>

      {/* Above the stretched link, so these go straight where they say. */}
      {project.demo && (
        <Link
          to={`/projects/${project.slug}${query}#demo`}
          aria-label={`Try it: ${project.demo.title}`}
          className="absolute top-5 left-5 z-10 inline-flex items-center gap-1.5 rounded-full border border-border bg-surface/90 px-2.5 py-1 text-xs font-medium shadow-card backdrop-blur-sm transition-colors hover:border-accent hover:text-accent"
        >
          <MousePointerClick className="size-3.5 text-accent" aria-hidden />
          Try it
        </Link>
      )}

      <div className="flex flex-1 flex-col px-2 pt-4 pb-2">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold">
            {/* Stretched link: the whole card is the click target. */}
            <Link
              to={`/projects/${project.slug}${query}`}
              className="inline-flex items-center gap-1 transition-colors group-hover:text-accent after:absolute after:inset-0 after:rounded-2xl after:content-['']"
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

        <p className="mt-1.5 flex-1 text-sm leading-relaxed text-fg-muted">{project.blurb}</p>

        <div className="mt-4 flex items-center justify-between gap-3">
          <ul className="flex flex-wrap gap-1.5" aria-label="Built with">
            {project.tech.slice(0, 3).map((tech) => (
              <li key={tech} className="rounded-md bg-surface-2 px-2 py-0.5 font-mono text-[0.6875rem] text-fg-muted">
                {tech}
              </li>
            ))}
          </ul>
          {project.links.repo && (
            <a
              href={project.links.repo}
              target="_blank"
              rel="noreferrer"
              aria-label={`${project.title} source code on GitHub`}
              title="Source on GitHub"
              className="relative z-10 shrink-0 rounded-md p-1.5 text-fg-subtle transition-colors hover:bg-surface-2 hover:text-fg"
            >
              <GithubIcon className="size-4" aria-hidden />
            </a>
          )}
        </div>
      </div>
    </article>
  )
}
