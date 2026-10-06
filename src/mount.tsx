import { StrictMode, type ReactNode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'

/** Hidrata o HTML pré-renderizado (build) ou renderiza do zero (dev). */
export function mount(node: ReactNode) {
  const root = document.getElementById('root')!
  const tree = <StrictMode>{node}</StrictMode>
  if (root.hasChildNodes()) hydrateRoot(root, tree)
  else createRoot(root).render(tree)
}
