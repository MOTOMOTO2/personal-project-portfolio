import { site } from '../data/site'
import { featuredFor, useLens } from '../lib/lens'
import { FeaturedProject } from './FeaturedProject'
import { HandsOn } from './HandsOn'
import { HiringLens } from './HiringLens'
import { MoreWork } from './MoreWork'
import { SectionHeading } from './SectionHeading'

/**
 * "Selected work" as a stack of cards, a door to the full index for the rest,
 * then the hands-on demos. The cards follow the hiring lens when one is
 * picked; every project is always one click away on /work.
 */
export function Projects() {
  const { lens, query } = useLens()
  const featured = featuredFor(lens)
  const featuredSlugs = new Set(featured.map((project) => project.slug))
  const others = site.projects.filter((project) => !featuredSlugs.has(project.slug))

  return (
    <>
      <section className="overflow-x-clip pt-20 pb-14 sm:pt-28 sm:pb-20">
        <div className="container-page">
          <SectionHeading
            id="work"
            index="01"
            eyebrow={lens ? `Selected work · ${lens.label}` : 'Selected work'}
            title="Projects I've designed, built and *shipped*"
            description={
              lens
                ? lens.pitch
                : 'The ones that best show how I work, from database schema to deployment. Each has a full write-up with screenshots.'
            }
          >
            <HiringLens />
          </SectionHeading>
          <div className="space-y-6 lg:space-y-10">
            {featured.map((project, index) => (
              <FeaturedProject key={project.slug} project={project} number={index + 1} query={query} />
            ))}
          </div>
        </div>
      </section>

      <MoreWork others={others} query={query} />
      <HandsOn query={query} />
    </>
  )
}
