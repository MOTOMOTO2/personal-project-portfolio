import { Check, Copy, Mail } from 'lucide-react'
import { useState } from 'react'
import { site } from '../data/site'
import { socialIcons } from '../lib/social-icons'

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
      // Clipboard can be blocked; the mailto button beside this still works.
    }
  }

  return (
    <section className="border-t border-border bg-surface/60 py-20 sm:py-28">
      <div className="container-page">
        <div className="reveal mx-auto max-w-2xl text-center">
          <p className="eyebrow mb-3">Contact</p>
          <h2 id="contact" className="scroll-mt-24 text-3xl font-semibold sm:text-5xl">
            Let's work together
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-fg-muted">
            I'm looking for internship and co-op roles in software development. If you're hiring, or want
            to hear more about any of these projects, send me an email.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-2">
            <a href={`mailto:${profile.email}`} className="btn btn-primary h-11 px-5">
              <Mail className="size-4" aria-hidden />
              {profile.email}
            </a>
            <button
              type="button"
              onClick={copyEmail}
              aria-label="Copy email address"
              className="btn btn-secondary btn-icon h-11 w-11"
            >
              {copied ? <Check className="size-4 text-success" aria-hidden /> : <Copy className="size-4" aria-hidden />}
            </button>
          </div>
          <p aria-live="polite" className="sr-only">
            {copied ? 'Email address copied to clipboard' : ''}
          </p>

          <ul className="mt-4 flex flex-wrap items-center justify-center gap-2">
            {elsewhere.map((social) => {
              const Icon = socialIcons[social.icon]
              return (
                <li key={social.label}>
                  <a href={social.href} target="_blank" rel="noreferrer" className="btn btn-secondary">
                    <Icon className="size-4" aria-hidden />
                    {social.label}
                  </a>
                </li>
              )
            })}
            {profile.resume && (
              <li>
                <a href={profile.resume} target="_blank" rel="noreferrer" className="btn btn-secondary">
                  Résumé
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
    </section>
  )
}
