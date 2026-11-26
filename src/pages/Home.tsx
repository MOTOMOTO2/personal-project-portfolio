import { About } from '../components/About'
import { Contact } from '../components/Contact'
import { Gallery } from '../components/Gallery'
import { Hero } from '../components/Hero'
import { Projects } from '../components/Projects'
import { Telemetry } from '../components/Telemetry'
import { useLens } from '../lib/lens'
import { useReveal } from '../lib/reveal'

export function Home() {
  // A new hiring lens mounts different rows and cards; observe those too, or
  // they would stay at opacity 0.
  const { lens } = useLens()
  useReveal([lens?.id])

  return (
    <>
      <Hero />
      <Telemetry />
      <Projects />
      <Gallery />
      <About />
      <Contact />
    </>
  )
}
