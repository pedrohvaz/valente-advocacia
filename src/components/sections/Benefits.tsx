import { benefits, headings } from '../../data/content'
import { Container } from '../ui/Container'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'

const roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII']

export function Benefits() {
  return (
    <section
      id="diferenciais"
      aria-labelledby="diferenciais-title"
      className="section hero-bg relative overflow-hidden bg-navy-950 text-white"
    >
      <Container className="relative grid gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <SectionHeading id="diferenciais-title" tone="dark" {...headings.benefits} />
            <Reveal delay={120} className="mt-10 hidden lg:block">
              <span aria-hidden="true" className="block font-serif text-[9rem] leading-none text-white/[0.06]">
                §
              </span>
            </Reveal>
          </div>
        </div>

        <ol className="grid gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-2 lg:col-span-7">
          {benefits.map((b, i) => (
            <Reveal
              as="li"
              key={b.title}
              delay={i * 90}
              className="group relative flex flex-col bg-navy-950 p-8 transition-colors duration-500 hover:bg-navy-900 sm:p-10"
            >
              <span aria-hidden="true" className="font-serif text-5xl leading-none text-gold-500 italic">
                {roman[i]}
              </span>
              <span
                aria-hidden="true"
                className="mt-8 block h-px w-10 bg-gold-500/60 transition-[width] duration-500 group-hover:w-20"
              />
              <h3 className="mt-6 font-serif text-[1.65rem] leading-tight">{b.title}</h3>
              <p className="mt-3 leading-relaxed text-white/70">{b.description}</p>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  )
}
