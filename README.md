# Personal project portfolio

A portfolio site for showing off projects to employers: a project grid with
filtering and search, a full case-study page per project with screenshots and
links, a photo gallery, an about/experience section, and a contact form.

The whole site is driven by one file — [`src/data/site.ts`](src/data/site.ts).
Edit that and you are done; you do not need to touch any components to add a
project, change your bio, or swap out images.

It ships with **sample content** so it looks finished while you fill it in. A
banner across the top says so; turn it off once the content is yours.

## Stack

| Choice | Why |
| --- | --- |
| **React 19 + TypeScript** | Types catch typos in the content file before the page breaks. |
| **Vite** | Instant dev server, static output you can host anywhere for free. |
| **Tailwind CSS v4** | Styling stays next to the markup; the theme lives in CSS variables. |
| **React Router** | Real URLs like `/projects/orbit-task-manager`, so each project is linkable and shareable. |
| **Vitest + Testing Library** | Catches a broken image path or a missing section before you deploy. |

No backend, no database, no build-time CMS. The output is plain static files.

## Running it

```bash
npm install
npm run dev        # http://localhost:5173
```

Other scripts:

```bash
npm run build      # type-check, bundle to dist/, write the SPA fallback
npm run preview    # serve the built site locally
npm test           # run the test suite once
npm run test:watch # run tests on change
npm run lint       # oxlint
npm run typecheck  # tsc only
npm run images     # regenerate the placeholder artwork in public/images/
```

After a build you can smoke-test the real output:

```bash
npm run build && node scripts/verify-dist.mjs
```

That serves `dist/` the way a dumb static host would and checks the HTML, the
hashed JS and CSS, an image, and the deep-link fallback.

## Making it yours

Everything below happens in `src/data/site.ts` unless noted.

1. **Your details** — `profile`: name, role, tagline, location, `about`
   paragraphs, email, socials. Set `availability: null` to hide the green status
   pill in the hero.
2. **Your résumé** — drop a PDF in `public/` and set `resume: 'resume.pdf'`. A
   button appears in the hero. `null` hides it.
3. **Your projects** — one object per project in the `projects` array:
   - `slug` becomes the URL (`/projects/<slug>`), so keep it lowercase and
     hyphenated.
   - `blurb` is the one-liner on the card; `description` is the paragraphs on the
     detail page.
   - `featured: true` sorts a project to the front of the grid.
   - `tags` populate the filter buttons automatically.
   - `highlights` are the bullet points in the detail-page sidebar. Numbers do
     the most work here — "cut load time 40%" beats "improved performance".
   - `links` are all optional: `demo`, `repo`, `writeup`.
   - `status` is one of `Shipped`, `In progress`, `Prototype`, `Archived`.
4. **Your pictures** — put files in `public/images/` and reference them without
   the `public` prefix (`images/my-shot.png`). The deploy base is prepended for
   you, so do **not** start the path with a slash. Every image wants `alt` text;
   `caption` is optional and shows under the screenshot and in the lightbox.
5. **Your photo wall** — the `photos` array feeds the Gallery section. Delete it
   and the section disappears.
6. **Turn off the banner** — set `SHOW_SAMPLE_BANNER = false`.
7. **Page title and link preview** — `index.html` holds the `<title>`, the
   meta description, and the Open Graph tags that LinkedIn and Slack read. Update
   the name there too, and swap `public/images/og-cover.svg` for a real 1200×630
   image.
8. **Colours** — `src/index.css` defines the palette as CSS variables at the top,
   once for light mode and once for `.dark`. Change `--accent` and the whole site
   follows.

### The contact form

Out of the box the form opens the visitor's mail client with the fields already
filled in, which needs no backend and no API key. To collect submissions on a
server instead, set `CONTACT_FORM_ENDPOINT` in `src/data/site.ts` to any URL that
accepts a JSON `POST` of `{ name, email, message }` — Formspree, Basin, a
Cloudflare Worker, your own API. The form switches behaviour automatically.

### Placeholder images

`public/images/` currently holds generated SVG gradients rather than real
screenshots, so nothing ships as a broken image. `npm run images` rewrites them
from [`scripts/generate-placeholders.mjs`](scripts/generate-placeholders.mjs).
Replace them with real JPG/PNG files as you go — the tests will tell you if a
path in the data file points at a file that is not there.

## Deploying

The build is static, so any host works. Two options:

**GitHub Pages** — already wired up. Go to repo **Settings → Pages → Source** and
pick **GitHub Actions**. Every push to `main` then runs lint, tests and the build
via [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) and publishes
to `https://<user>.github.io/<repo>/`. The workflow sets `VITE_BASE` to the repo
name because project sites are served from a subpath; if you rename the repo to
`<user>.github.io`, delete that `env` block so the base stays `/`.

**Netlify / Vercel / Cloudflare Pages** — build command `npm run build`, publish
directory `dist`. No base path needed, and these hosts handle deep links
themselves.

Because the site uses real paths rather than `#` routes, a static host needs to
serve the app for unknown URLs or refreshing `/projects/orbit` would 404. The
build writes `dist/404.html` as a copy of `index.html`, which is exactly what
GitHub Pages falls back to. On hosts that rewrite on their own it is just an
unused extra file.

## How it is put together

```
src/
  data/
    site.ts          all content lives here
    types.ts         the shape site.ts has to satisfy
    site.test.ts     checks slugs are unique, images exist, links are well-formed
  components/        Nav, Hero, Projects, Gallery, About, Contact, Lightbox, Footer
  pages/             Home, ProjectDetail, NotFound
  lib/
    assets.ts        prefixes image paths with the deploy base
    theme.ts         dark/light toggle, persisted in localStorage
    reveal.ts        scroll-into-view fade, one shared IntersectionObserver
    icons.tsx        inline brand marks (lucide v1 dropped them)
  App.tsx            layout and routes
  App.test.tsx       renders the real pages and asserts the content shows up
scripts/
  generate-placeholders.mjs   writes public/images/*.svg
  copy-spa-fallback.mjs       dist/index.html -> dist/404.html
  verify-dist.mjs             serves dist/ and smoke-tests it
```

## Accessibility and performance notes

- Dark mode is applied by a tiny inline script in `index.html` before first
  paint, so there is no white flash for dark-mode visitors.
- Every animation is disabled under `prefers-reduced-motion`.
- The lightbox traps `Escape` and arrow keys, locks background scrolling, and is
  announced as a modal dialog.
- There is a "skip to projects" link for keyboard users, and all images carry
  alt text (enforced by a test).
- Images below the fold are lazy-loaded and have explicit `width`/`height` so the
  layout does not shift as they arrive.

## Assumptions made while building this

Since this was generated without a back-and-forth, a few things were decided for
you. All are easy to change:

- The sample projects, experience entries and photos are invented. Replace them.
- Social links point at `github.com/MOTOMOTO2` (this repo's owner) and
  placeholder LinkedIn/email values.
- Inter is loaded from Google Fonts. Remove the two `<link>` tags in
  `index.html` to fall back to the system font stack.
- No analytics, cookie banner, or blog. Add them if you want them.
