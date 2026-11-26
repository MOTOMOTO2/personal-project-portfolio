import { ArrowDown, FileText, Mail } from 'lucide-react'
import { useRef } from 'react'
import { site } from '../data/site'
import { heroStats } from '../lib/stats'
import { socialIcons } from '../lib/social-icons'
import { CountUp } from './CountUp'
import { Emphasis } from './Emphasis'
import { LiveConsole } from './LiveConsole'

const stats = heroStats(site.projects)

export function Hero() {
  const { profile } = site
  const elsewhere = profile.socials.filter((social) => social.icon !== 'mail')
  const sectionRef = useRef<HTMLElement>(null)
  const place = profile.facts.find((fact) => fact.label === 'Based in')?.value

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
      <div aria-hidden className="hero-glow pointer-events-none absolute inset-0" />
      <div aria-hidden className="hero-grid pointer-events-none absolute inset-0 opacity-60" />
      <div
        aria-hidden
        className="hero-spotlight pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/hero:opacity-100"
      />

      <div className="container-page relative grid items-center gap-12 pt-14 pb-12 sm:pt-20 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:gap-14">
        <div>
          {profile.availability && (
            <p className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-3 py-1 text-sm text-fg-muted backdrop-blur-sm">
              <span aria-hidden className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60 motion-reduce:hidden" />
                <span className="relative inline-flex size-2 rounded-full bg-success" />
              </span>
              {profile.availability}
            </p>
          )}

          <h1 className="mt-6 text-[clamp(2.75rem,7vw,4.75rem)] leading-[0.95] font-semibold">{profile.name}</h1>
          <p className="mt-4 font-mono text-[0.8125rem] tracking-wide text-fg-subtle uppercase">
            {profile.role}
            {place && <span className="text-fg-subtle/80"> · {place}</span>}
          </p>
          <p className="mt-6 max-w-xl text-[clamp(1.375rem,2.6vw,1.875rem)] leading-[1.25] font-medium tracking-tight text-balance">
            <Emphasis text={profile.headline} />
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-2.5">
            <a href="#work" className="btn btn-accent h-11 px-5">
              See my work
              <ArrowDown className="size-4" aria-hidden />
            </a>
            <a href={`mailto:${profile.email}`} className="btn btn-secondary h-11 px-4">
              <Mail className="size-4" aria-hidden />
              Email me
            </a>
            {profile.resume && (
              <a href={profile.resume} target="_blank" rel="noreferrer" className="btn btn-secondary h-11 px-4">
                <FileText className="size-4" aria-hidden />
                Résumé
              </a>
            )}
            {elsewhere.map((social) => {
              const Icon = socialIcons[social.icon]
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  title={social.label}
                  className="btn btn-secondary btn-icon h-11 w-11"
                >
                  <Icon className="size-[18px]" aria-hidden />
                </a>
              )
            })}
          </div>
        </div>

        <LiveConsole />
      </div>

      <div className="container-page relative pb-14 sm:pb-20">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-6 border-t border-border pt-8 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label}>
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <span className="block text-3xl font-semibold tracking-tight sm:text-[2.5rem]">
                  <CountUp value={stat.value} />
                </span>
                <span aria-hidden className="mt-1 block text-sm text-fg-subtle">
                  {stat.label}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
