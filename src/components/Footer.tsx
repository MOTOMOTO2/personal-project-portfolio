import { ArrowUp } from 'lucide-react'
import { site } from '../data/site'
import { socialIcons } from '../lib/social-icons'

// Read once at module load: calling Date() during render is an impure read.
const year = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="border-t border-border py-10">
      <div className="container-page flex flex-col items-center justify-between gap-5 text-sm text-fg-muted sm:flex-row">
        <p>
          © {year} {site.profile.name}. Built with React, Vite and Tailwind.
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
                className="rounded-md p-2 transition hover:bg-surface-2 hover:text-fg"
              >
                <Icon className="size-4" aria-hidden />
              </a>
            )
          })}
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="ml-2 inline-flex items-center gap-1.5 rounded-md px-2 py-2 transition hover:bg-surface-2 hover:text-fg"
          >
            Back to top
            <ArrowUp className="size-4" aria-hidden />
          </button>
        </div>
      </div>
    </footer>
  )
}
