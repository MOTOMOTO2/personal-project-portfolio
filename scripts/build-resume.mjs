/**
 * Prints resume/resume.html to a PDF with headless Chrome: no dependencies.
 *
 *   npm run resume                       -> public/resume.pdf (no phone number)
 *   RESUME_PHONE="(905) 000-0000" \
 *   RESUME_OUT="$HOME/Documents/Aden Yadegar - Resume.pdf" npm run resume
 *                                        -> a private copy with the number
 *
 * CHROME overrides where Chrome is (the default is the usual macOS path).
 */
import { execFileSync } from 'node:child_process'
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const chrome = process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const out = resolve(process.env.RESUME_OUT ?? join(root, 'public', 'resume.pdf'))
const phone = process.env.RESUME_PHONE?.trim()

if (!existsSync(chrome)) {
  console.error(`Chrome not found at ${chrome}. Set CHROME to its path.`)
  process.exit(1)
}

// The source never holds the number; it is only stitched into a temp copy.
const html = readFileSync(join(root, 'resume', 'resume.html'), 'utf8').replace(
  '<!--PHONE-->',
  phone ? ` · ${phone.replace(/[<>&]/g, '')}` : '',
)
const work = mkdtempSync(join(tmpdir(), 'resume-'))
const page = join(work, 'resume.html')
writeFileSync(page, html)

try {
  execFileSync(
    chrome,
    [
      '--headless=new',
      '--disable-gpu',
      '--no-pdf-header-footer',
      // Time for the web fonts to arrive before printing.
      '--virtual-time-budget=8000',
      `--print-to-pdf=${out}`,
      `file://${page}`,
    ],
    { stdio: 'ignore' },
  )
} finally {
  rmSync(work, { recursive: true, force: true })
}

console.log(`Wrote ${out}${phone ? ' (with phone number)' : ''}`)
