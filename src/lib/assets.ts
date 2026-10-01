import type { SiteData } from '../data/types'

/**
 * Turns an asset path from `src/data/site.ts` into a URL that works from any
 * route and any deploy base.
 *
 * Paths in the data file are written relative to `public/` (`images/foo.jpg`).
 * A bare relative URL would resolve against the *current route*, so it would
 * break on `/projects/:slug`; prefixing BASE_URL makes it absolute and keeps the
 * GitHub Pages `/<repo>/` subpath working. External URLs pass through unchanged.
 */
export function asset(path: string): string {
  if (/^([a-z]+:)?\/\//i.test(path) || path.startsWith('data:')) return path
  return import.meta.env.BASE_URL + path.replace(/^\.?\/+/, '')
}

/** Resolves every asset path in the site data exactly once, at import time. */
export function withAssetPaths(data: SiteData): SiteData {
  return {
    ...data,
    profile: {
      ...data.profile,
      avatar: asset(data.profile.avatar),
      resume: data.profile.resume ? asset(data.profile.resume) : null,
    },
    projects: data.projects.map((project) => ({
      ...project,
      cover: { ...project.cover, src: asset(project.cover.src) },
      gallery: project.gallery.map((image) => ({ ...image, src: asset(image.src) })),
    })),
    photos: data.photos.map((photo) => ({ ...photo, src: asset(photo.src) })),
  }
}
