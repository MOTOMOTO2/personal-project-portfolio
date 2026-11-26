import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { asset } from '../lib/assets'
import { heroStats, testCount } from '../lib/stats'
import { clickName, viewPath } from '../lib/analytics'
import { CATEGORIES, inCategory, newestFirst, periodEnd } from '../lib/work'
import { site } from './site'

const publicDir = join(import.meta.dirname, '..', '..', 'public')

/** Every image referenced by the site, flattened with a label for failure output. */
const images = [
  ...site.projects.flatMap((project) => [
    { label: `${project.slug} cover`, src: project.cover.src },
    ...project.gallery.map((image, index) => ({
      label: `${project.slug} gallery[${index}]`,
      src: image.src,
    })),
  ]),
  ...site.photos.map((photo, index) => ({ label: `photos[${index}]`, src: photo.src })),
]

describe('asset()', () => {
  it('prefixes local paths with the deploy base', () => {
    expect(asset('images/a.svg')).toBe(`${import.meta.env.BASE_URL}images/a.svg`)
  })

  it('normalises a leading ./ so paths never resolve against the current route', () => {
    expect(asset('./images/a.svg')).toBe(asset('images/a.svg'))
  })

  it('leaves absolute URLs alone', () => {
    expect(asset('https://cdn.example.com/a.png')).toBe('https://cdn.example.com/a.png')
  })
})

describe('site data', () => {
  it('has at least one project', () => {
    expect(site.projects.length).toBeGreaterThan(0)
  })

  it('features at least one project, so "Selected work" is never empty', () => {
    expect(site.projects.some((project) => project.featured)).toBe(true)
  })

  it('lists featured projects first, so the detail-page order matches the home page', () => {
    const firstOther = site.projects.findIndex((project) => !project.featured)
    if (firstOther === -1) return
    expect(site.projects.slice(firstOther).every((project) => !project.featured)).toBe(true)
  })

  it('uses unique project slugs, since slugs are the detail-page routes', () => {
    const slugs = site.projects.map((project) => project.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('uses URL-safe slugs', () => {
    for (const project of site.projects) {
      expect(project.slug, project.title).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/)
    }
  })

  it('gives every project a title, blurb, description, period, role and tags', () => {
    for (const project of site.projects) {
      expect(project.period.length, project.slug).toBeGreaterThan(0)
      expect(project.role.length, project.slug).toBeGreaterThan(0)
      expect(project.title.length, project.slug).toBeGreaterThan(0)
      expect(project.blurb.length, project.slug).toBeGreaterThan(0)
      expect(project.description.length, project.slug).toBeGreaterThan(0)
      expect(project.tags.length, project.slug).toBeGreaterThan(0)
      expect(project.tech.length, project.slug).toBeGreaterThan(0)
    }
  })

  it('only uses http(s) or mailto links', () => {
    const links = [
      ...site.profile.socials.map((social) => social.href),
      ...site.projects.flatMap((project) => Object.values(project.links)),
    ].filter((href): href is string => Boolean(href))

    for (const href of links) {
      expect(href, href).toMatch(/^(https?:\/\/|mailto:)/)
    }
  })

  it('gives every demo a title and teaser, and at most one demo of each kind', () => {
    const demos = site.projects.flatMap((project) => (project.demo ? [project.demo] : []))
    for (const demo of demos) {
      expect(demo.title.length, demo.id).toBeGreaterThan(0)
      expect(demo.teaser.length, demo.id).toBeGreaterThan(0)
    }
    expect(new Set(demos.map((demo) => demo.id)).size).toBe(demos.length)
  })

  it('looks like a real email address', () => {
    expect(site.profile.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
  })

  it('gives every image alt text, for screen readers and broken-image fallback', () => {
    for (const image of images) {
      expect(image.src, image.label).toBeTruthy()
    }
    const withAlt = [
      site.projects.flatMap((project) => [project.cover, ...project.gallery]),
      site.photos,
    ].flat()
    for (const image of withAlt) {
      expect(image.alt.length, image.src).toBeGreaterThan(0)
    }
  })

  it('never shows the same image twice on one project page', () => {
    for (const project of site.projects) {
      const srcs = [project.cover, ...project.gallery].map((image) => image.src)
      expect(new Set(srcs).size, project.slug).toBe(srcs.length)
    }
  })

  it('points every image at a file that exists in public/', () => {
    const missing = images.filter(({ src }) => {
      if (/^https?:\/\//.test(src)) return false
      // Strip the deploy base that asset() added to get back to a public/ path.
      const relative = src.slice(import.meta.env.BASE_URL.length)
      return !existsSync(join(publicDir, relative))
    })

    expect(missing.map((image) => `${image.label}: ${image.src}`)).toEqual([])
  })
})

describe('hiring lenses', () => {
  const slugs = new Set(site.projects.map((project) => project.slug))
  const skills = new Set(site.skills.flatMap((group) => group.items))

  it('uses unique, URL-safe ids, since they go in ?for=', () => {
    const ids = site.lenses.map((lens) => lens.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const id of ids) expect(id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/)
  })

  it('features one to four real projects, each once', () => {
    for (const lens of site.lenses) {
      expect(lens.featured.length, lens.id).toBeGreaterThan(0)
      expect(lens.featured.length, lens.id).toBeLessThanOrEqual(4)
      expect(new Set(lens.featured).size, lens.id).toBe(lens.featured.length)
      expect(lens.featured.filter((slug) => !slugs.has(slug)), lens.id).toEqual([])
    }
  })

  it('only highlights skills that are actually listed, spelled the same way', () => {
    for (const lens of site.lenses) {
      expect(lens.skills.filter((skill) => !skills.has(skill)), lens.id).toEqual([])
    }
  })

  it('gives every lens a label and a pitch', () => {
    for (const lens of site.lenses) {
      expect(lens.label.length, lens.id).toBeGreaterThan(0)
      expect(lens.pitch.length, lens.id).toBeGreaterThan(0)
    }
  })
})

describe('hero and about content', () => {
  const slugs = new Set(site.projects.map((project) => project.slug))

  it('only puts real projects in the console, each line complete', () => {
    expect(site.console.length).toBeGreaterThan(0)
    for (const line of site.console) {
      expect(slugs.has(line.slug), line.slug).toBe(true)
      expect(line.command.length, line.slug).toBeGreaterThan(0)
      expect(line.result.length, line.slug).toBeGreaterThan(0)
    }
  })

  it('backs every principle with real projects', () => {
    for (const principle of site.principles) {
      expect(principle.proof.length, principle.title).toBeGreaterThan(0)
      expect(principle.proof.filter((slug) => !slugs.has(slug)), principle.title).toEqual([])
    }
  })

  it('marks exactly one emphasis in the headline, with balanced asterisks', () => {
    expect(site.profile.headline.split('*').length - 1).toBe(2)
  })
})

describe('hero stats', () => {
  it('reads test counts out of highlights', () => {
    const project = { ...site.projects[0], highlights: ['Nothing here', '57 automated tests, including full games'] }
    expect(testCount(project)).toBe(57)
    expect(testCount({ ...project, highlights: ['No numbers'] })).toBe(0)
  })

  it('derives every number from the projects', () => {
    const stats = heroStats(site.projects)
    expect(stats[0].value).toBe(site.projects.length)
    expect(stats[1].value).toBe(site.projects.filter((project) => project.status === 'Live').length)
    expect(stats[2].value).toBe(site.projects.reduce((sum, project) => sum + testCount(project), 0))
    expect(stats[3].value).toBe(site.projects.filter((project) => project.demo).length)
  })
})

describe('all work ordering and filters', () => {
  it('reads the end of a period', () => {
    expect(periodEnd('Sep – Oct 2026')).toBe(periodEnd('Oct 2026'))
    expect(periodEnd('Jan – Nov 2026')).toBeGreaterThan(periodEnd('Oct 2026'))
    expect(periodEnd('whenever')).toBe(0)
  })

  it('sorts newest first and keeps every project', () => {
    const sorted = newestFirst(site.projects)
    expect(sorted).toHaveLength(site.projects.length)
    for (let index = 1; index < sorted.length; index++) {
      expect(periodEnd(sorted[index - 1].period)).toBeGreaterThanOrEqual(periodEnd(sorted[index].period))
    }
  })

  it('can read every period, so nothing sorts to the bottom by accident', () => {
    for (const project of site.projects) expect(periodEnd(project.period), project.slug).toBeGreaterThan(0)
  })

  it('puts every project under at least one filter besides All', () => {
    for (const project of site.projects) {
      const kinds = CATEGORIES.filter((category) => category.id !== 'all' && inCategory(project, category.id))
      expect(kinds.length, project.slug).toBeGreaterThan(0)
    }
  })
})

describe('analytics', () => {
  it('uses a valid GoatCounter code when one is set', () => {
    const code = site.analytics.goatcounter
    if (code !== null) expect(code).toMatch(/^[a-z0-9-]+$/)
  })

  it('names the clicks worth counting and ignores the rest', () => {
    const host = 'motomoto2.github.io'
    expect(clickName('mailto:a@b.c', host)).toBe('click: email')
    expect(clickName('/personal-project-portfolio/resume.pdf', host)).toBe('click: résumé')
    expect(clickName('https://github.com/MOTOMOTO2', host)).toBe('click: github profile')
    expect(clickName('https://www.linkedin.com/in/x', host)).toBe('click: linkedin')
    expect(clickName('https://revvault.ca', host)).toBe('click: revvault.ca')
    expect(clickName('/projects/tally', host)).toBeNull()
    expect(clickName(`https://${host}/work`, host)).toBeNull()
  })

  it('keeps the hiring lens and filter in a page view, and nothing else', () => {
    expect(viewPath('/', '?for=backend&utm_source=x')).toBe('/?for=backend')
    expect(viewPath('/work', '?type=games')).toBe('/work?type=games')
    expect(viewPath('/projects/tally', '?ref=abc')).toBe('/projects/tally')
  })
})
