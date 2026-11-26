import type { Project } from '../data/types'

/** Content text with its *emphasis* asterisks removed, for titles and labels. */
export function plain(text: string): string {
  return text.replace(/\*([^*]+)\*/g, '$1')
}

/** What a browser frame's address bar shows: the live domain, the repo path, or nothing. */
export function addressFor(project: Project): string | null {
  const href = project.links.demo ?? project.links.repo
  if (!href) return null
  const url = new URL(href)
  return `${url.hostname.replace(/^www\./, '')}${url.pathname.replace(/\/$/, '')}`
}
