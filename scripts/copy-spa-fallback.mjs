/**
 * Copies dist/index.html to dist/404.html.
 *
 * The site uses real paths (/projects/revvault) rather than hash routes. Static
 * hosts that do not rewrite unknown paths to index.html -- GitHub Pages being
 * the common one -- serve 404.html instead, so shipping a copy of the app there
 * makes a deep link or a page refresh work.
 *
 * Netlify, Vercel and Cloudflare Pages rewrite on their own; the extra file is
 * harmless there.
 */
import { copyFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const dist = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist')
copyFileSync(join(dist, 'index.html'), join(dist, '404.html'))
console.log('Wrote dist/404.html (SPA fallback)')
