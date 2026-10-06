import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App'
import { notFoundRoute, routes } from './routes'
import { headFor, robotsTxt, sitemapXml } from './seo'

/** Usado apenas no build (scripts/prerender.mjs) para gerar o HTML estático de cada página. */
export function render(path: string) {
  return renderToString(
    <StrictMode>
      <App path={path} />
    </StrictMode>,
  )
}

export const pages = [...routes, notFoundRoute].map((route) => ({
  path: route.path,
  head: headFor(route),
  notFound: route.kind === 'notFound',
}))

export const sitemap = () => sitemapXml(routes.map((r) => r.path))
export const robots = robotsTxt
