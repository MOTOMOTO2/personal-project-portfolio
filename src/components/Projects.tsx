import { Search, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { site } from '../data/site'
import { useReveal } from '../lib/reveal'
import { ProjectCard } from './ProjectCard'
import { SectionHeading } from './SectionHeading'

const ALL = 'All'

export function Projects() {
  const [tag, setTag] = useState(ALL)
  const [query, setQuery] = useState('')

  const tags = useMemo(() => {
    const unique = new Set(site.projects.flatMap((project) => project.tags))
    return [ALL, ...[...unique].sort()]
  }, [])

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return site.projects
      .filter((project) => tag === ALL || project.tags.includes(tag))
      .filter((project) => {
        if (!needle) return true
        // Search title, blurb, tech and tags so "react" or "map" both work.
        const haystack = [project.title, project.blurb, ...project.tech, ...project.tags]
          .join(' ')
          .toLowerCase()
        return haystack.includes(needle)
      })
      .sort((a, b) => Number(b.featured) - Number(a.featured) || b.year.localeCompare(a.year))
  }, [tag, query])

  // Re-run the reveal observer when the visible set changes, so newly mounted
  // cards animate in instead of sitting at opacity 0.
  useReveal([visible.length, tag, query])

  return (
    <section className="py-16 sm:py-20">
      <div className="container-page">
        <SectionHeading
          id="projects"
          eyebrow="Work"
          title="Projects"
          description={`${site.projects.length} things I have designed, built, and in most cases shipped. Open one for the full story, screenshots, and links.`}
        />

        <div className="reveal mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <ul className="flex flex-wrap gap-2" role="list" aria-label="Filter projects by category">
            {tags.map((item) => (
              <li key={item}>
                <button
                  type="button"
                  onClick={() => setTag(item)}
                  aria-pressed={tag === item}
                  className={`rounded-full border px-3 py-1.5 text-sm transition ${
                    tag === item
                      ? 'border-accent bg-accent-soft font-medium text-accent'
                      : 'border-border bg-surface text-fg-muted hover:text-fg'
                  }`}
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>

          <div className="relative sm:w-64">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-fg-muted"
              aria-hidden
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search projects or tech"
              aria-label="Search projects"
              className="w-full rounded-lg border border-border bg-surface py-2 pr-9 pl-9 text-sm placeholder:text-fg-muted focus:border-accent focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Clear search"
                className="absolute top-1/2 right-2 -translate-y-1/2 rounded p-1 text-fg-muted transition hover:text-fg"
              >
                <X className="size-4" aria-hidden />
              </button>
            )}
          </div>
        </div>

        {visible.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border bg-surface p-10 text-center text-fg-muted">
            No projects match that filter.{' '}
            <button
              type="button"
              className="font-medium text-accent underline"
              onClick={() => {
                setTag(ALL)
                setQuery('')
              }}
            >
              Reset
            </button>
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
