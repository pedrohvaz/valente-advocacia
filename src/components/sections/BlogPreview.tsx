import { sortedArticles } from '../../data/blog'
import { Button } from '../ui/Button'
import { ArticleCard } from '../ui/ArticleCard'
import { Container } from '../ui/Container'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'
import { to } from '../../lib/paths'

/** Últimos artigos do blog na página inicial. */
export function BlogPreview() {
  const latest = sortedArticles().slice(0, 3)
  if (latest.length === 0) return null

  return (
    <section id="blog" aria-labelledby="blog-title" className="section bg-mist">
      <Container>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            id="blog-title"
            eyebrow="Blog jurídico"
            title="Informação clara para *decisões seguras*."
            description="Artigos objetivos sobre dúvidas frequentes, escritos para quem não é da área jurídica."
          />
          <Reveal className="shrink-0">
            <Button href={to('/blog/')} variant="outline" iconRight="arrowRight">
              Ver todos os artigos
            </Button>
          </Reveal>
        </div>

        <ul className="mt-14 grid gap-x-8 gap-y-14 md:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {latest.map((article, i) => (
            <Reveal as="li" key={article.slug} delay={i * 90}>
              <ArticleCard article={article} />
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  )
}
