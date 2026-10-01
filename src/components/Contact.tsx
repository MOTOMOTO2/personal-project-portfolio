import { Check, Copy, Mail, Send } from 'lucide-react'
import { useState } from 'react'
import { CONTACT_FORM_ENDPOINT, site } from '../data/site'
import { socialIcons } from '../lib/social-icons'
import { SectionHeading } from './SectionHeading'

type Status = 'idle' | 'sending' | 'sent' | 'error'

export function Contact() {
  const { profile } = site
  const [status, setStatus] = useState<Status>('idle')
  const [copied, setCopied] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const name = String(data.get('name') ?? '')
    const email = String(data.get('email') ?? '')
    const message = String(data.get('message') ?? '')

    // With no form backend configured, hand off to the visitor's mail client with
    // everything pre-filled. Set CONTACT_FORM_ENDPOINT in src/data/site.ts to
    // POST instead (Formspree, Basin, a Worker -- anything that accepts JSON).
    if (!CONTACT_FORM_ENDPOINT) {
      const subject = encodeURIComponent(`Portfolio enquiry from ${name || 'a visitor'}`)
      const body = encodeURIComponent(`${message}\n\n--\n${name}\n${email}`)
      window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`
      setStatus('sent')
      return
    }

    setStatus('sending')
    try {
      const response = await fetch(CONTACT_FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name, email, message }),
      })
      if (!response.ok) throw new Error(`Request failed: ${response.status}`)
      form.reset()
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard can be blocked; the mailto link beside this still works.
    }
  }

  return (
    <section className="border-t border-border bg-surface/50 py-16 sm:py-20">
      <div className="container-page">
        <SectionHeading
          id="contact"
          eyebrow="Contact"
          title="Get in touch"
          description="Hiring, collaborating, or just curious how one of these was built — send a note and I will reply."
        />

        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div className="reveal space-y-6">
            <div>
              <p className="mb-2 text-sm font-medium text-fg-muted">Email</p>
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={`mailto:${profile.email}`}
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 font-mono text-sm transition hover:border-accent"
                >
                  <Mail className="size-4" aria-hidden />
                  {profile.email}
                </a>
                <button
                  type="button"
                  onClick={copyEmail}
                  aria-label="Copy email address"
                  className="rounded-lg border border-border bg-surface p-2 text-fg-muted transition hover:text-fg"
                >
                  {copied ? (
                    <Check className="size-4 text-emerald-500" aria-hidden />
                  ) : (
                    <Copy className="size-4" aria-hidden />
                  )}
                </button>
              </div>
              <p aria-live="polite" className="sr-only">
                {copied ? 'Email address copied to clipboard' : ''}
              </p>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-fg-muted">Elsewhere</p>
              <ul className="flex flex-wrap gap-2">
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
          </div>

          <form
            onSubmit={handleSubmit}
            className="reveal space-y-4 rounded-xl border border-border bg-surface p-6 shadow-card"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium">Name</span>
                <input
                  name="name"
                  required
                  autoComplete="name"
                  className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm focus:border-accent focus:outline-none"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium">Email</span>
                <input
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm focus:border-accent focus:outline-none"
                />
              </label>
            </div>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium">Message</span>
              <textarea
                name="message"
                required
                rows={5}
                className="w-full resize-y rounded-lg border border-border bg-bg px-3 py-2 text-sm focus:border-accent focus:outline-none"
              />
            </label>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={status === 'sending'}
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-fg transition hover:opacity-90 disabled:opacity-60"
              >
                <Send className="size-4" aria-hidden />
                {status === 'sending' ? 'Sending…' : 'Send message'}
              </button>

              <p aria-live="polite" className="text-sm">
                {status === 'sent' && (
                  <span className="text-emerald-600 dark:text-emerald-400">
                    {CONTACT_FORM_ENDPOINT ? 'Thanks — message sent.' : 'Opening your mail app…'}
                  </span>
                )}
                {status === 'error' && (
                  <span className="text-red-600 dark:text-red-400">
                    Something went wrong. Email me directly instead.
                  </span>
                )}
              </p>
            </div>

            {!CONTACT_FORM_ENDPOINT && (
              <p className="text-xs text-fg-muted">
                This form opens your mail client. To receive submissions on a server instead, set{' '}
                <code className="font-mono">CONTACT_FORM_ENDPOINT</code> in{' '}
                <code className="font-mono">src/data/site.ts</code>.
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}
