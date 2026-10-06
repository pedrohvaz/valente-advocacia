import { headings, processSteps } from '../../data/content'
import { whatsappProps } from '../../lib/whatsapp'
import { Button } from '../ui/Button'
import { Container } from '../ui/Container'
import { Icon } from '../ui/Icon'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'

const pad = (n: number) => String(n).padStart(2, '0')

export function Process() {
  return (
    <section id="processo" aria-labelledby="processo-title" className="section bg-mist">
      <Container>
        <SectionHeading id="processo-title" {...headings.process} />

        <ol className="mt-14 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {processSteps.map((step, i) => (
            <Reveal as="li" key={step.title} delay={i * 100} className="card relative flex flex-col p-7">
              <div className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-full bg-navy-950 font-display text-sm font-semibold text-gold-500">
                  {pad(i + 1)}
                </span>
                {/* Conector entre etapas (desktop) */}
                {i < processSteps.length - 1 && (
                  <span aria-hidden="true" className="hidden h-px flex-1 bg-gradient-to-r from-navy-950/20 to-transparent lg:block" />
                )}
              </div>
              <h3 className="mt-8 font-display text-[1.3rem] leading-tight tracking-[-0.03em] text-navy-950">{step.title}</h3>
              <p className="mt-2.5 leading-relaxed text-muted">{step.description}</p>
            </Reveal>
          ))}
        </ol>

        <Reveal className="mt-4">
          <div className="on-dark flex flex-col items-start gap-5 rounded-3xl bg-navy-950 p-6 text-white sm:flex-row sm:items-center sm:justify-between sm:p-7">
            <p className="flex items-center gap-3 font-display text-xl tracking-[-0.02em]">
              <Icon name="message" size={22} className="shrink-0 text-gold-500" />
              <span>
                O primeiro passo é uma <em>conversa</em>.
              </span>
            </p>
            <Button {...whatsappProps()} variant="gold" icon="whatsapp">
              Falar com um advogado
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
