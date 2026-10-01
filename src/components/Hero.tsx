import { ArrowDown, FileText, MapPin } from 'lucide-react'
import { site } from '../data/site'
import { socialIcons } from '../lib/social-icons'

export function Hero() {
  const { profile } = site

  return (
    <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28">
      {/* Decorative glow behind the heading. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 size-[36rem] -translate-x-1/2 rounded-full bg-accent/12 blur-3xl"
      />

      <div className="container-page relative grid items-center gap-10 sm:gap-14 md:grid-cols-[1.4fr_1fr]">
        <div>
          {profile.availability && (
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-fg-muted">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-70" />
                <span className="relative inline-flex size-2 rounded-full bg-accent" />
              </span>
              {profile.availability}
            </p>
          )}

          <h1 className="text-4xl font-bold sm:text-5xl lg:text-6xl">{profile.name}</h1>
          <p className="mt-3 text-xl font-medium text-accent sm:text-2xl">{profile.role}</p>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-fg-muted">{profile.tagline}</p>

          <p className="mt-4 inline-flex items-center gap-1.5 text-sm text-fg-muted">
            <MapPin className="size-4" aria-hidden />
            {profile.location}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#projects"
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-fg shadow-card transition hover:opacity-90"
            >
              See my work
              <ArrowDown className="size-4" aria-hidden />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-5 py-2.5 text-sm font-semibold transition hover:bg-surface-2"
            >
              Get in touch
            </a>
            {profile.resume && (
              <a
                href={profile.resume}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold text-fg-muted transition hover:text-fg"
              >
                <FileText className="size-4" aria-hidden />
                Résumé
              </a>
            )}
          </div>

          <ul className="mt-8 flex flex-wrap items-center gap-2">
            {profile.socials.map((social) => {
              const Icon = socialIcons[social.icon]
              return (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target={social.href.startsWith('http') ? '_blank' : undefined}
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-fg-muted transition hover:border-accent hover:text-fg"
                  >
                    <Icon className="size-4" aria-hidden />
                    {social.label}
                  </a>
                </li>
              )
            })}
          </ul>
        </div>

        <div className="order-first md:order-last">
          <div className="relative mx-auto w-44 sm:w-56 md:w-full md:max-w-xs">
            <div aria-hidden className="absolute inset-0 -rotate-6 rounded-3xl bg-accent/20" />
            <img
              src={site.profile.avatar}
              alt={`Portrait of ${profile.name}`}
              width={480}
              height={480}
              className="relative aspect-square w-full rounded-3xl border border-border object-cover shadow-card"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
