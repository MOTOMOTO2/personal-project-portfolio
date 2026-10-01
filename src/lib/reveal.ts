import { useEffect } from 'react'

/**
 * Adds `reveal-in` to every `.reveal` element once it scrolls into view.
 *
 * Done with one shared observer rather than a wrapper component so sections stay
 * plain markup. Elements are unobserved after revealing, so nothing re-animates
 * on the way back up.
 */
export function useReveal(deps: unknown[] = []) {
  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>('.reveal:not(.reveal-in)'))
    if (targets.length === 0) return

    if (
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      targets.forEach((el) => el.classList.add('reveal-in'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add('reveal-in')
          observer.unobserve(entry.target)
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    )

    targets.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
