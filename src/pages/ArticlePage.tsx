import { useState } from 'react'
import { oabLabel, site } from '../config/site'
import { areaPath, findArea } from '../data/areas'
import { sortedArticles, type Article, type Block } from '../data/blog'
import { ArticleCard, formatDate } from '../components/ui/ArticleCard'
import { Button } from '../components/ui/Button'
import { Container } from '../components/ui/Container'
import { Icon } from '../components/ui/Icon'
import { whatsappProps } from '../lib/whatsapp'
import { to } from '../lib/paths'

function renderBlock(block: Block, i: number) {
  switch (block.type) {
    case 'h2':
      return (
        <h2 key={i} className="mt-14 font-display text-[1.6rem] leading-tight tracking-[-0.035em] text-navy-950 sm:text-[1.9rem]">
          {block.text}
        </h2>
      )
    case 'p':
      return (
        <p key={i} className="mt-5 text-lg leading-[1.8] text-ink">
          {block.text}
        </p>
      )
    case 'ul':
      return (
        <ul key={i} className="mt-6 space-y-3">
          {block.items.map((item) => (
            <li key={item} className="flex gap-4 text-lg leading-relaxed text-ink">
              <span aria-hidden="true" className="mt-[0.8em] h-px w-5 shrink-0 bg-gold-500" />
              {item}
            </li>
          ))}
        </ul>
      )
    case 'quote':
      return (
        <blockquote key={i} className="my-12 rounded-3xl bg-mist px-7 py-8 sm:px-10">
          <p className="font-accent text-[1.75rem] leading-snug text-navy-950 sm:text-[2.1rem]">{block.text}</p>
        </blockquote>
      )
  }
}

function ShareLinks({ article }: { article: Article }) {
  const [copied, setCopied] = useState(false)
  const url = `${site.url}/blog/${article.slug}/`
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      /* área de transferência indisponível */
    }
  }
  const btn =
    'grid size-11 place-items-center rounded-full border border-navy-950/15 text-navy-950 transition-colors hover:border-navy-950 hover:bg-navy-950 hover:text-white'
  return (
    <div className="flex items-center gap-3">
      <span className="mr-1 text-sm font-semibold text-muted">Compartilhar</span>
      <a
        href={`https://wa.me/?text=${encodeURIComponent(`${article.title} ${url}`)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Compartilhar no WhatsApp"
        className={btn}
      >
        <Icon name="whatsapp" size={18} />
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Compartilhar no LinkedIn"
        className={btn}
      >
        <Icon name="linkedin" size={18} />
      </a>
      <button type="button" onClick={copy} aria-label="Copiar link do artigo" className={btn}>
        <Icon name={copied ? 'check' : 'link'} size={18} />
      </button>
      <span role="status" className="text-sm text-gold-700">
        {copied ? 'Link copiado' : ''}
      </span>
    </div>
  )
}

export function ArticlePage({ article }: { article: Article }) {
  const area = findArea(article.area)
  const others = sortedArticles().filter((a) => a.slug !== article.slug)
  const related = [...others.filter((a) => a.area === article.area), ...others.filter((a) => a.area !== article.area)].slice(0, 3)
  const hero = site.images.hero

  return (
    <>
      <header className="hero-bg on-dark relative overflow-hidden bg-navy-950 text-white">
        <Container className="relative max-w-3xl pt-32 pb-16 sm:pt-40 sm:pb-20">
          <nav aria-label="Trilha de navegação" className="hero-in">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-white/60">
              <li>
                <a href={to('/')} className="hover:text-white">Início</a>
              </li>
              <li aria-hidden="true" className="text-gold-500">/</li>
              <li>
                <a href={to('/blog/')} className="hover:text-white">Blog</a>
              </li>
              {area && (
                <>
                  <li aria-hidden="true" className="text-gold-500">/</li>
                  <li>
                    <a href={to(areaPath(area))} className="hover:text-white">{area.title}</a>
                  </li>
                </>
              )}
            </ol>
          </nav>
          <h1 className="hero-in mt-10 font-display text-display-lg text-balance [animation-delay:80ms]">{article.title}</h1>
          <p className="hero-in mt-6 text-lg leading-relaxed text-white/75 [animation-delay:140ms]">{article.excerpt}</p>
          <div className="hero-in mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/10 pt-6 text-sm text-white/70 [animation-delay:200ms]">
            <span className="flex items-center gap-3">
              {hero && (
                <img src={to('/images/advogado-hero-640.webp')} alt="" width={40} height={40} className="size-10 rounded-full object-cover object-[50%_15%]" />
              )}
              <span>
                Por <span className="font-semibold text-white">{site.lawyer.name}</span>
              </span>
            </span>
            <time dateTime={article.date}>{formatDate(article.date)}</time>
            <span>{article.readingMinutes} min de leitura</span>
          </div>
        </Container>
      </header>

      <article className="bg-white py-16 sm:py-24">
        <Container className="max-w-3xl">
          <div className="first-letter-drop">{article.body.map(renderBlock)}</div>

          <aside className="mt-14 flex gap-4 rounded-2xl bg-mist p-5 text-sm leading-relaxed text-muted">
            <Icon name="shield" size={20} className="mt-0.5 shrink-0 text-gold-700" />
            <p>
              Este conteúdo tem caráter exclusivamente informativo e não substitui a consulta a um advogado. Cada
              situação deve ser analisada individualmente.
            </p>
          </aside>

          <div className="mt-10 flex flex-col gap-6 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
            <ShareLinks article={article} />
            {area && (
              <a href={to(areaPath(area))} className="inline-flex items-center gap-2 text-sm font-semibold text-navy-950 hover:text-gold-700">
                Conheça a área de {area.title}
                <Icon name="arrowRight" size={16} />
              </a>
            )}
          </div>

          {/* Autor */}
          <div className="mt-12 flex flex-col gap-5 border-y border-line py-8 sm:flex-row sm:items-center">
            {hero && (
              <img
                src={to('/images/advogado-hero-640.webp')}
                alt={`Foto de ${site.lawyer.name}`}
                width={80}
                height={80}
                loading="lazy"
                className="size-20 shrink-0 rounded-full object-cover object-[50%_15%]"
              />
            )}
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] text-gold-700 uppercase">Sobre o autor</p>
              <p className="mt-1 font-display text-2xl text-navy-950">{site.lawyer.name}</p>
              <p className="mt-1 text-sm text-muted">
                Advogado · {oabLabel} · {site.officeName}
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="on-dark relative mt-12 overflow-hidden rounded-4xl bg-navy-950 p-8 text-white sm:p-10">
            <div aria-hidden="true" className="pattern-lines absolute inset-0 opacity-70" />
            <div className="relative">
              <p className="font-display text-3xl leading-tight">
                Tem uma dúvida sobre <em>{area?.title ?? 'este tema'}</em>?
              </p>
              <p className="mt-3 text-white/75">Conte brevemente a sua situação e receba uma orientação inicial.</p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Button
                  {...whatsappProps(`Olá! Li o artigo "${article.title}" e gostaria de tirar uma dúvida.`)}
                  variant="gold"
                  icon="whatsapp"
                >
                  Falar com um advogado
                </Button>
                <Button href={to(`/agendar/${area ? `?area=${area.slug}` : ''}`)} variant="outlineLight">
                  Agendar consulta
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </article>

      {related.length > 0 && (
        <section aria-labelledby="leia-tambem" className="section bg-mist">
          <Container>
            <p className="eyebrow text-gold-700">Continue lendo</p>
            <h2 id="leia-tambem" className="mt-4 font-display text-display-md text-navy-950">
              Leia <em>também</em>.
            </h2>
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
    </>
  )
}
