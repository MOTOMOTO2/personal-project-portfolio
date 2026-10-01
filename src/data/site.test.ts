import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { asset } from '../lib/assets'
import { site } from './site'

const publicDir = join(import.meta.dirname, '..', '..', 'public')

/** Every image referenced by the site, flattened with a label for failure output. */
const images = [
  { label: 'profile avatar', src: site.profile.avatar },
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

  it('uses unique project slugs, since slugs are the detail-page routes', () => {
    const slugs = site.projects.map((project) => project.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('uses URL-safe slugs', () => {
    for (const project of site.projects) {
      expect(project.slug, project.title).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/)
    }
  })

  it('gives every project a title, blurb, description and tags', () => {
    for (const project of site.projects) {
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
