import { site } from '../../config/site'
import { finalCta } from '../../data/content'
import { rich } from '../../lib/rich'
import { whatsappProps } from '../../lib/whatsapp'
import { Button } from '../ui/Button'
import { Container } from '../ui/Container'
import { Reveal } from '../ui/Reveal'
import { to } from '../../lib/paths'

export function FinalCta() {
  const bg = site.images.ctaBackground
  return (
    <section aria-labelledby="cta-title" className="on-dark relative isolate overflow-hidden bg-navy-950 py-28 text-white sm:py-36">
      {bg && (
        <>
          <img
            src={bg.src}
            srcSet={bg.srcSet}
            sizes="100vw"
            alt=""
            width={1920}
            height={1080}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 -z-20 h-full w-full object-cover"
          />
          {/* Véu azul para garantir contraste do texto sobre a foto */}
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-navy-950/75" />
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgb(11_19_43/0.6)_75%)]"
          />
        </>
      )}
      <Container className="relative">
        <Reveal className="mx-auto max-w-3xl text-center">
          <span aria-hidden="true" className="mx-auto block h-12 w-px bg-gradient-to-b from-transparent to-gold-500" />
          <h2 id="cta-title" className="mt-8 font-serif text-display-lg text-balance">
            {rich(finalCta.title)}
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-pretty text-white/80">{finalCta.text}</p>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Button {...whatsappProps()} variant="gold" size="lg" icon="whatsapp">
              Falar com um advogado
            </Button>
            <Button href={to('/agendar/')} variant="outlineLight" size="lg">
              Agendar consulta
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
