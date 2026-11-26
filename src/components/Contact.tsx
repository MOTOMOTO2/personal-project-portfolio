import { ArrowUpRight, Check, Copy, FileText } from 'lucide-react'
import { useState } from 'react'
import { site } from '../data/site'
import { socialIcons } from '../lib/social-icons'
import { Emphasis } from './Emphasis'
import { Scramble } from './Scramble'

/** The close: one big line, and the email address as the biggest thing on it. */
export function Contact() {
  const { profile } = site
  const [copied, setCopied] = useState(false)
  const elsewhere = profile.socials.filter((social) => social.icon !== 'mail')

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard can be blocked; the mailto link above still works.
    }
  }

  return (
    <section className="relative isolate overflow-hidden border-t border-border py-24 sm:py-32">
      <div aria-hidden className="hero-glow absolute inset-0 -z-10 opacity-90" />
      <div aria-hidden className="hero-grid absolute inset-0 -z-10 opacity-40" />

      <div className="container-page">
        <p className="label reveal flex items-center gap-4 text-fg-subtle">
          <span className="text-accent">[04]</span>
          <Scramble text="Contact" />
          <span aria-hidden className="h-px flex-1 bg-border" />
          <span>Barrie, ON</span>
        </p>

        <h2 id="contact" className="display reveal mt-8 max-w-5xl scroll-mt-24 text-[clamp(2.5rem,6.4vw,5.75rem)] leading-[0.95]">
          <Emphasis text="Let's build something that *keeps working*." />
        </h2>
        <p className="reveal mt-6 max-w-xl text-lg leading-relaxed text-fg-muted">
          I'm looking for internship and co-op roles in software development. If you're hiring, or want to hear more
          about any of these projects, send me an email.
        </p>

        <a
          href={`mailto:${profile.email}`}
          aria-label={profile.email}
          className="group reveal mt-14 block border-y border-border py-7 transition-colors hover:border-accent/60 sm:py-9"
        >
          <span aria-hidden className="label text-fg-subtle">
            Email
          </span>
          <span aria-hidden className="mt-3 flex items-center justify-between gap-6">
            <span className="display text-[clamp(1.25rem,4.6vw,4rem)] leading-none [overflow-wrap:anywhere] transition-colors duration-300 group-hover:text-accent">
              {profile.email}
            </span>
            <ArrowUpRight className="size-8 shrink-0 text-fg-subtle transition duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-accent sm:size-14" />
          </span>
        </a>

        <div className="reveal mt-6 flex flex-wrap items-center gap-2">
          <button type="button" onClick={copyEmail} className="btn btn-secondary h-11">
            {copied ? <Check className="size-4 text-success" aria-hidden /> : <Copy className="size-4" aria-hidden />}
            {copied ? 'Copied' : 'Copy address'}
          </button>
          <p aria-live="polite" className="sr-only">
            {copied ? 'Email address copied to clipboard' : ''}
          </p>
          {elsewhere.map((social) => {
            const Icon = socialIcons[social.icon]
            return (
              <a key={social.label} href={social.href} target="_blank" rel="noreferrer" className="btn btn-secondary h-11">
                <Icon className="size-4" aria-hidden />
                {social.label}
                <ArrowUpRight className="size-3.5 text-fg-subtle" aria-hidden />
              </a>
            )
          })}
          {profile.resume && (
            <a href={profile.resume} target="_blank" rel="noreferrer" className="btn btn-secondary h-11">
              <FileText className="size-4" aria-hidden />
              Resume
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
