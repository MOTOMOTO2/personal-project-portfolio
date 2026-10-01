/**
 * One-shot smoke test of the built site in `dist/`.
 *
 * Serves dist on an ephemeral port, checks that the entry HTML, a hashed asset,
 * a placeholder image and the 404 SPA fallback all come back, then exits. Run it
 * after `npm run build`:
 *
 *   node scripts/verify-dist.mjs
 */
import { readFile, stat } from 'node:fs/promises'
import { createServer } from 'node:http'
import { extname, join, normalize } from 'node:path'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const dist = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist')

/** The deploy base the build used, e.g. "/" or "/personal-project-portfolio/". */
const base = JSON.parse(process.env.VERIFY_BASE_JSON ?? '"/"')

const types = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
}

const server = createServer(async (request, response) => {
  // Strip the query string and refuse traversal out of dist.
  const path = decodeURIComponent(new URL(request.url, 'http://localhost').pathname)
  // GitHub Pages serves a project site from /<repo>/, so requests arrive with a
  // base prefix that dist/ does not itself contain. Strip it before resolving.
  const relative = path.startsWith(base) ? path.slice(base.length) : path.replace(/^\//, '')
  const target = join(dist, normalize(relative).replace(/^(\.\.[/\\])+/, ''))

  try {
    const info = await stat(target)
    const file = info.isDirectory() ? join(target, 'index.html') : target
    response.writeHead(200, { 'Content-Type': types[extname(file)] ?? 'application/octet-stream' })
    response.end(await readFile(file))
  } catch {
    // Mirror a static host with no rewrite rules: unknown paths get 404.html.
    response.writeHead(404, { 'Content-Type': 'text/html' })
    response.end(await readFile(join(dist, '404.html')))
  }
})

await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
const origin = `http://127.0.0.1:${server.address().port}`

const indexHtml = await (await fetch(`${origin}${base}`)).text()

const assetMatch = indexHtml.match(/src="([^"]*assets\/index-[^"]+\.js)"/)
const cssMatch = indexHtml.match(/href="([^"]*assets\/index-[^"]+\.css)"/)

const checks = [
  ['index.html mentions the site title', /<title>[^<]+<\/title>/.test(indexHtml)],
  ['index.html pre-applies the theme', indexHtml.includes('portfolio-theme')],
  ['index.html has an og:image', indexHtml.includes('og:image')],
  ['index.html has a #root mount point', indexHtml.includes('id="root"')],
  ['entry script is linked', Boolean(assetMatch)],
  ['stylesheet is linked', Boolean(cssMatch)],
]

async function expectOk(label, path) {
  const response = await fetch(`${origin}${path}`)
  checks.push([`${label} (${response.status})`, response.ok])
  return response
}

if (assetMatch) await expectOk('entry JS loads', assetMatch[1])
if (cssMatch) await expectOk('stylesheet loads', cssMatch[1])
await expectOk('project image loads', `${base}images/revvault-cover.png`)
await expectOk('favicon loads', `${base}favicon.svg`)

// A deep link has no file on disk, so the host serves 404.html -- which must be
// the app, otherwise refreshing a project page would show a blank 404.
const deep = await fetch(`${origin}${base}projects/revvault`)
const deepBody = await deep.text()
checks.push(['deep link falls back to the app shell', deepBody.includes('id="root"')])

const assetPrefix = assetMatch?.[1] ?? ''
checks.push([`assets use the "${base}" base`, assetPrefix.startsWith(base)])

server.close()

let failed = 0
for (const [label, passed] of checks) {
  if (!passed) failed += 1
  console.log(`${passed ? 'PASS' : 'FAIL'}  ${label}`)
}

console.log(`\n${checks.length - failed}/${checks.length} checks passed`)
process.exit(failed === 0 ? 0 : 1)
