/**
 * Caminhos internos com o prefixo de publicação.
 * Em domínio próprio o prefixo é '/'; no GitHub Pages é '/<repositorio>/'
 * (definido por BASE_PATH no build — ver vite.config.ts).
 */
export const BASE = import.meta.env.BASE_URL

/** '/blog/' → '/valente-advocacia/blog/' (âncoras e links externos ficam iguais). */
export function to(path: string) {
  if (!path.startsWith('/') || path.startsWith('//')) return path
  return BASE.replace(/\/$/, '') + path
}

/** Remove o prefixo de um pathname do navegador para encontrar a rota. */
export function stripBase(pathname: string) {
  return BASE !== '/' && pathname.startsWith(BASE) ? `/${pathname.slice(BASE.length)}` : pathname
}
