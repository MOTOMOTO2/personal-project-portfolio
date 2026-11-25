// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
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

  it('splits projects into featured rows and the grid', () => {
    renderAt('/')
    const work = document.getElementById('work')?.closest('section')
    const grid = document.getElementById('projects')?.closest('section')
    expect(work).toBeTruthy()
    for (const project of site.projects) {
      const home = project.featured ? work : grid
      expect(within(home as HTMLElement).getByRole('link', { name: project.title }), project.slug).toBeDefined()
    }
  })

  it('gives visitors a direct email link in the contact section', () => {
    renderAt('/')
    const contact = document.getElementById('contact')?.closest('section')
    expect(contact).toBeTruthy()
    const link = within(contact as HTMLElement).getByRole('link', { name: site.profile.email })
    expect(link.getAttribute('href')).toBe(`mailto:${site.profile.email}`)
  })
})

describe('project detail page', () => {
  const project = site.projects[0]

  it('shows the project title, description, timeline, role and highlights', () => {
    renderAt(`/projects/${project.slug}`)
    expect(screen.getByRole('heading', { level: 1, name: project.title })).toBeDefined()
    expect(screen.getByText(project.period)).toBeDefined()
    expect(screen.getByText(project.role)).toBeDefined()
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
      expect(screen.getByRole('link', { name: /live site/i })).toHaveProperty(
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

/** The section that holds a heading id, e.g. the large rows (#work) or the grid (#projects). */
function sectionOf(id: string): HTMLElement {
  const section = document.getElementById(id)?.closest('section')
  if (!section) throw new Error(`no section around #${id}`)
  return section
}

describe('hiring lens', () => {
  const lens = site.lenses[0]
  const titleOf = (slug: string) => site.projects.find((project) => project.slug === slug)!.title

  it('swaps in the lens picks as the large rows when the link has ?for=', () => {
    renderAt(`/?for=${lens.id}`)
    for (const project of site.projects) {
      const home = lens.featured.includes(project.slug) ? sectionOf('work') : sectionOf('projects')
      expect(within(home).getByRole('link', { name: project.title }), project.slug).toBeDefined()
    }
    expect(screen.getByText(lens.pitch)).toBeDefined()
  })

  it('ignores an unknown lens and shows the usual picks', () => {
    renderAt('/?for=not-a-lens')
    for (const project of site.projects.filter((candidate) => candidate.featured)) {
      expect(within(sectionOf('work')).getByRole('link', { name: project.title })).toBeDefined()
    }
  })

  it('reorders the page when a visitor picks a lens, and back again', () => {
    renderAt('/')
    fireEvent.click(screen.getByRole('button', { name: lens.label }))
    expect(screen.getByRole('button', { name: lens.label }).getAttribute('aria-pressed')).toBe('true')
    for (const slug of lens.featured) {
      expect(within(sectionOf('work')).getByRole('link', { name: titleOf(slug) }), slug).toBeDefined()
    }

    fireEvent.click(screen.getByRole('button', { name: 'Everything' }))
    for (const project of site.projects.filter((candidate) => candidate.featured)) {
      expect(within(sectionOf('work')).getByRole('link', { name: project.title })).toBeDefined()
    }
  })

  it('carries the lens onto project pages and back', () => {
    renderAt(`/?for=${lens.id}`)
    const slug = lens.featured[0]
    const link = within(sectionOf('work')).getByRole('link', { name: titleOf(slug) })
    expect(link.getAttribute('href')).toBe(`/projects/${slug}?for=${lens.id}`)

    fireEvent.click(link)
    expect(screen.getByRole('link', { name: /all projects/i }).getAttribute('href')).toBe(`/?for=${lens.id}#work`)
  })
})

describe('command palette', () => {
  it('opens with Ctrl+K and finds projects by the tech they use', () => {
    renderAt('/')
    fireEvent.keyDown(document, { key: 'k', ctrlKey: true })
    const dialog = screen.getByRole('dialog', { name: /search the site/i })
    fireEvent.change(within(dialog).getByRole('combobox'), { target: { value: 'postgres' } })

    const options = within(dialog)
      .getAllByRole('option')
      .map((option) => option.textContent ?? '')
    const usesIt = (text: string) => text.toLowerCase().includes('postgres')
    for (const project of site.projects) {
      const matches = usesIt([project.title, project.blurb, ...project.tags, ...project.tech].join(' '))
      expect(
        options.some((option) => option.startsWith(project.title)),
        project.slug,
      ).toBe(matches)
    }
  })

  it('opens the highlighted result on Enter and closes', () => {
    const target = site.projects[site.projects.length - 1]
    renderAt('/')
    fireEvent.click(screen.getByRole('button', { name: /search the site/i }))
    const input = screen.getByRole('combobox')
    fireEvent.change(input, { target: { value: target.title } })
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(screen.getByRole('heading', { level: 1, name: target.title })).toBeDefined()
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('closes on Escape', () => {
    renderAt('/')
    fireEvent.keyDown(document, { key: 'k', metaKey: true })
    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Escape' })
    expect(screen.queryByRole('dialog')).toBeNull()
  })
})

describe('hands-on demos', () => {
  const withDemos = site.projects.filter((project) => project.demo)

  it('lists every demo on the home page, linking straight to it', () => {
    renderAt('/')
    for (const project of withDemos) {
      const link = within(sectionOf('try')).getByRole('link', { name: new RegExp(project.demo!.title) })
      expect(link.getAttribute('href')).toBe(`/projects/${project.slug}#demo`)
    }
  })

  it('renders each demo on its project page under #demo', () => {
    for (const project of withDemos) {
      const { unmount } = renderAt(`/projects/${project.slug}`)
      expect(screen.getByRole('heading', { level: 2, name: project.demo!.title }).id).toBe('demo')
      unmount()
    }
  })

  it('plays the double-booking race out to a result', () => {
    const project = withDemos.find((candidate) => candidate.demo!.id === 'double-booking')!
    // Each step's timer is set by an effect after the previous step renders,
    // so advance one step per act() rather than all at once.
    const playOut = () => {
      for (let step = 0; step < 6; step++) act(() => vi.advanceTimersByTime(1_000))
    }
    vi.useFakeTimers()
    try {
      renderAt(`/projects/${project.slug}`)
      fireEvent.click(screen.getByRole('button', { name: /both press book/i }))
      playOut()
      expect(screen.getAllByText(/^Double-booked/).length).toBeGreaterThan(0)

      fireEvent.click(screen.getByRole('button', { name: 'Exclusion constraint' }))
      fireEvent.click(screen.getByRole('button', { name: /both press book/i }))
      playOut()
      expect(screen.getAllByText('Refused by the database').length).toBeGreaterThan(0)
    } finally {
      vi.useRealTimers()
    }
  })

  it('merges offline edits to different fields in the sync demo', () => {
    const project = withDemos.find((candidate) => candidate.demo!.id === 'sync-merge')!
    renderAt(`/projects/${project.slug}`)
    fireEvent.click(screen.getByRole('switch', { name: /online/i }))
    fireEvent.click(screen.getByRole('button', { name: 'Change note on the phone' }))
    fireEvent.click(screen.getByRole('button', { name: 'Change amount on the other device' }))
    fireEvent.click(screen.getByRole('switch', { name: /offline/i }))
    expect(screen.getByText(/both edits are kept/)).toBeDefined()
  })
})
