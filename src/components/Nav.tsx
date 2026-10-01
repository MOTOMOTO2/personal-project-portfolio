import { Menu, Moon, Sun, X } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { site } from '../data/site'
import { useTheme } from '../lib/theme'

// The Gallery section renders nothing without photos, so its link goes too.
const sections = [
  { id: 'projects', label: 'Projects' },
  ...(site.photos.length > 0 ? [{ id: 'gallery', label: 'Gallery' }] : []),
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
]

export function Nav() {
  const { theme, toggle } = useTheme()
  const [open, setOpen] = useState(false)
  // Initialised from the real scroll position so a mid-page reload gets the
  // solid header immediately rather than on the next scroll event.
  const [scrolled, setScrolled] = useState(() => window.scrollY > 8)
  const { pathname } = useLocation()
  const onHome = pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Section links are in-page anchors on the home page and route links elsewhere,
  // so they work from a project detail page too.
  const href = (id: string) => (onHome ? `#${id}` : `/#${id}`)

  // Closing on navigation happens here rather than in an effect on `pathname`,
  // which would cost an extra render on every route change.
  const closeMenu = useCallback(() => setOpen(false), [])

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-colors ${
        scrolled ? 'border-border bg-bg/85 backdrop-blur-md' : 'border-transparent bg-transparent'
      }`}
    >
      <nav className="container-page flex h-16 items-center justify-between gap-4" aria-label="Main">
        <Link
          to="/"
          className="font-semibold tracking-tight transition hover:text-accent"
          onClick={() => {
            closeMenu()
            window.scrollTo({ top: 0 })
          }}
        >
          {site.profile.name}
        </Link>

        <div className="flex items-center gap-1">
          <ul className="hidden items-center gap-1 sm:flex">
            {sections.map((section) =>
              onHome ? (
                <li key={section.id}>
                  <a
                    href={href(section.id)}
                    onClick={closeMenu}
                    className="rounded-md px-3 py-2 text-sm text-fg-muted transition hover:bg-surface-2 hover:text-fg"
                  >
                    {section.label}
                  </a>
                </li>
              ) : (
                <li key={section.id}>
                  <Link
                    to={href(section.id)}
                    onClick={closeMenu}
                    className="rounded-md px-3 py-2 text-sm text-fg-muted transition hover:bg-surface-2 hover:text-fg"
                  >
                    {section.label}
                  </Link>
                </li>
              ),
            )}
          </ul>

          <button
            type="button"
            onClick={toggle}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            className="rounded-md p-2 text-fg-muted transition hover:bg-surface-2 hover:text-fg"
          >
            {theme === 'dark' ? <Sun className="size-5" aria-hidden /> : <Moon className="size-5" aria-hidden />}
          </button>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label="Toggle navigation menu"
            className="rounded-md p-2 text-fg-muted transition hover:bg-surface-2 hover:text-fg sm:hidden"
          >
            {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
          </button>
        </div>
      </nav>

      {open && (
        <ul id="mobile-menu" className="container-page border-t border-border py-2 sm:hidden">
          {sections.map((section) => (
            <li key={section.id}>
              <Link
                to={href(section.id)}
                onClick={closeMenu}
                className="block rounded-md px-3 py-3 text-sm text-fg-muted transition hover:bg-surface-2 hover:text-fg"
              >
                {section.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  )
}
