import { ArrowRight, ArrowUpRight, Check, MousePointerClick } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Project } from '../data/types'
import { GithubIcon } from '../lib/icons'
import { StatusPill } from './StatusPill'

type Props = {
  project: Project
  /** Puts the screenshot on the right, so consecutive rows alternate. */
  reverse: boolean
  /** The hiring-lens query string, carried onto the project page. */
  query?: string
}

/** A large row in "Selected work": screenshot on one side, the pitch on the other. */
export function FeaturedProject({ project, reverse, query = '' }: Props) {
  const to = `/projects/${project.slug}${query}`

  return (
    <article className="reveal grid items-center gap-8 lg:grid-cols-12 lg:gap-14">
      <Link
        to={to}
        tabIndex={-1}
        aria-hidden
        className={`group block overflow-hidden rounded-xl border border-border bg-surface-2 shadow-card lg:col-span-7 ${
          reverse ? 'lg:order-last' : ''
        }`}
      >
        <img
          src={project.cover.src}
          alt=""
          width={1600}
          height={1000}
          loading="lazy"
          className="aspect-16/10 w-full object-cover transition duration-700 group-hover:scale-[1.02]"
        />
      </Link>

      <div className="lg:col-span-5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <StatusPill status={project.status} />
          <span aria-hidden className="text-fg-subtle">
            ·
          </span>
          <span className="text-xs text-fg-subtle">{project.period}</span>
          <span aria-hidden className="text-fg-subtle">
            ·
          </span>
          <span className="text-xs text-fg-subtle">{project.role}</span>
        </div>

        <h3 className="mt-3 text-2xl font-semibold sm:text-3xl">
          <Link to={to} className="transition-colors hover:text-accent">
            {project.title}
          </Link>
        </h3>
        <p className="mt-3 leading-relaxed text-fg-muted">{project.blurb}</p>

        <ul className="mt-5 space-y-2.5 text-sm">
          {project.highlights.slice(0, 3).map((highlight) => (
            <li key={highlight} className="flex gap-2.5">
              <Check className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
              <span>{highlight}</span>
            </li>
          ))}
        </ul>

        <p className="mt-5 font-mono text-xs leading-relaxed text-fg-subtle">{project.tech.join(' · ')}</p>

        {project.demo && (
          <Link
            to={`/projects/${project.slug}${query}#demo`}
            className="group/demo mt-6 flex items-center gap-3 rounded-lg border border-dashed border-border-strong px-3.5 py-2.5 text-sm transition-colors hover:border-accent hover:bg-accent-soft"
          >
            <MousePointerClick className="size-4 shrink-0 text-accent" aria-hidden />
            <span className="min-w-0 flex-1">
              <span className="font-medium">Try it:</span> {project.demo.title}
            </span>
            <ArrowRight className="size-4 shrink-0 text-fg-subtle transition group-hover/demo:translate-x-0.5 group-hover/demo:text-accent" aria-hidden />
          </Link>
        )}

        <div className="mt-6 flex flex-wrap gap-2">
          <Link to={to} className="btn btn-primary" aria-label={`Read the ${project.title} case study`}>
            Case study
            <ArrowRight className="size-4" aria-hidden />
          </Link>
          {project.links.demo && (
            <a
              href={project.links.demo}
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary"
              aria-label={`${project.title} live site`}
            >
              Live site
              <ArrowUpRight className="size-4" aria-hidden />
            </a>
          )}
          {project.links.repo && (
            <a
              href={project.links.repo}
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary"
              aria-label={`${project.title} source code on GitHub`}
            >
              <GithubIcon className="size-4" aria-hidden />
              Code
            </a>
          )}
        </div>
      </div>
    </article>
  )
}
