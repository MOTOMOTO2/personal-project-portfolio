import { ArrowRight, ArrowUpRight, MousePointerClick } from 'lucide-react'
import { useCallback, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import type { Project } from '../data/types'
import { GithubIcon } from '../lib/icons'
import { featuredFor, useLens } from '../lib/lens'
import { useMedia } from '../lib/media'
import { addressFor } from '../lib/text'
import { BrowserFrame } from './BrowserFrame'
import { Emphasis } from './Emphasis'
import { HiringLens } from './HiringLens'
import { Scramble } from './Scramble'
import { StatusPill } from './StatusPill'

/**
 * Wide and tall enough (and motion allowed): the section pins and vertical
 * scrolling slides the panels sideways. Otherwise a plain vertical list.
 * The threshold is where a whole panel plus the header fits under the nav.
 */
const REEL_QUERY = '(min-width: 64rem) and (min-height: 50rem) and (prefers-reduced-motion: no-preference)'

function Spec({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline gap-3">
      <dt className="label shrink-0 text-fg-subtle">{label}</dt>
      <span aria-hidden className="leader h-3 min-w-6 flex-1" />
      <dd className="min-w-0 truncate text-right text-sm">{children}</dd>
    </div>
  )
}

function WorkPanel({
  project,
  number,
  total,
  query,
  className = '',
}: {
  project: Project
  number: number
  total: number
  query: string
  className?: string
}) {
  const to = `/projects/${project.slug}${query}`
  return (
    <article
      data-panel={number - 1}
      className={`brackets relative grid gap-7 border border-border bg-surface/85 p-5 backdrop-blur-sm sm:p-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-10 ${className}`}
    >
      <Link to={to} tabIndex={-1} aria-hidden className="group block min-w-0 self-center">
        <BrowserFrame address={addressFor(project)}>
          <img
            src={project.cover.src}
            alt=""
            width={1600}
            height={1000}
            loading="lazy"
            className="aspect-16/10 w-full object-cover transition duration-700 group-hover:scale-[1.02]"
          />
        </BrowserFrame>
      </Link>

      <div className="flex min-w-0 flex-col">
        <div className="label flex items-center justify-between gap-3 text-fg-subtle">
          <span>
            <span className="text-accent">PRJ-{String(number).padStart(2, '0')}</span> / {String(total).padStart(2, '0')}
          </span>
          <StatusPill status={project.status} />
        </div>

        <h3 className="display mt-5 text-[clamp(2rem,3.1vw,2.9rem)] leading-[0.95]">
          <Link to={to} className="transition-colors hover:text-accent">
            {project.title}
          </Link>
        </h3>
        <p className="mt-4 line-clamp-3 leading-relaxed text-fg-muted">{project.blurb}</p>

        <dl className="mt-6 space-y-2.5">
          <Spec label="Role">{project.role}</Spec>
          <Spec label="When">{project.period}</Spec>
          <Spec label="Stack">{project.tech.slice(0, 3).join(', ')}</Spec>
        </dl>

        <div className="mt-auto flex flex-wrap gap-2 pt-7">
          <Link to={to} className="btn btn-primary" aria-label={`Read the ${project.title} case study`}>
            Case study
            <ArrowRight className="size-4" aria-hidden />
          </Link>
          {project.demo && (
            <Link
              to={`${to}#demo`}
              className="btn btn-secondary"
              aria-label={`Try it: ${project.demo.title}`}
            >
              <MousePointerClick className="size-4 text-accent" aria-hidden />
              Try it
            </Link>
          )}
          {project.links.demo && (
            <a
              href={project.links.demo}
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary btn-icon"
              aria-label={`${project.title} live site`}
              title="Live site"
            >
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
    </article>
  )
}

/** "Selected work": the featured projects as a reel that scrolls sideways. */
export function WorkReel() {
  const { lens, query } = useLens()
  const featured = featuredFor(lens)
  const reel = useMedia(REEL_QUERY)
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)
  const total = featured.length

  // Map vertical scroll through the section onto the track's sideways travel,
  // one pixel for one pixel. Writes straight to the DOM, so no re-renders.
  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!reel || !section || !track) {
      if (track) track.style.transform = ''
      if (section) section.style.height = ''
      return
    }

    let frame = 0
    let travel = 0
    const measure = () => {
      travel = Math.max(0, track.scrollWidth - track.clientWidth)
      section.style.height = `${window.innerHeight + travel}px`
    }
    const update = () => {
      frame = 0
      const scrolled = Math.min(travel, Math.max(0, -section.getBoundingClientRect().top))
      const progress = travel > 0 ? scrolled / travel : 0
      track.style.transform = `translate3d(${-scrolled}px, 0, 0)`
      if (barRef.current) barRef.current.style.transform = `scaleX(${progress})`
      if (counterRef.current) {
        counterRef.current.textContent = String(Math.min(total, Math.round(progress * (total - 1)) + 1)).padStart(2, '0')
      }
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    const onResize = () => {
      measure()
      schedule()
    }

    measure()
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(frame)
    }
  }, [reel, total, lens?.id])

  // Keyboard users: focusing something in an off-screen panel scrolls the
  // page to the point where that panel is in view.
  const onFocus = useCallback(
    (event: React.FocusEvent) => {
      const section = sectionRef.current
      const track = trackRef.current
      const panel = (event.target as HTMLElement).closest<HTMLElement>('[data-panel]')
      if (!reel || !section || !track || !panel) return
      const travel = Math.max(0, track.scrollWidth - track.clientWidth)
      const index = Number(panel.dataset.panel)
      const top = section.getBoundingClientRect().top + window.scrollY
      window.scrollTo({ top: top + (total > 1 ? (index / (total - 1)) * travel : 0), behavior: 'auto' })
    },
    [reel, total],
  )

  return (
    <section ref={sectionRef} aria-labelledby="work" className="relative">
      <div className={reel ? 'sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden pt-16' : 'py-20 sm:py-28'}>
        <div className="container-page">
          <p className="label flex items-center gap-4 text-fg-subtle">
            <span className="text-accent">[01]</span>
            <Scramble text={lens ? `Selected work · ${lens.label}` : 'Selected work'} />
            <span aria-hidden className="h-px flex-1 bg-border" />
            <span className="tabular-nums">
              {reel ? <span ref={counterRef}>01</span> : String(total).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </span>
          </p>
          <div className="mt-6 flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
            <h2 id="work" className="display max-w-3xl scroll-mt-24 text-[clamp(2.1rem,3.6vw,3.4rem)] leading-[1]">
              <Emphasis text="Projects I've designed, built and *shipped*" />
            </h2>
            <HiringLens />
          </div>
          {lens && <p className="mt-4 max-w-3xl text-sm leading-relaxed text-fg-muted">{lens.pitch}</p>}
        </div>

        <div
          ref={trackRef}
          onFocus={onFocus}
          className={reel ? 'mt-8 flex gap-6 will-change-transform' : 'container-page mt-10 space-y-6'}
          style={reel ? { paddingLeft: 'max(2rem, calc((100vw - 74rem) / 2 + 2rem))', paddingRight: '12vw' } : undefined}
        >
          {featured.map((project, index) => (
            <WorkPanel
              key={project.slug}
              project={project}
              number={index + 1}
              total={total}
              query={query}
              className={reel ? 'w-[min(82vw,68rem)] shrink-0' : 'reveal'}
            />
          ))}
        </div>

        {reel && (
          <div className="container-page mt-8">
            <div className="h-px bg-border">
              <div ref={barRef} className="h-px origin-left scale-x-0 bg-accent" />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
