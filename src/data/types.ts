export type Social = {
  label: string
  href: string
  /** Key into the icon map in `src/lib/social-icons.ts`. */
  icon: 'github' | 'linkedin' | 'mail' | 'globe' | 'twitter' | 'youtube' | 'instagram'
}

/** One labelled line in the hero's profile card, e.g. "Based in: Ontario". */
export type Fact = {
  label: string
  value: string
}

export type Profile = {
  name: string
  role: string
  tagline: string
  /** Short paragraphs for the About section. */
  about: string[]
  /** Lines in the profile card beside the hero. */
  facts: Fact[]
  email: string
  /** Path to a PDF in `public/`, or null to hide the résumé button. */
  resume: string | null
  /** Shown with a green dot above your name; null hides it. */
  availability: string | null
  socials: Social[]
}

export type SkillGroup = {
  name: string
  items: string[]
}

export type TimelineEntry = {
  period: string
  title: string
  org: string
  summary: string
}

export type Image = {
  src: string
  alt: string
  caption?: string
}

export type ProjectLinks = {
  demo?: string
  repo?: string
  writeup?: string
}

/**
 * - `Live`: deployed and running now.
 * - `In progress`: still being built (it may also be deployed).
 * - `Complete`: finished, but not hosted anywhere right now.
 */
export type ProjectStatus = 'Live' | 'In progress' | 'Complete'

export type Project = {
  /** URL fragment for the detail page -- keep it lowercase and hyphenated. */
  slug: string
  title: string
  /** One-liner shown on the card. */
  blurb: string
  /** Paragraphs shown on the detail page. */
  description: string[]
  /** When it was built, e.g. "Jan – Nov 2026". */
  period: string
  role: string
  status: ProjectStatus
  /** Featured projects get a large row in "Selected work"; the rest go in the grid below. */
  featured: boolean
  tags: string[]
  tech: string[]
  links: ProjectLinks
  cover: Image
  gallery: Image[]
  highlights: string[]
}

export type SiteData = {
  profile: Profile
  skills: SkillGroup[]
  timeline: TimelineEntry[]
  /** Shown in this order: featured first, then the rest. */
  projects: Project[]
  /** Free-form photo wall: build shots, event photos, whatever. */
  photos: Image[]
}
