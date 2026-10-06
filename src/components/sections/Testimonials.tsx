import { useState } from 'react'
import { headings, testimonials } from '../../data/content'
import { Container } from '../ui/Container'
import { Icon } from '../ui/Icon'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'

const pad = (n: number) => String(n).padStart(2, '0')

/**
 * Um depoimento em destaque por vez, com navegação manual (sem autoplay).
 * Exibe somente os itens de `src/data/content.ts`; sem itens, a seção some.
 */
export function Testimonials() {
  const [index, setIndex] = useState(0)
  const total = testimonials.length
  if (total === 0) return null

  const go = (step: number) => setIndex((i) => (i + step + total) % total)
  const t = testimonials[index]

  return (
    <section
      id="depoimentos"
      aria-labelledby="depoimentos-title"
      className="section on-dark relative overflow-hidden bg-navy-950 text-white"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-10 right-[-2rem] font-accent text-[22rem] leading-none text-white/[0.04] select-none sm:-top-20 sm:text-[32rem]"
      >
        &ldquo;
      </span>

      <Container className="relative grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <SectionHeading id="depoimentos-title" tone="dark" {...headings.testimonials} />

          {total > 1 && (
            <Reveal delay={120} className="mt-10 flex items-center gap-5">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Depoimento anterior"
                className="grid size-12 place-items-center rounded-full border border-white/20 transition-colors hover:border-gold-500 hover:text-gold-500"
              >
                <Icon name="arrowRight" size={18} className="rotate-180" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Próximo depoimento"
                className="grid size-12 place-items-center rounded-full border border-white/20 transition-colors hover:border-gold-500 hover:text-gold-500"
              >
                <Icon name="arrowRight" size={18} />
              </button>
              <span className="font-display text-lg text-white/60" aria-hidden="true">
                <span className="text-white">{pad(index + 1)}</span> / {pad(total)}
              </span>
            </Reveal>
          )}
        </div>

        <Reveal delay={80} className="lg:col-span-8">
          <div
            role="group"
            aria-roledescription="carrossel"
            aria-label="Depoimentos de clientes"
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight') go(1)
              if (e.key === 'ArrowLeft') go(-1)
            }}
          >
            <figure
              key={index}
              aria-live="polite"
              aria-label={`Depoimento ${index + 1} de ${total}`}
              className="panel-in glass rounded-4xl p-7 sm:p-12"
            >
              <blockquote className="font-display text-[1.45rem] leading-[1.35] tracking-[-0.025em] text-pretty text-white sm:text-[1.9rem] lg:text-[2.1rem]">
                <p>
                  <em className="not-italic text-gold-500">&ldquo;</em>
                  {t.quote}
                  <em className="not-italic text-gold-500">&rdquo;</em>
                </p>
              </blockquote>
              <figcaption className="mt-10 flex items-center gap-4">
                <span aria-hidden="true" className="grid size-12 shrink-0 place-items-center rounded-full bg-gold-500 font-display text-sm font-semibold text-navy-950">
                  {t.author.replace(/[^A-ZÀ-Ú]/g, '').slice(0, 2)}
                </span>
                <span>
                  <span className="block font-semibold">{t.author}</span>
                  {t.context && <span className="mt-0.5 block text-sm text-white/60">{t.context}</span>}
                </span>
              </figcaption>
            </figure>

            {total > 1 && (
              <div className="mt-8 flex gap-2" aria-hidden="true">
                {testimonials.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 rounded-full transition-[width,background-color] duration-500 ${
                      i === index ? 'w-10 bg-gold-500' : 'w-4 bg-white/25'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
