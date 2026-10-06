import { oabLabel, site } from '../config/site'
import { areaPath, practiceAreas, type PracticeArea } from '../data/areas'
import { sortedArticles } from '../data/blog'
import { FaqRow } from '../components/sections/FAQ'
import { FinalCta } from '../components/sections/FinalCta'
import { Process } from '../components/sections/Process'
import { ArticleCard } from '../components/ui/ArticleCard'
import { Button } from '../components/ui/Button'
import { Container } from '../components/ui/Container'
import { Icon, type IconName } from '../components/ui/Icon'
import { PageHero } from '../components/ui/PageHero'
import { Reveal } from '../components/ui/Reveal'
import { SectionHeading } from '../components/ui/SectionHeading'
import { whatsappProps } from '../lib/whatsapp'
import { to } from '../lib/paths'

const pad = (n: number) => String(n).padStart(2, '0')

export function AreaPage({ area }: { area: PracticeArea }) {
  const message = `Olá! Gostaria de obter informações sobre atendimento em ${area.title}.`
  const related = sortedArticles().filter((a) => a.area === area.slug)
  const others = practiceAreas.filter((a) => a.slug !== area.slug)
  const highlights: { icon: IconName; text: string }[] = [
    { icon: 'globe', text: 'Atendimento presencial e online' },
    { icon: 'userCheck', text: 'Análise individual de cada caso' },
    { icon: 'message', text: 'Comunicação clara em cada etapa' },
    { icon: 'badge', text: `${site.lawyer.name} · ${oabLabel}` },
  ]

  return (
    <>
      <PageHero
        crumbs={[{ label: 'Início', href: '/' }, { label: 'Áreas de atuação', href: '/#areas' }, { label: area.title }]}
        eyebrow={area.title}
        title={area.headline}
        description={<p>{area.description}</p>}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button {...whatsappProps(message)} variant="gold" size="lg" icon="whatsapp">
            Falar com um advogado
          </Button>
          <Button href={to(`/agendar/?area=${area.slug}`)} variant="outlineLight" size="lg" iconRight="arrowRight">
            Agendar consulta
          </Button>
        </div>
      </PageHero>

      {/* Introdução */}
      <section aria-label={`Sobre ${area.title}`} className="section bg-white">
        <Container className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-7">
            <p className="font-serif text-[1.65rem] leading-snug text-pretty text-navy-950 sm:text-3xl">{area.intro[0]}</p>
            {area.intro.slice(1).map((p) => (
              <p key={p} className="mt-6 text-lg leading-relaxed text-pretty text-ink">
                {p}
              </p>
            ))}
          </Reveal>

          <Reveal delay={100} as="aside" className="lg:col-span-5">
            <div className="border border-line bg-mist p-7 sm:p-9 lg:sticky lg:top-28">
              <p className="eyebrow text-gold-700">Como é o atendimento</p>
              <ul className="mt-6 space-y-4">
                {highlights.map((h) => (
                  <li key={h.text} className="flex items-center gap-4 text-navy-950">
                    <span className="grid size-10 shrink-0 place-items-center rounded-full border border-navy-950/10 bg-white text-gold-700">
                      <Icon name={h.icon} size={18} strokeWidth={1.5} />
                    </span>
                    {h.text}
                  </li>
                ))}
              </ul>
              <Button href={to(`/agendar/?area=${area.slug}`)} variant="primary" className="mt-8 w-full" iconRight="arrowRight">
                Agendar consulta
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Serviços */}
      <section aria-labelledby="servicos-title" className="section bg-mist">
        <Container>
          <SectionHeading
            id="servicos-title"
            eyebrow="Atuação"
            title={`Como podemos ajudar em *${area.title}*.`}
          />
          <ol className="mt-14 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:mt-16">
            {area.services.map((s, i) => (
              <Reveal as="li" key={s.title} delay={(i % 2) * 90} className="group bg-white p-8 sm:p-10">
                <span className="font-serif text-4xl text-gold-700 italic">{pad(i + 1)}</span>
                <span
                  aria-hidden="true"
                  className="mt-6 block h-px w-10 bg-gold-500 transition-[width] duration-500 group-hover:w-20"
                />
                <h3 className="mt-6 font-serif text-[1.65rem] leading-tight text-navy-950">{s.title}</h3>
                <p className="mt-3 leading-relaxed text-muted">{s.text}</p>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      <Process />

      {/* FAQ da área */}
      <section aria-labelledby="area-faq-title" className="section bg-white">
        <Container className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <SectionHeading id="area-faq-title" eyebrow="Perguntas frequentes" title={`Dúvidas sobre *${area.title}*.`} />
            <Reveal delay={120} className="mt-8">
              <a
                {...whatsappProps(message)}
                className="inline-flex items-center gap-2 font-semibold text-navy-950 underline decoration-gold-500 decoration-1 underline-offset-[6px] hover:decoration-2"
              >
                <Icon name="whatsapp" size={18} />
                Enviar minha dúvida
              </a>
            </Reveal>
          </div>
          <Reveal as="ul" delay={80} className="border-t border-navy-950/10 lg:col-span-8">
            {area.faq.map((item, i) => (
              <FaqRow key={item.question} {...item} defaultOpen={i === 0} />
            ))}
          </Reveal>
        </Container>
      </section>

      {/* Artigos relacionados */}
      {related.length > 0 && (
        <section aria-labelledby="relacionados-title" className="section bg-mist">
          <Container>
            <SectionHeading id="relacionados-title" eyebrow="Blog" title="Conteúdo *relacionado*." />
            <ul className="mt-12 grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
              {related.map((a) => (
                <li key={a.slug}>
                  <ArticleCard article={a} />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      {/* Outras áreas */}
      <nav aria-label="Outras áreas de atuação" className="border-t border-line bg-white py-14">
        <Container>
          <p className="eyebrow text-gold-700">Outras áreas de atuação</p>
          <ul className="mt-6 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {others.map((a) => (
              <li key={a.slug}>
                <a
                  href={to(areaPath(a))}
                  className="group flex h-full items-center justify-between gap-4 bg-white p-6 transition-colors hover:bg-mist"
                >
                  <span className="font-serif text-xl text-navy-950">{a.title}</span>
                  <Icon
                    name="arrowRight"
                    size={18}
                    className="shrink-0 text-gold-700 transition-transform duration-300 group-hover:translate-x-1"
                  />
                </a>
              </li>
            ))}
          </ul>
        </Container>
      </nav>

      <FinalCta />
    </>
  )
}
