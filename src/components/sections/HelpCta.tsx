import { site } from '../../config/site'
import { helpCta } from '../../data/content'
import { rich } from '../../lib/rich'
import { whatsappProps } from '../../lib/whatsapp'
import { Button } from '../ui/Button'
import { Container } from '../ui/Container'
import { Reveal } from '../ui/Reveal'

/** Seção "Como podemos ajudar" — faixa de conversão para o WhatsApp. */
export function HelpCta() {
  const image = site.images.meeting
  return (
    <section aria-labelledby="ajuda-title" className="relative overflow-hidden bg-white">
      <Container className="relative grid items-center gap-14 py-20 sm:py-28 lg:grid-cols-12 lg:gap-20">
        <Reveal className={`${image ? 'lg:col-span-6 lg:order-2' : 'lg:col-span-8'}`}>
          <p className="eyebrow text-gold-700">Como podemos ajudar</p>
          <h2 id="ajuda-title" className="mt-4 font-serif text-display-md text-balance text-navy-950">
            {rich(helpCta.title)}
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-pretty text-muted">{helpCta.text}</p>
          <div className="mt-9">
            <Button {...whatsappProps()} variant="primary" size="lg" icon="whatsapp" className="w-full sm:w-auto">
              Conversar pelo WhatsApp
            </Button>
            <p className="mt-4 flex items-center gap-2 text-sm text-muted">
              <span aria-hidden="true" className="h-px w-5 bg-gold-500" />
              {helpCta.disclaimer}
            </p>
          </div>
        </Reveal>

        {image && (
          <Reveal delay={120} className="relative lg:order-1 lg:col-span-6">
            <div aria-hidden="true" className="absolute -top-4 -left-4 hidden h-full w-full border border-gold-500/50 sm:block" />
            <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
              <img
                src={image.src}
                srcSet={image.srcSet}
                sizes="(min-width: 1024px) 45vw, 100vw"
                alt={image.alt}
                width={1080}
                height={810}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
              <div aria-hidden="true" className="absolute inset-0 bg-navy-950/15 mix-blend-multiply" />
            </div>
          </Reveal>
        )}
      </Container>
    </section>
  )
}
