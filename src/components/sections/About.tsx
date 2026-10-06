import { oabLabel, site } from '../../config/site'
import { about } from '../../data/content'
import { rich } from '../../lib/rich'
import { Button } from '../ui/Button'
import { Container } from '../ui/Container'
import { Icon, type IconName } from '../ui/Icon'
import { Portrait } from '../ui/Portrait'
import { Reveal } from '../ui/Reveal'

const facts: { icon: IconName; label: string; value: string }[] = [
  { icon: 'badge', label: 'OAB', value: oabLabel },
  { icon: 'pin', label: 'Localização', value: `${site.location.city}/${site.location.stateCode}` },
  { icon: 'globe', label: 'Atendimento', value: 'Presencial e Online' },
]

export function About() {
  return (
    <section id="sobre" aria-labelledby="sobre-title" className="section bg-mist">
      <Container className="grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
        <Reveal className="relative mx-auto w-full max-w-md lg:col-span-5 lg:max-w-none">
          <div aria-hidden="true" className="absolute -bottom-4 -left-4 hidden h-full w-full border border-gold-500/40 sm:block" />
          <Portrait
            image={site.images.about}
            placeholder="[FOTO DO ADVOGADO OU DO ESCRITÓRIO]"
            sizes="(min-width: 1024px) 38vw, (min-width: 640px) 448px, 100vw"
          />
          {site.lawyer.foundedYear && (
            <div className="absolute -right-3 -bottom-8 bg-navy-950 px-6 py-5 text-white shadow-[0_24px_50px_-24px_rgba(11,19,43,0.7)] sm:-right-8">
              <span className="block text-xs font-semibold tracking-[0.18em] text-white/70 uppercase">Desde</span>
              <span className="mt-1 block font-serif text-5xl leading-none text-gold-500">{site.lawyer.foundedYear}</span>
              <span className="mt-2 block text-xs text-white/70">
                em {site.location.city}/{site.location.stateCode}
              </span>
            </div>
          )}
        </Reveal>

        <div className="lg:col-span-7">
          <Reveal>
            <p className="eyebrow text-gold-700">{about.eyebrow}</p>
            <h2 id="sobre-title" className="mt-4 font-serif text-display-md text-balance text-navy-950">
              {rich(about.title)}
            </h2>
          </Reveal>

          <Reveal delay={100} className="mt-7 space-y-5 text-lg leading-relaxed text-pretty text-ink">
            {site.lawyer.bio.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </Reveal>

          {site.lawyer.stats.length > 0 && (
            <Reveal as="dl" delay={150} className="mt-10 grid grid-cols-3 gap-4 border-y border-navy-950/10 py-7">
              {site.lawyer.stats.map((stat) => (
                <div key={stat.label} className="flex flex-col-reverse justify-end">
                  <dt className="mt-1.5 text-xs leading-snug text-muted sm:text-sm">{stat.label}</dt>
                  <dd className="font-serif text-4xl leading-none text-navy-950 sm:text-5xl">{stat.value}</dd>
                </div>
              ))}
            </Reveal>
          )}

          <Reveal as="dl" delay={200} className="mt-8 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-3">
            {facts.map((fact) => (
              <div key={fact.label} className="flex items-center gap-4 bg-white p-5 sm:flex-col sm:items-start sm:gap-3">
                <Icon name={fact.icon} size={22} strokeWidth={1.4} className="shrink-0 text-gold-700" />
                <div className="min-w-0">
                  <dt className="text-xs font-semibold tracking-[0.16em] text-muted uppercase">{fact.label}</dt>
                  <dd className="mt-1 font-medium break-words text-navy-950">{fact.value}</dd>
                </div>
              </div>
            ))}
          </Reveal>

          <Reveal delay={240} className="mt-10">
            <Button href="#diferenciais" variant="primary" size="lg" iconRight="arrowRight">
              Conheça o escritório
            </Button>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
