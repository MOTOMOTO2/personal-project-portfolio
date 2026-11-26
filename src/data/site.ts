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

/** The public repository for this site, linked from the footer. */
export const SOURCE_URL = 'https://github.com/MOTOMOTO2/personal-project-portfolio'

const GH = 'https://github.com/MOTOMOTO2/'

const data: SiteData = {
  profile: {
    name: 'Aden Yadegar',
    role: 'Full-stack developer',
    headline: 'I build software that *keeps working* when the signal drops, a server fails, or two people click at once.',
    tagline:
      'I design, build and deploy complete products: a used-car search engine running in production, a course planner that reads syllabi with Claude, and a clinic-booking app I’m building with a team.',
    about: [
      "I'm a student at Lakehead University's Barrie campus, and most of what I build starts as a problem in my own week: a project car I couldn't find parts for, deadlines my course site didn't show me, or wanting to start a coding project from my phone.",
      'I like taking an idea all the way to something live. RevVault runs in production with Google sign-in, Stripe subscriptions, scheduled jobs and error monitoring. Several of my projects use Claude for the parts that need judgement, like reading a syllabus PDF or answering a hard question about a codebase, and the parts that have to be exactly right, like sync conflicts or push encryption, have tests that prove it.',
      "I also build with other people. On Care Track, a clinic-booking app with two other students, I've written the database schema, the booking rules, an audit log, the email notifications and the admin tools, then tried to break it all with a security pass, all through pull requests on a shared repository. I'm looking for an internship or co-op where I can do that on a larger codebase.",
    ],
    facts: [
      { label: 'Based in', value: 'Ontario, Canada' },
      { label: 'Studying at', value: 'Lakehead University, Barrie' },
      { label: 'Focus', value: 'Full-stack web, offline and real-time sync, AI tooling' },
      { label: 'Main languages', value: 'TypeScript, C#, Python, SQL' },
    ],
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
    { name: 'Languages', items: ['TypeScript', 'JavaScript', 'C#', 'Python', 'SQL', 'C', 'Luau', 'HTML & CSS'] },
    {
      name: 'Frontend',
      items: ['React', 'Next.js', 'Vite', 'Tailwind CSS', 'React Native (Expo)', 'Three.js / WebGL', 'PWAs & service workers'],
    },
    {
      name: 'Backend & data',
      items: ['ASP.NET Core', 'Entity Framework Core', 'Node.js', 'Fastify', 'FastAPI', 'PostgreSQL', 'SQLite', 'Supabase', 'Drizzle ORM'],
    },
    { name: 'AI', items: ['Claude API', 'Claude Code', 'Model Context Protocol (MCP)'] },
    {
      name: 'Infrastructure & testing',
      items: ['Docker', 'Google Cloud Run', 'Vercel', 'Fly.io', 'GitHub Actions', 'Vitest', 'xUnit', 'pytest', 'Playwright'],
    },
  ],

  // "What are you hiring for?" Each choice swaps in its own large rows and
  // highlights its skills. Send a tailored link with /?for=<id>.
  lenses: [
    {
      id: 'backend',
      label: 'Backend',
      pitch:
        'Data that stays correct when things happen at once: a database constraint that makes double-booking impossible, idempotent writes, a per-field sync protocol, and an ASP.NET Core API in production.',
      featured: ['care-track', 'revvault', 'tally', 'field-reports'],
      skills: [
        'TypeScript',
        'C#',
        'Python',
        'SQL',
        'ASP.NET Core',
        'Entity Framework Core',
        'Node.js',
        'Fastify',
        'FastAPI',
        'PostgreSQL',
        'SQLite',
        'Supabase',
        'Drizzle ORM',
        'Docker',
        'xUnit',
        'pytest',
      ],
    },
    {
      id: 'frontend',
      label: 'Frontend',
      pitch:
        'React and TypeScript interfaces that hold up on a phone with a bad connection: installable apps, live dashboards, and a WebGL game with no image or model files.',
      featured: ['revvault', 'claude-remote', 'tally', 'retro-zombie-arena'],
      skills: [
        'TypeScript',
        'JavaScript',
        'HTML & CSS',
        'React',
        'Next.js',
        'Vite',
        'Tailwind CSS',
        'Three.js / WebGL',
        'PWAs & service workers',
        'Vitest',
        'Playwright',
      ],
    },
    {
      id: 'ai',
      label: 'AI tooling',
      pitch:
        'Claude where a task needs judgement, plain code where it has to be exact: reading syllabus PDFs, an MCP connector for studying, a fleet of coding agents, and language models written from scratch.',
      featured: ['course-deadline-tracker', 'claude-remote', 'personal-code-assistant'],
      skills: ['TypeScript', 'Python', 'Node.js', 'Claude API', 'Claude Code', 'Model Context Protocol (MCP)'],
    },
    {
      id: 'offline',
      label: 'Offline & real-time',
      pitch:
        "Apps that keep working with no signal and agree with the server once it's back: durable outboxes, retries that can't land twice, per-field merges, and live state over WebSockets.",
      featured: ['tally', 'field-reports', 'claude-remote', 'bluffalo'],
      skills: ['TypeScript', 'React', 'PWAs & service workers', 'Node.js', 'FastAPI', 'PostgreSQL', 'SQLite', 'Supabase'],
    },
    {
      id: 'games',
      label: 'Games',
      pitch:
        'Three games built entirely from code: a WebGL shooter whose textures, models and sounds are generated at runtime, a real-time party game, and a Roblox survival game tested without Roblox.',
      featured: ['retro-zombie-arena', 'bluffalo', 'necrotide'],
      skills: ['TypeScript', 'JavaScript', 'Luau', 'Three.js / WebGL', 'Node.js'],
    },
  ],

  console: [
    { slug: 'revvault', command: 'search used cars near Toronto', result: '591 listings from 3 sites, prices rated', tone: 'ok' },
    {
      slug: 'care-track',
      command: 'book Dr. Osei 10:15–10:45',
      result: '23P01 appointments_no_overlap: slot taken',
      tone: 'refused',
    },
    { slug: 'tally', command: 'sync op-7 (note) from rev 3', result: 'merged: both edits kept', tone: 'merged' },
    { slug: 'field-reports', command: 'POST /reports r-48e0 (retry)', result: '200 duplicate: no second row', tone: 'ok' },
    { slug: 'claude-remote', command: 'queue job on tally', result: 'waiting: its own project is busy', tone: 'waiting' },
    {
      slug: 'course-deadline-tracker',
      command: 'read MATH1171-syllabus.pdf',
      result: '4 dated items, 2 Brightspace missed',
      tone: 'ok',
    },
    { slug: 'daily-digest-bot', command: 'collect hn-front', result: 'selector matched 0: reported, not skipped', tone: 'refused' },
  ],

  principles: [
    {
      title: 'Correct when things happen at once',
      body: "Two people booking the same slot, two phones editing the same expense. I put the rule where timing can't break it: in a database constraint or a sync protocol, with tests that race it.",
      proof: ['care-track', 'tally'],
    },
    {
      title: 'Works offline, fails out loud',
      body: 'Writes are saved on the device first and sent when they can be, retries never land twice, and a source that breaks says so instead of going quiet.',
      proof: ['field-reports', 'daily-digest-bot'],
    },
    {
      title: 'Shipped, not just started',
      body: 'Real deployments with sign-in, payments, scheduled jobs and monitoring, rebuilt and redeployed by CI on every push.',
      proof: ['revvault', 'course-deadline-tracker'],
    },
  ],

  timeline: [],

  projects: [
    // ---- Featured: shown as large rows under "Selected work" ----------------
    {
      slug: 'revvault',
      title: 'RevVault',
      blurb:
        'Searches Kijiji, AutoTrader and eBay for a used car at once, then finds parts for it across a dozen retailers. Live at revvault.ca.',
      description: [
        'Shopping for a project car means running the same search on several sites and seeing the same car three times. RevVault searches Kijiji, AutoTrader and eBay at once, shows each car once even when it is listed on more than one site, and compares every price with similar cars for sale nearby. Listings that mention a salvage title, accident history or unusual mileage are flagged.',
        'It keeps going after you buy: a garage and build log for the cars you own, parts search for your exact vehicle across retailers like RockAuto, Amazon, Canadian Tire and eBay, and a wishlist that is re-checked on a schedule so a price drop turns into an email and an in-app alert.',
        "It's an ASP.NET Core 8 API serving a React 19 single-page app, built into a Docker image and deployed to Google Cloud Run by GitHub Actions on every push to main. I migrated it there from Fly.io; it now scales to zero when idle and runs inside Cloud Run's free tier. Most sources are scraped or read through public JSON endpoints, so each one is built to fail quietly: a site that's down returns nothing for that search instead of breaking the page, and an hourly health check emails me when a source stops returning results.",
      ],
      period: 'Jan – Nov 2026',
      role: 'Solo: design, frontend, backend, deployment',
      status: 'Live',
      featured: true,
      tags: ['Full-stack', 'Web app'],
      tech: ['C#', 'ASP.NET Core', 'EF Core', 'React', 'TypeScript', 'PostgreSQL', 'Docker', 'Google Cloud Run', 'Stripe'],
      links: { demo: 'https://revvault.ca' },
      cover: {
        src: 'images/revvault-results.jpg',
        alt: 'RevVault search results for Toronto: 591 listings from Kijiji, eBay and AutoTrader, each with a price rating',
        caption:
          'Search results: 591 listings from three sites, each price rated against similar cars nearby. A source that returns nothing gets a notice, not a broken page.',
      },
      gallery: [
        {
          src: 'images/revvault-cover.png',
          alt: 'RevVault home page with a used-car search form',
          caption: 'The home page: one search across Kijiji, AutoTrader and eBay.',
        },
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
        'Live in production at revvault.ca, with 358 commits since January 2026',
        'Searches 4 listing sources and a dozen parts retailers from one form',
        'Price-drop alerts by email, driven by scheduled jobs on GitHub Actions',
        'Google sign-in, Stripe subscriptions and Sentry error monitoring',
      ],
    },
    {
      slug: 'course-deadline-tracker',
      title: 'Course Deadline Tracker',
      blurb:
        'Every deadline and grade for a term in one place, merged from Brightspace and read out of syllabus PDFs with Claude.',
      description: [
        "Brightspace only knows the deadlines an instructor typed into it, which usually means the dropboxes and quizzes but not the lab dates, in-class tests, or what any of it is worth. The rest is in the syllabus PDF. This app subscribes to my Brightspace calendar feed, reads each syllabus with Claude (or an offline parser when there's no API key), and merges the two, so I see the deadlines Brightspace missed instead of a second copy of the ones it had.",
        'It works out what each item is (course code, type of work and grade weight) and reads the grading scheme, so each course page shows my marks so far, what is missing, and my weighted grade. Reminders go out a week, three days, a day and three hours before graded work, by phone notification, Discord or email, and everything exports back out as a calendar feed for Google, Apple or Outlook.',
        'It doubles as a study tool: lecture slides saved from D2L are available to Claude through an MCP connector, so Claude can see when each test is, read the slides it covers, and quiz me on them. The calendar parser and the Web Push encryption are written by hand rather than pulled in as dependencies. It installs to a phone’s home screen and runs on Fly.io.',
      ],
      period: 'Sep – Oct 2026',
      role: 'Solo',
      status: 'Live',
      featured: true,
      tags: ['Full-stack', 'AI'],
      tech: ['TypeScript', 'Node.js', 'Fastify', 'React', 'SQLite', 'Claude API', 'MCP', 'Web Push'],
      links: { demo: 'https://course-deadline-tracker.fly.dev' },
      cover: {
        src: 'images/course-tracker-dashboard.jpg',
        alt: 'Course Deadline Tracker dashboard: overdue work, grade weights and four courses for the fall term',
      },
      gallery: [
        {
          src: 'images/course-tracker-deadlines.jpg',
          alt: 'Deadlines page: overdue, next 24 hours, next 7 days and the share of the final grade at stake',
          caption: 'Deadlines: what is overdue, what is due next, and how much of the final grade is riding on the week.',
        },
        {
          src: 'images/course-tracker-study.jpg',
          alt: 'Study page listing upcoming tests with their dates and grade weights',
          caption: 'Study: pick an upcoming test and Claude teaches and quizzes from that course’s lecture slides.',
        },
        {
          src: 'images/course-tracker-cover.jpg',
          alt: 'Course Deadline Tracker sign-in page listing its features',
          caption: 'Sign-in page. Screenshots are from the seeded demo term, not a real student’s data.',
        },
      ],
      highlights: [
        'Finds the deadlines Brightspace missed by matching syllabus dates against the calendar feed',
        'Weighted grade per course, from the grading scheme in the syllabus',
        'MCP connector lets Claude read lecture slides and quiz me before a test',
        'Hand-written iCalendar (RFC 5545) parser and Web Push encryption (RFC 8291)',
      ],
    },
    {
      slug: 'claude-remote',
      title: 'Claude Remote',
      blurb:
        'A phone dashboard for running several Claude Code agents at once, on my desktop or in cloud sandboxes, and watching them work live.',
      description: [
        'Claude Remote is the control panel for the AI coding agents I run. I type what to build, choose how much effort it should spend and whether the result is a private repo, a public one or local only, and an agent creates the repository, writes the code and pushes it, streaming its log back to my phone as it goes.',
        "Jobs go into Supabase and are claimed by a runner on my desktop. When the desktop is off, a Vercel Function starts a Vercel Sandbox for the project instead, so a job queued from the bus still starts in seconds. I set a ceiling of one to six agents running at once, each project gets at most one, and every waiting job says exactly what it's waiting for: a free slot, its own project, or a desktop that isn't there.",
        'The same relay carries other traffic without opening a single port: questions to my own coding assistant on the desktop, and taps on lights and the thermostat to the smart home hub on my Raspberry Pi. The app is plain JavaScript with no build step, and row-level security scopes every row to its owner, which is what makes it safe for the page to ship with a public Supabase key.',
        "It also works with no signal. A job, a message or a field report is saved on the phone the moment it's sent and goes out when the connection comes back; ids made on the phone mean a retry can't land twice, and the app opens on what it last read and says how old that is. That machinery came from Field Reports, which now lives inside Claude Remote on the same sign-in and row-level security.",
      ],
      period: 'Sep – Nov 2026',
      role: 'Solo',
      status: 'Live',
      featured: true,
      tags: ['AI', 'Full-stack', 'Real-time'],
      tech: ['JavaScript', 'Supabase', 'PostgreSQL', 'Vercel Functions', 'Vercel Sandbox', 'Claude Code', 'IndexedDB', 'PWA'],
      links: { repo: 'https://github.com/MOTOMOTO2/claude-remote-dashboard' },
      cover: {
        src: 'images/claude-remote-cover.jpg',
        alt: 'Agents screen: one agent running, one paused on a usage limit, and usage meters in the sidebar',
      },
      gallery: [
        {
          src: 'images/claude-remote-chat.jpg',
          alt: 'A project chat: a finished run with its summary, and a second run still working',
          caption: 'A chat per project: each run’s summary, its log, and the next run streaming in live.',
        },
        {
          src: 'images/claude-remote-new.jpg',
          alt: 'New project screen with suggestions, thinking effort, a usage cap and repository visibility',
          caption: 'Starting a job: effort, a usage cap it pauses at, and whether the repo is private, public or local.',
        },
        {
          src: 'images/claude-remote-house.jpg',
          alt: 'House screen with rooms, a thermostat, lights and a locked front door',
          caption: 'House: the smart home hub on my Raspberry Pi, reached through the same relay.',
        },
        {
          src: 'images/claude-remote-ask.jpg',
          alt: 'Ask screen: a chat with a personal assistant running on the desktop',
          caption: 'Ask: a chat with my own assistant, which runs on the desktop.',
        },
      ],
      highlights: [
        'Runs up to 6 agents at once, on the desktop or in Vercel Sandboxes when it is off',
        'Live agent logs streamed to the phone with Supabase Realtime',
        'Reaches home devices through an outbound-only relay: no open ports or tunnels',
        'Works with no signal: jobs, messages and reports queue on the phone and send themselves later',
        'Row-level security scopes every job, project and message to its owner',
      ],
      demo: {
        id: 'agent-queue',
        title: 'Queue more agents than there are slots',
        teaser:
          'Set the ceiling, put the desktop to sleep and queue a rush of jobs. Every job that has to wait says exactly what it is waiting for.',
      },
    },
    {
      slug: 'care-track',
      title: 'Care Track',
      blurb:
        'A clinic-booking app built by a team of three students: practitioners publish open times and patients book them. I built much of the backend and its security pass.',
      description: [
        "Waits for scans and specialist appointments can stretch for months, partly because booking still runs on outdated software. Care Track lets practitioners publish their open availability and patients find a slot and book it, with a dashboard on each side for upcoming appointments. We're building it as a team of three students to practise working on a shared codebase, loosely modelled on parts of healthcare platforms like PointClickCare.",
        'My part is mostly the backend. I wrote the Drizzle schema and first migration, the booking flow with instant and approval-required modes, and a PostgreSQL exclusion constraint that makes double-booking impossible at the database level rather than relying on checks in application code. I also added an append-only audit log that records reads and writes of patient data and every role change.',
        'I also built availability editing (weekly hours, exceptions, slot length) and the email layer: Mailpit locally, Resend in production, and status emails when an appointment is requested, confirmed, declined, cancelled or rescheduled. With a teammate I also wrote the daily reminder job, a secret-protected cron route that sends each reminder exactly once.',
        "Before launch I built the admin side, then tried to break the app. Admins can change roles, disable accounts, verify practitioners (an unverified one never appears in search) and search the audit log by who did what and when. For the break-it pass I wrote a test for every server action that signs in as the wrong patient, practitioner, staff member or admin and calls it with someone else's ids; each test passes only if the database is exactly as it was before. It found two gaps, edits that weren't being audited and account endpoints that allowed password guessing outside the login rate limit, and both are fixed.",
      ],
      period: 'Sep – Nov 2026',
      role: 'Backend developer, team of three',
      status: 'In progress',
      featured: true,
      tags: ['Full-stack', 'Team project'],
      tech: ['TypeScript', 'Next.js', 'React', 'PostgreSQL', 'Drizzle ORM', 'Better Auth', 'Vitest', 'Vercel'],
      links: { demo: 'https://care-track-pearl.vercel.app', repo: 'https://github.com/c0balt60/care-track' },
      cover: {
        src: 'images/care-track-cover.jpg',
        alt: 'Care Track home page: search for open appointments by specialty and location',
      },
      gallery: [],
      highlights: [
        'Double-booking prevented by a PostgreSQL exclusion constraint',
        "Attack tests for every server action: the wrong user, someone else's ids, and an unchanged database",
        'Append-only audit log of patient-data access and role changes, searchable by admins',
        'Appointment status and reminder emails, each sent exactly once',
        'Shipped through pull requests on a shared repository with two other developers',
      ],
      demo: {
        id: 'double-booking',
        title: 'Try to double-book a clinic',
        teaser:
          'Two patients press Book at the same moment. Compare checking first, a unique index, and the exclusion constraint Care Track uses.',
      },
    },

    // ---- More projects: shown in the grid --------------------------------
    {
      slug: 'retro-zombie-arena',
      title: 'Retro Zombie Arena',
      blurb:
        'A late-90s-style zombie shooter that runs in the browser, with every texture, model and sound generated in code.',
      description: [
        'A wave-survival first-person shooter in the spirit of Call of Duty: Zombies, with the pace of Doom and the look of a late-90s PC game: a low-resolution framebuffer scaled up to the window, bloom, dithering, scanlines, chunky textures, and low-poly monsters with glowing eyes. You earn points for hits and kills, buy your way through doors, roll the mystery box for a random gun, buy perks, and upgrade your weapons.',
        'There is a story too. Four chapters on four maps (an asylum, a town, an ironworks and an underground lab) each have their own objective, a boss, and a way out. Every map is regenerated from a new seed each time you play, and nothing on the HUD tells you where to go.',
        "There are no image, model or font files in the repository. Textures are painted onto canvases at load, the guns are modelled in code from the dimensions of real firearms, lighting is baked into vertex colours, and every sound effect and the soundtrack are synthesised with the Web Audio API. The only recorded audio is the announcer's voice lines, generated offline with an open-source text-to-speech model.",
      ],
      period: 'Sep – Oct 2026',
      role: 'Solo',
      status: 'In progress',
      featured: false,
      tags: ['Game'],
      tech: ['TypeScript', 'Three.js', 'WebGL', 'Web Audio API', 'Vite'],
      links: { repo: GH + 'retro-zombie-arena' },
      cover: {
        src: 'images/zombie-cover.png',
        alt: 'Reloading a rifle in the asylum admissions room as zombies close in',
      },
      gallery: [
        { src: 'images/zombie-title.png', alt: 'Retro Zombie Arena title screen', caption: 'Title screen.' },
        {
          src: 'images/zombie-chapters.jpg',
          alt: 'Chapter select screen with four chapters',
          caption: 'Chapter select: escape one map to unlock the next.',
        },
        {
          src: 'images/zombie-hollow-creek.png',
          alt: 'Hollow Creek: an open street under the night sky',
          caption: 'Chapter 2, Hollow Creek: open streets under the night sky.',
        },
        {
          src: 'images/zombie-chapel.jpg',
          alt: 'Round 1 in a stone chapel lit by hanging lamps, holding a pistol',
          caption: 'Round 1 in the chapel: baked vertex lighting and textures painted on canvases at load.',
        },
        {
          src: 'images/zombie-ironworks.jpg',
          alt: 'A warehouse aisle in Vireo Ironworks, lined with racks of crates under work lights',
          caption: 'Chapter 3, Vireo Ironworks: aisles of racked crates under work lights.',
        },
        {
          src: 'images/zombie-butcher.png',
          alt: 'Fighting the Butcher boss in Hollow Creek',
          caption: 'The Butcher, the boss of chapter 2.',
        },
        {
          src: 'images/zombie-furnace-man.jpg',
          alt: 'Fighting the Furnace Man among stacked crates in the ironworks',
          caption: 'The Furnace Man, the boss of chapter 3, Vireo Ironworks.',
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
      slug: 'tally',
      title: 'Tally',
      blurb:
        'An offline-first expense tracker that queues changes on the phone, syncs them later, and asks before overwriting anything.',
      description: [
        'Tally is an installable expense tracker that keeps working with no connection. Every tap is written to an outbox on the device first, so an entry appears instantly and survives the app being closed while offline; syncing is a separate step that happens whenever the network comes back.',
        'The interesting part is the sync protocol. Every change carries the last revision the device had seen, and the server keeps a per-field change log, so it can tell a stale edit to a different field (merged automatically, both edits kept) from a stale edit to the same field (a conflict). Conflicts appear as a card with both values side by side, so nothing is silently overwritten, and retries are idempotent, so a push whose response was lost never applies twice.',
        'On top of that sit bank imports through Plaid (matched against entries typed in by hand), subscription detection, monthly budgets and Web Push reminders. It runs on Vercel, with FastAPI as a serverless function and Supabase Postgres behind it.',
      ],
      period: 'Oct – Nov 2026',
      role: 'Solo',
      status: 'Live',
      featured: false,
      tags: ['Full-stack', 'Offline-first', 'PWA'],
      tech: ['Python', 'FastAPI', 'React', 'TypeScript', 'IndexedDB', 'Service workers', 'Supabase', 'Plaid'],
      links: { demo: 'https://tally-five-topaz.vercel.app', repo: GH + 'offline-sync-tracker' },
      cover: {
        src: 'images/tally-cover.jpg',
        alt: 'Three phone screens: offline with a queued change, a sync conflict asking which value to keep, and fully synced',
      },
      gallery: [],
      highlights: [
        'Per-field merging: concurrent edits to different fields both survive',
        'Compacted outbox: ten offline edits to one entry arrive as one change',
        '231 tests across the protocol, the client engine, HTTP smoke tests and real Chromium',
        'Bank transactions imported through Plaid and matched to manual entries',
      ],
      demo: {
        id: 'sync-merge',
        title: 'Edit the same expense on two devices',
        teaser:
          'Go offline, change a field, and change one on the other device too. Different fields merge on their own; the same field asks you which to keep.',
      },
    },
    {
      slug: 'personal-code-assistant',
      title: 'Personal Code Assistant',
      blurb:
        "A coding assistant I'm training on my own code, using machine-learning models written from scratch, with Claude for the hard questions.",
      description: [
        'A coding assistant that learns from my own repositories. The machine-learning models (a tokenizer, an n-gram language model with Kneser-Ney smoothing, a small transformer, and code embeddings) are implemented from scratch and run locally at interactive speed, with no network and no API cost.',
        'One chat sits over both halves. A router decides each turn: the local models answer what they can, Claude answers the rest, and every answer Claude gives is folded into the local models on the next training run, so the local side covers more ground every week.',
        "It runs in the terminal, in the browser, or on my phone over home Wi-Fi by scanning a QR code, and the conversation lives on my machine so I can pick it up on any of them. It's still in progress: right now I'm tuning code completion against a held-out evaluation set.",
      ],
      period: 'Sep – Oct 2026',
      role: 'Solo',
      status: 'In progress',
      featured: false,
      tags: ['AI', 'Machine learning', 'Developer tool'],
      tech: ['TypeScript', 'Node.js', 'Claude API'],
      links: { repo: GH + 'personal-code-assistant' },
      cover: {
        src: 'images/code-assistant-cover.jpg',
        alt: 'Terminal: pca chat answering one question locally in 4 ms and routing a harder one to Claude',
      },
      gallery: [],
      highlights: [
        'Tokenizer, n-gram model, transformer and embeddings written from scratch',
        'Local answers in milliseconds, fully offline',
        "Learns from Claude's answers so the same question stays local next time",
      ],
    },
    {
      slug: 'bluffalo',
      title: 'Bluffalo',
      blurb:
        'A real-time multiplayer bluffing game: write a convincing fake answer, then spot the real one. 2–10 players, each on their own device.',
      description: [
        "Everyone gets the same statement with a word missing. You invent a lie that sounds like the truth, then try to pick the real answer out of everyone else's lies. Players join from their own phones with a four-letter room code: no install and no accounts.",
        "The server is the only source of truth. Clients send intents and get back a redacted view of the game: during the lie phase neither the answer nor anyone else's lie is in the payload, and answer ids are assigned after shuffling, so reading the WebSocket frames in devtools doesn't give the truth away. The rules engine is pure logic with an injected clock, so every timed rule is tested instantly.",
        'The client is plain ES modules with no build step and one runtime dependency. Reloading the page resumes the same seat, and the host role moves to another player if the host leaves.',
      ],
      period: 'Oct 2026',
      role: 'Solo',
      status: 'Complete',
      featured: false,
      tags: ['Game', 'Real-time'],
      tech: ['JavaScript', 'Node.js', 'WebSockets', 'node:test', 'Puppeteer'],
      links: { repo: GH + 'online-multiplayer-party-game' },
      cover: {
        src: 'images/bluffalo-cover.jpg',
        alt: 'Three phone screens: the home page with the rules, picking the true answer, and the round results',
      },
      gallery: [
        {
          src: 'images/bluffalo-game.jpg',
          alt: 'Two phone screens: writing a lie, and the final scoreboard',
          caption: 'Writing a lie, and the final scoreboard.',
        },
      ],
      highlights: [
        'Redacted game state: the answer never reaches a client early',
        '57 automated tests, including full games over real WebSockets',
        'A browser check plays a complete game across two real Chrome profiles',
        'Reconnect and host migration, up to 10 players per room',
      ],
    },
    {
      slug: 'pi-smart-home-hub',
      title: 'Pi Smart Home Hub',
      blurb:
        'A self-hosted hub on a Raspberry Pi that controls Nanoleaf panels, a TV, an Xbox, a PC, an Ecobee and a Ring doorbell from one dashboard.',
      description: [
        "One touch-friendly dashboard for every device in the house, with no vendor apps and no cloud relay for anything that can be controlled locally. It runs on a Raspberry Pi 4 as a systemd service and speaks each device's own protocol: Nanoleaf's local HTTP API, Roku ECP and ADB for the TV, SmartGlass to wake the Xbox, Wake-on-LAN for the PC, and the official APIs for Ecobee and Ring.",
        'Adapters declare capabilities (power, brightness, colour, thermostat, camera) rather than device types, and the dashboard builds its controls from that metadata, so a new adapter gets a working panel for free. Scenes chain commands across devices with delays, automations fire on events, schedules or thresholds, and state is pushed over a WebSocket so every screen stays in sync.',
        'Adapters never touch the network directly; everything goes through an injected transport. In demo mode that transport is a set of in-process device simulators running the exact same adapter code, so the whole hub works with no hardware, and the tests check the exact bytes each adapter sends.',
      ],
      period: 'Oct 2026',
      role: 'Solo',
      status: 'Complete',
      featured: false,
      tags: ['IoT', 'Full-stack'],
      tech: ['TypeScript', 'Node.js', 'React', 'WebSockets', 'Raspberry Pi', 'systemd'],
      links: { repo: GH + 'pi-smart-home-hub' },
      cover: {
        src: 'images/pi-hub-cover.jpg',
        alt: 'Home Hub dashboard on a tablet: scenes, rooms and device toggles',
      },
      gallery: [
        {
          src: 'images/pi-hub-device.jpg',
          alt: 'Nanoleaf device panel with colour swatches, brightness and white temperature',
          caption: 'The panel for the Nanoleaf lights: colour, brightness, white temperature and effects.',
        },
        {
          src: 'images/pi-hub-phone-settings.jpg',
          alt: 'The dashboard on a phone beside the settings page with hub status and automations',
          caption: 'On a phone, and the settings page: hub status, automations, and a scan of the LAN for devices.',
        },
      ],
      highlights: [
        'Six kinds of device, each over its own local protocol or official API',
        'Demo mode runs the real adapters against in-process simulators',
        'Scenes and automations triggered by events, cron schedules or thresholds',
        'Runs as a hardened systemd service under a non-root user',
      ],
    },
    {
      slug: 'field-reports',
      title: 'Field Reports',
      blurb:
        "An offline-first phone app for field inspections: read sites and file reports with no signal, and it syncs itself once you're back in range.",
      description: [
        'A phone front end for a field-service API: a list of sites, a detail screen for each, and one write action, filing a report. Reading and writing both work with no signal, and the status strip always says which is happening; "synced 2 min ago" only appears when a live read actually succeeded.',
        "Reports are written to a durable IndexedDB outbox before anything is sent, then delivered whenever possible: immediately, on reconnect, when the app returns to the foreground, on a retry timer, and through Background Sync. The client generates each report's id and the server treats it as an idempotency key, so retries can't create duplicates, and a report written at 9:00 but synced at 17:00 keeps its original time, so it can't overwrite newer state.",
        'Failures are handled by kind: a 4xx is parked as rejected, a 5xx backs off exponentially with jitter, and a dead network pauses the queue instead of burning through it. Every primary control sits in the bottom third of the screen for one-handed use.',
        "It has since moved into Claude Remote as one of its screens, with sites and reports in Supabase under row-level security, and its outbox now carries Claude Remote's jobs and messages too.",
      ],
      period: 'Nov 2026',
      role: 'Solo',
      status: 'Complete',
      featured: false,
      tags: ['Offline-first', 'PWA'],
      tech: ['TypeScript', 'React', 'IndexedDB', 'Service workers', 'Python', 'FastAPI'],
      links: { repo: GH + 'offline-sync-pwa' },
      cover: {
        src: 'images/field-reports-cover.jpg',
        alt: 'Three phone screens: the site list, a site with a report queued offline, and the outbox',
      },
      gallery: [
        {
          src: 'images/field-reports-sync.jpg',
          alt: 'Two phone screens: filing a report with no signal, and an empty outbox after syncing',
          caption: 'Filing a report with no signal, and the outbox after the queue drained on its own.',
        },
        {
          src: 'images/field-reports-claude-remote.jpg',
          alt: 'Three phone screens in Claude Remote: the site list, a site with a report not yet sent, and the outbox',
          caption: 'Field Reports today, as a screen inside Claude Remote: offline, with three things waiting to send.',
        },
      ],
      highlights: [
        'Idempotent writes: a replayed report returns the original instead of a duplicate',
        'ETag caching: an unchanged list costs a 304 and no body',
        '100 tests, including a check that every precached URL is actually served',
        'Outbox screen shows why each report is waiting, with retry and discard',
      ],
      demo: {
        id: 'outbox',
        title: 'File a report with no signal',
        teaser:
          'Cut the signal, break the server, lose a response. Reports wait, back off and retry, and none of them arrives twice.',
      },
    },
    {
      slug: 'daily-digest-bot',
      title: 'Daily Digest Bot',
      blurb:
        'Collects RSS feeds, APIs and scraped pages, removes duplicates, and posts one digest a day. Built so a broken source is never silent.',
      description: [
        'A bot that gathers items from the sources you configure (RSS feeds, JSON APIs and pages it scrapes), deduplicates them against everything it has already sent, and posts one digest a day to a chat channel. Everything it knows lives in one SQLite file.',
        'The design goal was that it can’t fail quietly. A source that errors is listed in a "Collection problems" section of the digest itself; a scraped page whose selector matches nothing is an error, not an empty result; a failed delivery returns its items to the queue and pings a separate alert channel; and a health check exits non-zero when no digest has gone out for too long, so an uptime monitor turns silence into an alert.',
        'A read-only React dashboard shows the hours since the last digest, per-source health and reliability, every digest exactly as it was posted, and the log.',
      ],
      period: 'Oct 2026',
      role: 'Solo',
      status: 'Complete',
      featured: false,
      tags: ['Automation'],
      tech: ['Python', 'SQLite', 'FastAPI', 'React', 'TypeScript', 'pytest'],
      links: { repo: GH + 'daily-digest-bot' },
      cover: {
        src: 'images/digest-bot-cover.jpg',
        alt: 'Dashboard overview: hours since the last digest, health checks and per-source cards',
      },
      gallery: [
        {
          src: 'images/digest-bot-history.jpg',
          alt: 'Digest history: a chart of items per day and a table of digests',
          caption: 'Digest history: items per day, and every digest as it was posted.',
        },
      ],
      highlights: [
        '188 tests with HTTP mocked: timeouts, DNS failures, revoked webhooks, redesigned pages',
        'Failed deliveries return their items to the queue, so nothing is lost',
        'A distinct exit code per failure, so cron and uptime monitors can tell them apart',
        'A one-command demo runs the whole lifecycle against a real local HTTP server',
      ],
    },
    {
      slug: 'github-project-index',
      title: 'GitHub Project Index',
      blurb:
        "A page listing every repository on a GitHub account, rebuilt from the GitHub API every Monday so it can't go stale.",
      description: [
        'One page that lists every project on a GitHub account: name, a one-line description, language, last push, and a live link where there is one. The data is read from the GitHub API at build time, and a GitHub Actions workflow rebuilds and redeploys the page every week.',
        "Most repositories have no description, so a standard-library Python script falls back to the first real paragraph of the README, skipping titles, badges and code. Live links come from the repository's homepage field or its GitHub Pages URL, and each one gets an HTTP check, so a dead link is dropped rather than published.",
        'Nothing is fetched in the browser: the data is inlined into the bundle, so there is no rate limit, no token on the client and no loading spinner. The page has search, language filters and a language-share bar whose legend doubles as the filter, with colours from a colourblind-checked palette.',
      ],
      period: 'Oct 2026',
      role: 'Solo',
      status: 'Complete',
      featured: false,
      tags: ['Automation', 'Web app'],
      tech: ['Python', 'React', 'TypeScript', 'Vite', 'GitHub Actions'],
      links: { repo: GH + 'github-project-index' },
      cover: {
        src: 'images/project-index-cover.jpg',
        alt: 'Project index in its light theme: summary stats, a language bar and the project list',
      },
      gallery: [
        {
          src: 'images/project-index-dark.jpg',
          alt: 'Project index in its dark theme',
          caption: 'The same page in its dark theme.',
        },
        {
          src: 'images/project-index-mobile.jpg',
          alt: 'The project index on a desktop and a phone side by side',
          caption: 'Desktop and phone layouts of the same build.',
        },
      ],
      highlights: [
        '100 tests: 67 for the page and 33 for the Python data step',
        'Falls back to the README when a repository has no description',
        'Checks every live link and drops dead ones before publishing',
        'Screenshots captured from the production build by a headless Chrome script',
      ],
    },
    {
      slug: 'necrotide',
      title: 'Necrotide: Last Stand',
      blurb:
        'A round-based zombie survival shooter for Roblox: 20 waves, 4 bosses and 12 upgradable weapons, tested headlessly without Roblox.',
      description: [
        'Hold the Ashvault against escalating waves of the undead: buy guns off the walls, gamble at the Fate Crate for a random weapon, forge upgrades, drink permanent buffs, nail the barricades back up and revive downed teammates. A boss arrives every five waves, ending with a three-phase final boss on wave 20, after which the game goes endless.',
        'Everything is original: the names, the lore, the balance numbers, and the map geometry, which is generated from code. There are no external asset IDs.',
        'Roblox can’t be scripted from CI, so the game verifies itself three ways: every file is parsed offline, a checker walks the built place file and resolves cross-module references, and a stub of the Roblox API runs the real game modules in a Lua VM, building the map, buying and forging a gun, downing and reviving a player, and phasing a boss.',
      ],
      period: 'Sep 2026',
      role: 'Solo',
      status: 'Complete',
      featured: false,
      tags: ['Game'],
      tech: ['Luau', 'Roblox', 'Rojo', 'Node.js'],
      links: { repo: GH + 'roblox-zombie-survival' },
      cover: { src: 'images/necrotide-cover.jpg', alt: 'Necrotide: Last Stand title card' },
      gallery: [],
      highlights: [
        'Runs the real game code headlessly in a Lua VM against a stub of the Roblox API',
        'Live sync: a pushed commit shows up in an open Roblox Studio session within seconds',
        '5 enemy types and 4 bosses with phase changes',
        'Map geometry generated from code and checked for reachability',
      ],
    },
    {
      slug: 'portfolio',
      title: 'This portfolio',
      blurb:
        "The site you're on: a hiring lens that retailors the page for a role, working models of four projects' hardest problems, and ⌘K search, all driven by one content file.",
      description: [
        'A React and TypeScript site where one file, src/data/site.ts, holds every word, project and screenshot, so adding a project never means touching a component. It builds to static files and is deployed to GitHub Pages by GitHub Actions on every push, after lint, the tests and a smoke test of the built output.',
        "Most of it is about the person reading it. Picking a role under “Hiring for” swaps in the projects that matter for that job and highlights the matching skills, and the choice lives in the URL, so a tailored view is a link I can send. Four projects carry a small working model of the problem they solve, built from that project's own rules and tested against them. ⌘K finds projects by the technology they use, and the All work page lists everything with a filter for each kind.",
        "The numbers in the hero are counted from the content rather than typed in, so they can't drift out of date, and the tests check that every image exists, every link is well-formed, and no project page shows the same screenshot twice.",
      ],
      period: 'Oct – Nov 2026',
      role: 'Solo',
      status: 'Live',
      featured: false,
      tags: ['Frontend', 'Web app'],
      tech: ['TypeScript', 'React', 'Vite', 'Tailwind CSS', 'React Router', 'Vitest', 'GitHub Actions'],
      links: { demo: 'https://motomoto2.github.io/personal-project-portfolio/', repo: GH + 'personal-project-portfolio' },
      cover: {
        src: 'images/portfolio-home.jpg',
        alt: 'The home page of this portfolio: name, headline, stats and a terminal of project events',
      },
      gallery: [
        {
          src: 'images/portfolio-index.jpg',
          alt: 'The All work page: filters, a list of every project, and a hovered project’s cover floating beside the pointer',
          caption: 'All work: every project with a filter for each kind. Hovering a row floats its cover beside the pointer.',
        },
        {
          src: 'images/portfolio-demo.jpg',
          alt: "The double-booking demo on Care Track's page, with the second booking refused by the exclusion constraint",
          caption: "One of the four demos: Care Track's exclusion constraint refusing an overlapping booking.",
        },
      ],
      highlights: [
        'Content, rendered pages and the demo models all under test, run by CI before every deploy',
        'Hiring lens: a tailored view of the page for each role, shareable as a link',
        'Working models of four projects’ hardest problems, built from their real rules',
        'Hero numbers derived from the content, so they never go stale',
      ],
    },
  ],

  photos: [],
}

/** Asset paths are resolved against the deploy base; see src/lib/assets.ts. */
export const site: SiteData = withAssetPaths(data)
