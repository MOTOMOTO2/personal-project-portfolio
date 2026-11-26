import { ArrowLeft, ArrowUpRight, MousePointerClick } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Emphasis } from '../components/Emphasis'
import { StatusPill } from '../components/StatusPill'
import { site } from '../data/site'
import type { Project } from '../data/types'
import { useLens } from '../lib/lens'
import { useReveal } from '../lib/reveal'
import { CATEGORIES, inCategory, newestFirst } from '../lib/work'

const ordered = newestFirst(site.projects)
const live = site.projects.filter((project) => project.status === 'Live').length
const building = site.projects.filter((project) => project.status === 'In progress').length

/**
 * Every project in one index, newest first, filterable by kind. Hovering a row
 * floats its cover beside the pointer; on touch screens each row carries a
 * small thumbnail instead.
 */
export function AllWork() {
  const [params, setParams] = useSearchParams()
  const { query } = useLens()
  const type = CATEGORIES.some((category) => category.id === params.get('type')) ? params.get('type')! : 'all'
  const shown = ordered.filter((project) => inCategory(project, type))

  const previewRef = useRef<HTMLDivElement>(null)
  const [preview, setPreview] = useState<Project | null>(null)

  useReveal([type])

  // The filter shares the URL with the hiring lens (?for=), so keep that.
  const choose = (id: string) =>
    setParams(
      (current) => {
        const next = new URLSearchParams(current)
        if (id === 'all') next.delete('type')
        else next.set('type', id)
        return next
      },
      { replace: true },
    )

  // Written to the element, not state, so moving the mouse never re-renders.
  const follow = useCallback((event: React.PointerEvent) => {
    const element = previewRef.current
    if (!element || event.pointerType !== 'mouse') return
    element.style.transform = `translate3d(${event.clientX + 28}px, ${event.clientY - 110}px, 0) rotate(-2deg)`
  }, [])

  return (
    <section className="relative">
      <div aria-hidden className="hero-glow pointer-events-none absolute inset-x-0 top-0 h-[30rem]" />
      <div className="container-page relative pt-10 pb-24 sm:pt-14">
        <Link
          to={`/${query}`}
          className="inline-flex items-center gap-1.5 text-sm text-fg-muted transition-colors hover:text-fg"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Home
        </Link>

        <header className="reveal mt-8 max-w-3xl">
          <p className="eyebrow">Index</p>
          <h1 className="mt-4 text-[clamp(2.75rem,7vw,5rem)] leading-[0.95] font-semibold">
            <Emphasis text="Everything I've *built*" />
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-fg-muted">
            {site.projects.length} projects, newest first. {live} are live in production and {building} are still being
            built. Each one has its own write-up.
          </p>
        </header>

        <div role="group" aria-label="Filter by kind of project" className="mt-10 flex flex-wrap gap-1.5">
          {CATEGORIES.map((category) => {
            const count = site.projects.filter((project) => inCategory(project, category.id)).length
            const active = type === category.id
            return (
              <button
                key={category.id}
                type="button"
                aria-pressed={active}
                onClick={() => choose(category.id)}
                className={`inline-flex h-9 items-center gap-2 rounded-full border px-4 text-sm transition-colors ${
                  active
                    ? 'border-fg bg-fg text-bg'
                    : 'border-border bg-surface text-fg-muted hover:border-border-strong hover:text-fg'
                }`}
              >
                {category.label}
                <span className={`font-mono text-xs ${active ? 'text-bg/70' : 'text-fg-subtle'}`}>{count}</span>
              </button>
            )
          })}
        </div>

        <ol
          aria-label="Projects"
          onPointerMove={follow}
          onPointerLeave={() => setPreview(null)}
          className="mt-8 border-t border-border"
        >
          {shown.map((project, index) => (
            <li key={project.slug} className="border-b border-border">
              <Link
                to={`/projects/${project.slug}${query}`}
                onPointerEnter={() => setPreview(project)}
                onFocus={() => setPreview(null)}
                className="group grid grid-cols-[4.5rem_minmax(0,1fr)] items-center gap-x-4 gap-y-1 py-5 sm:grid-cols-[3rem_minmax(0,1fr)_8rem] sm:py-6 lg:grid-cols-[3rem_minmax(0,1.6fr)_minmax(0,1fr)_7.5rem_8rem_1.25rem]"
              >
                <img
                  src={project.cover.src}
                  alt=""
                  loading="lazy"
                  className="aspect-16/10 w-full rounded-md border border-border object-cover sm:hidden"
                />
                <span aria-hidden className="hidden font-mono text-sm text-fg-subtle tabular-nums sm:block">
                  {String(index + 1).padStart(2, '0')}
                </span>

                <span className="min-w-0">
                  <span className="flex items-center gap-2.5">
                    <span className="text-lg font-semibold tracking-tight transition duration-300 group-hover:translate-x-1 group-hover:text-accent sm:text-2xl">
                      {project.title}
                    </span>
                    {project.demo && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-accent-soft px-2 py-0.5 text-[0.6875rem] font-medium text-accent">
                        <MousePointerClick className="size-3" aria-hidden />
                        demo
                      </span>
                    )}
                  </span>
                  <span className="mt-1 line-clamp-2 text-sm leading-relaxed text-fg-muted sm:line-clamp-1">
                    {project.blurb}
                  </span>
                </span>

                <span className="hidden truncate font-mono text-xs text-fg-subtle lg:block">
                  {project.tech.slice(0, 3).join(' · ')}
                </span>
                <span className="hidden lg:block">
                  <StatusPill status={project.status} />
                </span>
                <span className="col-start-2 text-xs text-fg-subtle sm:col-start-auto sm:text-right sm:text-sm">
                  {project.period}
                </span>
                <ArrowUpRight
                  aria-hidden
                  className="hidden size-5 text-fg-subtle transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent lg:block"
                />
              </Link>
            </li>
          ))}
        </ol>

        {shown.length === 0 && <p className="mt-8 text-fg-muted">Nothing in this group yet.</p>}
      </div>

      {/* The cover that follows the pointer over the list. Mouse only. */}
      <div
        ref={previewRef}
        aria-hidden
        className={`pointer-events-none fixed top-0 left-0 z-30 hidden w-80 overflow-hidden rounded-xl border border-border bg-surface-2 shadow-[0_30px_60px_-20px_rgb(0_0_0/0.45)] transition-opacity duration-200 [@media(hover:hover)]:lg:block ${
          preview ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {preview && <img src={preview.cover.src} alt="" className="aspect-16/10 w-full object-cover" />}
      </div>
    </section>
  )
}
