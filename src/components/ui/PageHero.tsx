import type { ReactNode } from 'react'
import { rich } from '../../lib/rich'
import { Container } from './Container'
import { to } from '../../lib/paths'

type Crumb = { label: string; href?: string }

type PageHeroProps = {
  crumbs: Crumb[]
  eyebrow?: string
  /** Use *asteriscos* para o itálico dourado. */
  title: string
  description?: ReactNode
  children?: ReactNode
}

/** Abertura das páginas internas (fundo escuro, trilha de navegação e título H1). */
export function PageHero({ crumbs, eyebrow, title, description, children }: PageHeroProps) {
  return (
    <section className="hero-bg on-dark relative overflow-hidden bg-navy-950 text-white">
      <Container className="relative pt-32 pb-16 sm:pt-40 sm:pb-20">
        <nav aria-label="Trilha de navegação" className="hero-in">
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-white/60">
            {crumbs.map((c, i) => (
              <li key={c.label} className="flex items-center gap-2">
                {i > 0 && <span aria-hidden="true" className="text-gold-500">/</span>}
                {c.href ? (
                  <a href={to(c.href)} className="transition-colors hover:text-white">
                    {c.label}
                  </a>
                ) : (
                  <span aria-current="page" className="text-white/85">
                    {c.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        {eyebrow && <p className="eyebrow hero-in mt-10 text-gold-500 [animation-delay:60ms]">{eyebrow}</p>}
        <h1 className={`hero-in max-w-4xl font-display text-display-lg text-balance [animation-delay:100ms] ${eyebrow ? 'mt-5' : 'mt-10'}`}>
          {rich(title)}
        </h1>
        {description && (
          <div className="hero-in mt-6 max-w-2xl text-lg leading-relaxed text-pretty text-white/75 [animation-delay:160ms]">
            {description}
          </div>
        )}
        {children && <div className="hero-in mt-10 [animation-delay:220ms]">{children}</div>}
      </Container>
    </section>
  )
}
