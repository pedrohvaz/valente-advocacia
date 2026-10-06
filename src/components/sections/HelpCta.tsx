import { site } from '../../config/site'
import { helpCta } from '../../data/content'
import { rich } from '../../lib/rich'
import { whatsappProps } from '../../lib/whatsapp'
import { Button } from '../ui/Button'
import { Container } from '../ui/Container'
import { Icon } from '../ui/Icon'
import { Reveal } from '../ui/Reveal'

/** Seção "Como podemos ajudar" — faixa de conversão para o WhatsApp. */
export function HelpCta() {
  const image = site.images.meeting
  return (
    <section aria-labelledby="ajuda-title" className="relative overflow-hidden bg-white">
      <Container className="relative grid items-center gap-14 py-20 sm:py-28 lg:grid-cols-12 lg:gap-20">
        <Reveal className={`${image ? 'lg:col-span-6 lg:order-2' : 'lg:col-span-8'}`}>
          <p className="eyebrow text-gold-700">Como podemos ajudar</p>
          <h2 id="ajuda-title" className="mt-4 font-display text-display-md text-balance text-navy-950">
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
            <div className="relative aspect-[4/3] overflow-hidden rounded-4xl">
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
            <div className="absolute -bottom-5 left-5 flex items-center gap-3 rounded-2xl bg-white p-3 pr-5 shadow-[0_20px_40px_-20px_rgba(11,19,43,0.45)] sm:left-8">
              <span className="grid size-10 place-items-center rounded-xl bg-[#15803D] text-white">
                <Icon name="whatsapp" size={20} />
              </span>
              <span className="text-sm">
                <span className="block font-semibold text-navy-950">Primeiro contato pelo WhatsApp</span>
                <span className="block text-muted">Atendimento presencial e online</span>
              </span>
            </div>
          </Reveal>
        )}
      </Container>
    </section>
  )
}
