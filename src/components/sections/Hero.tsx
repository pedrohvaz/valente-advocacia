import { oabLabel, site } from '../../config/site'
import { areaPath } from '../../data/areas'
import { hero, practiceAreas } from '../../data/content'
import { to } from '../../lib/paths'
import { rich } from '../../lib/rich'
import { whatsappProps } from '../../lib/whatsapp'
import { Button } from '../ui/Button'
import { Container } from '../ui/Container'
import { Icon } from '../ui/Icon'
import { Portrait } from '../ui/Portrait'

export function Hero() {
  const years = site.lawyer.stats[0]

  return (
    <section id="inicio" aria-labelledby="hero-title" className="hero-bg on-dark relative overflow-hidden bg-navy-950 text-white">
      <Container className="relative grid items-center gap-16 pt-32 pb-16 sm:pt-40 lg:grid-cols-12 lg:gap-10 lg:pt-44 lg:pb-24">
        <div className="lg:col-span-7">
          <p className="eyebrow hero-in text-gold-500">
            {hero.eyebrow}
            <span className="hidden sm:inline">
              {' '}
              · {site.location.city}/{site.location.stateCode}
            </span>
          </p>

          <h1 id="hero-title" className="hero-in mt-7 font-display text-display-xl text-balance [animation-delay:80ms]">
            {rich(hero.title)}
          </h1>

          <p className="hero-in mt-7 max-w-xl text-lg leading-relaxed text-pretty text-white/70 sm:text-xl [animation-delay:160ms]">
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

          <ul className="hero-in mt-12 flex flex-wrap gap-x-6 gap-y-3 [animation-delay:320ms]">
            {hero.highlights.map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-sm text-white/75">
                <span className="grid size-5 shrink-0 place-items-center rounded-full bg-gold-500/15 text-gold-500">
                  <Icon name="check" size={13} strokeWidth={2.2} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Foto em moldura arredondada com cartões flutuantes de vidro */}
        <div className="hero-in relative mx-auto w-full max-w-md lg:col-span-5 lg:max-w-none [animation-delay:200ms]">
          <div
            aria-hidden="true"
            className="absolute -inset-6 rounded-[3rem] bg-[radial-gradient(closest-side,rgb(201_162_39/0.25),transparent)] blur-2xl"
          />
          <div className="relative rounded-[2.25rem] border border-white/10 bg-white/5 p-2 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)]">
            <Portrait
              image={site.images.hero}
              placeholder="[FOTO PROFISSIONAL DO ADVOGADO]"
              sizes="(min-width: 1024px) 38vw, (min-width: 640px) 448px, 100vw"
              priority
              className="aspect-[4/5] rounded-[1.85rem]"
              imgClassName="object-[50%_18%]"
            />
          </div>

          {years && (
            <div className="glass absolute top-8 -left-3 rounded-2xl px-4 py-3 sm:-left-8">
              <span className="block font-display text-3xl leading-none font-semibold tracking-[-0.04em]">
                {years.value}
              </span>
              <span className="mt-1 block text-xs text-white/70">{years.label}</span>
            </div>
          )}

          <div className="glass absolute right-4 -bottom-6 left-4 flex items-center gap-3.5 rounded-2xl p-3 pr-5 sm:right-auto sm:-left-8 lg:-left-12">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-gold-500 text-navy-950">
              <Icon name="badge" size={21} strokeWidth={1.6} />
            </span>
            <span className="min-w-0">
              <span className="block truncate font-display text-base font-semibold">{site.lawyer.name}</span>
              <span className="mt-0.5 block text-xs text-white/65">Advogado · {oabLabel}</span>
            </span>
          </div>
        </div>
      </Container>

      {/* Áreas de atuação em pílulas */}
      <Container className="relative pb-14 lg:pb-20">
        <div className="hero-in flex flex-col gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center [animation-delay:380ms]">
          <span className="shrink-0 text-xs font-medium tracking-[0.16em] text-white/50 uppercase">Áreas de atuação</span>
          <ul className="flex flex-wrap gap-2">
            {practiceAreas.map((area) => (
              <li key={area.slug}>
                <a
                  href={to(areaPath(area))}
                  className="glass inline-flex min-h-10 items-center gap-2 rounded-full px-4 text-sm text-white/85 transition-colors hover:bg-white/15 hover:text-white"
                >
                  <Icon name={area.icon} size={15} className="text-gold-500" />
                  {area.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  )
}
