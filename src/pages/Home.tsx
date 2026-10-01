import { About } from '../components/About'
import { Contact } from '../components/Contact'
import { Gallery } from '../components/Gallery'
import { Hero } from '../components/Hero'
import { Projects } from '../components/Projects'
import { useReveal } from '../lib/reveal'

export function Home() {
  useReveal()

  return (
    <>
      <Hero />
      <Projects />
      <Gallery />
      <About />
      <Contact />
    </>
  )
}
