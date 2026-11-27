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
export const SOURCE_URL = 'https://github.com/adenyadegar/adenyadegar.github.io'

/**
 * Where the site lives. Link previews and canonical URLs are built from it
 * (scripts/route-pages.mjs, and the og: tags in index.html); change both if
 * the site moves, e.g. to a custom domain.
 */
export const SITE_URL = 'https://adenyadegar.github.io/'

const GH = 'https://github.com/adenyadegar/'

const data: SiteData = {
  profile: {
    name: 'Aden Yadegar',
    role: 'Software Engineering student · Full-stack developer',
    headline: "I build full-stack web apps and get them *online*. RevVault, my used-car search engine, has been live since January.",
    tagline:
      "I'm a software engineering student in Barrie, Ontario. I've been teaching myself to code since 2020, and these days I build full-stack apps.",
    about: [
      "I started teaching myself to code in 2020, during quarantine. I picked up Python, fell in love with it, and never really stopped. In high school I wrote autonomous and driver code for my VEX robotics team, and since then I've moved on to websites, apps and the projects on this page.",
      "Now I'm in my first year of Software Engineering at Lakehead University in Barrie, after a year of Computer Engineering at TMU. Most of my projects start with something that bugged me. I couldn't find parts for my project car, so I built RevVault. My course site kept missing deadlines, so I built a tracker that reads my syllabi for me.",
      "I like getting things all the way to live. RevVault has real sign-in, payments and error monitoring, and it redeploys itself every time I push. I also like building with other people. On Care Track I worked mostly on the backend with two other students, all through pull requests. I'm looking for an internship or co-op where I can keep learning on a bigger team.",
    ],
    facts: [
      { label: 'Based in', value: 'Barrie, Ontario' },
      { label: 'Studying', value: 'B.Eng. Software Engineering, Lakehead University (first year, to 2030)' },
      { label: 'Focus', value: 'Full-stack web, offline and real-time sync, AI tooling' },
      { label: 'Main languages', value: 'TypeScript, C#, Python, SQL' },
      { label: 'Speaks', value: 'English, Spanish (fluent), French (advanced)' },
    ],
    email: 'aden.yadegar21@gmail.com',
    resume: 'resume.pdf',
    availability: 'Open to internship and co-op roles',
    socials: [
      { label: 'GitHub', href: 'https://github.com/adenyadegar', icon: 'github' },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/adenyadegar', icon: 'linkedin' },
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
        "Backend work where the data has to stay right. A booking system that can't double-book, sync that merges edits safely, and a C# API that's been running in production since January.",
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
        "React and TypeScript apps that work well on phones, including ones that keep working offline, plus a 3D browser game with no image or model files.",
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
        "Projects that use Claude where it actually helps, like reading syllabus PDFs and running coding agents, and a code assistant with language models I wrote myself.",
      featured: ['course-deadline-tracker', 'claude-remote', 'personal-code-assistant'],
      skills: ['TypeScript', 'Python', 'Node.js', 'Claude API', 'Claude Code', 'Model Context Protocol (MCP)'],
    },
    {
      id: 'offline',
      label: 'Offline & real-time',
      pitch:
        "Apps that keep working without internet and catch up when it comes back, without losing or doubling anything. Plus a multiplayer game that runs live over WebSockets.",
      featured: ['tally', 'field-reports', 'claude-remote', 'bluffalo'],
      skills: ['TypeScript', 'React', 'PWAs & service workers', 'Node.js', 'FastAPI', 'PostgreSQL', 'SQLite', 'Supabase'],
    },
    {
      id: 'games',
      label: 'Games',
      pitch:
        "Three games, all made in code. A 3D zombie shooter in the browser, a party game you play on your phones, and a Roblox survival game.",
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
      title: "Get the tricky cases right",
      body: "Two people booking the same time slot, or two phones editing the same expense. I put rules like that in the database or the sync code, where timing can't break them, and write tests that try to.",
      proof: ['care-track', 'tally'],
    },
    {
      title: "Keep working offline",
      body: "If there's no signal, the app should save your work and send it later, and never send it twice. If something breaks, it should tell you instead of going quiet.",
      proof: ['field-reports', 'daily-digest-bot'],
    },
    {
      title: "Put it online",
      body: "Most of my projects are deployed with real sign-in, payments or scheduled jobs. RevVault runs its tests on every push and only deploys if they pass.",
      proof: ['revvault', 'course-deadline-tracker'],
    },
  ],

  timeline: [
    {
      period: '2025 – 2026',
      title: 'Computer Engineering',
      org: 'Toronto Metropolitan University',
      summary: 'One year. My credits transferred to Lakehead.',
    },
    {
      period: '2022 – now',
      title: 'Line cook',
      org: 'five Barrie-area kitchens',
      summary: 'From fine dining to high-volume service, alongside school.',
    },
  ],

  projects: [
    // ---- Featured: shown as large rows under "Selected work" ----------------
    {
      slug: 'revvault',
      title: 'RevVault',
      blurb: "Search Kijiji, AutoTrader and eBay for a used car in one go, then find parts for it from a dozen stores. Live at revvault.ca.",
      description: [
        "Shopping for a project car means running the same search on three sites and seeing the same car three times. RevVault searches Kijiji, AutoTrader and eBay together, shows each car once, and compares every price with similar cars for sale nearby. It also flags listings that mention a salvage title, an accident or odd mileage.",
        "It's still useful after you buy. You can keep a garage and build log for your cars, search for parts that fit your exact vehicle at stores like RockAuto, Amazon, Canadian Tire and eBay, and save parts to a wishlist. The wishlist gets re-checked on a schedule, so a price drop turns into an email.",
        "It's an ASP.NET Core 8 API with a React 19 frontend, packaged in Docker and deployed to Google Cloud Run by GitHub Actions on every push. I moved it there from Fly.io, and now it scales to zero when nobody's using it and fits in the free tier. Most sources are scraped or read from public JSON endpoints, so I built each one to fail quietly. If a site is down, that search just skips it, and an hourly health check emails me when a source stops returning results.",
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
      blurb: "Every deadline and grade for my term in one place, pulled from Brightspace and from my syllabus PDFs with Claude.",
      description: [
        "Brightspace only shows the deadlines an instructor typed into it. That usually means dropboxes and quizzes, but not lab dates, in-class tests or how much anything is worth. The rest is in the syllabus PDF. So this app subscribes to my Brightspace calendar, reads each syllabus with Claude (or a simpler parser when there's no API key), and merges the two. That way I see what Brightspace missed instead of a second copy of what it already had.",
        "It also reads each course's grading scheme, so every course page shows my marks so far, what's missing and my weighted grade. Reminders go out a week, three days, a day and three hours before anything graded, by phone notification, Discord or email. Everything can be exported as a calendar for Google, Apple or Outlook.",
        "I use it to study, too. Lecture slides I save from D2L are available to Claude through an MCP connector, so Claude can see when a test is, read the slides it covers and quiz me on them. I wrote the calendar parser and the Web Push encryption myself instead of pulling in libraries. It installs on a phone's home screen and runs on Fly.io.",
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
      blurb: "A phone app for running several Claude Code agents at once, on my desktop or in the cloud, and watching them work live.",
      description: [
        "Claude Remote is how I run AI coding agents from my phone. I type what I want built, pick how much effort it should use and whether the repo should be private, public or local, and an agent creates the repository, writes the code and pushes it. Its log streams back to my phone while it works.",
        "Jobs go into Supabase, and a runner on my desktop picks them up. If my desktop is off, a Vercel Function starts a cloud sandbox instead, so a job I queue from the bus still starts in seconds. I can run one to six agents at once, only one per project, and every waiting job says what it's waiting for.",
        "The same connection carries other things too, without opening any ports at home: questions to my own coding assistant on the desktop, and the lights and thermostat through my Raspberry Pi hub. The app is plain JavaScript with no build step, and row-level security in the database keeps each user's data separate. That's what makes it safe to ship a public Supabase key in the page.",
        "It also works with no signal. Jobs and messages are saved on the phone right away and sent when the connection comes back, and they can't be sent twice. That part came from Field Reports, which now lives inside Claude Remote.",
      ],
      period: 'Sep – Nov 2026',
      role: 'Solo',
      status: 'Live',
      featured: true,
      tags: ['AI', 'Full-stack', 'Real-time'],
      tech: ['JavaScript', 'Supabase', 'PostgreSQL', 'Vercel Functions', 'Vercel Sandbox', 'Claude Code', 'IndexedDB', 'PWA'],
      links: { repo: 'https://github.com/adenyadegar/claude-remote-dashboard' },
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
          "Set a limit, turn the desktop off, and queue a bunch of jobs. Each one that has to wait tells you why.",
      },
    },
    {
      slug: 'care-track',
      title: 'Care Track',
      blurb: "A clinic-booking app I'm building with two other students. Practitioners post open times and patients book them. I built a lot of the backend and its security testing.",
      description: [
        "Waits for scans and specialist appointments can take months, partly because booking still runs on old software. Care Track lets practitioners post their open times and lets patients find a slot and book it, with a dashboard on each side. Three of us are building it to get practice working on a shared codebase, loosely based on parts of healthcare platforms like PointClickCare.",
        "I worked mostly on the backend. I wrote the Drizzle schema, the first migration and the booking flow, which handles instant bookings and ones that need approval. I used a PostgreSQL exclusion constraint so double-booking is impossible at the database level, instead of relying on checks in the app code. I also added an append-only audit log that records every read and write of patient data and every role change.",
        "I built availability editing too (weekly hours, exceptions and slot length) and the emails: Mailpit locally, Resend in production, and an email whenever an appointment is requested, confirmed, declined, cancelled or rescheduled. A teammate and I wrote the daily reminder job together, and it sends each reminder exactly once.",
        "Before launch I built the admin side and then tried to break the app. Admins can change roles, disable accounts, verify practitioners and search the audit log. For the security pass I wrote a test for every server action that signs in as the wrong user and goes after someone else's data, and it only passes if the database is unchanged afterwards. It found two real gaps: some edits weren't being logged, and some account endpoints allowed password guessing outside the login rate limit. Both are fixed.",
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
          "Two patients hit Book at the same moment. See what happens with a simple check, a unique index, and the constraint Care Track actually uses.",
      },
    },

    // ---- More projects: shown in the grid --------------------------------
    {
      slug: 'retro-zombie-arena',
      title: 'Retro Zombie Arena',
      blurb: "A 90s-style zombie shooter that runs in the browser. Every texture, model and sound is made in code.",
      description: [
        "It's a wave-survival shooter inspired by Call of Duty: Zombies, with the speed of Doom and the look of an old PC game. It renders at a low resolution and scales up, with bloom, dithering and scanlines on top. You earn points for kills, buy your way through doors, roll the mystery box for a random gun, and buy perks and weapon upgrades.",
        "There's a story too. Four chapters on four maps (an asylum, a town, an ironworks and an underground lab) each have their own objective, boss and way out. Every map is regenerated from a new seed each time you play, and nothing on screen tells you where to go.",
        "The repo has no image, model or font files at all. Textures are painted onto canvases when the game loads, the guns are modelled in code from the measurements of real firearms, lighting is baked into vertex colours, and every sound effect and the music are made with the Web Audio API. The only recorded audio is the announcer, generated offline with an open-source text-to-speech model.",
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
      blurb: "An expense tracker that works offline. Changes wait on your phone, sync later, and it asks before overwriting anything.",
      description: [
        "Tally is an expense tracker you can install on your phone, and it keeps working with no connection. Every change is saved on the device first, so it shows up right away and survives the app closing. Syncing happens separately, whenever the network comes back.",
        "The sync is the interesting part. Each change remembers the last version the device saw, and the server keeps a log of changes for every field. That lets it tell two kinds of conflict apart. If two devices edited different fields of an expense, both changes are kept. If they edited the same field, the app shows both values and asks which one to keep. Retries are safe too, so a sync whose response got lost never gets applied twice.",
        "On top of that there are bank imports through Plaid (matched against expenses you typed in yourself), subscription detection, monthly budgets and push reminders. It runs on Vercel, with FastAPI as a serverless function and Supabase Postgres behind it.",
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
          "Go offline, change a field, then change one on the other device. Different fields merge by themselves, and the same field asks you which to keep.",
      },
    },
    {
      slug: 'personal-code-assistant',
      title: 'Personal Code Assistant',
      blurb: "A coding assistant I'm training on my own code, with machine-learning models I wrote from scratch and Claude for the hard questions.",
      description: [
        "A coding assistant that learns from my own repositories. I wrote the machine-learning models myself (a tokenizer, an n-gram language model with Kneser-Ney smoothing, a small transformer and code embeddings), and they run locally and fast, with no internet and no API costs.",
        "There's one chat for both halves. For each message, a router decides who answers: the local models take what they can and Claude takes the rest. Every answer Claude gives is then folded into the local models on the next training run, so the local side can handle more over time.",
        "I measure every change on files the models never trained on. On its own repo, the n-gram model guesses the next token right 52% of the time, and 77% of the time within its top five guesses. Fixing what those tests turned up took fully correct suggestions from 6.4% to 37%. They also show the transformer still losing to the n-gram after five minutes of training (29% against 52%), so it stays off by default for now.",
        "It runs in the terminal, in the browser, or on my phone over home Wi-Fi by scanning a QR code, and the conversation stays on my machine. It's still a work in progress.",
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
        '52% top-1 and 77% top-5 next-token accuracy on held-out files',
        'Evaluation-driven fixes took fully correct suggestions from 6.4% to 37%',
        'Local answers in milliseconds, fully offline',
        "Learns from Claude's answers so the same question stays local next time",
      ],
    },
    {
      slug: 'bluffalo',
      title: 'Bluffalo',
      blurb: "A multiplayer bluffing game. Write a fake answer that sounds real, then try to spot the real one. 2 to 10 players, each on their own phone.",
      description: [
        "Everyone gets the same fact with a word missing. You make up an answer that sounds true, then try to pick the real one out of everyone else's fakes. Players join from their own phones with a four-letter room code, and there's no app or account to set up.",
        "The server is the only one that knows the answer. Players send their moves and get back only what they're allowed to see, so even reading the WebSocket messages in devtools won't give the answer away. The game rules are plain logic with a fake clock, so I can test every timer instantly.",
        "The frontend is plain JavaScript with no build step. If you reload the page you get your seat back, and if the host leaves, someone else becomes host.",
      ],
      period: 'Oct 2026',
      role: 'Solo',
      status: 'Live',
      featured: false,
      tags: ['Game', 'Real-time'],
      tech: ['JavaScript', 'Node.js', 'WebSockets', 'node:test', 'Puppeteer'],
      links: { demo: 'https://bluffalo-party.fly.dev', repo: GH + 'online-multiplayer-party-game' },
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
      blurb: "A hub on a Raspberry Pi that controls Nanoleaf panels, a TV, an Xbox, a PC, an Ecobee and a Ring doorbell from one dashboard.",
      description: [
        "One dashboard for every device in the house, without the vendor apps, and without the cloud for anything that can be controlled locally. It runs on a Raspberry Pi 4 and talks to each device in its own language: Nanoleaf's local API, Roku and ADB for the TV, SmartGlass to wake the Xbox, Wake-on-LAN for the PC, and the official APIs for Ecobee and Ring.",
        "Each device adapter lists what it can do (power, brightness, colour, thermostat, camera), and the dashboard builds its controls from that, so a new device gets a working panel for free. Scenes run commands across devices with delays, automations trigger on events, schedules or thresholds, and every screen stays in sync over a WebSocket.",
        "Adapters never talk to the network directly. Everything goes through a transport layer, and in demo mode that layer is a set of fake devices running in the same process. So the whole hub works with no hardware, and the tests check the exact bytes each adapter sends.",
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
      blurb: "An offline-first phone app for field inspections. You can look up sites and file reports with no signal, and it syncs once you're back in range.",
      description: [
        "A phone app for a field-service API: a list of sites, a page for each one, and one thing you can do, which is file a report. Looking things up and filing both work with no signal, and a status bar always tells you which mode you're in. It only says \"synced 2 min ago\" if it really did sync then.",
        "Reports are saved to an outbox on the phone before anything is sent, then sent whenever possible: right away, when the connection comes back, when you reopen the app, on a retry timer, and through Background Sync. The phone creates each report's id and the server uses it to ignore repeats, so retries can't make duplicates. A report written at 9:00 but synced at 17:00 keeps its 9:00 time, so it can't overwrite anything newer.",
        "Different failures get handled differently. A 4xx error is set aside as rejected, a 5xx waits a bit longer before each retry, and when the network is down the queue pauses instead of burning through its retries. The main buttons are all in the bottom third of the screen so you can use it one-handed.",
        "It's since moved into Claude Remote as one of its screens, with its data in Supabase, and its outbox now sends Claude Remote's jobs and messages too.",
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
          "Turn off the signal, break the server, or lose a response. Reports wait and retry, and none of them shows up twice.",
      },
    },
    {
      slug: 'daily-digest-bot',
      title: 'Daily Digest Bot',
      blurb: "Collects RSS feeds, APIs and web pages, skips duplicates, and posts one digest a day. If a source breaks, it tells you.",
      description: [
        "A bot that collects from the sources you set up (RSS feeds, JSON APIs and pages it scrapes), skips anything it has already sent, and posts one digest a day to a chat channel. Everything it knows is in one SQLite file.",
        "My main goal was that it should never fail quietly. A source that breaks shows up in a \"Collection problems\" section of the digest. A scraped page that matches nothing counts as an error, not an empty result. A failed send puts its items back in the queue and pings a separate alert channel. And a health check fails when no digest has gone out for too long, so a monitoring tool can alert on it.",
        "There's also a read-only React dashboard that shows how long it's been since the last digest, how reliable each source is, every digest as it was posted, and the log.",
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
        '248 tests with HTTP mocked: timeouts, DNS failures, revoked webhooks, redesigned pages',
        'Failed deliveries return their items to the queue, so nothing is lost',
        'A distinct exit code per failure, so cron and uptime monitors can tell them apart',
        'A one-command demo runs the whole lifecycle against a real local HTTP server',
      ],
    },
    {
      slug: 'github-project-index',
      title: 'GitHub Project Index',
      blurb: "A page that lists every repo on a GitHub account. It rebuilds itself from the GitHub API every Monday, so it never goes out of date.",
      description: [
        "One page listing every project on a GitHub account, with its description, language, last update and a live link if it has one. The data comes from the GitHub API when the page is built, and a GitHub Actions workflow rebuilds and redeploys it every week.",
        "A lot of repos have no description, so a Python script falls back to the first real paragraph of the README, skipping titles, badges and code. Live links come from each repo's homepage or GitHub Pages URL, and every one gets checked first, so a dead link is dropped instead of published.",
        "Nothing loads in the browser. The data is built into the page, so there's no rate limit, no token and no loading spinner. You can search, filter by language, or click the language bar to filter, and its colours are checked to work for colourblind people.",
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
      blurb: "A zombie survival game for Roblox with 20 waves, 4 bosses and 12 upgradable weapons, tested without opening Roblox.",
      description: [
        "You hold the Ashvault against waves of zombies. Buy guns off the walls, try your luck at the Fate Crate for a random weapon, upgrade your guns, buy permanent buffs, rebuild barricades and revive teammates. A boss shows up every five waves, ending with a three-phase final boss on wave 20, and after that it goes endless.",
        "Everything is original, including the names, the story, the balance numbers and the map, which is generated from code. It doesn't use any outside assets.",
        "You can't run Roblox in CI, so the game checks itself three ways. Every file is parsed offline, a checker goes through the built place file and makes sure every reference between modules resolves, and a fake version of the Roblox API runs the real game code in a Lua VM. That last test builds the map, buys and upgrades a gun, downs and revives a player, and takes a boss through its phases.",
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
      blurb: "The site you're on. It has a WebGL background I wrote by hand that reacts to your cursor, a hiring filter that rearranges the page for a role, and small working demos of four projects.",
      description: [
        "The background on the home page is a shader I wrote in raw WebGL2. It draws contour lines that drift and bend around your cursor, uses the theme's colours, pauses when you scroll away, and turns itself down on slower computers. In Selected work, a screen on the right shows each project's screenshots as you scroll past it.",
        "Under the hood it's React and TypeScript, and every word, project and screenshot lives in one file, src/data/site.ts, so adding a project never means touching a component. It builds to static files, and GitHub Actions deploys it to GitHub Pages on every push once the linter, the tests and a check of the built site pass.",
        "I built a few things with recruiters in mind. Picking a role under \"Hiring for\" brings the most relevant projects to the top and highlights the matching skills, and the choice is saved in the link, so I can send someone a version of the page for their role. Four projects have a small working demo built from that project's real rules. ⌘K searches projects by the tech they use, and the All work page lists everything with filters.",
        "The numbers at the top are counted from the content instead of typed in, so they can't go out of date, and the tests check that every image exists, every link is valid and no project page repeats a screenshot.",
      ],
      period: 'Oct – Nov 2026',
      role: 'Solo',
      status: 'Live',
      featured: false,
      tags: ['Frontend', 'Web app'],
      tech: ['TypeScript', 'React', 'WebGL', 'Vite', 'Tailwind CSS', 'React Router', 'Vitest', 'GitHub Actions'],
      links: { demo: 'https://adenyadegar.github.io/', repo: GH + 'adenyadegar.github.io' },
      cover: {
        src: 'images/portfolio-home.jpg',
        alt: 'The home page of this portfolio: the name over a field of blue contour lines that bend around the cursor',
      },
      gallery: [
        {
          src: 'images/portfolio-work.jpg',
          alt: "Selected work: a project's write-up on the left and its screenshot on a pinned, tilting screen on the right",
          caption: 'Selected work: the project in the middle of the screen takes over the stage, with its screenshots cycling.',
        },
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
        'Hero shader written by hand in raw WebGL2, with no library, following the cursor',
        'Hiring lens: a tailored view of the page for each role, shareable as a link',
        'Working models of four projects’ hardest problems, built from their real rules',
        'Every page has its own link preview; CI deploys only after the tests pass',
      ],
    },
  ],

  photos: [],

  // Counts at https://adenyadegar.goatcounter.com (no cookies; see src/lib/analytics.ts).
  analytics: { goatcounter: 'adenyadegar' },
}

/** Asset paths are resolved against the deploy base; see src/lib/assets.ts. */
export const site: SiteData = withAssetPaths(data)
