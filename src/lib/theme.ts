import { useCallback, useEffect, useState } from 'react'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'portfolio-theme'

/** Storage can throw (private mode, blocked site data), so every access is guarded. */
function readStored(): Theme | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored === 'light' || stored === 'dark' ? stored : null
  } catch {
    return null
  }
}

function store(theme: Theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    // Not remembered across visits; the toggle still works for this one.
  }
}

/** Dark is the site's look; light ("paper") only when the visitor picks it. */
export function readStoredTheme(): Theme {
  return readStored() ?? 'dark'
}

function apply(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(readStoredTheme)

  useEffect(() => {
    apply(theme)
  }, [theme])

  const toggle = useCallback(() => {
    const next = theme === 'dark' ? 'light' : 'dark'
    store(next)
    setTheme(next)
  }, [theme])

  return { theme, toggle }
}
