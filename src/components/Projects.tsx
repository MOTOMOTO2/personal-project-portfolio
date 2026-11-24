import { site } from '../data/site'
import { FeaturedProject } from './FeaturedProject'
import { ProjectCard } from './ProjectCard'
import { SectionHeading } from './SectionHeading'

const featured = site.projects.filter((project) => project.featured)
const others = site.projects.filter((project) => !project.featured)

/** "Selected work" (large rows) followed by "More projects" (a grid). */
export function Projects() {
  return (
    <>
      <section className="py-20 sm:py-28">
        <div className="container-page">
          <SectionHeading
            id="work"
            eyebrow="Selected work"
            title="Projects I've designed, built and shipped"
            description="The ones that best show how I work, from database schema to deployment. Each has a full write-up with screenshots."
          />
          <div className="space-y-20 sm:space-y-28">
            {featured.map((project, index) => (
              <FeaturedProject key={project.slug} project={project} reverse={index % 2 === 1} />
            ))}
          </div>
        </div>
      </section>

      {others.length > 0 && (
        <section className="border-t border-border bg-surface/60 py-20 sm:py-28">
          <div className="container-page">
            <SectionHeading
              id="projects"
              eyebrow="More projects"
              title="Games, offline apps and tools"
              description="Browser and Roblox games, offline-first phone apps, home automation and developer tools. Each one has its own write-up."
            />
            <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
