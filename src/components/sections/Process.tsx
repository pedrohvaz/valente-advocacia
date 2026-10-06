import { headings, processSteps } from '../../data/content'
import { whatsappProps } from '../../lib/whatsapp'
import { Button } from '../ui/Button'
import { Container } from '../ui/Container'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'

export function Process() {
  return (
    <section id="processo" aria-labelledby="processo-title" className="section bg-mist">
      <Container>
        <SectionHeading id="processo-title" {...headings.process} />

        <div className="relative mt-14 lg:mt-20">
          {/* Linha da timeline: vertical no mobile, horizontal no desktop */}
          <span aria-hidden="true" className="absolute top-2 bottom-2 left-7 w-px bg-navy-950/15 lg:hidden" />
          <span aria-hidden="true" className="absolute top-7 right-0 left-0 hidden h-px bg-navy-950/15 lg:block" />

          <ol className="relative grid gap-10 lg:grid-cols-4 lg:gap-8">

          {processSteps.map((step, i) => (
            <Reveal as="li" key={step.title} delay={i * 110} className="relative flex gap-6 lg:block">
              <span className="relative z-10 grid size-14 shrink-0 place-items-center rounded-full border border-gold-500 bg-mist font-serif text-xl text-navy-950">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="pt-2 lg:pt-8 lg:pr-4">
                <h3 className="font-serif text-2xl leading-tight text-navy-950">{step.title}</h3>
                <p className="mt-3 leading-relaxed text-muted">{step.description}</p>
              </div>
            </Reveal>
          ))}
          </ol>
        </div>

        <Reveal className="mt-14 flex flex-col items-start gap-4 border-t border-navy-950/10 pt-10 sm:flex-row sm:items-center sm:justify-between lg:mt-20">
          <p className="font-serif text-2xl text-navy-950">O primeiro passo é uma conversa.</p>
          <Button {...whatsappProps()} variant="primary" icon="whatsapp">
            Falar com um advogado
          </Button>
        </Reveal>
      </Container>
    </section>
  )
}
