import { useState } from 'react'
import { findArea } from '../data/areas'
import { articlePath, sortedArticles } from '../data/blog'
import { ArticleCard, ArticleCover, formatDate } from '../components/ui/ArticleCard'
import { Container } from '../components/ui/Container'
import { Icon } from '../components/ui/Icon'
import { PageHero } from '../components/ui/PageHero'
import { Reveal } from '../components/ui/Reveal'
import { to } from '../lib/paths'

export function BlogPage() {
  const all = sortedArticles()
  const areaSlugs = [...new Set(all.map((a) => a.area))]
  const [filter, setFilter] = useState<string>('todos')
  const list = filter === 'todos' ? all : all.filter((a) => a.area === filter)
  const [featured, ...rest] = list
  const showFeatured = filter === 'todos' && featured

  return (
    <>
      <PageHero
        crumbs={[{ label: 'Início', href: '/' }, { label: 'Blog' }]}
        eyebrow="Blog jurídico"
        title="Conteúdo jurídico *sem complicação*."
        description={
          <p>
            Artigos informativos sobre dúvidas frequentes. O conteúdo tem caráter geral e não substitui a análise
            individual de cada caso.
          </p>
        }
      />

      <section aria-label="Artigos" className="section bg-white">
        <Container>
          {/* Filtro por área */}
          <div role="group" aria-label="Filtrar artigos por área" className="flex flex-wrap gap-2">
            {['todos', ...areaSlugs].map((slug) => {
              const active = filter === slug
              return (
                <button
                  key={slug}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFilter(slug)}
                  className={`min-h-11 rounded-full border px-5 text-sm font-semibold transition-colors ${
                    active
                      ? 'border-navy-950 bg-navy-950 text-white'
                      : 'border-navy-950/15 text-navy-950 hover:border-navy-950/40'
                  }`}
                >
                  {slug === 'todos' ? 'Todos' : findArea(slug)?.title}
                </button>
              )
            })}
          </div>

          {/* Destaque */}
          {showFeatured && (
            <Reveal className="mt-12">
              <article className="group relative grid items-center gap-8 lg:grid-cols-12 lg:gap-14">
                <div className="overflow-hidden lg:col-span-7">
                  <div className="transition-transform duration-700 ease-out group-hover:scale-[1.02]">
                    <ArticleCover article={featured} large />
                  </div>
                </div>
                <div className="lg:col-span-5">
                  <p className="text-xs font-semibold tracking-[0.14em] text-muted uppercase">
                    <span className="text-gold-700">Mais recente</span> · <time dateTime={featured.date}>{formatDate(featured.date)}</time>
                  </p>
                  <h2 className="mt-4 font-serif text-display-md text-balance text-navy-950">
                    <a href={to(articlePath(featured))} className="after:absolute after:inset-0">
                      {featured.title}
                    </a>
                  </h2>
                  <p className="mt-5 text-lg leading-relaxed text-muted">{featured.excerpt}</p>
                  <p className="mt-6 inline-flex items-center gap-2 font-semibold text-navy-950">
                    Ler artigo
                    <Icon name="arrowRight" size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </p>
                </div>
              </article>
            </Reveal>
          )}

          <ul
            aria-live="polite"
            className={`grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3 ${showFeatured ? 'mt-20 border-t border-line pt-16' : 'mt-12'}`}
          >
            {(showFeatured ? rest : list).map((article) => (
              <li key={article.slug}>
                <ArticleCard article={article} />
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  )
}
