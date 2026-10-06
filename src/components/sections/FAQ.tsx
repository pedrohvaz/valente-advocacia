import { useId, useState } from 'react'
import { faq, headings } from '../../data/content'
import { whatsappProps } from '../../lib/whatsapp'
import { Container } from '../ui/Container'
import { Icon } from '../ui/Icon'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'

export function FaqRow({ question, answer, defaultOpen }: { question: string; answer: string; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  const id = useId()

  return (
    <li className="border-b border-navy-950/10">
      <h3>
        <button
          type="button"
          id={`${id}-q`}
          aria-expanded={open}
          aria-controls={`${id}-a`}
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between gap-6 py-6 text-left font-serif text-xl leading-snug text-navy-950 transition-colors hover:text-navy-800 sm:text-[1.4rem]"
        >
          {question}
          <span
            aria-hidden="true"
            className={`grid size-9 shrink-0 place-items-center rounded-full border transition-[transform,background-color,border-color,color] duration-300 ${
              open ? 'rotate-45 border-navy-950 bg-navy-950 text-white' : 'border-navy-950/15 text-navy-950'
            }`}
          >
            <Icon name="plus" size={16} />
          </span>
        </button>
      </h3>
      <div
        id={`${id}-a`}
        role="region"
        aria-labelledby={`${id}-q`}
        className={`grid transition-[grid-template-rows,visibility] duration-300 ease-out ${
          open ? 'visible grid-rows-[1fr]' : 'invisible grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <p className="max-w-3xl pr-12 pb-7 leading-relaxed text-muted">{answer}</p>
        </div>
      </div>
    </li>
  )
}

export function FAQ() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="section bg-white">
      <Container className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <SectionHeading id="faq-title" {...headings.faq} />
            <Reveal delay={120} className="mt-8">
              <a
                {...whatsappProps('Olá! Tenho uma dúvida sobre atendimento jurídico.')}
                className="inline-flex items-center gap-2 font-semibold text-navy-950 underline decoration-gold-500 decoration-1 underline-offset-[6px] transition-[text-decoration-thickness] hover:decoration-2"
              >
                <Icon name="whatsapp" size={18} />
                Enviar minha dúvida
              </a>
            </Reveal>
          </div>
        </div>

        <Reveal as="ul" delay={80} className="border-t border-navy-950/10 lg:col-span-8">
          {faq.map((item, i) => (
            <FaqRow key={item.question} {...item} defaultOpen={i === 0} />
          ))}
        </Reveal>
      </Container>
    </section>
  )
}
