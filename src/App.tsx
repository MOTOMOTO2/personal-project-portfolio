import { useCallback, useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import { CommandPalette } from './components/CommandPalette'
import { Footer } from './components/Footer'
import { Nav } from './components/Nav'
import { ScrollManager } from './components/ScrollManager'
import { Home } from './pages/Home'
import { NotFound } from './pages/NotFound'
import { ProjectDetail } from './pages/ProjectDetail'
import { useTheme } from './lib/theme'

export default function App() {
  // Owned here so the nav button and the command palette share one theme.
  const { theme, toggle } = useTheme()
  const [paletteOpen, setPaletteOpen] = useState(false)
  const openPalette = useCallback(() => setPaletteOpen(true), [])
  const closePalette = useCallback(() => setPaletteOpen(false), [])

  // ⌘K on a Mac, Ctrl+K elsewhere, from anywhere on the site.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setPaletteOpen((open) => !open)
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <div className="flex min-h-dvh flex-col">
      <ScrollManager />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-fg focus:px-3 focus:py-2 focus:text-sm focus:text-bg"
      >
        Skip to content
      </a>
      <Nav theme={theme} onToggleTheme={toggle} onOpenPalette={openPalette} />
      <main id="main" className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      {paletteOpen && <CommandPalette theme={theme} onToggleTheme={toggle} onClose={closePalette} />}
    </div>
  )
}
