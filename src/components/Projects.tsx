import { site } from '../data/site'
import { featuredFor, useLens } from '../lib/lens'
import { HandsOn } from './HandsOn'
import { MoreWork } from './MoreWork'
import { WorkShowcase } from './WorkShowcase'

/**
 * Selected work (the showcase), the door to the full index for everything
 * else, then the hands-on demos. The showcase follows the hiring lens; every
 * project is always one click away on /work.
 */
export function Projects() {
  const { lens, query } = useLens()
  const featuredSlugs = new Set(featuredFor(lens).map((project) => project.slug))
  const others = site.projects.filter((project) => !featuredSlugs.has(project.slug))

  return (
    <>
      <WorkShowcase />
      <MoreWork others={others} query={query} />
      <HandsOn query={query} />
    </>
  )
}
