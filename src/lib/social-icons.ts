import { Globe, Mail } from 'lucide-react'
import type { SVGProps } from 'react'
import type { Social } from '../data/types'
import { GithubIcon, InstagramIcon, LinkedinIcon, XIcon, YoutubeIcon } from './icons'

export type IconComponent = (props: SVGProps<SVGSVGElement>) => React.ReactElement

/** Maps the `icon` key used in `src/data/site.ts` to a component. */
export const socialIcons: Record<Social['icon'], IconComponent> = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  twitter: XIcon,
  youtube: YoutubeIcon,
  instagram: InstagramIcon,
  mail: Mail as IconComponent,
  globe: Globe as IconComponent,
}
