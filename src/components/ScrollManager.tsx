import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * The browser only scrolls to a `#fragment` on a real page load, so client-side
 * navigations to `/#projects` need this. Routes without a hash start at the top.
 */
export function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0 })
      return
    }

    // Wait a frame so the target section exists before scrolling to it.
    const frame = requestAnimationFrame(() => {
      const target = document.querySelector(hash)
      target?.scrollIntoView({ block: 'start' })
    })
    return () => cancelAnimationFrame(frame)
  }, [pathname, hash])

  return null
}
