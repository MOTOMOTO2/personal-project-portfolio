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
 */
export const SHOW_SAMPLE_BANNER = false

/**
 * Where the contact form POSTs its JSON. Leave null and the form instead opens
 * the visitor's mail client with everything pre-filled, which needs no backend.
 * Any service that accepts a JSON POST works -- Formspree, Basin, a Worker.
 */
export const CONTACT_FORM_ENDPOINT: string | null = null

const data: SiteData = {
  profile: {
    name: 'Aden Yadegar',
    role: 'Software Developer',
    tagline: 'I build full-stack web apps, browser games, and AI tools, and put them online for people to use.',
    location: 'Ontario, Canada',
    about: [
      "I'm a student at Lakehead University's Barrie campus, and most of what I build starts as a problem in my own week: a project car I couldn't find parts for, deadlines my course site didn't show me, or wanting to start a coding project from my phone.",
      'I like taking an idea all the way to something live. RevVault runs in production with sign-in, subscriptions, scheduled jobs, and error monitoring, and several of my projects use Claude to handle the parts that need judgement, like reading a syllabus PDF or answering a hard question about a codebase.',
      "I'm currently building a coding assistant with machine-learning models written from scratch. If any of the projects above look relevant to what you're hiring for, I'd be glad to talk through them.",
    ],
    avatar: 'images/avatar.svg',
    email: 'aden.yadegar21@gmail.com',
    resume: null,
    availability: 'Open to internship and co-op roles',
    socials: [
      { label: 'GitHub', href: 'https://github.com/MOTOMOTO2', icon: 'github' },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/aden-yadegar-349063313', icon: 'linkedin' },
      { label: 'Email', href: 'mailto:aden.yadegar21@gmail.com', icon: 'mail' },
    ],
  },

  skills: [
    { name: 'Languages', items: ['TypeScript', 'JavaScript', 'C#', 'C', 'SQL', 'HTML & CSS'] },
    { name: 'Frontend', items: ['React', 'React Native (Expo)', 'Vite', 'Tailwind CSS', 'Three.js / WebGL', 'PWAs'] },
    { name: 'Backend & data', items: ['ASP.NET Core', 'Node.js', 'Fastify', 'Entity Framework Core', 'PostgreSQL', 'SQLite', 'Supabase'] },
    { name: 'AI & tooling', items: ['Claude API', 'Claude Code', 'Git', 'GitHub Actions', 'Docker', 'Fly.io', 'Vitest', 'xUnit'] },
  ],

  timeline: [],

  projects: [
    {
      slug: 'revvault',
      title: 'RevVault',
      blurb: 'Search Kijiji, AutoTrader and eBay for a used car at once, then find parts for it across a dozen retailers.',
      description: [
        'Shopping for a project car means running the same search on several sites and seeing the same car three times. RevVault searches Kijiji, AutoTrader and eBay at once, shows each car once even when it is listed on more than one site, and compares every price with similar cars for sale nearby. Listings that mention a salvage title, accident history or unusual mileage are flagged.',
        'It keeps going after you buy: a garage and build log for the cars you own, parts search for your exact vehicle across retailers like RockAuto, Amazon, Canadian Tire and eBay, and a wishlist that is re-checked on a schedule so a price drop turns into an email and an in-app alert.',
        "It's an ASP.NET Core 8 API serving a React 19 single-page app, deployed on Fly.io. Most sources are scraped or read through public JSON endpoints, so each one is built to fail quietly: a site that's down returns nothing for that search instead of breaking the page, and an hourly health check emails me when a source stops returning results.",
      ],
      year: '2026',
      role: 'Solo — design, frontend, backend, deployment',
      status: 'Shipped',
      featured: true,
      tags: ['Web app', 'Full-stack'],
      tech: ['C#', 'ASP.NET Core', 'React', 'TypeScript', 'PostgreSQL', 'Fly.io'],
      links: { demo: 'https://revvault.ca' },
      cover: { src: 'images/revvault-cover.png', alt: 'RevVault home page with a used-car search form' },
      gallery: [
        {
          src: 'images/revvault-parts.png',
          alt: 'RevVault parts search with vehicle details and part categories',
          caption: 'Parts search: enter your vehicle once, then compare prices across retailers by category.',
        },
        {
          src: 'images/revvault-market-value.png',
          alt: 'RevVault market value estimator form',
          caption: 'Market value: what a car is worth, based on current listings across Canada.',
        },
      ],
      highlights: [
        'Live in production at revvault.ca',
        'Searches 4 listing sources and a dozen parts retailers from one form',
        'Price-drop alerts by email, driven by scheduled jobs on GitHub Actions',
        'Google sign-in, Stripe subscriptions, and Sentry error monitoring',
      ],
    },
    {
      slug: 'claude-remote',
      title: 'Claude Remote',
      blurb: 'Start coding projects from my phone: describe an app, and Claude Code on my desktop builds it and pushes it to GitHub.',
      description: [
        'Claude Remote is a phone dashboard for an AI coding agent running on my desktop. I type a prompt like "create a simple mario game", choose how much effort it should put in and how much of my usage it can spend, and pick a private repo, a public repo, or local only. My desktop picks up the job, creates the repository, writes the code, and pushes it.',
        'The dashboard is a plain JavaScript progressive web app that installs to the home screen. Supabase handles sign-in, stores jobs and their event logs, and streams changes in real time, so I can watch an agent work, see what is running, queued or paused, check usage meters, and cancel a job from anywhere.',
        'Row-level security scopes every row to the signed-in user, which is what makes it safe for the page to ship with a public Supabase key.',
      ],
      year: '2026',
      role: 'Solo',
      status: 'Shipped',
      featured: true,
      tags: ['AI', 'Web app'],
      tech: ['JavaScript', 'Supabase', 'PostgreSQL', 'Claude Code', 'PWA'],
      links: { repo: 'https://github.com/MOTOMOTO2/claude-remote-dashboard' },
      cover: { src: 'images/claude-remote-cover.svg', alt: 'Claude Remote' },
      gallery: [],
      highlights: [
        'Live agent logs streamed to my phone with Supabase Realtime',
        'Row-level security scopes every job and project to its owner',
        'Installs to the home screen, with one sign-in per device',
      ],
    },
    {
      slug: 'retro-zombie-arena',
      title: 'Retro Zombie Arena',
      blurb: 'A late-90s-style zombie shooter that runs in the browser, with every texture, model and sound generated in code.',
      description: [
        'A wave-survival first-person shooter in the spirit of Call of Duty: Zombies, with the pace of Doom and the look of a late-90s PC game: a low-resolution framebuffer scaled up to the window, bloom, dithering, scanlines, chunky textures, and low-poly monsters with glowing eyes. You earn points for hits and kills, buy your way through doors, roll the mystery box for a random gun, buy perks, and upgrade your weapons.',
        'There is a story too. Four chapters on four maps (an asylum, a town, an ironworks and an underground lab) each have their own objective, a boss, and a way out. Every map is regenerated from a new seed each time you play, and nothing on the HUD tells you where to go.',
        "There are no image, model or font files in the repository. Textures are painted onto canvases at load, the guns are modelled in code from the dimensions of real firearms, lighting is baked into vertex colours, and every sound effect and the soundtrack are synthesised with the Web Audio API. The only recorded audio is the announcer's voice lines, generated offline with an open-source text-to-speech model.",
      ],
      year: '2026',
      role: 'Solo',
      status: 'In progress',
      featured: true,
      tags: ['Game'],
      tech: ['TypeScript', 'Three.js', 'WebGL', 'Web Audio API', 'Vite'],
      links: {},
      cover: { src: 'images/zombie-cover.png', alt: 'Reloading a rifle in the asylum admissions room as zombies close in' },
      gallery: [
        { src: 'images/zombie-title.png', alt: 'Retro Zombie Arena title screen', caption: 'Title screen.' },
        {
          src: 'images/zombie-hollow-creek.png',
          alt: 'Hollow Creek: an open street under the night sky',
          caption: 'Chapter 2, Hollow Creek: open streets under the night sky.',
        },
        {
          src: 'images/zombie-butcher.png',
          alt: 'Fighting the Butcher boss in Hollow Creek',
          caption: 'The Butcher, the boss of chapter 2.',
        },
        {
          src: 'images/zombie-sublevel-9.png',
          alt: 'Sublevel 9: a lab lined with specimen tanks',
          caption: 'Chapter 4, Vireo Labs Sublevel 9.',
        },
      ],
      highlights: [
        '4 story chapters on 4 maps, each with its own boss',
        'No image, model or font files: everything is generated at runtime',
        'Every map regenerated from a fresh seed each run',
        'Rebindable controls, with on-screen prompts that update to match',
      ],
    },
    {
      slug: 'course-deadline-tracker',
      title: 'Course Deadline Tracker',
      blurb: 'Every deadline and grade for a term in one place, pulled from Brightspace and read out of syllabus PDFs with Claude.',
      description: [
        "Brightspace only knows the deadlines an instructor typed into it, which usually means the dropboxes and quizzes but not the lab dates, in-class tests, or what any of it is worth. The rest is in the syllabus PDF. This app subscribes to my Brightspace calendar feed, reads each syllabus with Claude (or an offline parser when there's no API key), and merges the two, so I see the deadlines Brightspace missed instead of a second copy of the ones it had.",
        'It works out what each item is (course code, type of work, and grade weight) and reads the grading scheme, so each course page shows my marks so far, what is missing, and my weighted grade. Reminders go out a week, three days, a day, and three hours before graded work, by phone notification, Discord or email, and everything exports back out as a calendar feed for Google, Apple or Outlook.',
        "I built it for Lakehead University's Barrie campus, but any Brightspace/D2L calendar feed works. It installs to a phone's home screen and runs on Fly.io.",
      ],
      year: '2026',
      role: 'Solo',
      status: 'Shipped',
      featured: false,
      tags: ['Web app', 'Full-stack', 'AI'],
      tech: ['TypeScript', 'Node.js', 'Fastify', 'React', 'SQLite', 'Claude API'],
      links: { demo: 'https://course-deadline-tracker.fly.dev' },
      cover: { src: 'images/course-tracker-cover.svg', alt: 'Course Deadline Tracker' },
      gallery: [],
      highlights: [
        'Finds the deadlines Brightspace missed by matching syllabus dates against the calendar feed',
        'Weighted grade per course, from the grading scheme in the syllabus',
        'Each reminder fires exactly once, and skips lectures and other ungraded events',
        'Works without an API key, using an offline PDF parser',
      ],
    },
    {
      slug: 'personal-code-assistant',
      title: 'Personal Code Assistant',
      blurb: "A coding assistant I'm training on my own code, using machine-learning models written from scratch, with Claude for the hard questions.",
      description: [
        'A coding assistant that learns from my own repositories. The machine-learning models (a tokenizer, an n-gram language model with Kneser-Ney smoothing, a small transformer, and code embeddings) are implemented from scratch and run locally at interactive speed, with no network and no API cost.',
        'One chat sits over both halves. A router decides each turn: the local models answer what they can, Claude answers the rest, and every answer Claude gives is folded into the local models on the next training run, so the local side covers more ground every week.',
        "It runs in the terminal, in the browser, or on my phone over home Wi-Fi by scanning a QR code, and the conversation lives on my machine so I can pick it up on any of them. It's still in progress: right now I'm tuning code completion against a held-out evaluation set.",
      ],
      year: '2026',
      role: 'Solo',
      status: 'In progress',
      featured: false,
      tags: ['AI', 'Machine learning', 'Developer tool'],
      tech: ['TypeScript', 'Node.js', 'Claude API'],
      links: {},
      cover: { src: 'images/code-assistant-cover.svg', alt: 'Personal Code Assistant' },
      gallery: [],
      highlights: [
        'Tokenizer, n-gram model, transformer and embeddings written from scratch',
        'Local answers in milliseconds, fully offline',
        "Learns from Claude's answers so the same question stays local next time",
      ],
    },
  ],

  photos: [],
}

/** Asset paths are resolved against the deploy base; see src/lib/assets.ts. */
export const site: SiteData = withAssetPaths(data)
