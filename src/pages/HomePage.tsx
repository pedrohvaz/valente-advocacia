import { About } from '../components/sections/About'
import { Benefits } from '../components/sections/Benefits'
import { BlogPreview } from '../components/sections/BlogPreview'
import { Contact } from '../components/sections/Contact'
import { FAQ } from '../components/sections/FAQ'
import { FinalCta } from '../components/sections/FinalCta'
import { HelpCta } from '../components/sections/HelpCta'
import { Hero } from '../components/sections/Hero'
import { PracticeAreas } from '../components/sections/PracticeAreas'
import { Process } from '../components/sections/Process'
import { Testimonials } from '../components/sections/Testimonials'

export function HomePage() {
  return (
    <>
      <Hero />
      <PracticeAreas />
      <About />
      <Benefits />
      <HelpCta />
      <Process />
      <Testimonials />
      <BlogPreview />
      <FAQ />
      <FinalCta />
      <Contact />
    </>
  )
}
