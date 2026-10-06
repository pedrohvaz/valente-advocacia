import type { ReactNode } from 'react'

/** Largura padrão de 80rem; passe uma classe `max-w-*` para uma coluna mais estreita (ex.: artigos). */
export function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  const width = /(^|\s)max-w-/.test(className) ? '' : 'max-w-7xl'
  return <div className={`mx-auto w-full px-5 sm:px-8 lg:px-10 ${width} ${className}`}>{children}</div>
}
