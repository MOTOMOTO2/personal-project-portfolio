import { useCallback } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { site } from '../data/site'
import type { Lens, Project } from '../data/types'

/**
 * The "What are you hiring for?" choice lives in the URL (`?for=backend`), so a
 * tailored view is a link that can be sent, bookmarked or reloaded, and the
 * back button never has to undo it. Internal links append `query` so the
 * choice follows the visitor onto project pages and back.
 */

const bySlug = new Map(site.projects.map((project) => [project.slug, project]))

export function findLens(id: string | null): Lens | null {
  return site.lenses.find((lens) => lens.id === id) ?? null
}

/** The large rows for a lens, or the projects marked `featured` when there is none. */
export function featuredFor(lens: Lens | null): Project[] {
  if (!lens) return site.projects.filter((project) => project.featured)
  return lens.featured.map((slug) => bySlug.get(slug)).filter((project): project is Project => Boolean(project))
}

/** "A, B and C", matching the rest of the site's copy. */
export function joinTitles(titles: string[]): string {
  if (titles.length <= 1) return titles.join('')
  return `${titles.slice(0, -1).join(', ')} and ${titles[titles.length - 1]}`
}

export function useLens() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { pathname, hash } = useLocation()
  const lens = findLens(params.get('for'))

  // Replace rather than push: flipping between choices shouldn't fill the
  // history. The hash is kept, so ScrollManager sees no change and the page
  // stays where it is.
  const setLens = useCallback(
    (id: string | null) => navigate({ pathname, search: id ? `?for=${id}` : '', hash }, { replace: true }),
    [navigate, pathname, hash],
  )

  return { lens, setLens, query: lens ? `?for=${lens.id}` : '' }
}
