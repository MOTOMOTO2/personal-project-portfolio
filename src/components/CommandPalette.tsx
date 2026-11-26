import {
  ArrowRight,
  Briefcase,
  Copy,
  CornerDownLeft,
  FileText,
  Hash,
  Mail,
  Moon,
  MousePointerClick,
  Search,
  Sun,
  type LucideIcon,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { site } from '../data/site'
import type { Theme } from '../lib/theme'
import { useLens } from '../lib/lens'
import { socialIcons, type IconComponent } from '../lib/social-icons'

const GROUPS = ['Projects', 'Try it', 'Hiring for', 'Go to', 'Actions'] as const
type Group = (typeof GROUPS)[number]

type Command = {
  id: string
  group: Group
  label: string
  hint?: string
  /** Extra words that should find this command: tags, tech, synonyms. */
  keywords: string
  /** Tech names, so a search for one can say which project uses it. */
  tech?: string[]
  icon: LucideIcon | IconComponent
  run: () => void | Promise<void>
}

const SECTIONS = [
  { id: 'work', label: 'Selected work' },
  ...(site.projects.some((project) => project.demo) ? [{ id: 'try', label: 'Hands-on demos' }] : []),
  { id: 'about', label: 'About and skills' },
  { id: 'contact', label: 'Contact' },
]

function tokens(text: string): string[] {
  return text.toLowerCase().split(/\s+/).filter(Boolean)
}

/** -1 for no match; otherwise higher is better. Every word typed has to appear somewhere. */
function score(command: Command, words: string[], raw: string): number {
  if (words.length === 0) return 0
  const label = command.label.toLowerCase()
  const haystack = `${label} ${command.keywords.toLowerCase()}`
  if (!words.every((word) => haystack.includes(word))) return -1
  if (label.startsWith(raw)) return 3
  if (label.includes(raw)) return 2
  return 1
}

type Props = {
  theme: Theme
  onToggleTheme: () => void
  onClose: () => void
}

/**
 * ⌘K / Ctrl+K: jump to any project, demo or section, tailor the page to a role,
 * or copy the email address. Searching a technology ("postgres", "offline")
 * lists the projects that use it. Mounted only while open, so each opening
 * starts fresh.
 */
export function CommandPalette({ theme, onToggleTheme, onClose }: Props) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { query: lensQuery } = useLens()
  const [text, setText] = useState('')
  const [active, setActive] = useState(0)
  const [copied, setCopied] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)

  const commands = useMemo<Command[]>(() => {
    const { profile } = site
    const goToSection = (id: string) => {
      navigate(`/${lensQuery}#${id}`)
      // Already on the home page with this hash: the router sees no change, so scroll here.
      if (pathname === '/') requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView?.({ block: 'start' }))
    }

    const list: Command[] = [
      ...site.projects.map((project) => ({
        id: `project-${project.slug}`,
        group: 'Projects' as const,
        label: project.title,
        hint: project.tech.slice(0, 3).join(' · '),
        keywords: [...project.tags, ...project.tech, project.blurb].join(' '),
        tech: project.tech,
        icon: Briefcase,
        run: () => navigate(`/projects/${project.slug}${lensQuery}`),
      })),
      ...site.projects.flatMap((project) =>
        project.demo
          ? [
              {
                id: `demo-${project.slug}`,
                group: 'Try it' as const,
                label: project.demo.title,
                hint: project.title,
                keywords: `demo interactive try ${project.title} ${project.tags.join(' ')}`,
                icon: MousePointerClick,
                run: () => navigate(`/projects/${project.slug}${lensQuery}#demo`),
              },
            ]
          : [],
      ),
      ...site.lenses.map((lens) => ({
        id: `lens-${lens.id}`,
        group: 'Hiring for' as const,
        label: `${lens.label} roles`,
        hint: 'Reorder the page for this role',
        keywords: `hiring role view tailor ${lens.skills.join(' ')}`,
        icon: Briefcase,
        run: () => navigate(`/?for=${lens.id}#work`),
      })),
      {
        id: 'all-work',
        group: 'Go to' as const,
        label: 'All work',
        hint: `Every project, newest first`,
        keywords: 'index archive everything projects list',
        icon: Hash,
        run: () => navigate(`/work${lensQuery}`),
      },
      ...SECTIONS.map((section) => ({
        id: `section-${section.id}`,
        group: 'Go to' as const,
        label: section.label,
        keywords: 'section jump scroll',
        icon: Hash,
        run: () => goToSection(section.id),
      })),
      {
        id: 'copy-email',
        group: 'Actions',
        label: 'Copy email address',
        hint: profile.email,
        keywords: 'contact mail clipboard',
        icon: Copy,
        run: async () => {
          try {
            await navigator.clipboard.writeText(profile.email)
            setCopied(true)
            window.setTimeout(onClose, 700)
          } catch {
            // Clipboard blocked or missing: the address is in the hint, so just close.
            onClose()
          }
        },
      },
      {
        id: 'email',
        group: 'Actions',
        label: 'Send me an email',
        hint: profile.email,
        keywords: 'contact mail hire',
        icon: Mail,
        run: () => {
          window.location.href = `mailto:${profile.email}`
        },
      },
      ...profile.socials
        .filter((social) => social.icon !== 'mail')
        .map((social) => ({
          id: `social-${social.label}`,
          group: 'Actions' as const,
          label: `Open ${social.label}`,
          hint: social.href.replace(/^https?:\/\/(www\.)?/, ''),
          keywords: 'profile social link',
          icon: socialIcons[social.icon],
          run: () => {
            window.open(social.href, '_blank', 'noopener,noreferrer')
          },
        })),
      ...(profile.resume
        ? [
            {
              id: 'resume',
              group: 'Actions' as const,
              label: 'Open my resume',
              keywords: 'resume cv pdf',
              icon: FileText,
              run: () => {
                window.open(profile.resume!, '_blank', 'noopener,noreferrer')
              },
            },
          ]
        : []),
      {
        id: 'theme',
        group: 'Actions',
        label: `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`,
        keywords: 'dark light mode appearance theme',
        icon: theme === 'dark' ? Sun : Moon,
        run: onToggleTheme,
      },
    ]
    return list
  }, [navigate, pathname, lensQuery, theme, onToggleTheme, onClose])

  const raw = text.trim().toLowerCase()
  const words = tokens(raw)
  const results = commands
    .map((command) => ({ command, score: score(command, words, raw) }))
    .filter((result) => result.score >= 0)
    .sort((a, b) => GROUPS.indexOf(a.command.group) - GROUPS.indexOf(b.command.group) || b.score - a.score)
    .map((result) => result.command)
  const current = Math.min(active, Math.max(0, results.length - 1))

  // Lock the page behind, and give focus back to whatever had it on close.
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = overflow
      previous?.focus?.()
    }
  }, [])

  useEffect(() => {
    listRef.current?.querySelector('[aria-selected="true"]')?.scrollIntoView?.({ block: 'nearest' })
  }, [current, text])

  function choose(command: Command | undefined) {
    if (!command) return
    command.run()
    if (command.id !== 'copy-email') onClose()
  }

  function onKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActive((current + 1) % Math.max(1, results.length))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActive((current - 1 + results.length) % Math.max(1, results.length))
    } else if (event.key === 'Enter') {
      event.preventDefault()
      choose(results[current])
    } else if (event.key === 'Escape') {
      event.preventDefault()
      onClose()
    }
  }

  const matched = (command: Command) =>
    words.length > 0 ? command.tech?.filter((tech) => words.some((word) => tech.toLowerCase().includes(word))) : []

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 px-4 pt-[10vh] backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search the site"
        className="w-full max-w-xl overflow-hidden rounded-xl border border-border bg-surface shadow-2xl"
        onKeyDown={onKeyDown}
      >
        <div className="flex items-center gap-3 border-b border-border px-4">
          <Search className="size-4 shrink-0 text-fg-subtle" aria-hidden />
          <input
            autoFocus
            value={text}
            onChange={(event) => {
              setText(event.target.value)
              setActive(0)
            }}
            placeholder="Search projects, tech, demos…"
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-results"
            aria-autocomplete="list"
            aria-activedescendant={results[current] ? `palette-${results[current].id}` : undefined}
            className="h-13 min-w-0 flex-1 bg-transparent text-[0.9375rem] outline-none placeholder:text-fg-subtle"
          />
          <kbd className="hidden rounded border border-border px-1.5 py-0.5 font-mono text-[0.6875rem] text-fg-subtle sm:inline">
            esc
          </kbd>
        </div>

        <div ref={listRef} id="palette-results" role="listbox" aria-label="Results" className="max-h-[min(60vh,26rem)] overflow-y-auto p-2">
          {results.length === 0 && (
            <p className="px-3 py-8 text-center text-sm text-fg-muted">
              Nothing matches “{text.trim()}”. Try a language like <span className="font-mono">python</span> or a
              topic like <span className="font-mono">offline</span>.
            </p>
          )}
          {results.map((command, index) => {
            const header = index === 0 || results[index - 1].group !== command.group ? command.group : null
            const Icon = command.icon
            const selected = index === current
            const uses = matched(command)
            const hint =
              command.id === 'copy-email' && copied ? 'Copied to the clipboard' : uses?.length ? `Uses ${uses.join(', ')}` : command.hint
            return (
              <div key={command.id}>
                {header && (
                  <p role="presentation" className="px-3 pt-3 pb-1.5 font-mono text-[0.6875rem] tracking-wider text-fg-subtle uppercase first:pt-1">
                    {header}
                  </p>
                )}
                <div
                  id={`palette-${command.id}`}
                  role="option"
                  aria-selected={selected}
                  onMouseMove={() => setActive(index)}
                  onClick={() => choose(command)}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 ${selected ? 'bg-surface-2' : ''}`}
                >
                  <Icon className={`size-4 shrink-0 ${selected ? 'text-accent' : 'text-fg-subtle'}`} aria-hidden />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{command.label}</span>
                    {hint && <span className="block truncate text-xs text-fg-subtle">{hint}</span>}
                  </span>
                  {selected && <CornerDownLeft className="size-3.5 shrink-0 text-fg-subtle" aria-hidden />}
                </div>
              </div>
            )
          })}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-border px-4 py-2.5 text-[0.6875rem] text-fg-subtle">
          <span className="flex items-center gap-3">
            <span>↑↓ move</span>
            <span>↵ open</span>
            <span className="hidden sm:inline">esc close</span>
          </span>
          <button
            type="button"
            // Keep focus in the search box so typing carries on from here.
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              setText('postgres')
              setActive(0)
            }}
            className="flex items-center gap-1 rounded px-1 transition-colors hover:text-fg"
          >
            Try <span className="font-mono text-fg-muted">postgres</span>
            <ArrowRight className="size-3" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  )
}
