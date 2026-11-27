import { ArrowRight, ArrowUpRight, Check, MousePointerClick } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Image, Project } from '../data/types'
import { GithubIcon } from '../lib/icons'
import { featuredFor, useLens } from '../lib/lens'
import { useMedia } from '../lib/media'
import { addressFor } from '../lib/text'
import { BrowserFrame } from './BrowserFrame'
import { Emphasis } from './Emphasis'
import { HiringLens } from './HiringLens'
import { Scramble } from './Scramble'
import { ShaderField } from './ShaderField'
import { StatusPill } from './StatusPill'

/** Wide screens get the pinned stage; narrower ones get each project as a card. */
const STAGE_QUERY = '(min-width: 64rem)'

const imagesOf = (project: Project): Image[] => [project.cover, ...project.gallery]
const pad = (value: number) => String(value).padStart(2, '0')

function Spec({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline gap-3">
      <dt className="label shrink-0 text-fg-subtle">{label}</dt>
      <span aria-hidden className="leader h-3 min-w-6 flex-1" />
      <dd className="min-w-0 truncate text-right text-sm">{children}</dd>
    </div>
  )
}

/**
 * The pinned screen on the right. It shows the active project's screenshots,
 * wiping each new one in from the right with a glowing line on its edge, and
 * moves on by itself while nobody is hovering it. The pointer tilts it in 3D
 * with a glare that follows, over a halo of the hero's contour shader.
 */
function Stage({
  projects,
  active,
  query,
  onJump,
}: {
  projects: Project[]
  active: number
  query: string
  onJump: (index: number) => void
}) {
  const project = projects[active]
  const images = imagesOf(project)
  const reduced = useMedia('(prefers-reduced-motion: reduce)')
  const stageRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  // Which screenshot is showing; a choice made for another project means "start at 0".
  const [pick, setPick] = useState({ slug: project.slug, index: 0 })
  const index = pick.slug === project.slug ? Math.min(pick.index, images.length - 1) : 0
  const showing = images[index]
  const key = `${project.slug}:${index}`

  // Keep the previous screenshot underneath while the new one wipes in. This
  // is React's "adjust state when a prop changes" pattern: set during render.
  const [layers, setLayers] = useState<{ key: string; top: Image; under: Image | null }>({
    key,
    top: showing,
    under: null,
  })
  if (layers.key !== key) setLayers({ key, top: showing, under: layers.top })

  const advance = useCallback(
    () => setPick({ slug: project.slug, index: (index + 1) % images.length }),
    [project.slug, index, images.length],
  )

  // Only run the screenshot timer while the stage is on screen.
  useEffect(() => {
    const element = stageRef.current
    if (!element) return
    const observer = new IntersectionObserver(([entry]) => setVisible(Boolean(entry?.isIntersecting)), {
      threshold: 0.4,
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  // Tilt towards the pointer, with the glare following it. Straight to the DOM.
  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const frame = frameRef.current
    if (!frame || event.pointerType !== 'mouse') return
    const rect = frame.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width
    const y = (event.clientY - rect.top) / rect.height
    frame.style.setProperty('--gx', `${x * 100}%`)
    frame.style.setProperty('--gy', `${y * 100}%`)
    if (!reduced) {
      frame.style.transform = `perspective(1400px) rotateX(${((0.5 - y) * 7).toFixed(2)}deg) rotateY(${((x - 0.5) * 9).toFixed(2)}deg)`
    }
  }
  const onPointerLeave = () => {
    if (frameRef.current) frameRef.current.style.transform = ''
  }

  const autoplay = images.length > 1 && !reduced

  return (
    <div ref={stageRef} className="group/stage relative" onPointerMove={onPointerMove} onPointerLeave={onPointerLeave}>
      {/* The hero's contour field, as a halo around the screen. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-24 -inset-y-28 -z-10 [mask-image:radial-gradient(closest-side,black_50%,transparent)]"
      >
        <ShaderField className="h-full w-full" />
      </div>

      <div className="label mb-4 flex items-center gap-4 text-fg-subtle">
        <span>
          <span className="text-accent">PRJ-{pad(active + 1)}</span> / {pad(projects.length)}
        </span>
        <div className="flex flex-1 gap-1.5">
          {projects.map((candidate, candidateIndex) => (
            <button
              key={candidate.slug}
              type="button"
              onClick={() => onJump(candidateIndex)}
              aria-label={`Show ${candidate.title}`}
              aria-current={candidateIndex === active ? 'true' : undefined}
              className="group/seg flex h-5 flex-1 items-center"
            >
              <span
                className={`h-0.5 w-full transition-colors duration-300 ${
                  candidateIndex === active ? 'bg-accent' : 'bg-border-strong group-hover/seg:bg-fg-subtle'
                }`}
              />
            </button>
          ))}
        </div>
        <StatusPill status={project.status} />
      </div>

      <div
        ref={frameRef}
        className="relative transition-transform duration-300 ease-out will-change-transform"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div
          aria-hidden
          className="absolute -inset-6 -z-10 rounded-3xl bg-[radial-gradient(closest-side,var(--glow),transparent)] opacity-80 transition duration-500 group-hover/stage:scale-110 group-hover/stage:opacity-100"
        />
        <BrowserFrame address={addressFor(project)}>
          <Link
            to={`/projects/${project.slug}${query}`}
            tabIndex={-1}
            aria-hidden
            className="relative block aspect-16/10 overflow-hidden bg-surface-2"
          >
            {layers.under && (
              <img src={layers.under.src} alt="" className="absolute inset-0 h-full w-full object-cover" />
            )}
            <img key={layers.key} src={layers.top.src} alt="" className="absolute inset-0 h-full w-full animate-wipe object-cover" />
            <span
              key={`sweep-${layers.key}`}
              className="pointer-events-none absolute inset-y-0 w-0.5 animate-sweep bg-accent shadow-[0_0_28px_6px_var(--accent)]"
            />
            <span
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/stage:opacity-100"
              style={{
                background:
                  'radial-gradient(circle at var(--gx, 50%) var(--gy, 50%), rgb(255 255 255 / 0.16), rgb(255 255 255 / 0.04) 30%, transparent 55%)',
              }}
            />
          </Link>
        </BrowserFrame>
      </div>

      <div className="mt-5 flex items-start justify-between gap-6">
        <p aria-live="polite" className="line-clamp-2 max-w-md text-sm leading-relaxed text-fg-muted">
          {showing.caption ?? showing.alt}
        </p>
        {images.length > 1 && (
          <div className="flex shrink-0 gap-1.5">
            {images.map((image, imageIndex) => {
              const current = imageIndex === index
              return (
                <button
                  key={image.src}
                  type="button"
                  aria-label={`Screenshot ${imageIndex + 1} of ${images.length}: ${image.alt}`}
                  aria-pressed={current}
                  onClick={() => setPick({ slug: project.slug, index: imageIndex })}
                  className={`relative h-10 w-16 overflow-hidden border transition ${
                    current ? 'border-accent' : 'border-border opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={image.src} alt="" loading="lazy" className="h-full w-full object-cover" />
                  {current && autoplay && (
                    <span
                      key={key}
                      aria-hidden
                      onAnimationEnd={advance}
                      className={`absolute inset-x-0 bottom-0 h-0.5 origin-left animate-fill bg-accent group-hover/stage:[animation-play-state:paused] ${
                        visible ? '' : '[animation-play-state:paused]'
                      }`}
                    />
                  )}
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

/** One project on the left: what it is, the spec, and where to go next. */
function Chapter({
  project,
  index,
  total,
  active,
  query,
  withImage,
  innerRef,
  onFocus,
}: {
  project: Project
  index: number
  total: number
  active: boolean
  query: string
  withImage: boolean
  innerRef: (element: HTMLElement | null) => void
  onFocus: () => void
}) {
  const to = `/projects/${project.slug}${query}`
  return (
    <article
      ref={innerRef}
      data-index={index}
      onFocus={onFocus}
      className={`relative border-l border-border pl-7 transition-opacity duration-500 sm:pl-9 ${
        withImage ? 'pb-16' : `flex min-h-[78svh] flex-col justify-center ${active ? '' : 'opacity-30 hover:opacity-60'}`
      }`}
    >
      <span
        aria-hidden
        className={`absolute top-1/2 -left-px w-0.5 -translate-y-1/2 bg-accent transition-all duration-500 ${
          active || withImage ? 'h-28' : 'h-0'
        }`}
      />

      {withImage && (
        <Link to={to} tabIndex={-1} aria-hidden className="mb-8 block">
          <BrowserFrame address={addressFor(project)}>
            <img src={project.cover.src} alt="" loading="lazy" className="aspect-16/10 w-full object-cover" />
          </BrowserFrame>
        </Link>
      )}

      <div className="flex items-end gap-4">
        <span aria-hidden className="font-serif text-6xl leading-[0.8] text-accent italic">
          {pad(index + 1)}
        </span>
        <span className="label pb-1 text-fg-subtle">
          / {pad(total)} · {project.period}
        </span>
      </div>

      <h3 className="display mt-6 text-[clamp(2.4rem,4.4vw,4rem)] leading-[0.92]">
        <Link to={to} className="transition-colors hover:text-accent">
          {project.title}
        </Link>
      </h3>
      <p className="mt-5 max-w-md text-lg leading-relaxed text-fg-muted">{project.blurb}</p>

      <ul className="mt-6 max-w-md space-y-2.5 text-sm">
        {project.highlights.slice(0, 2).map((highlight) => (
          <li key={highlight} className="flex gap-2.5">
            <Check className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
            <span>{highlight}</span>
          </li>
        ))}
      </ul>

      <dl className="mt-6 max-w-md space-y-2">
        <Spec label="Role">{project.role}</Spec>
        <Spec label="Stack">{project.tech.slice(0, 4).join(', ')}</Spec>
      </dl>

      <div className="mt-8 flex flex-wrap gap-2">
        <Link to={to} className="btn btn-primary" aria-label={`Read the ${project.title} case study`}>
          Case study
          <ArrowRight className="size-4" aria-hidden />
        </Link>
        {project.demo && (
          <Link to={`${to}#demo`} className="btn btn-secondary" aria-label={`Try it: ${project.demo.title}`}>
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
    </article>
  )
}

/**
 * "Selected work". The projects scroll by normally on the left; whichever one
 * crosses the middle of the screen takes over the pinned stage on the right.
 */
export function WorkShowcase() {
  const { lens, query } = useLens()
  const featured = featuredFor(lens)
  const stage = useMedia(STAGE_QUERY)
  const [activeIndex, setActiveIndex] = useState(0)
  const active = Math.min(activeIndex, featured.length - 1)
  const chapters = useRef<(HTMLElement | null)[]>([])
  const slugs = featured.map((project) => project.slug).join(',')

  // The chapter crossing the middle line of the screen is the active one.
  useEffect(() => {
    if (!stage) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveIndex(Number((entry.target as HTMLElement).dataset.index))
        }
      },
      { rootMargin: '-50% 0px -50% 0px' },
    )
    chapters.current.forEach((element) => element && observer.observe(element))
    return () => observer.disconnect()
  }, [stage, slugs])

  const jump = useCallback((index: number) => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    chapters.current[index]?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' })
  }, [])

  return (
    <section aria-labelledby="work" className="overflow-x-clip py-20 sm:py-28">
      <div className="container-page">
        <p className="label flex items-center gap-4 text-fg-subtle">
          <span className="text-accent">[01]</span>
          <Scramble text={lens ? `Selected work · ${lens.label}` : 'Selected work'} />
          <span aria-hidden className="h-px flex-1 bg-border" />
          <span>{pad(featured.length)} projects</span>
        </p>
        <div className="mt-6 flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
          <h2 id="work" className="display max-w-3xl scroll-mt-24 text-[clamp(2.25rem,4.4vw,4rem)] leading-[1]">
            <Emphasis text="Projects I'm *proud of*" />
          </h2>
          <HiringLens />
        </div>
        {lens && <p className="mt-4 max-w-3xl leading-relaxed text-fg-muted">{lens.pitch}</p>}

        <div className={stage ? 'mt-10 grid grid-cols-12 gap-14' : 'mt-12'}>
          <div className={stage ? 'col-span-5' : ''}>
            {featured.map((project, index) => (
              <Chapter
                key={project.slug}
                project={project}
                index={index}
                total={featured.length}
                active={index === active}
                query={query}
                withImage={!stage}
                innerRef={(element) => {
                  chapters.current[index] = element
                }}
                onFocus={() => setActiveIndex(index)}
              />
            ))}
          </div>

          {stage && featured.length > 0 && (
            <div className="col-span-7">
              <div className="sticky top-24 flex h-[calc(100svh-7rem)] flex-col justify-center">
                <Stage projects={featured} active={active} query={query} onJump={jump} />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
