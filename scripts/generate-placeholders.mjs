/**
 * Generates the placeholder artwork in `public/images/`.
 *
 * The site ships with sample content, so it needs sample images. Rather than
 * commit binary stock photos, this writes small deterministic SVGs: a gradient
 * derived from a hash of the filename plus a caption. Replace any of them with
 * a real JPG/PNG and update the path in `src/data/site.ts`.
 *
 *   node scripts/generate-placeholders.mjs
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const outDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'images')

/** Stable 32-bit hash so each filename always produces the same artwork. */
function hash(text) {
  let h = 2166136261
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

const SIZES = {
  cover: { w: 1200, h: 750 },
  shot: { w: 1200, h: 750 },
  photo: { w: 900, h: 900 },
  avatar: { w: 480, h: 480 },
}

function escapeXml(text) {
  return text.replace(/[<>&'"]/g, (c) => `&#${c.charCodeAt(0)};`)
}

function svg({ file, label, kind }) {
  const { w, h } = SIZES[kind]
  const seed = hash(file)
  const hue = seed % 360
  const hue2 = (hue + 40 + (seed % 60)) % 360
  const id = file.replace(/\W/g, '')

  // A few deterministic blobs so no two images look identical.
  const blobs = Array.from({ length: 4 }, (_, i) => {
    const s = hash(`${file}:${i}`)
    const cx = (s % w) | 0
    const cy = ((s >> 8) % h) | 0
    const r = Math.round(h * 0.18 + ((s >> 16) % Math.round(h * 0.3)))
    const opacity = (0.06 + ((s >> 20) % 10) / 100).toFixed(2)
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff" opacity="${opacity}" />`
  }).join('')

  const text =
    kind === 'avatar'
      ? `<text x="50%" y="54%" text-anchor="middle" font-family="ui-sans-serif, system-ui, sans-serif"
           font-size="${Math.round(h * 0.34)}" font-weight="700" fill="#fff" opacity="0.92">${escapeXml(label)}</text>`
      : `<text x="48" y="${h - 48}" font-family="ui-sans-serif, system-ui, sans-serif"
           font-size="${Math.round(h * 0.052)}" font-weight="600" fill="#fff" opacity="0.92">${escapeXml(label)}</text>
         <text x="48" y="${h - 48 + Math.round(h * 0.055)}" font-family="ui-monospace, monospace"
           font-size="${Math.round(h * 0.03)}" fill="#fff" opacity="0.6">placeholder image</text>`

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img">
  <defs>
    <linearGradient id="g${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="hsl(${hue} 68% 52%)" />
      <stop offset="1" stop-color="hsl(${hue2} 62% 32%)" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#g${id})" />
  ${blobs}
  ${text}
</svg>
`
}

// Only the images that are still placeholders. RevVault and Retro Zombie Arena
// use real screenshots (PNGs in public/images/), so they are not listed here.
const manifest = [
  { file: 'avatar.svg', label: 'AY', kind: 'avatar' },

  { file: 'claude-remote-cover.svg', label: 'Claude Remote', kind: 'cover' },
  { file: 'course-tracker-cover.svg', label: 'Course Deadline Tracker', kind: 'cover' },
  { file: 'code-assistant-cover.svg', label: 'Personal Code Assistant', kind: 'cover' },

  { file: 'og-cover.svg', label: 'Aden Yadegar — portfolio', kind: 'cover' },
]

mkdirSync(outDir, { recursive: true })
for (const entry of manifest) {
  writeFileSync(join(outDir, entry.file), svg(entry), 'utf8')
}
console.log(`Wrote ${manifest.length} placeholder images to public/images/`)
