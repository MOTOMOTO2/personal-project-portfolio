import { ArrowDown, FileText, Mail } from 'lucide-react'
import { useRef } from 'react'
import { site } from '../data/site'
import { useClock } from '../lib/clock'
import { socialIcons } from '../lib/social-icons'
import { Emphasis } from './Emphasis'
import { ShaderField } from './ShaderField'

/** Where the clock and coordinates in the hero point: the Barrie campus. */
const PLACE = { name: 'Barrie, ON', coords: '44.39°N 79.69°W', timeZone: 'America/Toronto' }

export function Hero() {
  const { profile } = site
  const elsewhere = profile.socials.filter((social) => social.icon !== 'mail')
  const sectionRef = useRef<HTMLElement>(null)
  const readoutRef = useRef<HTMLSpanElement>(null)
  const time = useClock(PLACE.timeZone)
  const words = profile.name.split(' ')
  // Where each word's letters start in the stagger, so the name rises left to right.
  const offsets = words.map((_, index) => words.slice(0, index).join('').length)

  // The crosshair and its readout follow the mouse through CSS variables and
  // a ref, so moving the mouse never re-renders.
  function trackPointer(event: React.PointerEvent<HTMLElement>) {
    const section = sectionRef.current
    if (!section || event.pointerType !== 'mouse') return
    const rect = section.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    section.style.setProperty('--spot-x', `${x}px`)
    section.style.setProperty('--spot-y', `${y}px`)
    if (readoutRef.current) {
      readoutRef.current.textContent = `x ${(x / rect.width).toFixed(3)}  y ${(1 - y / rect.height).toFixed(3)}`
    }
  }

  return (
    <section
      ref={sectionRef}
      onPointerMove={trackPointer}
      className="group/hero relative isolate -mt-16 flex min-h-[100svh] flex-col overflow-hidden border-b border-border"
    >
      <div aria-hidden className="hero-glow absolute inset-0 -z-30" />
      <ShaderField className="absolute inset-0 -z-20 h-full w-full" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-3/4 bg-gradient-to-t from-bg via-bg/75 to-transparent" />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover/hero:opacity-100 [@media(hover:none)]:hidden"
      >
        <div className="absolute inset-y-0 w-px bg-fg/10" style={{ left: 'var(--spot-x, -10px)' }} />
        <div className="absolute inset-x-0 h-px bg-fg/10" style={{ top: 'var(--spot-y, -10px)' }} />
        <span
          ref={readoutRef}
          className="label absolute whitespace-pre text-fg-subtle"
          style={{ left: 'calc(var(--spot-x, -100px) + 14px)', top: 'calc(var(--spot-y, -100px) + 12px)' }}
        />
      </div>

      <div className="container-page relative flex flex-1 flex-col pt-24 pb-8 sm:pt-28">
        <div className="label flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-fg-subtle">
          <span>Portfolio · 2026</span>
          <span className="hidden md:inline">
            {PLACE.name} · {PLACE.coords}
          </span>
          <span className="tabular-nums">
            <span className="hidden sm:inline">Local </span>
            {time}
          </span>
          {profile.availability && (
            <span className="flex items-center gap-2 text-fg-muted">
              <span aria-hidden className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-70 motion-reduce:hidden" />
                <span className="relative inline-flex size-1.5 rounded-full bg-success" />
              </span>
              {profile.availability}
            </span>
          )}
        </div>

        <div className="min-h-12 flex-1" />

        <h1 aria-label={profile.name} className="display-xl text-[clamp(3rem,13.8vw,11rem)]">
          {words.map((word, wordIndex) => (
            <span key={word} aria-hidden className="mr-[0.2em] inline-block overflow-hidden pb-[0.04em] align-bottom last:mr-0">
              {[...word].map((letter, index) => (
                <span
                  key={index}
                  className="inline-block animate-rise"
                  style={{ animationDelay: `${80 + (offsets[wordIndex] + index) * 42}ms` }}
                >
                  {letter}
                </span>
              ))}
            </span>
          ))}
        </h1>

        <div className="mt-8 grid gap-8 border-t border-border pt-7 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <div>
            <p className="label text-accent">{profile.role}</p>
            <p className="mt-3 max-w-xl text-[clamp(1.3rem,2.3vw,1.75rem)] leading-[1.25] font-medium tracking-tight">
              <Emphasis text={profile.headline} />
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <a href="#work" className="btn btn-accent h-12 px-5">
              See the work
              <ArrowDown className="size-4" aria-hidden />
            </a>
            <a href={`mailto:${profile.email}`} className="btn btn-secondary h-12 px-4">
              <Mail className="size-4" aria-hidden />
              Email me
            </a>
            {profile.resume && (
              <a href={profile.resume} target="_blank" rel="noreferrer" className="btn btn-secondary h-12 px-4">
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
                  className="btn btn-secondary btn-icon h-12 w-12"
                >
                  <Icon className="size-[18px]" aria-hidden />
                </a>
              )
            })}
          </div>
        </div>

        <div className="label mt-10 flex items-center justify-between text-fg-subtle">
          <span className="flex items-center gap-3">
            <span aria-hidden className="relative h-8 w-px overflow-hidden bg-border">
              <span className="absolute inset-0 animate-cue bg-accent" />
            </span>
            Scroll
          </span>
          <span className="hidden sm:inline">Software that keeps working</span>
        </div>
      </div>
    </section>
  )
}
