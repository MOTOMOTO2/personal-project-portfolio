import { ArrowLeft, ArrowRight, ExternalLink, FileText } from 'lucide-react'
import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { Lightbox } from '../components/Lightbox'
import { GithubIcon } from '../lib/icons'
import { StatusPill } from '../components/StatusPill'
import { site } from '../data/site'
import { useReveal } from '../lib/reveal'

export function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>()
  const [open, setOpen] = useState<number | null>(null)

  const index = site.projects.findIndex((candidate) => candidate.slug === slug)
  const project = index === -1 ? undefined : site.projects[index]

  useReveal([slug])

  if (!project) return <Navigate to="/404" replace />

  // Previous/next wrap around so there is always somewhere to go.
  const next = site.projects[(index + 1) % site.projects.length]
  const images = [project.cover, ...project.gallery]

  return (
    <article className="pb-20">
      <div className="container-page pt-10">
        <Link
          to="/#projects"
          className="inline-flex items-center gap-1.5 text-sm text-fg-muted transition hover:text-fg"
        >
          <ArrowLeft className="size-4" aria-hidden />
          All projects
        </Link>

        <header className="mt-6 max-w-3xl">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <StatusPill status={project.status} />
            <span className="font-mono text-xs text-fg-muted">{project.year}</span>
            {project.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-surface-2 px-2 py-0.5 text-[11px] text-fg-muted">
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-3xl font-bold sm:text-4xl lg:text-5xl">{project.title}</h1>
          <p className="mt-4 text-lg leading-relaxed text-fg-muted">{project.blurb}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            {project.links.demo && (
              <a
                href={project.links.demo}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-accent-fg transition hover:opacity-90"
              >
                <ExternalLink className="size-4" aria-hidden />
                Live demo
              </a>
            )}
            {project.links.repo && (
              <a
                href={project.links.repo}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-semibold transition hover:bg-surface-2"
              >
                <GithubIcon className="size-4" aria-hidden />
                Source code
              </a>
            )}
            {project.links.writeup && (
              <a
                href={project.links.writeup}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-semibold transition hover:bg-surface-2"
              >
                <FileText className="size-4" aria-hidden />
                Write-up
              </a>
            )}
          </div>
        </header>

        <button
          type="button"
          onClick={() => setOpen(0)}
          className="reveal mt-10 block w-full overflow-hidden rounded-2xl border border-border shadow-card"
          aria-label={`Enlarge cover image: ${project.cover.alt}`}
        >
          <img
            src={project.cover.src}
            alt={project.cover.alt}
            width={1200}
            height={750}
            className="aspect-16/10 w-full object-cover"
          />
        </button>

        <div className="mt-12 grid gap-12 lg:grid-cols-[1.5fr_1fr]">
          <div className="reveal space-y-4 text-[1.0625rem] leading-relaxed text-fg-muted">
            {project.description.map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
          </div>

          <aside className="reveal space-y-6 self-start rounded-xl border border-border bg-surface p-6">
            <div>
              <h2 className="mb-1.5 text-xs font-semibold tracking-wider uppercase">Role</h2>
              <p className="text-sm text-fg-muted">{project.role}</p>
            </div>
            <div>
              <h2 className="mb-2 text-xs font-semibold tracking-wider uppercase">Built with</h2>
              <ul className="flex flex-wrap gap-1.5">
                {project.tech.map((tech) => (
                  <li
                    key={tech}
                    className="rounded-md bg-surface-2 px-2 py-1 font-mono text-[11px] text-fg-muted"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
            {project.highlights.length > 0 && (
              <div>
                <h2 className="mb-2 text-xs font-semibold tracking-wider uppercase">Highlights</h2>
                <ul className="space-y-2 text-sm text-fg-muted">
                  {project.highlights.map((highlight) => (
                    <li key={highlight} className="flex gap-2">
                      <span aria-hidden className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>

        {project.gallery.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-6 text-xl font-semibold">Screenshots</h2>
            <ul className="grid gap-6 sm:grid-cols-2">
              {project.gallery.map((image, galleryIndex) => (
                <li key={image.src} className="reveal">
                  <button
                    type="button"
                    /* +1 because the cover occupies index 0 of the lightbox set. */
                    onClick={() => setOpen(galleryIndex + 1)}
                    className="group block w-full overflow-hidden rounded-xl border border-border bg-surface text-left"
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      width={1200}
                      height={750}
                      loading="lazy"
                      className="aspect-16/10 w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                    />
                    {image.caption && (
                      <span className="block px-4 py-3 text-sm text-fg-muted">{image.caption}</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        <nav className="mt-16 flex items-center justify-between gap-4 border-t border-border pt-8">
          <Link to="/#projects" className="text-sm text-fg-muted transition hover:text-fg">
            ← Back to all projects
          </Link>
          <Link
            to={`/projects/${next.slug}`}
            className="inline-flex items-center gap-2 text-sm font-medium transition hover:text-accent"
            onClick={() => window.scrollTo({ top: 0 })}
          >
            <span className="text-fg-muted">Next:</span> {next.title}
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </nav>
      </div>

      <Lightbox images={images} index={open} onClose={() => setOpen(null)} onNavigate={setOpen} />
    </article>
  )
}
