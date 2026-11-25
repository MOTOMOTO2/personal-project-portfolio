import { ArrowDown, FileText, Mail } from 'lucide-react'
import { useRef } from 'react'
import { site } from '../data/site'
import { socialIcons } from '../lib/social-icons'
import { HiringLens } from './HiringLens'

export function Hero() {
  const { profile } = site
  const elsewhere = profile.socials.filter((social) => social.icon !== 'mail')
  const sectionRef = useRef<HTMLElement>(null)
  const showLens = site.lenses.length > 0

  // Feeds the spotlight's position as CSS variables. Written straight to the
  // element rather than through state, so moving the mouse never re-renders.
  function trackPointer(event: React.PointerEvent<HTMLElement>) {
    const section = sectionRef.current
    if (!section || event.pointerType !== 'mouse') return
    const rect = section.getBoundingClientRect()
    section.style.setProperty('--spot-x', `${event.clientX - rect.left}px`)
    section.style.setProperty('--spot-y', `${event.clientY - rect.top}px`)
  }

  return (
    <section ref={sectionRef} onPointerMove={trackPointer} className="group/hero relative overflow-hidden border-b border-border">
      <div aria-hidden className="hero-grid pointer-events-none absolute inset-0 opacity-70" />
      <div
        aria-hidden
        className="hero-spotlight pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/hero:opacity-100"
      />

      <div
        className={`container-page relative grid gap-12 pt-16 sm:pt-24 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end lg:gap-16 ${
          showLens ? 'pb-10 sm:pb-12' : 'pb-16 sm:pb-24'
        }`}
      >
        <div>
          {profile.availability && (
            <p className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-sm text-fg-muted">
              <span aria-hidden className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60 motion-reduce:hidden" />
                <span className="relative inline-flex size-2 rounded-full bg-success" />
              </span>
              {profile.availability}
            </p>
          )}

          <h1 className="mt-6 text-5xl font-semibold sm:text-6xl lg:text-7xl">{profile.name}</h1>
          <p className="mt-3 text-xl font-medium text-fg-muted sm:text-2xl">{profile.role}</p>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-fg-muted">{profile.tagline}</p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a href="#work" className="btn btn-primary">
              View my work
              <ArrowDown className="size-4" aria-hidden />
            </a>
            <a href={`mailto:${profile.email}`} className="btn btn-secondary">
              <Mail className="size-4" aria-hidden />
              Email me
            </a>
            {profile.resume && (
              <a href={profile.resume} target="_blank" rel="noreferrer" className="btn btn-secondary">
                <FileText className="size-4" aria-hidden />
                Résumé
              </a>
            )}
          </div>
        </div>

        <aside aria-label="At a glance" className="rounded-xl border border-border bg-surface p-6 shadow-card">
          <dl className="divide-y divide-border">
            {profile.facts.map((fact) => (
              <div key={fact.label} className="py-3 first:pt-0 last:pb-0">
                <dt className="text-xs text-fg-subtle">{fact.label}</dt>
                <dd className="mt-1 text-sm font-medium">{fact.value}</dd>
              </div>
            ))}
          </dl>

          <ul className="mt-5 flex gap-2 border-t border-border pt-5">
            {elsewhere.map((social) => {
              const Icon = socialIcons[social.icon]
              return (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary h-9 px-3"
                  >
                    <Icon className="size-4" aria-hidden />
                    {social.label}
                  </a>
                </li>
              )
            })}
          </ul>
        </aside>
      </div>

      {showLens && (
        <div className="container-page relative pb-16 sm:pb-20">
          <HiringLens />
        </div>
      )}
    </section>
  )
}
