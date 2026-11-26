import type { Project } from '../data/types'

export type Stat = { value: number; label: string }

/** "231 tests", "57 automated tests": the first test count in a project's highlights. */
export function testCount(project: Project): number {
  for (const highlight of project.highlights) {
    const match = highlight.match(/\b(\d[\d,]*)\s+(?:automated\s+)?tests\b/i)
    if (match) return Number(match[1].replace(/,/g, ''))
  }
  return 0
}

/**
 * The numbers in the hero, all derived from the content so they can never
 * disagree with the projects below them.
 */
export function heroStats(projects: Project[]): Stat[] {
  const tested = projects.filter((project) => testCount(project) > 0)
  const tests = tested.reduce((sum, project) => sum + testCount(project), 0)
  return [
    { value: projects.length, label: 'projects built in 2026' },
    { value: projects.filter((project) => project.status === 'Live').length, label: 'live in production' },
    { value: tests, label: `automated tests across ${tested.length} projects` },
    { value: projects.filter((project) => project.demo).length, label: 'demos you can try in the page' },
  ]
}
