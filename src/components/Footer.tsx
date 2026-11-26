import { ArrowUp } from 'lucide-react'
import { SOURCE_URL, site } from '../data/site'
import { useClock } from '../lib/clock'
import { socialIcons } from '../lib/social-icons'

// Read once at module load: calling Date() during render is an impure read.
const year = new Date().getFullYear()
const built = new Date(__BUILD_TIME__).toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' })

/** A mono status strip: who, when this build went out, the local time, and the way back up. */
export function Footer() {
  const time = useClock('America/Toronto')

  return (
    <footer className="border-t border-border py-7">
      <div className="container-page label flex flex-col gap-4 text-fg-subtle lg:flex-row lg:items-center lg:justify-between">
        <p className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <span className="text-fg-muted">
            © {year} {site.profile.name}
          </span>
          <span>Built {built}</span>
          <span className="tabular-nums">Barrie {time}</span>
          <a href={SOURCE_URL} target="_blank" rel="noreferrer" className="transition-colors hover:text-accent">
            Source on GitHub ↗
          </a>
        </p>

        <div className="flex items-center gap-1">
          {site.profile.socials.map((social) => {
            const Icon = socialIcons[social.icon]
            return (
              <a
                key={social.label}
                href={social.href}
                target={social.href.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                aria-label={social.label}
                className="p-2 text-fg-muted transition-colors hover:text-accent"
              >
                <Icon className="size-4" aria-hidden />
              </a>
            )
          })}
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="ml-3 inline-flex items-center gap-1.5 py-2 text-fg-muted transition-colors hover:text-accent"
          >
            Back to top
            <ArrowUp className="size-3.5" aria-hidden />
          </button>
        </div>
      </div>
    </footer>
  )
}
