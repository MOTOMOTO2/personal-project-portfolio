/**
 * Link previews for every route. Runs after `vite build`.
 *
 * The app is one page, so LinkedIn, Slack and iMessage would otherwise see the
 * home page's title and image for every link (and a 404 status for deep links,
 * which GitHub Pages serves from 404.html). This writes a copy of index.html
 * per route with that route's own title, description, image and canonical URL:
 *
 *   dist/work.html                  -> /work
 *   dist/projects/<slug>.html       -> /projects/<slug>
 *
 * GitHub Pages serves /work from work.html with a 200, and the app boots the
 * same way it does from index.html. The data comes from src/data/site.ts,
 * loaded through Vite so it resolves exactly as it does in the app.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const base = process.env.VITE_BASE ?? '/'

const server = await createServer({
  root,
  base,
  configFile: false,
  logLevel: 'error',
  appType: 'custom',
  server: { middlewareMode: true, hmr: false, ws: false },
})
const { site, SITE_URL } = await server.ssrLoadModule('/src/data/site.ts')
await server.close()

/** An asset path as the app has it (with the deploy base) -> an absolute URL on the live site. */
const absolute = (src) => new URL(src.startsWith(base) ? src.slice(base.length) : src.replace(/^\//, ''), SITE_URL).href
const escape = (text) => text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const template = readFileSync(join(dist, 'index.html'), 'utf8')

/** Swap one tag's content; fail loudly if index.html stops having it. */
function setMeta(html, pattern, replacement, label) {
  if (!pattern.test(html)) throw new Error(`index.html has no ${label}`)
  return html.replace(pattern, replacement)
}

function page({ title, description, image, width, height, url }) {
  let html = template
  html = setMeta(html, /<title>[^<]*<\/title>/, `<title>${escape(title)}</title>`, '<title>')
  html = setMeta(html, /(<meta\s+name="description"\s+content=")[^"]*(")/, `$1${escape(description)}$2`, 'description')
  html = setMeta(html, /(<meta\s+property="og:title"\s+content=")[^"]*(")/, `$1${escape(title)}$2`, 'og:title')
  html = setMeta(html, /(<meta\s+property="og:description"\s+content=")[^"]*(")/, `$1${escape(description)}$2`, 'og:description')
  html = setMeta(html, /(<meta\s+property="og:image"\s+content=")[^"]*(")/, `$1${escape(image)}$2`, 'og:image')
  html = setMeta(html, /(<meta\s+property="og:image:width"\s+content=")[^"]*(")/, `$1${width}$2`, 'og:image:width')
  html = setMeta(html, /(<meta\s+property="og:image:height"\s+content=")[^"]*(")/, `$1${height}$2`, 'og:image:height')
  html = setMeta(html, /(<meta\s+property="og:url"\s+content=")[^"]*(")/, `$1${escape(url)}$2`, 'og:url')
  html = setMeta(html, /(<link\s+rel="canonical"\s+href=")[^"]*(")/, `$1${escape(url)}$2`, 'canonical')
  return html
}

const name = site.profile.name
const pages = [
  {
    file: 'work.html',
    title: `All work · ${name}`,
    description: `Everything ${name.split(' ')[0]} has built: ${site.projects.length} projects, newest first, each with a write-up and screenshots.`,
    image: absolute(`${base}images/og-cover.jpg`),
    width: 1200,
    height: 630,
    url: new URL('work', SITE_URL).href,
  },
  ...site.projects.map((project) => ({
    file: `projects/${project.slug}.html`,
    title: `${project.title} · ${name}`,
    description: project.blurb,
    image: absolute(project.cover.src),
    width: 1600,
    height: 1000,
    url: new URL(`projects/${project.slug}`, SITE_URL).href,
  })),
]

for (const entry of pages) {
  const target = join(dist, entry.file)
  mkdirSync(dirname(target), { recursive: true })
  writeFileSync(target, page(entry))
}
console.log(`Wrote ${pages.length} route pages with their own link previews`)
