# Personal project portfolio

My portfolio site: the projects I've built, each with screenshots and a full
write-up, plus a short about section and how to reach me.

The home page opens on a positioning headline, a terminal that types out what
each project really does, and stats counted from the content (projects, how many
are live, automated tests, demos). Then four **selected** projects as cards that
stack as you scroll (on screens tall enough to show a whole card), a door to the
full index, the hands-on demos, About with "How I work", and a contact panel.

**All work** (`/work`, a tab in the nav) lists every project newest first, with
a filter for each kind (`/work?type=games`); hovering a row floats its cover
beside the pointer. Every project has its own page at `/projects/<slug>` with an
overview, highlights, the stack, and a screenshot gallery with a lightbox.

The look: warm neutrals with one ember accent, Geist with Instrument Serif
italics for the words a heading leans on, light and dark themes.

Three things make it more than a list of projects:

- **"What are you hiring for?"** A row of choices under the hero (Backend,
  Frontend, AI tooling, Offline & real-time, Games). Picking one swaps the
  large rows for the projects that matter most to that role, rewrites the
  section pitch and highlights the matching skills. The choice lives in the
  URL, so `/?for=backend` is a tailored link to send with an application, and
  it follows the visitor onto project pages and back.
- **Hands-on demos.** Four projects hinge on one hard problem, and their pages
  carry a small working model of it, built from that project's real rules:
  racing two bookings against Care Track's exclusion constraint, editing one
  expense on two devices with Tally's per-field merge, filing Field Reports
  with no signal, and queueing more Claude Remote agents than there are slots.
  The home page links to all four under "Hands-on".
- **⌘K / Ctrl+K search.** Jump to any project, demo or section, tailor the page
  to a role, or copy the email address. Searching a technology ("postgres")
  lists the projects that use it.

The whole site is driven by one file — [`src/data/site.ts`](src/data/site.ts).
Edit that and you are done; you do not need to touch any components to add a
project, change the bio, or swap images.

## Stack

| Choice | Why |
| --- | --- |
| **React 19 + TypeScript** | Types catch typos in the content file before the page breaks. |
| **Vite** | Instant dev server, static output you can host anywhere for free. |
| **Tailwind CSS v4** | Styling stays next to the markup; the theme lives in CSS variables. |
| **React Router** | Real URLs like `/projects/revvault`, so each project is linkable and shareable. |
| **Vitest + Testing Library** | Catches a broken image path or a missing section before deploying. |

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
```

After a build you can smoke-test the real output:

```bash
npm run build && node scripts/verify-dist.mjs
```

That serves `dist/` the way a dumb static host would and checks the HTML, the
hashed JS and CSS, an image, and the deep-link fallback.

## Editing the content

Everything below happens in `src/data/site.ts` unless noted.

1. **Profile** — `profile`: name, role, `headline` (the big line in the hero;
   wrap words in `*asterisks*` to set them in the italic accent), tagline,
   `facts` (the "Based in" one is shown beside the role), the `about`
   paragraphs, email and socials. Set
   `availability: null` to hide the green "open to roles" line.
2. **Résumé** — drop a PDF in `public/` and set `resume: 'resume.pdf'`. A
   button appears in the nav, the hero and the contact section. `null` hides it.
3. **Projects** — one object per project in the `projects` array, shown in
   array order:
   - `featured: true` puts a project in "Selected work" as a large row. Keep the
     featured ones at the top of the array (a test checks this), so the
     previous/next links on project pages follow the same order as the home page.
   - `slug` becomes the URL (`/projects/<slug>`), so keep it lowercase and
     hyphenated.
   - `blurb` is the one-liner on the card; `description` is the paragraphs on the
     project page.
   - `period` is free text, e.g. `'Jan – Nov 2026'`.
   - `status` is `Live` (deployed now), `In progress`, or `Complete` (finished
     but not hosted).
   - `highlights` are the bullet points. The first three also appear on the home
     page for featured projects. Numbers do the most work here.
   - `links` are all optional: `demo`, `repo`, `writeup`. Only link a repo if it
     is public — a private one is a 404 for visitors.
4. **Images** — put files in `public/images/` and reference them without the
   `public` prefix (`images/my-shot.jpg`). The deploy base is prepended for you,
   so do **not** start the path with a slash. Covers and screenshots are shown
   at 16:10; every image needs `alt` text, and `caption` is optional.
5. **Hero console and "How I work"** — `console` is the lines the hero
   terminal types out, one per project, each linking to it; `principles` are
   the three cards in the About section, each with `proof` slugs. Section
   titles also accept `*emphasis*`.
6. **Hiring lenses** — `lenses`: one entry per "What are you hiring for?"
   choice. `id` is what goes in `/?for=<id>`; `featured` is the 1–4 project
   slugs shown as large rows; `skills` are items from `skills` to highlight and
   must match them exactly (a test checks both). An empty array hides the
   picker.
7. **Demos** — a project's optional `demo` (`id`, `title`, `teaser`) adds a
   "Try it" section to its page and a card under "Hands-on". The `id` picks a
   component from `src/components/demos/registry.ts`; to add a new kind, write
   the model as a pure `.ts` file with tests, a component beside it, and
   register both there.
8. **Photo wall** — the `photos` array feeds an optional Gallery section. It is
   empty now, so the section and its nav link are hidden.
9. **Experience** — `timeline` entries appear under the skills in the About
   section. Empty hides it.
10. **Page title and link preview** — `index.html` holds the `<title>`, the meta
   description, and the Open Graph tags that LinkedIn and Slack read.
   `og:image` must be an absolute URL to a PNG or JPG
   (`public/images/og-cover.png`, 1200×630); update it if the site moves to a
   new domain.
11. **Colours** — `src/index.css` defines the palette as CSS variables at the
   top, once for light mode and once for `.dark`. Change `--accent` and the
   links, focus rings and highlight ticks follow.

### Where the screenshots came from

They are all real: captured from the live sites (RevVault's search results,
Care Track's home page), from each project's own tooling (Claude Remote's
`tools/preview.mjs`, which renders the real app against its test fixtures;
Bluffalo's and Field Reports' browser checks), from Course Deadline Tracker's
seeded demo term (`npm run seed`), or from the screenshots committed in each
repo.
Phone screenshots are composed three to an image so they fit the 16:10 frame.
Two covers are designed rather than captured: Personal Code Assistant's shows
the terminal transcript from its README, and Necrotide's is a title card,
because Roblox can't be screenshotted headlessly.

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
serve the app for unknown URLs or refreshing `/projects/revvault` would 404. The
build writes `dist/404.html` as a copy of `index.html`, which is exactly what
GitHub Pages falls back to. On hosts that rewrite on their own it is just an
unused extra file.

## How it is put together

```
src/
  data/
    site.ts          all content lives here
    types.ts         the shape site.ts has to satisfy
    site.test.ts     checks slugs, ordering, images, links
  components/
    Hero.tsx             name, headline, stats, the console, the cursor spotlight
    LiveConsole.tsx      the terminal that types out what each project does
    BrowserFrame.tsx     a screenshot dressed as a browser window
    CountUp.tsx, Emphasis.tsx, ReadingProgress.tsx
    HiringLens.tsx       "What are you hiring for?" picker
    Projects.tsx         "Selected work" cards, the door to /work, "Hands-on"
    MoreWork.tsx         that door: how many more projects, and their covers
    HandsOn.tsx          one card per demo on the home page
    FeaturedProject.tsx  one card in the Selected work stack
    CommandPalette.tsx   ⌘K search
    demos/
      registry.ts        demo id -> component and icon
      ui.tsx             switches, segmented controls, badges, panels
      double-booking.ts  + DoubleBookingDemo.tsx   (Care Track)
      sync-merge.ts      + SyncMergeDemo.tsx       (Tally)
      outbox.ts          + OutboxDemo.tsx          (Field Reports)
      agent-queue.ts     + AgentQueueDemo.tsx      (Claude Remote)
      demos.test.ts      the models against each project's real rules
    About.tsx, Contact.tsx, Gallery.tsx, Lightbox.tsx, Nav.tsx, Footer.tsx
  pages/             Home, AllWork (/work), ProjectDetail, NotFound
  lib/
    assets.ts        prefixes image paths with the deploy base
    theme.ts         dark/light toggle; follows the OS until you pick one
    lens.ts          the ?for= hiring lens: read, set, carry onto links
    stats.ts         the hero numbers, derived from the projects
    work.ts          the All work filters (from project tags) and newest-first order
    pointer.ts       card spotlight and screenshot tilt, via CSS variables
    text.ts          strip *emphasis*; the address a browser frame shows
    reveal.ts        scroll-into-view fade, one shared IntersectionObserver
    icons.tsx        inline brand marks (lucide v1 dropped them)
  App.tsx            layout and routes
  App.test.tsx       renders the real pages and asserts the content shows up
scripts/
  copy-spa-fallback.mjs       dist/index.html -> dist/404.html
  verify-dist.mjs             serves dist/ and smoke-tests it
```

## Accessibility and performance notes

- Dark mode is applied by a tiny inline script in `index.html` before first
  paint, so there is no white flash for dark-mode visitors.
- Every animation is disabled under `prefers-reduced-motion`; the
  double-booking demo then shows its steps at once instead of playing them out,
  and the hero spotlight is hidden (it is also hidden on touch screens).
- The demos are built from buttons, switches (`role="switch"`) and pressed-state
  toggles, and announce new results through `aria-live` regions.
- The command palette is a modal combobox: arrow keys move, Enter opens,
  Escape closes, and focus goes back to where it was.
- Project status is shown as a word next to a coloured dot, never colour alone.
- The lightbox handles `Escape` and arrow keys, locks background scrolling, and
  is announced as a modal dialog.
- There is a "skip to content" link for keyboard users, and all images carry alt
  text (enforced by a test).
- Images below the fold are lazy-loaded and have explicit `width`/`height` so the
  layout does not shift as they arrive.
