import { withAssetPaths } from '../lib/assets'
import type { SiteData } from './types'

/**
 * This file is the whole website.
 *
 * Everything on the page comes from the object below -- edit it, save, and the
 * browser updates. No component changes are needed to add a project.
 *
 * Image paths are relative to `public/`, so `images/foo.jpg` lives at
 * `public/images/foo.jpg`. The deploy base is prepended for you.
 *
 * The content shipped here is SAMPLE content, so the site looks finished while
 * you fill it in. Replace it with your own, then flip the banner flag below.
 */
export const SHOW_SAMPLE_BANNER = true

/**
 * Where the contact form POSTs its JSON. Leave null and the form instead opens
 * the visitor's mail client with everything pre-filled, which needs no backend.
 * Any service that accepts a JSON POST works -- Formspree, Basin, a Worker.
 */
export const CONTACT_FORM_ENDPOINT: string | null = null

const data: SiteData = {
  profile: {
    name: 'Your Name',
    role: 'Software Engineer',
    tagline: 'I build things for the web, and occasionally for the physical world.',
    location: 'Toronto, ON',
    about: [
      "I'm a developer who likes problems that start out vague. Most of what I make begins as a small annoyance in my own day and grows into something other people end up using.",
      'Lately I spend my time on full-stack TypeScript, data-heavy interfaces, and the unglamorous work of making software fast enough that nobody notices it. Before that I did a lot of embedded tinkering, which is where the habit of measuring things came from.',
      "Outside of work I shoot film, take apart hardware that was working fine, and play an aggressive amount of chess. If any of the projects below look relevant to what you're hiring for, I'd be glad to talk through them in detail.",
    ],
    avatar: 'images/avatar.svg',
    email: 'you@example.com',
    resume: null,
    availability: 'Open to new-grad and internship roles',
    socials: [
      { label: 'GitHub', href: 'https://github.com/MOTOMOTO2', icon: 'github' },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/your-handle', icon: 'linkedin' },
      { label: 'Email', href: 'mailto:you@example.com', icon: 'mail' },
    ],
  },

  skills: [
    { name: 'Languages', items: ['TypeScript', 'Python', 'Java', 'C', 'SQL', 'Bash'] },
    { name: 'Frontend', items: ['React', 'Next.js', 'Tailwind CSS', 'Vite', 'D3', 'Accessibility (WCAG)'] },
    { name: 'Backend & data', items: ['Node.js', 'FastAPI', 'PostgreSQL', 'Redis', 'Prisma', 'WebSockets'] },
    { name: 'Tooling', items: ['Git', 'Docker', 'GitHub Actions', 'Playwright', 'Vitest', 'Figma'] },
  ],

  timeline: [
    {
      period: '2025 — present',
      title: 'Software Engineering Intern',
      org: 'Northline Systems',
      summary:
        'Shipped internal tooling the support team uses daily. Cut a nightly report job from 40 minutes to under 3 by replacing per-row queries with a single aggregate.',
    },
    {
      period: '2024 — 2025',
      title: 'Undergraduate Research Assistant',
      org: 'Human-Computer Interaction Lab',
      summary:
        'Built the data-collection harness for a study on reading comprehension in dark mode. Instrumented the client, cleaned 1.2M events, co-authored the analysis notebook.',
    },
    {
      period: '2023 — 2024',
      title: 'Freelance Developer',
      org: 'Independent',
      summary:
        'Four small-business sites and one inventory tool. Learned more about scope creep than about any framework.',
    },
  ],

  projects: [
    {
      slug: 'orbit-task-manager',
      title: 'Orbit',
      blurb: 'A keyboard-first task manager that treats your week as a budget of hours.',
      description: [
        'Orbit started because every task app I tried let me write down more work than a week physically contains. Instead of an infinite list, Orbit asks you to assign each task an hour estimate and shows the week filling up in real time. When you overcommit, the view turns red before Thursday does.',
        'The client is a React app with an offline-first local store that syncs through a small Node service. Conflict resolution is last-write-wins per field rather than per record, which was the single change that made multi-device editing stop losing data.',
        'Everything is reachable from the keyboard. The command palette is the primary interface and the mouse is a fallback.',
      ],
      year: '2025',
      role: 'Solo — design, frontend, backend',
      status: 'Shipped',
      featured: true,
      tags: ['Web app', 'Full-stack'],
      tech: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'IndexedDB'],
      links: { demo: 'https://example.com/orbit', repo: 'https://github.com/MOTOMOTO2' },
      cover: { src: 'images/orbit-cover.svg', alt: 'Orbit week view showing an hour budget filling up' },
      gallery: [
        {
          src: 'images/orbit-1.svg',
          alt: 'The Orbit command palette open over the week view',
          caption: 'Command palette — every action in the app is reachable from here.',
        },
        {
          src: 'images/orbit-2.svg',
          alt: 'Week capacity bar turning red as tasks are added',
          caption: 'Capacity bar. Red means you have promised more hours than the week has.',
        },
        {
          src: 'images/orbit-3.svg',
          alt: 'Offline sync indicator reconciling two devices',
          caption: 'Field-level merge on reconnect, so two devices editing one task both win.',
        },
      ],
      highlights: [
        '400+ users from a single Show HN comment, no marketing spend',
        'Offline edits merge per field, not per record — no lost writes across devices',
        'First paint under 1.2s on a throttled 3G profile',
      ],
    },
    {
      slug: 'transit-delay-map',
      title: 'Transit Delay Map',
      blurb: 'Live map of which bus routes are actually running late, and by how much.',
      description: [
        'The transit agency publishes a real-time feed but keeps no history, so nobody could answer "is this route always like this?". This project polls the feed every 20 seconds, stores the deltas, and renders a map where each route is coloured by how far behind schedule it is right now, plus a sparkline of the last six hours.',
        'The interesting part was storage. Naively keeping every vehicle ping produced about 9GB a month. Downsampling to per-route-per-minute medians kept the charts identical and dropped it to roughly 140MB.',
      ],
      year: '2025',
      role: 'Solo',
      status: 'Shipped',
      featured: true,
      tags: ['Data viz', 'Full-stack'],
      tech: ['Python', 'FastAPI', 'PostgreSQL', 'D3', 'MapLibre'],
      links: {
        demo: 'https://example.com/transit',
        repo: 'https://github.com/MOTOMOTO2',
        writeup: 'https://example.com/blog/transit-storage',
      },
      cover: { src: 'images/transit-cover.svg', alt: 'City map with transit routes coloured by delay' },
      gallery: [
        {
          src: 'images/transit-1.svg',
          alt: 'Map view with routes shaded from green to red by current delay',
          caption: 'Green is on time, red is more than eight minutes behind.',
        },
        {
          src: 'images/transit-2.svg',
          alt: 'Route detail panel with a six-hour delay sparkline',
          caption: 'Per-route history. The 7pm spike is the same every weekday.',
        },
      ],
      highlights: [
        'Ingests ~4M vehicle pings a day on a $6/month VPS',
        'Downsampling cut storage 98% with no visible change to the charts',
        'Open data, open source — the ingest script works with any GTFS-RT feed',
      ],
    },
    {
      slug: 'shelf-ocr',
      title: 'Shelf',
      blurb: 'Point your phone at a bookshelf and get a catalogued library back.',
      description: [
        'Shelf takes one photo of a bookshelf, segments the individual spines, runs OCR on each, and matches the results against an ISBN database. The output is a list you can export, which saved me an afternoon of typing when I moved.',
        'Spine segmentation was the hard part — text runs vertically, spines lean, and lighting is uneven. An edge-detection pass plus rotation normalisation got accuracy to the point where the remaining failures were books I could not read by eye either.',
      ],
      year: '2024',
      role: 'Two-person team — I built the pipeline and API',
      status: 'Prototype',
      featured: true,
      tags: ['Machine learning', 'Mobile'],
      tech: ['Python', 'OpenCV', 'Tesseract', 'FastAPI', 'React Native'],
      links: { repo: 'https://github.com/MOTOMOTO2' },
      cover: { src: 'images/shelf-cover.svg', alt: 'Bookshelf photo with detected spine bounding boxes' },
      gallery: [
        {
          src: 'images/shelf-1.svg',
          alt: 'Detected spine boundaries overlaid on a shelf photo',
          caption: 'Segmentation pass. Each box becomes one OCR job.',
        },
        {
          src: 'images/shelf-2.svg',
          alt: 'Catalogued list of matched book titles with confidence scores',
          caption: 'Matched titles with confidence. Anything under 0.6 is flagged for review.',
        },
      ],
      highlights: [
        '87% title accuracy on a 200-book test set shot in normal room light',
        'Processes a full shelf in about 4 seconds on-device',
        'Built at a 36-hour hackathon, then rewritten properly over two weeks',
      ],
    },
    {
      slug: 'desk-weather-clock',
      title: 'Desk Weather Clock',
      blurb: 'An e-paper desk clock that shows tomorrow instead of right now.',
      description: [
        'A small e-paper display on an ESP32 that shows the time, the next day of weather, and whether I need a jacket. The point of e-paper is that it draws almost nothing — this runs about five weeks on a battery because it only wakes to redraw once a minute.',
        'Most of the work was power budgeting: deep sleep between refreshes, batching the Wi-Fi fetch to once an hour, and caching the forecast locally so a failed request shows stale data instead of an error.',
      ],
      year: '2024',
      role: 'Solo — firmware, PCB, enclosure',
      status: 'Shipped',
      featured: false,
      tags: ['Hardware', 'Embedded'],
      tech: ['C++', 'ESP32', 'E-paper', 'KiCad', '3D printing'],
      links: { repo: 'https://github.com/MOTOMOTO2' },
      cover: { src: 'images/clock-cover.svg', alt: 'E-paper desk clock showing tomorrow forecast' },
      gallery: [
        {
          src: 'images/clock-1.svg',
          alt: 'Finished clock in a 3D-printed enclosure',
          caption: 'Third enclosure revision. The first two did not fit the battery.',
        },
        {
          src: 'images/clock-2.svg',
          alt: 'Bare PCB and e-paper panel before assembly',
          caption: 'Guts. The connector on the left is the one I soldered backwards first.',
        },
      ],
      highlights: [
        'About 5 weeks of battery life per charge',
        'Custom PCB — the second revision actually worked',
        'Falls back to a cached forecast when Wi-Fi drops instead of erroring',
      ],
    },
    {
      slug: 'chess-opening-trainer',
      title: 'Opening Trainer',
      blurb: 'Spaced-repetition drilling for chess openings, built from my own loss log.',
      description: [
        'I kept losing the same positions, so I built a trainer that imports my games, finds the moves where I deviated from theory, and turns those exact positions into spaced-repetition cards. It drills the mistakes I actually make rather than a generic repertoire.',
        'Scheduling is a simplified SM-2. The useful twist was weighting intervals by how often a position shows up in my own games, so common positions come back more often than rare ones.',
      ],
      year: '2024',
      role: 'Solo',
      status: 'In progress',
      featured: false,
      tags: ['Web app'],
      tech: ['TypeScript', 'React', 'Vite', 'Stockfish WASM', 'IndexedDB'],
      links: { demo: 'https://example.com/trainer', repo: 'https://github.com/MOTOMOTO2' },
      cover: { src: 'images/chess-cover.svg', alt: 'Chess board with a drill prompt and review queue' },
      gallery: [
        {
          src: 'images/chess-1.svg',
          alt: 'Drill view with a board position and move input',
          caption: 'Each card is a position I got wrong in a real game.',
        },
        {
          src: 'images/chess-2.svg',
          alt: 'Review schedule heatmap across several weeks',
          caption: 'Review load, smoothed so no single day spikes.',
        },
      ],
      highlights: [
        'Imports PGN archives and generates cards from real deviations',
        'Engine analysis runs client-side in WASM — no server, no cost',
        'Intervals weighted by how often a position occurs in my own games',
      ],
    },
    {
      slug: 'markdown-slides',
      title: 'Slidewright',
      blurb: 'A CLI that turns a Markdown file into slides that do not look like Markdown.',
      description: [
        'Every Markdown-to-slides tool I tried produced slides that looked like a document with page breaks. Slidewright applies real layout rules: it picks a layout per slide based on content shape, enforces a typographic scale, and refuses to render text that would end up below 18pt.',
        'Output is a single self-contained HTML file. No runtime, no network — it works from a USB stick in a conference room with bad Wi-Fi.',
      ],
      year: '2023',
      role: 'Solo',
      status: 'Shipped',
      featured: false,
      tags: ['Developer tool', 'CLI'],
      tech: ['TypeScript', 'Node.js', 'remark', 'Vitest'],
      links: { repo: 'https://github.com/MOTOMOTO2', writeup: 'https://example.com/blog/slidewright' },
      cover: { src: 'images/slides-cover.svg', alt: 'Markdown source next to the slide it produces' },
      gallery: [
        {
          src: 'images/slides-1.svg',
          alt: 'Markdown input beside the chosen slide layout',
          caption: 'Layout is inferred from content shape, not declared per slide.',
        },
      ],
      highlights: [
        'Single self-contained HTML output — no runtime, works offline',
        'Hard minimum type size, so nothing ships unreadable from the back row',
        '94% test coverage on the layout selector',
      ],
    },
  ],

  photos: [
    { src: 'images/photo-1.svg', alt: 'Workbench with a half-assembled PCB', caption: 'Where most of the hardware projects happen.' },
    { src: 'images/photo-2.svg', alt: 'Speaking at a local developer meetup', caption: 'Talking about offline-first sync at a local meetup.' },
    { src: 'images/photo-3.svg', alt: 'Whiteboard covered in a data model sketch', caption: 'The Orbit data model, revision five.' },
    { src: 'images/photo-4.svg', alt: 'Team photo at a weekend hackathon', caption: 'Hour 30 of 36. Shelf was still segmenting nothing.' },
    { src: 'images/photo-5.svg', alt: 'Film photograph of a city street at dusk', caption: 'Portra 400, pushed one stop.' },
    { src: 'images/photo-6.svg', alt: 'Three iterations of a 3D-printed enclosure', caption: 'Enclosure revisions one through three.' },
  ],
}

/** Asset paths are resolved against the deploy base; see src/lib/assets.ts. */
export const site: SiteData = withAssetPaths(data)
