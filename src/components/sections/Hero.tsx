import { oabLabel, site } from '../../config/site'
import { hero, practiceAreas } from '../../data/content'
import { rich } from '../../lib/rich'
import { whatsappProps } from '../../lib/whatsapp'
import { Button } from '../ui/Button'
import { Container } from '../ui/Container'
import { Icon } from '../ui/Icon'
import { Portrait } from '../ui/Portrait'

export function Hero() {
  return (
    <section id="inicio" aria-labelledby="hero-title" className="hero-bg on-dark relative overflow-hidden bg-navy-950 text-white">
      <div className="relative lg:flex lg:min-h-[min(100svh,58rem)] lg:items-center">
        <Container className="relative z-10 pt-32 sm:pt-40 lg:pt-36 lg:pb-28">
          <div className="max-w-2xl lg:w-[52%] lg:max-w-none xl:w-[50%]">
            <p className="eyebrow hero-in text-gold-500">
              <span>
                {hero.eyebrow}
                <span className="hidden sm:inline">
                  {' '}
                  · {site.location.city}/{site.location.stateCode}
                </span>
              </span>
            </p>

            <h1 id="hero-title" className="hero-in mt-6 font-serif text-display-xl text-balance [animation-delay:80ms]">
              {rich(hero.title)}
            </h1>

            <p className="hero-in mt-6 max-w-xl text-lg leading-relaxed text-pretty text-white/75 sm:text-xl [animation-delay:160ms]">
              {hero.subtitle}
            </p>

            <div className="hero-in mt-10 flex flex-col gap-3 sm:flex-row [animation-delay:240ms]">
              <Button {...whatsappProps()} variant="gold" size="lg" icon="whatsapp">
                Falar com um advogado
              </Button>
              <Button href="#areas" variant="outlineLight" size="lg" iconRight="arrowRight">
                Conheça nossa atuação
              </Button>
            </div>

            <ul className="hero-in mt-12 grid gap-x-8 gap-y-3 border-t border-white/10 pt-8 sm:grid-cols-3 [animation-delay:320ms]">
              {hero.highlights.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm leading-snug text-white/80">
                  <Icon name="check" size={18} className="mt-px shrink-0 text-gold-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Container>

        {/* Foto: em fluxo no mobile, sangrando à direita no desktop */}
        <div className="hero-in relative mx-5 mt-16 mb-24 sm:mx-auto sm:max-w-md lg:absolute lg:inset-y-0 lg:right-0 lg:m-0 lg:w-[44%] lg:max-w-none xl:w-[42%] [animation-delay:200ms]">
          <Portrait
            image={site.images.hero}
            placeholder="[FOTO PROFISSIONAL DO ADVOGADO]"
            sizes="(min-width: 1024px) 44vw, (min-width: 640px) 448px, 100vw"
            priority
            className="aspect-[4/5] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.7)] lg:aspect-auto lg:h-full lg:rounded-none lg:shadow-none"
            imgClassName="object-[50%_18%]"
          />
          {/* Fusão da foto com o fundo azul no desktop */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-navy-950 via-navy-950/25 to-transparent lg:block"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-1/3 bg-gradient-to-t from-navy-950/80 to-transparent lg:block"
          />

          <div className="absolute -bottom-8 left-4 right-4 flex items-center gap-4 bg-white px-5 py-4 text-navy-950 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.5)] sm:-left-8 sm:right-auto lg:bottom-20 lg:left-0 lg:-ml-10 lg:min-w-[19rem] xl:bottom-24">
            <span className="grid size-11 shrink-0 place-items-center bg-navy-950 text-gold-500">
              <Icon name="badge" size={22} />
            </span>
            <span className="min-w-0">
              <span className="block truncate font-serif text-xl leading-tight font-semibold">{site.lawyer.name}</span>
              <span className="mt-0.5 block text-xs font-medium tracking-wide text-muted">
                Advogado · {oabLabel}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Faixa com as áreas de atuação */}
      <div className="relative z-10 border-t border-white/10 bg-navy-950/60 backdrop-blur-sm">
        <Container className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 py-6 text-center lg:justify-between">
          {practiceAreas.map((area, i) => (
            <span key={area.title} className="flex items-center gap-8 font-serif text-lg text-white/75 sm:text-xl">
              {area.title}
              {i < practiceAreas.length - 1 && (
                <span aria-hidden="true" className="hidden size-1 rotate-45 bg-gold-500 lg:block" />
              )}
            </span>
          ))}
        </Container>
      </div>
    </section>
  )
}
