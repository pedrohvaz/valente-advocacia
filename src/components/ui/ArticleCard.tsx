import { findArea } from '../../data/areas'
import { articlePath, type Article } from '../../data/blog'
import { Icon } from './Icon'
import { to } from '../../lib/paths'

export const formatDate = (iso: string) =>
  new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(`${iso}T12:00:00Z`),
  )

/** Capa tipográfica (sem foto): mantém a identidade e carrega instantaneamente. */
export function ArticleCover({ article, large = false }: { article: Article; large?: boolean }) {
  const area = findArea(article.area)
  return (
    <div
      aria-hidden="true"
      className={`on-dark hero-bg relative flex flex-col justify-between overflow-hidden rounded-3xl bg-navy-950 text-white ${
        large ? 'aspect-[16/10] p-8 sm:p-10' : 'aspect-[16/10] p-6'
      }`}
    >
      <div className="pattern-lines absolute inset-0 opacity-80" />
      <div className="absolute -right-6 -bottom-10 font-accent text-[11rem] leading-none text-white/[0.05]">§</div>
      <div className="relative flex items-center justify-between">
        <span className="grid size-11 place-items-center rounded-xl bg-gold-500 text-navy-950">
          {area && <Icon name={area.icon} size={22} strokeWidth={1.3} />}
        </span>
        <span className="text-[0.68rem] font-semibold tracking-[0.22em] text-gold-500 uppercase">{area?.title}</span>
      </div>
      <p className={`relative font-display leading-tight tracking-[-0.03em] ${large ? 'text-3xl sm:text-4xl' : 'text-[1.4rem]'}`}>
        {article.title}
      </p>
    </div>
  )
}

export function ArticleCard({ article }: { article: Article }) {
  const area = findArea(article.area)
  return (
    <article className="group relative flex h-full flex-col">
      <div className="overflow-hidden rounded-3xl">
        <div className="transition-transform duration-700 ease-out group-hover:scale-[1.03]">
          <ArticleCover article={article} />
        </div>
      </div>
      <div className="flex flex-1 flex-col pt-6">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold tracking-[0.14em] text-muted uppercase">
          <span className="text-gold-700">{area?.title}</span>
          <span aria-hidden="true">·</span>
          <time dateTime={article.date}>{formatDate(article.date)}</time>
        </p>
        <h3 className="mt-3 font-display text-xl leading-snug tracking-[-0.025em] text-navy-950">
          <a href={to(articlePath(article))} className="after:absolute after:inset-0 hover:text-navy-800">
            {article.title}
          </a>
        </h3>
        <p className="mt-3 flex-1 leading-relaxed text-muted">{article.excerpt}</p>
        <p className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-navy-950">
          Ler artigo
          <Icon name="arrowRight" size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
          <span className="ml-2 font-normal text-muted">{article.readingMinutes} min de leitura</span>
        </p>
      </div>
    </article>
  )
}
