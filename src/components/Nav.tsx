import { Menu, Moon, Search, Sun, X } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { site } from '../data/site'
import { useLens } from '../lib/lens'
import type { Theme } from '../lib/theme'

// Sections that render nothing (no photos, no demos) drop their links too.
const sections = [
  { id: 'work', label: 'Work' },
  ...(site.projects.some((project) => project.demo) ? [{ id: 'try', label: 'Try it' }] : []),
  ...(site.photos.length > 0 ? [{ id: 'gallery', label: 'Gallery' }] : []),
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
]

const shortcut = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/i.test(navigator.userAgent) ? '⌘K' : 'Ctrl K'

const linkClass = 'label px-3 py-2 text-fg-muted transition-colors hover:text-fg'

type Props = {
  theme: Theme
  onToggleTheme: () => void
  onOpenPalette: () => void
}

export function Nav({ theme, onToggleTheme, onOpenPalette }: Props) {
  const [open, setOpen] = useState(false)
  const { query } = useLens()
  // Initialised from the real scroll position so a mid-page reload gets the
  // solid header immediately rather than on the next scroll event.
  const [scrolled, setScrolled] = useState(() => window.scrollY > 8)
  const { pathname } = useLocation()
  const onHome = pathname === '/'
  const onIndex = pathname === '/work'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Section links are in-page anchors on the home page and route links elsewhere,
  // so they work from a project detail page too. Either way the hiring lens
  // (?for=) comes along: a bare #id keeps the current query string.
  const href = (id: string) => (onHome ? `#${id}` : `/${query}#${id}`)

  // Closing on navigation happens here rather than in an effect on `pathname`,
  // which would cost an extra render on every route change.
  const closeMenu = useCallback(() => setOpen(false), [])

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-colors ${
        scrolled || open ? 'border-border bg-bg/85 backdrop-blur-md' : 'border-transparent bg-bg/0'
      }`}
    >
      <nav className="container-page flex h-16 items-center justify-between gap-4" aria-label="Main">
        <Link
          to={`/${query}`}
          className="flex items-center gap-2.5 font-semibold tracking-tight"
          onClick={() => {
            closeMenu()
            window.scrollTo({ top: 0 })
          }}
        >
          <span
            aria-hidden
            className="grid size-7 place-items-center bg-accent font-mono text-[11px] font-semibold text-accent-fg"
          >
            AY
          </span>
          <span className="display text-[0.95rem]">{site.profile.name}</span>
        </Link>

        <div className="flex items-center gap-1">
          <ul className="hidden items-center gap-0.5 md:flex">
            <li>
              <Link
                to={`/work${query}`}
                aria-current={onIndex ? 'page' : undefined}
                className={`label mr-2 inline-flex items-center gap-2 border px-3 py-2 transition-colors ${
                  onIndex
                    ? 'border-fg bg-fg text-bg'
                    : 'border-border bg-surface text-fg hover:border-border-strong'
                }`}
              >
                All work
                <span className={onIndex ? 'text-bg/70' : 'text-accent'}>
                  {site.projects.length}
                </span>
              </Link>
            </li>
            {sections.map((section) => (
              <li key={section.id}>
                {onHome ? (
                  <a href={href(section.id)} className={linkClass}>
                    {section.label}
                  </a>
                ) : (
                  <Link to={href(section.id)} className={linkClass}>
                    {section.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          {site.profile.resume && (
            <a href={site.profile.resume} target="_blank" rel="noreferrer" className="btn btn-secondary ml-2 hidden h-9 md:inline-flex">
              Resume
            </a>
          )}

          <button
            type="button"
            onClick={onOpenPalette}
            aria-label="Search the site"
            aria-keyshortcuts="Meta+K Control+K"
            className="ml-2 inline-flex h-9 items-center gap-2 border border-border bg-surface px-2.5 text-sm text-fg-muted transition-colors hover:border-border-strong hover:text-fg"
          >
            <Search className="size-4" aria-hidden />
            <span className="hidden lg:inline">Search</span>
            <kbd className="hidden rounded border border-border bg-surface-2 px-1.5 font-mono text-[0.6875rem] sm:inline">
              {shortcut}
            </kbd>
          </button>

          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            className="ml-1 rounded-md p-2 text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg"
          >
            {theme === 'dark' ? <Sun className="size-[18px]" aria-hidden /> : <Moon className="size-[18px]" aria-hidden />}
          </button>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label="Toggle navigation menu"
            className="rounded-md p-2 text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg md:hidden"
          >
            {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
          </button>
        </div>
      </nav>

      {open && (
        <ul id="mobile-menu" className="container-page border-t border-border py-2 md:hidden">
          <li>
            <Link
              to={`/work${query}`}
              onClick={closeMenu}
              className="flex items-center justify-between rounded-md px-3 py-3 text-sm font-medium text-fg transition-colors hover:bg-surface-2"
            >
              All work
              <span className="font-mono text-xs text-fg-subtle">{site.projects.length} projects</span>
            </Link>
          </li>
          {sections.map((section) => (
            <li key={section.id}>
              <Link
                to={href(section.id)}
                onClick={closeMenu}
                className="block rounded-md px-3 py-3 text-sm text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg"
              >
                {section.label}
              </Link>
            </li>
          ))}
          {site.profile.resume && (
            <li>
              <a
                href={site.profile.resume}
                target="_blank"
                rel="noreferrer"
                className="block rounded-md px-3 py-3 text-sm text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg"
              >
                Resume
              </a>
            </li>
          )}
        </ul>
      )}
    </header>
  )
}
