import { Fragment, type ReactNode } from 'react'

/**
 * Converte *trecho* em <em> — usado para o itálico de destaque nos títulos.
 * Ex.: 'Defesa jurídica *estratégica*' → Defesa jurídica <em>estratégica</em>
 */
export function rich(text: string): ReactNode {
  return text.split(/(\*[^*]+\*)/g).map((part, i) =>
    part.startsWith('*') && part.endsWith('*') ? <em key={i}>{part.slice(1, -1)}</em> : <Fragment key={i}>{part}</Fragment>,
  )
}

/** Remove os marcadores *…* (para textos fora do HTML, como SEO). */
export const plain = (text: string) => text.replace(/\*/g, '')
