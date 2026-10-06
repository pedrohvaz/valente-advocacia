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
          </div>
        </div>

        <ol className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
          {benefits.map((b, i) => (
            <Reveal
              as="li"
              key={b.title}
              delay={i * 90}
              className="glass group relative flex flex-col overflow-hidden rounded-3xl p-8 transition-[background-color,border-color,transform] duration-500 hover:-translate-y-1 hover:border-gold-500/30 hover:bg-white/[0.09] sm:p-9"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-16 -right-16 size-40 rounded-full bg-gold-500/0 blur-3xl transition-colors duration-700 group-hover:bg-gold-500/20"
              />
              <span aria-hidden="true" className="font-accent text-5xl leading-none text-gold-500">
                {roman[i]}
              </span>
              <h3 className="mt-10 font-display text-[1.4rem] leading-tight tracking-[-0.03em]">{b.title}</h3>
              <p className="mt-3 leading-relaxed text-white/70">{b.description}</p>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  )
}
