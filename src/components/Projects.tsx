import { site } from '../data/site'
import { featuredFor, useLens } from '../lib/lens'
import { FeaturedProject } from './FeaturedProject'
import { HandsOn } from './HandsOn'
import { ProjectCard } from './ProjectCard'
import { SectionHeading } from './SectionHeading'

/**
 * "Selected work" (large rows), the hands-on demos, then "More projects" (a
 * grid). The large rows follow the hiring lens when one is picked; everything
 * else lands in the grid, so every project is always on the page once.
 */
export function Projects() {
  const { lens, setLens, query } = useLens()
  const featured = featuredFor(lens)
  const featuredSlugs = new Set(featured.map((project) => project.slug))
  const others = site.projects.filter((project) => !featuredSlugs.has(project.slug))

  return (
    <>
      <section className="py-20 sm:py-28">
        <div className="container-page">
          <SectionHeading
            id="work"
            eyebrow={lens ? `Selected work · ${lens.label}` : 'Selected work'}
            title="Projects I've designed, built and shipped"
            description={
              lens
                ? lens.pitch
                : 'The ones that best show how I work, from database schema to deployment. Each has a full write-up with screenshots.'
            }
          >
            {lens && (
              <button
                type="button"
                onClick={() => setLens(null)}
                className="mt-4 text-sm text-fg-muted underline underline-offset-4 transition-colors hover:text-fg"
              >
                Show my usual picks instead
              </button>
            )}
          </SectionHeading>
          <div className="space-y-20 sm:space-y-28">
            {featured.map((project, index) => (
              <FeaturedProject key={project.slug} project={project} reverse={index % 2 === 1} query={query} />
            ))}
          </div>
        </div>
      </section>

      <HandsOn query={query} />

      {others.length > 0 && (
        <section className="border-t border-border bg-surface/60 py-20 sm:py-28">
          <div className="container-page">
            <SectionHeading
              id="projects"
              eyebrow="More projects"
              title={lens ? 'Everything else I’ve built' : 'Games, offline apps and tools'}
              description="Browser and Roblox games, offline-first phone apps, home automation and developer tools. Each one has its own write-up."
            />
            <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((project) => (
                <ProjectCard key={project.slug} project={project} query={query} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
