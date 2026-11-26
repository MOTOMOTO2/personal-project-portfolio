import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Privacy-friendly analytics with GoatCounter (https://www.goatcounter.com):
 * no cookies, no personal data, no consent banner needed.
 *
 * - Counts page views, keeping the hiring lens and filter in the path
 *   (/?for=backend), so opening a tailored link shows up as its own entry.
 * - Counts clicks on the links that matter: email, résumé, GitHub, LinkedIn,
 *   and live sites.
 * - Does nothing in development or tests, without a GoatCounter code, or for
 *   visitors who send Do Not Track or Global Privacy Control.
 */

type Count = { path: string; title?: string; event?: boolean }

declare global {
  interface Window {
    goatcounter?: { no_onload?: boolean; no_events?: boolean; count?: (vars: Count) => void }
  }
}

const SCRIPT = 'https://gc.zgo.at/count.js'

function optedOut(): boolean {
  const nav = navigator as Navigator & { globalPrivacyControl?: boolean }
  return nav.doNotTrack === '1' || nav.globalPrivacyControl === true
}

let loading: Promise<void> | null = null

function load(code: string): Promise<void> {
  if (loading) return loading
  // Count only when told to: a single-page app has to send its own page views.
  window.goatcounter = { no_onload: true, no_events: true }
  loading = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.async = true
    script.src = SCRIPT
    script.dataset.goatcounter = `https://${code}.goatcounter.com/count`
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('GoatCounter did not load'))
    document.head.appendChild(script)
  })
  return loading
}

function send(vars: Count) {
  loading?.then(() => window.goatcounter?.count?.(vars)).catch(() => {})
}

/** Which kind of link was clicked, or null for ones not worth counting. */
export function clickName(href: string, host: string): string | null {
  if (href.startsWith('mailto:')) return 'click: email'
  if (/\.pdf($|\?)/.test(href)) return 'click: résumé'
  if (!/^https?:\/\//.test(href)) return null
  const url = new URL(href)
  if (url.host === host) return null
  if (url.host === 'github.com') return `click: github${url.pathname === '/MOTOMOTO2' ? ' profile' : ''}`
  if (url.host.endsWith('linkedin.com')) return 'click: linkedin'
  return `click: ${url.host}`
}

/** The path to record: the route, plus the hiring lens and filter when present. */
export function viewPath(pathname: string, search: string): string {
  const params = new URLSearchParams(search)
  const kept = new URLSearchParams()
  for (const key of ['for', 'type']) {
    const value = params.get(key)
    if (value) kept.set(key, value)
  }
  const query = kept.toString()
  return query ? `${pathname}?${query}` : pathname
}

export function useAnalytics(code: string | null) {
  const { pathname, search } = useLocation()
  const enabled = Boolean(code) && import.meta.env.PROD && typeof window !== 'undefined' && !optedOut()

  useEffect(() => {
    if (!enabled || !code) return
    load(code)
    send({ path: viewPath(pathname, search), title: document.title })
  }, [enabled, code, pathname, search])

  useEffect(() => {
    if (!enabled) return
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.('a')
      const href = link?.getAttribute('href')
      if (!link || !href) return
      const name = clickName(href, window.location.host)
      if (name) send({ path: name, title: link.textContent?.trim().slice(0, 80) || name, event: true })
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [enabled])
}
