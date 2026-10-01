import { ArrowUpRight, ExternalLink } from 'lucide-react'
import { GithubIcon } from '../lib/icons'
import { Link } from 'react-router-dom'
import type { Project } from '../data/types'
import { StatusPill } from './StatusPill'

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="reveal group relative flex flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-card transition hover:-translate-y-1 hover:border-accent/60">
      <Link to={`/projects/${project.slug}`} className="block overflow-hidden" tabIndex={-1} aria-hidden>
        <img
          src={project.cover.src}
          alt=""
          width={1200}
          height={750}
          loading="lazy"
          className="aspect-16/10 w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        />
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center gap-2">
          <StatusPill status={project.status} />
          <span className="font-mono text-xs text-fg-muted">{project.year}</span>
        </div>

        <h3 className="text-lg font-semibold">
          {/* Stretched link: the whole card is the click target for the detail page. */}
          <Link to={`/projects/${project.slug}`} className="after:absolute after:inset-0 after:content-['']">
            {project.title}
          </Link>
        </h3>

        <p className="mt-2 text-sm leading-relaxed text-fg-muted">{project.blurb}</p>

        <ul className="mt-4 flex flex-wrap gap-1.5">
          {project.tech.slice(0, 4).map((tech) => (
            <li
              key={tech}
              className="rounded-md bg-surface-2 px-2 py-1 font-mono text-[11px] text-fg-muted"
            >
              {tech}
            </li>
          ))}
          {project.tech.length > 4 && (
            <li className="rounded-md px-2 py-1 font-mono text-[11px] text-fg-muted">
              +{project.tech.length - 4}
            </li>
          )}
        </ul>

        <div className="mt-5 flex items-center gap-4 pt-1 text-sm">
          <span className="inline-flex items-center gap-1 font-medium text-accent">
            Case study
            <ArrowUpRight className="size-4 transition group-hover:translate-x-0.5" aria-hidden />
          </span>

          {/* Raised above the stretched link so these stay independently clickable. */}
          <span className="relative z-10 ml-auto flex items-center gap-1">
            {project.links.repo && (
              <a
                href={project.links.repo}
                target="_blank"
                rel="noreferrer"
                aria-label={`${project.title} source code on GitHub`}
                className="rounded-md p-1.5 text-fg-muted transition hover:bg-surface-2 hover:text-fg"
              >
                <GithubIcon className="size-4" aria-hidden />
              </a>
            )}
            {project.links.demo && (
              <a
                href={project.links.demo}
                target="_blank"
                rel="noreferrer"
                aria-label={`${project.title} live demo`}
                className="rounded-md p-1.5 text-fg-muted transition hover:bg-surface-2 hover:text-fg"
              >
                <ExternalLink className="size-4" aria-hidden />
              </a>
            )}
          </span>
        </div>
      </div>
    </article>
  )
}
