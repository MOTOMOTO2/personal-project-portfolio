import { ArrowRight, ArrowUpRight, Check, MousePointerClick } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Project } from '../data/types'
import { GithubIcon } from '../lib/icons'
import { useTilt } from '../lib/pointer'
import { addressFor } from '../lib/text'
import { BrowserFrame } from './BrowserFrame'
import { StatusPill } from './StatusPill'

type Props = {
  project: Project
  /** Position in the list, shown as "01", "02"... */
  number: number
  /** Puts the screenshot on the right, so consecutive rows alternate. */
  reverse: boolean
  /** The hiring-lens query string, carried onto the project page. */
  query?: string
}

/** A large row in "Selected work": a framed screenshot on one side, the pitch on the other. */
export function FeaturedProject({ project, number, reverse, query = '' }: Props) {
  const to = `/projects/${project.slug}${query}`
  const { ref: tiltRef, onPointerMove, onPointerLeave } = useTilt<HTMLDivElement>()

  return (
    <article className="reveal grid items-center gap-8 lg:grid-cols-12 lg:gap-14">
      <div
        ref={tiltRef}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        className={`relative min-w-0 transition-transform duration-300 ease-out will-change-transform lg:col-span-7 ${
          reverse ? 'lg:order-last' : ''
        }`}
      >
        <div
          aria-hidden
          className="absolute -inset-6 -z-10 rounded-[2rem] bg-[radial-gradient(closest-side,var(--glow),transparent)] opacity-70"
        />
        <Link to={to} tabIndex={-1} aria-hidden className="group block">
          <BrowserFrame address={addressFor(project)}>
            <img
              src={project.cover.src}
              alt=""
              width={1600}
              height={1000}
              loading="lazy"
              className="aspect-16/10 w-full object-cover transition duration-700 group-hover:scale-[1.015]"
            />
          </BrowserFrame>
        </Link>
      </div>

      <div className="min-w-0 lg:col-span-5">
        <div className="flex items-center gap-4">
          <span aria-hidden className="font-serif text-5xl leading-none text-accent italic">
            {String(number).padStart(2, '0')}
          </span>
          <span aria-hidden className="h-px flex-1 bg-border" />
          <StatusPill status={project.status} />
        </div>

        <h3 className="mt-5 text-3xl font-semibold sm:text-4xl">
          <Link to={to} className="transition-colors hover:text-accent">
            {project.title}
          </Link>
        </h3>
        <p className="mt-2 text-sm text-fg-subtle">
          {project.period} · {project.role}
        </p>
        <p className="mt-4 leading-relaxed text-fg-muted">{project.blurb}</p>

        <ul className="mt-5 space-y-2.5 text-sm">
          {project.highlights.slice(0, 3).map((highlight) => (
            <li key={highlight} className="flex gap-2.5">
              <Check className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
              <span>{highlight}</span>
            </li>
          ))}
        </ul>

        <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Built with">
          {project.tech.slice(0, 6).map((tech) => (
            <li key={tech} className="rounded-md border border-border bg-surface px-2 py-0.5 font-mono text-[0.6875rem] text-fg-muted">
              {tech}
            </li>
          ))}
          {project.tech.length > 6 && (
            <li className="px-1 py-0.5 font-mono text-[0.6875rem] text-fg-subtle">+{project.tech.length - 6}</li>
          )}
        </ul>

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
