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
  /** Position in the stack, shown as "01", "02"... */
  number: number
  /** The hiring-lens query string, carried onto the project page. */
  query?: string
}

/**
 * One card in "Selected work". On wide screens the cards are sticky, each a
 * little lower than the last, so scrolling stacks them like a deck. Plain CSS:
 * nothing runs on scroll.
 */
export function FeaturedProject({ project, number, query = '' }: Props) {
  const to = `/projects/${project.slug}${query}`
  const { ref: tiltRef, onPointerMove, onPointerLeave } = useTilt<HTMLDivElement>()

  return (
    <article className="stack-card" style={{ top: `calc(5.5rem + ${(number - 1) * 1.25}rem)` }}>
      <div className="reveal grid items-center gap-8 rounded-[1.75rem] border border-border bg-surface p-5 shadow-card sm:p-8 lg:grid-cols-12 lg:gap-12 lg:p-10">
        <div className="min-w-0 lg:col-span-5">
          <div className="flex items-center gap-3">
            <span aria-hidden className="font-serif text-4xl leading-none text-accent italic">
              {String(number).padStart(2, '0')}
            </span>
            <StatusPill status={project.status} />
            {project.demo && (
              <Link
                to={`/projects/${project.slug}${query}#demo`}
                className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-2.5 py-1 text-xs font-medium text-accent transition-opacity hover:opacity-80"
                aria-label={`Try it: ${project.demo.title}`}
              >
                <MousePointerClick className="size-3.5" aria-hidden />
                Try it
              </Link>
            )}
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

          <ul className="mt-5 space-y-2 text-sm">
            {project.highlights.slice(0, 2).map((highlight) => (
              <li key={highlight} className="flex gap-2.5">
                <Check className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>

          <p className="mt-5 font-mono text-xs leading-relaxed text-fg-subtle">{project.tech.slice(0, 5).join(' · ')}</p>

          <div className="mt-7 flex flex-wrap gap-2">
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
                className="btn btn-secondary btn-icon"
                aria-label={`${project.title} source code on GitHub`}
                title="Source on GitHub"
              >
                <GithubIcon className="size-4" aria-hidden />
              </a>
            )}
          </div>
        </div>

        <div
          ref={tiltRef}
          onPointerMove={onPointerMove}
          onPointerLeave={onPointerLeave}
          className="relative min-w-0 transition-transform duration-300 ease-out will-change-transform lg:col-span-7"
        >
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
      </div>
    </article>
  )
}
