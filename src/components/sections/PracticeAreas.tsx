import { site } from '../../config/site'
import { areaPath, type PracticeArea } from '../../data/areas'
import { headings, practiceAreas } from '../../data/content'
import { to } from '../../lib/paths'
import { whatsappProps } from '../../lib/whatsapp'
import { Button } from '../ui/Button'
import { Container } from '../ui/Container'
import { Icon } from '../ui/Icon'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'

const pad = (n: number) => String(n).padStart(2, '0')

/** Cartão em destaque (primeira área): escuro, com foto e lista de serviços. */
function FeaturedCard({ area }: { area: PracticeArea }) {
  const bg = site.images.about
  return (
    <a
      href={to(areaPath(area))}
      className="group on-dark relative isolate flex h-full min-h-[26rem] flex-col justify-between overflow-hidden rounded-4xl bg-navy-950 p-7 text-white sm:p-9"
    >
      {bg && (
        <img
          src={bg.src}
          srcSet={bg.srcSet}
          sizes="(min-width: 1024px) 50vw, 100vw"
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-0 -z-20 h-full w-full object-cover opacity-40 transition-transform duration-700 ease-out group-hover:scale-105"
        />
      )}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-navy-950 via-navy-950/85 to-navy-950/30" />

      <div className="flex items-start justify-between">
        <span className="grid size-13 place-items-center rounded-2xl bg-gold-500 text-navy-950">
          <Icon name={area.icon} size={26} strokeWidth={1.4} />
        </span>
        <span className="glass rounded-full px-3 py-1 text-xs font-medium text-white/80">Mais procurada</span>
      </div>

      <div>
        <h3 className="font-display text-3xl tracking-[-0.03em] sm:text-4xl">{area.title}</h3>
        <p className="mt-3 max-w-md leading-relaxed text-white/75">{area.description}</p>
        <ul className="mt-6 flex flex-wrap gap-2">
          {area.services.map((s) => (
            <li key={s.title} className="glass rounded-full px-3 py-1.5 text-xs text-white/85">
              {s.title}
            </li>
          ))}
        </ul>
        <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-gold-500">
          Conhecer a área
          <Icon name="arrowRight" size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </div>
    </a>
  )
}

function AreaCard({ area, index }: { area: PracticeArea; index: number }) {
  return (
    <a href={to(areaPath(area))} className="group card card-hover flex h-full flex-col p-7">
      <div className="flex items-start justify-between">
        <span className="grid size-12 place-items-center rounded-2xl bg-mist text-navy-800 transition-colors duration-300 group-hover:bg-navy-950 group-hover:text-gold-500">
          <Icon name={area.icon} size={23} strokeWidth={1.5} />
        </span>
        <span className="font-accent text-2xl text-navy-950/25">{pad(index + 1)}</span>
      </div>
      <h3 className="mt-8 font-display text-[1.4rem] leading-tight tracking-[-0.03em] text-navy-950">{area.title}</h3>
      <p className="mt-2.5 flex-1 text-[0.95rem] leading-relaxed text-muted">{area.description}</p>
      <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-navy-950">
        Saiba mais
        <span className="grid size-7 place-items-center rounded-full bg-mist transition-[background-color,transform] duration-300 group-hover:translate-x-1 group-hover:bg-gold-500">
          <Icon name="arrowRight" size={14} />
        </span>
      </span>
    </a>
  )
}

export function PracticeAreas() {
  const [featured, ...rest] = practiceAreas

  return (
    <section id="areas" aria-labelledby="areas-title" className="section bg-mist">
      <Container>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading id="areas-title" {...headings.areas} />
          <Reveal className="shrink-0">
            <Button href={to('/agendar/')} variant="outline" iconRight="arrowRight">
              Agendar atendimento
            </Button>
          </Reveal>
        </div>

        {/* Grade bento: destaque 2x2 + quatro cartões */}
        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:grid-rows-2">
          {featured && (
            <Reveal as="li" className="sm:col-span-2 lg:row-span-2">
              <FeaturedCard area={featured} />
            </Reveal>
          )}
          {rest.map((area, i) => (
            <Reveal as="li" key={area.slug} delay={(i % 2) * 90 + 60}>
              <AreaCard area={area} index={i + 1} />
            </Reveal>
          ))}
        </ul>

        <Reveal className="mt-4">
          <div className="card flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
            <div className="flex items-center gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-gold-500/15 text-gold-700">
                <Icon name="message" size={21} />
              </span>
              <p className="text-navy-950">
                <span className="font-medium">Não encontrou a sua situação?</span>{' '}
                <span className="text-muted">Conte brevemente o seu caso e indicaremos se e como podemos ajudar.</span>
              </p>
            </div>
            <Button {...whatsappProps()} variant="primary" icon="whatsapp" className="shrink-0">
              Falar com um advogado
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
