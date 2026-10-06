/**
 * ROTAS DO SITE
 * ------------------------------------------------------------------
 * Todas as páginas são geradas como HTML estático no build
 * (scripts/prerender.mjs) — cada uma com URL amigável e SEO próprio.
 * Para criar uma nova página de área ou artigo, basta adicioná-la em
 * src/data/areas.ts ou src/data/blog.ts.
 */
import { areaPath, practiceAreas, type PracticeArea } from './data/areas'
import { articlePath, articles, type Article } from './data/blog'
import { stripBase } from './lib/paths'

export type Route =
  | { kind: 'home'; path: '/' }
  | { kind: 'area'; path: string; area: PracticeArea }
  | { kind: 'blog'; path: '/blog/' }
  | { kind: 'article'; path: string; article: Article }
  | { kind: 'schedule'; path: '/agendar/' }
  | { kind: 'privacy'; path: '/privacidade/' }
  | { kind: 'notFound'; path: '/404/' }

export const routes: Route[] = [
  { kind: 'home', path: '/' },
  ...practiceAreas.map((area) => ({ kind: 'area' as const, path: areaPath(area), area })),
  { kind: 'blog', path: '/blog/' },
  ...articles.map((article) => ({ kind: 'article' as const, path: articlePath(article), article })),
  { kind: 'schedule', path: '/agendar/' },
  { kind: 'privacy', path: '/privacidade/' },
]

export const notFoundRoute: Route = { kind: 'notFound', path: '/404/' }

/** Normaliza o caminho (barra final, sem index.html) e encontra a rota. */
export function matchRoute(pathname: string): Route {
  let path = stripBase(pathname).replace(/index\.html$/, '')
  if (!path.endsWith('/')) path += '/'
  return routes.find((r) => r.path === path) ?? notFoundRoute
}
