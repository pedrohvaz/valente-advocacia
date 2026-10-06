import { useId, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
import { areaPath } from '../../data/areas'
import { headings, practiceAreas } from '../../data/content'
import { whatsappProps } from '../../lib/whatsapp'
import { Button } from '../ui/Button'
import { Container } from '../ui/Container'
import { Icon } from '../ui/Icon'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'
import { to } from '../../lib/paths'

const pad = (n: number) => String(n).padStart(2, '0')

/**
 * Índice editorial das áreas de atuação (padrão "tabs" acessível).
 * Desktop: lista à esquerda + painel fixo à direita.
 * Mobile: o mesmo painel aparece logo abaixo da área selecionada (acordeão).
 */
export function PracticeAreas() {
  const [active, setActive] = useState(0)
  const uid = useId()
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const area = practiceAreas[active]
  const total = practiceAreas.length

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const keys: Record<string, number> = { ArrowDown: i + 1, ArrowUp: i - 1, Home: 0, End: total - 1 }
    if (!(e.key in keys)) return
    e.preventDefault()
    const next = (keys[e.key] + total) % total
    setActive(next)
    tabRefs.current[next]?.focus()
  }

  return (
    <section id="areas" aria-labelledby="areas-title" className="section bg-white">
      <Container>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading id="areas-title" {...headings.areas} />
          <Reveal className="shrink-0">
            <Button href="#contato" variant="outline" iconRight="arrowRight">
              Agendar atendimento
            </Button>
          </Reveal>
        </div>

        <Reveal
          delay={80}
          className="mt-14 grid border-t border-navy-950/15 lg:mt-20 lg:grid-cols-12 lg:gap-x-16"
          as="div"
        >
          <div
            role="tablist"
            aria-orientation="vertical"
            aria-label="Áreas de atuação"
            className="contents"
          >
            {practiceAreas.map((a, i) => {
              const selected = i === active
              return (
                <button
                  key={a.title}
                  ref={(el) => {
                    tabRefs.current[i] = el
                  }}
                  id={`${uid}-tab-${i}`}
                  role="tab"
                  type="button"
                  aria-selected={selected}
                  aria-controls={`${uid}-panel`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(i)}
                  onMouseEnter={() => window.matchMedia('(min-width: 1024px)').matches && setActive(i)}
                  onKeyDown={(e) => onKeyDown(e, i)}
                  style={{ order: i * 2 }}
                  className="group flex w-full items-center gap-5 border-b border-navy-950/15 py-6 text-left sm:gap-8 sm:py-7 lg:col-span-7 lg:col-start-1"
                >
                  <span
                    className={`w-7 shrink-0 font-serif text-base transition-colors duration-300 ${
                      selected ? 'text-gold-700' : 'text-navy-950/35'
                    }`}
                  >
                    {pad(i + 1)}
                  </span>
                  <span
                    className={`flex-1 font-serif text-[1.6rem] leading-tight transition-[color,transform] duration-500 ease-out sm:text-[2.6rem] ${
                      selected
                        ? 'text-navy-950 lg:translate-x-2'
                        : 'text-navy-950/80 group-hover:text-navy-950 lg:text-navy-950/35'
                    }`}
                  >
                    {a.title}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`grid size-11 shrink-0 place-items-center rounded-full border transition-[background-color,border-color,color,transform] duration-500 ${
                      selected
                        ? 'rotate-0 border-navy-950 bg-navy-950 text-gold-500 max-lg:rotate-90'
                        : '-rotate-45 border-navy-950/15 text-navy-950/60 group-hover:border-navy-950/40'
                    }`}
                  >
                    <Icon name="arrowRight" size={18} />
                  </span>
                </button>
              )
            })}
          </div>

          {/* Painel da área selecionada */}
          <div
            id={`${uid}-panel`}
            role="tabpanel"
            aria-labelledby={`${uid}-tab-${active}`}
            style={{ order: active * 2 + 1, '--rows': total } as CSSProperties}
            className="pt-2 pb-6 lg:col-span-5 lg:col-start-8 lg:[grid-row:1/span_var(--rows)] lg:pt-10 lg:pb-0"
          >
            <div className="on-dark relative overflow-hidden bg-navy-950 p-7 text-white sm:p-10 lg:sticky lg:top-28">
              <div aria-hidden="true" className="pattern-lines absolute inset-0 opacity-70" />
              <div key={active} className="panel-in relative">
                <div className="flex items-center justify-between">
                  <span className="grid size-14 place-items-center border border-gold-500/40 text-gold-500">
                    <Icon name={area.icon} size={28} strokeWidth={1.2} />
                  </span>
                  <span className="font-serif text-sm tracking-[0.2em] text-white/50">
                    {pad(active + 1)} / {pad(total)}
                  </span>
                </div>

                <h3 className="mt-8 font-serif text-3xl leading-tight sm:text-4xl">{area.title}</h3>
                <p className="mt-4 leading-relaxed text-white/75">{area.description}</p>

                <p className="mt-8 text-xs font-semibold tracking-[0.2em] text-gold-500 uppercase">Exemplos de atuação</p>
                <ul className="mt-4 divide-y divide-white/10 border-y border-white/10">
                  {area.services.map((service) => (
                    <li key={service.title} className="flex items-center gap-3 py-3 text-[0.95rem] text-white/85">
                      <span aria-hidden="true" className="h-px w-4 shrink-0 bg-gold-500" />
                      {service.title}
                    </li>
                  ))}
                </ul>

                <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                  <Button
                    {...whatsappProps(`Olá! Gostaria de obter informações sobre atendimento em ${area.title}.`)}
                    variant="gold"
                    icon="whatsapp"
                  >
                    Falar sobre o caso
                  </Button>
                  <a
                    href={to(areaPath(area))}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-white underline decoration-gold-500 decoration-1 underline-offset-[6px] hover:decoration-2"
                  >
                    Ver página da área
                    <Icon name="arrowRight" size={16} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between lg:max-w-[58%]">
          <p className="text-muted">
            Não encontrou a sua situação? Conte brevemente o seu caso e indicaremos se e como podemos ajudar.
          </p>
          <a
            {...whatsappProps()}
            className="inline-flex shrink-0 items-center gap-2 font-semibold text-navy-950 underline decoration-gold-500 decoration-1 underline-offset-[6px] hover:decoration-2"
          >
            Falar com um advogado
            <Icon name="arrowRight" size={16} />
          </a>
        </Reveal>
      </Container>
    </section>
  )
}
