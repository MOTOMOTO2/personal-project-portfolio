export type Social = {
  label: string
  href: string
  /** Key into the icon map in `src/lib/icons.tsx`. */
  icon: 'github' | 'linkedin' | 'mail' | 'globe' | 'twitter' | 'youtube' | 'instagram'
}

export type Profile = {
  name: string
  role: string
  tagline: string
  location: string
  /** Short paragraphs for the About section. */
  about: string[]
  avatar: string
  email: string
  /** Path to a PDF in `public/`, or null to hide the resume button. */
  resume: string | null
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

export type Project = {
  /** URL fragment for the detail page -- keep it lowercase and hyphenated. */
  slug: string
  title: string
  /** One-liner shown on the card. */
  blurb: string
  /** Paragraphs shown on the detail page. */
  description: string[]
  year: string
  role: string
  status: 'Shipped' | 'In progress' | 'Prototype' | 'Archived'
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
  projects: Project[]
  /** Free-form photo wall: build shots, event photos, whatever. */
  photos: Image[]
}
