import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Check, FileText, MousePointerClick } from 'lucide-react'
import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { BrowserFrame } from '../components/BrowserFrame'
import { Lightbox } from '../components/Lightbox'
import { ReadingProgress } from '../components/ReadingProgress'
import { demos } from '../components/demos/registry'
import { StatusPill } from '../components/StatusPill'
import { site } from '../data/site'
import { GithubIcon } from '../lib/icons'
import { featuredFor, useLens } from '../lib/lens'
import { useReveal } from '../lib/reveal'
import { addressFor } from '../lib/text'

export function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>()
  const [open, setOpen] = useState<number | null>(null)
  const { lens, query } = useLens()

  const index = site.projects.findIndex((candidate) => candidate.slug === slug)
  const project = index === -1 ? undefined : site.projects[index]

  useReveal([slug])

  if (!project) return <Navigate to="/404" replace />

  // Previous/next wrap around so there is always somewhere to go.
  const count = site.projects.length
  const previous = site.projects[(index - 1 + count) % count]
  const next = site.projects[(index + 1) % count]
  const images = [project.cover, ...project.gallery]
  // Back to wherever this project sits on the home page under the same lens.
  const inRows = featuredFor(lens).some((candidate) => candidate.slug === project.slug)
  const backTo = inRows ? `/${query}#work` : `/work${query}`
  const Demo = project.demo ? demos[project.demo.id].Component : null

  return (
    <article className="relative pb-24">
      <ReadingProgress />
      <div aria-hidden className="hero-glow pointer-events-none absolute inset-x-0 top-0 h-[36rem]" />
      <div className="container-page relative pt-10 sm:pt-14">
        <Link
          to={backTo}
          className="inline-flex items-center gap-1.5 text-sm text-fg-muted transition-colors hover:text-fg"
        >
          <ArrowLeft className="size-4" aria-hidden />
          All projects
        </Link>

        <header className="mt-8 max-w-3xl">
          <p className="eyebrow">{project.tags.join(' · ')}</p>
          <h1 className="mt-4 text-[clamp(2.5rem,6vw,4.25rem)] leading-[1] font-semibold">{project.title}</h1>
          <p className="mt-5 text-lg leading-relaxed text-fg-muted sm:text-xl">{project.blurb}</p>

          {(project.links.demo || project.links.repo || project.links.writeup || project.demo) && (
            <div className="mt-8 flex flex-wrap gap-2">
              {project.links.demo && (
                <a href={project.links.demo} target="_blank" rel="noreferrer" className="btn btn-accent">
                  Live site
                  <ArrowUpRight className="size-4" aria-hidden />
                </a>
              )}
              {project.links.repo && (
                <a href={project.links.repo} target="_blank" rel="noreferrer" className="btn btn-secondary">
                  <GithubIcon className="size-4" aria-hidden />
                  Source code
                </a>
              )}
              {project.links.writeup && (
                <a href={project.links.writeup} target="_blank" rel="noreferrer" className="btn btn-secondary">
                  <FileText className="size-4" aria-hidden />
                  Write-up
                </a>
              )}
              {project.demo && (
                <a href="#demo" className="btn btn-secondary">
                  <MousePointerClick className="size-4 text-accent" aria-hidden />
                  Try it in the page
                  <ArrowDown className="size-3.5" aria-hidden />
                </a>
              )}
            </div>
          )}
        </header>

        <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-5 border-y border-border py-6 sm:grid-cols-4">
          <div>
            <dt className="text-xs text-fg-subtle">Timeline</dt>
            <dd className="mt-1 text-sm font-medium">{project.period}</dd>
          </div>
          <div>
            <dt className="text-xs text-fg-subtle">Role</dt>
            <dd className="mt-1 text-sm font-medium">{project.role}</dd>
          </div>
          <div>
            <dt className="text-xs text-fg-subtle">Status</dt>
            <dd className="mt-1.5">
              <StatusPill status={project.status} />
            </dd>
          </div>
          <div>
            <dt className="text-xs text-fg-subtle">Main stack</dt>
            <dd className="mt-1 text-sm font-medium">{project.tech.slice(0, 3).join(', ')}</dd>
          </div>
        </dl>

        <button
          type="button"
          onClick={() => setOpen(0)}
          className="reveal mt-10 block w-full cursor-zoom-in text-left"
          aria-label={`Enlarge cover image: ${project.cover.alt}`}
        >
          <BrowserFrame address={addressFor(project)}>
            <img
              src={project.cover.src}
              alt={project.cover.alt}
              width={1600}
              height={1000}
              className="aspect-16/10 w-full object-cover"
            />
          </BrowserFrame>
        </button>

        <div className="mt-16 grid gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="reveal lg:col-span-7">
            <h2 className="eyebrow mb-5">Overview</h2>
            <div className="space-y-5 text-[1.0625rem] leading-relaxed text-fg-muted">
              {project.description.map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{paragraph}</p>
              ))}
            </div>
          </div>

          <aside className="reveal space-y-10 self-start lg:col-span-4 lg:col-start-9">
            {project.highlights.length > 0 && (
              <div>
                <h2 className="eyebrow mb-4">Highlights</h2>
                <ul className="space-y-3 text-sm">
                  {project.highlights.map((highlight) => (
                    <li key={highlight} className="flex gap-2.5">
                      <Check className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div>
              <h2 className="eyebrow mb-4">Built with</h2>
              <ul className="flex flex-wrap gap-1.5">
                {project.tech.map((tech) => (
                  <li
                    key={tech}
                    className="rounded-md border border-border bg-surface px-2 py-1 font-mono text-xs text-fg-muted"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>

        {project.demo && Demo && (
          <section aria-labelledby="demo" className="mt-20">
            <p className="eyebrow mb-3">Try it</p>
            <h2 id="demo" className="scroll-mt-24 text-2xl font-semibold sm:text-3xl">
              {project.demo.title}
            </h2>
            <p className="mt-3 max-w-2xl leading-relaxed text-fg-muted">{project.demo.teaser}</p>
            <div className="mt-6 rounded-xl border border-border bg-surface p-4 shadow-card sm:p-6">
              <Demo key={project.slug} />
            </div>
            <p className="mt-3 text-xs text-fg-subtle">
              A model that runs in this page, built from {project.title}'s own rules. It doesn't talk to the real app.
            </p>
          </section>
        )}

        {project.gallery.length > 0 && (
          <section className="mt-20">
            <h2 className="eyebrow mb-6">Screenshots</h2>
            <ul className={`grid gap-6 ${project.gallery.length > 1 ? 'sm:grid-cols-2' : ''}`}>
              {project.gallery.map((image, galleryIndex) => (
                <li key={image.src} className="reveal">
                  <button
                    type="button"
                    /* +1 because the cover occupies index 0 of the lightbox set. */
                    onClick={() => setOpen(galleryIndex + 1)}
                    className="group block w-full cursor-zoom-in text-left"
                  >
                    <span className="block overflow-hidden rounded-xl border border-border bg-surface-2">
                      <img
                        src={image.src}
                        alt={image.alt}
                        width={1600}
                        height={1000}
                        loading="lazy"
                        className="aspect-16/10 w-full object-cover transition duration-700 group-hover:scale-[1.02]"
                      />
                    </span>
                    {image.caption && <span className="mt-3 block text-sm text-fg-muted">{image.caption}</span>}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        <nav aria-label="More projects" className="mt-20 grid gap-4 border-t border-border pt-10 sm:grid-cols-2">
          <Link
            to={`/projects/${previous.slug}${query}`}
            className="group rounded-xl border border-border bg-surface p-5 transition-colors hover:border-border-strong"
          >
            <span className="flex items-center gap-1.5 text-xs text-fg-subtle">
              <ArrowLeft className="size-3.5 transition group-hover:-translate-x-0.5" aria-hidden />
              Previous
            </span>
            <span className="mt-1.5 block font-medium">{previous.title}</span>
          </Link>
          <Link
            to={`/projects/${next.slug}${query}`}
            className="group rounded-xl border border-border bg-surface p-5 text-right transition-colors hover:border-border-strong"
          >
            <span className="flex items-center justify-end gap-1.5 text-xs text-fg-subtle">
              Next
              <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" aria-hidden />
            </span>
            <span className="mt-1.5 block font-medium">{next.title}</span>
          </Link>
        </nav>
      </div>

      <Lightbox images={images} index={open} onClose={() => setOpen(null)} onNavigate={setOpen} />
    </article>
  )
}
