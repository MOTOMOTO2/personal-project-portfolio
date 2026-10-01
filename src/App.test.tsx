// @vitest-environment jsdom
import { cleanup, render, screen, within } from '@testing-library/react'
import { afterEach, beforeAll, describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import App from './App'
import { site } from './data/site'

beforeAll(() => {
  // jsdom implements neither of these, and the theme toggle and reveal
  // animations both touch them on mount.
  if (!window.matchMedia) {
    window.matchMedia = ((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    })) as unknown as typeof window.matchMedia
  }
  if (!window.IntersectionObserver) {
    window.IntersectionObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
      takeRecords() {
        return []
      }
      root = null
      rootMargin = ''
      thresholds: number[] = []
    } as unknown as typeof window.IntersectionObserver
  }
})

afterEach(cleanup)

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )
}

describe('home page', () => {
  it('shows the name and role', () => {
    renderAt('/')
    expect(screen.getByRole('heading', { level: 1, name: site.profile.name })).toBeDefined()
    expect(screen.getAllByText(site.profile.role).length).toBeGreaterThan(0)
  })

  it('renders a card for every project', () => {
    renderAt('/')
    for (const project of site.projects) {
      expect(screen.getAllByRole('link', { name: project.title }).length).toBeGreaterThan(0)
    }
  })

  it('renders each section heading the nav links to', () => {
    renderAt('/')
    const nav = screen.getByRole('navigation')
    const ids = within(nav)
      .getAllByRole('link')
      .map((link) => link.getAttribute('href')?.split('#')[1])
      .filter((id): id is string => Boolean(id))
    expect(ids).toContain('projects')
    for (const id of ids) {
      expect(document.getElementById(id), id).not.toBeNull()
    }
  })

  it('hides the gallery and its nav link when there are no photos', () => {
    renderAt('/')
    const hasGallery = site.photos.length > 0
    expect(document.getElementById('gallery') !== null).toBe(hasGallery)
    expect(within(screen.getByRole('navigation')).queryByRole('link', { name: 'Gallery' }) !== null).toBe(
      hasGallery,
    )
  })

  it('renders the gallery photos', () => {
    renderAt('/')
    for (const photo of site.photos) {
      expect(screen.getByAltText(photo.alt)).toBeDefined()
    }
  })

  it('renders a contact form with name, email and message fields', () => {
    renderAt('/')
    // Scoped to the form: "email" also matches the mailto link and copy button
    // in the contact details beside it.
    const form = document.querySelector('form')
    expect(form).not.toBeNull()
    const fields = within(form as HTMLElement)
    expect(fields.getByLabelText('Name')).toBeDefined()
    expect(fields.getByLabelText('Email')).toBeDefined()
    expect(fields.getByLabelText('Message')).toBeDefined()
    expect(fields.getByRole('button', { name: /send message/i })).toBeDefined()
  })
})

describe('project detail page', () => {
  const project = site.projects[0]

  it('shows the project title, description and highlights', () => {
    renderAt(`/projects/${project.slug}`)
    expect(screen.getByRole('heading', { level: 1, name: project.title })).toBeDefined()
    expect(screen.getByText(project.description[0])).toBeDefined()
    for (const highlight of project.highlights) {
      expect(screen.getByText(highlight)).toBeDefined()
    }
  })

  it('links out to the repo and demo when present', () => {
    renderAt(`/projects/${project.slug}`)
    // Compared as parsed URLs: an anchor's href reads back normalised, so a bare
    // origin like https://example.com comes back with a trailing slash.
    if (project.links.repo) {
      expect(screen.getByRole('link', { name: /source code/i })).toHaveProperty(
        'href',
        new URL(project.links.repo).href,
      )
    }
    if (project.links.demo) {
      expect(screen.getByRole('link', { name: /live demo/i })).toHaveProperty(
        'href',
        new URL(project.links.demo).href,
      )
    }
  })

  it('shows every screenshot in the gallery', () => {
    renderAt(`/projects/${project.slug}`)
    const screenshots = screen.getByRole('heading', { name: /screenshots/i }).parentElement
    expect(screenshots).not.toBeNull()
    for (const image of project.gallery) {
      expect(within(screenshots as HTMLElement).getByAltText(image.alt)).toBeDefined()
    }
  })

  it('falls back to the 404 page for an unknown slug', () => {
    renderAt('/projects/does-not-exist')
    expect(screen.getByRole('heading', { level: 1, name: /nothing here/i })).toBeDefined()
  })
})
