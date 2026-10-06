import { site } from '../../config/site'
import { finalCta } from '../../data/content'
import { to } from '../../lib/paths'
import { rich } from '../../lib/rich'
import { whatsappProps } from '../../lib/whatsapp'
import { Button } from '../ui/Button'
import { Container } from '../ui/Container'
import { Reveal } from '../ui/Reveal'

/** Chamada final: painel arredondado com foto ao fundo. */
export function FinalCta() {
  const bg = site.images.ctaBackground
  return (
    <section aria-labelledby="cta-title" className="bg-white py-6 sm:py-10">
      <Container>
        <div className="on-dark hero-bg relative isolate overflow-hidden rounded-5xl bg-navy-950 px-6 py-24 text-white sm:py-32">
          {bg && (
            <>
              <img
                src={bg.src}
                srcSet={bg.srcSet}
                sizes="(min-width: 1280px) 1200px, 100vw"
                alt=""
                width={1920}
                height={1080}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 -z-20 h-full w-full object-cover"
              />
              {/* Véu azul para garantir contraste do texto sobre a foto */}
              <div aria-hidden="true" className="absolute inset-0 -z-10 bg-navy-950/80" />
            </>
          )}
          <Reveal className="relative mx-auto max-w-3xl text-center">
            <span className="eyebrow text-gold-500">Fale com o escritório</span>
            <h2 id="cta-title" className="mt-7 font-display text-display-lg text-balance">
              {rich(finalCta.title)}
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-pretty text-white/75">{finalCta.text}</p>
            <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
              <Button {...whatsappProps()} variant="gold" size="lg" icon="whatsapp">
                Falar com um advogado
              </Button>
              <Button href={to('/agendar/')} variant="outlineLight" size="lg">
                Agendar consulta
              </Button>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
