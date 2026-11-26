import type { Project } from '../data/types'

/**
 * The filters on the All work page. Each one is a set of project tags, so a
 * new project lands under the right filters without touching this file.
 */
export const CATEGORIES = [
  { id: 'all', label: 'All', tags: [] as string[] },
  { id: 'full-stack', label: 'Full-stack', tags: ['Full-stack'] },
  { id: 'ai', label: 'AI', tags: ['AI', 'Machine learning'] },
  { id: 'offline', label: 'Offline & real-time', tags: ['Offline-first', 'Real-time', 'PWA'] },
  { id: 'games', label: 'Games', tags: ['Game'] },
  { id: 'web', label: 'Web apps', tags: ['Web app', 'Frontend'] },
  { id: 'tools', label: 'Tools & automation', tags: ['Automation', 'IoT', 'Developer tool'] },
] as const

export type CategoryId = (typeof CATEGORIES)[number]['id']

export function inCategory(project: Project, id: string): boolean {
  const category = CATEGORIES.find((candidate) => candidate.id === id)
  if (!category || category.tags.length === 0) return true
  return project.tags.some((tag) => (category.tags as readonly string[]).includes(tag))
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/**
 * When a project's period ends, as a sortable number: "Sep – Oct 2026" is
 * October 2026. A period this cannot read sorts last.
 */
export function periodEnd(period: string): number {
  const year = Number(period.match(/(\d{4})\s*$/)?.[1])
  const months = [...period.matchAll(/\b([A-Z][a-z]{2})\b/g)].map((match) => MONTHS.indexOf(match[1])).filter((m) => m >= 0)
  if (!year || months.length === 0) return 0
  return year * 12 + months[months.length - 1]
}

/** Most recently finished first; projects ending in the same month keep their order. */
export function newestFirst(projects: Project[]): Project[] {
  return projects
    .map((project, index) => ({ project, index }))
    .sort((a, b) => periodEnd(b.project.period) - periodEnd(a.project.period) || a.index - b.index)
    .map(({ project }) => project)
}
