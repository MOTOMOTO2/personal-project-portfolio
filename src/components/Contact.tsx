import { ArrowUpRight, Check, Copy, FileText, Mail } from 'lucide-react'
import { useState } from 'react'
import { site } from '../data/site'
import { socialIcons } from '../lib/social-icons'
import { Emphasis } from './Emphasis'

/** The closing panel: dark in both themes, one clear thing to do. */
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
    <section className="py-20 sm:py-28">
      <div className="container-page">
        <div className="reveal relative overflow-hidden rounded-[2rem] border border-ink-border bg-ink px-6 py-16 text-white sm:px-14 sm:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(36rem_22rem_at_85%_0%,hsl(18_100%_55%/0.28),transparent_70%),radial-gradient(28rem_18rem_at_0%_100%,hsl(18_100%_55%/0.14),transparent_70%)]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgb(255_255_255/0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.05)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_70%_80%_at_70%_0%,black,transparent)]"
          />

          <div className="relative max-w-2xl">
            <p className="flex items-center gap-3 font-mono text-xs font-medium tracking-[0.08em] text-white/55 uppercase">
              <span className="text-[#ff8a5c]">04</span>
              <span aria-hidden className="h-px w-8 bg-white/25" />
              Contact
            </p>
            <h2 id="contact" className="mt-4 scroll-mt-24 text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.02] font-semibold">
              <span className="[&_.serif-accent]:text-[#ff8a5c]">
                <Emphasis text="Let's build something that *keeps working*." />
              </span>
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-white/70">
              I'm looking for internship and co-op roles in software development. If you're hiring, or want to hear
              more about any of these projects, send me an email.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-2.5">
              <a
                href={`mailto:${profile.email}`}
                className="btn h-12 bg-[#ff6a33] px-5 text-[0.9375rem] text-[#1a0d06] shadow-[0_10px_30px_-10px_#ff6a33] hover:bg-[#ff7a47]"
              >
                <Mail className="size-4" aria-hidden />
                {profile.email}
              </a>
              <button
                type="button"
                onClick={copyEmail}
                aria-label="Copy email address"
                className="btn btn-icon h-12 w-12 border-white/15 bg-white/5 text-white hover:bg-white/10"
              >
                {copied ? <Check className="size-4 text-emerald-400" aria-hidden /> : <Copy className="size-4" aria-hidden />}
              </button>
              <p aria-live="polite" className="sr-only">
                {copied ? 'Email address copied to clipboard' : ''}
              </p>
            </div>

            <ul className="mt-6 flex flex-wrap items-center gap-2">
              {elsewhere.map((social) => {
                const Icon = socialIcons[social.icon]
                return (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      className="btn h-10 border-white/15 bg-white/5 text-white/85 hover:bg-white/10 hover:text-white"
                    >
                      <Icon className="size-4" aria-hidden />
                      {social.label}
                      <ArrowUpRight className="size-3.5 text-white/50" aria-hidden />
                    </a>
                  </li>
                )
              })}
              {profile.resume && (
                <li>
                  <a
                    href={profile.resume}
                    target="_blank"
                    rel="noreferrer"
                    className="btn h-10 border-white/15 bg-white/5 text-white/85 hover:bg-white/10 hover:text-white"
                  >
                    <FileText className="size-4" aria-hidden />
                    Résumé
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
