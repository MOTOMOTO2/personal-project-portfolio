import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// Hosts that serve the site from the domain root (Netlify, Vercel, Cloudflare
// Pages, a plain static host) need no configuration. GitHub Pages serves project
// sites from /<repo>/, so the deploy workflow sets VITE_BASE=/<repo>/ and the
// router picks the same value up through import.meta.env.BASE_URL.
const base = process.env.VITE_BASE ?? '/'

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
  build: { outDir: 'dist', sourcemap: false },
  // Most suites are plain data checks; the component suites opt into jsdom
  // with a `@vitest-environment jsdom` docblock.
  test: { environment: 'node', include: ['src/**/*.test.{ts,tsx}'] },
})
