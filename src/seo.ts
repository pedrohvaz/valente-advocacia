/**
 * SEO por página: <title>, meta description, canonical, Open Graph,
 * Twitter e dados estruturados (JSON-LD). Usado apenas no build.
 */
import { faq } from './data/content'
import { areaPath, findArea } from './data/areas'
import { oabLabel, seoDescription, seoTitle, site } from './config/site'
import type { Route } from './routes'
import { BASE } from './lib/paths'

type Meta = {
  title: string
  description: string
  path: string
  type: 'website' | 'article'
  noindex?: boolean
  schema: object[]
}

const abs = (path: string) => `${site.url}${path}`

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const breadcrumb = (items: { name: string; path: string }[]) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: item.name,
    item: abs(item.path),
  })),
})

const organization = () => {
  const { location, contact, social, lawyer } = site
  const sameAs = [social.instagram, social.linkedin].filter(Boolean)
  return {
    '@type': 'LegalService',
    '@id': abs('/#escritorio'),
    name: site.officeName,
    description: seoDescription,
    url: abs('/'),
    image: abs(site.images.og),
    ...(site.images.logo ? { logo: abs(site.images.logo) } : {}),
    email: contact.email,
    ...(contact.whatsapp ? { telephone: `+${contact.whatsapp}` } : {}),
    address: {
      '@type': 'PostalAddress',
      streetAddress: location.street,
      addressLocality: location.city,
      addressRegion: location.stateCode,
      postalCode: location.postalCode,
      addressCountry: 'BR',
    },
    areaServed: { '@type': 'City', name: location.city },
    openingHours: contact.hoursSchema,
    ...(sameAs.length ? { sameAs } : {}),
    employee: { '@type': 'Person', name: lawyer.name, jobTitle: 'Advogado', identifier: oabLabel },
  }
}

const faqSchema = (items: { question: string; answer: string }[]) => ({
  '@type': 'FAQPage',
  mainEntity: items.map((q) => ({
    '@type': 'Question',
    name: q.question,
    acceptedAnswer: { '@type': 'Answer', text: q.answer },
  })),
})

export function metaFor(route: Route): Meta {
  const office = site.officeName
  switch (route.kind) {
    case 'home':
      return {
        title: seoTitle,
        description: seoDescription,
        path: '/',
        type: 'website',
        schema: [
          organization(),
          { '@type': 'WebSite', '@id': abs('/#site'), url: abs('/'), name: office, inLanguage: 'pt-BR' },
          faqSchema(faq),
        ],
      }
    case 'area': {
      const { area } = route
      return {
        title: `${area.title} em ${site.location.city}/${site.location.stateCode} | ${office}`,
        description: area.seoDescription,
        path: route.path,
        type: 'website',
        schema: [
          {
            '@type': 'Service',
            name: area.title,
            serviceType: area.title,
            description: area.seoDescription,
            provider: { '@id': abs('/#escritorio') },
            areaServed: { '@type': 'City', name: site.location.city },
          },
          faqSchema(area.faq),
          breadcrumb([
            { name: 'Início', path: '/' },
            { name: 'Áreas de atuação', path: '/#areas' },
            { name: area.title, path: route.path },
          ]),
        ],
      }
    }
    case 'blog':
      return {
        title: `Blog jurídico | ${office}`,
        description: `Artigos informativos sobre Direito Civil, Família, Trabalhista, Empresarial e do Consumidor, escritos por ${site.lawyer.name}.`,
        path: route.path,
        type: 'website',
        schema: [breadcrumb([{ name: 'Início', path: '/' }, { name: 'Blog', path: '/blog/' }])],
      }
    case 'article': {
      const { article } = route
      const area = findArea(article.area)
      return {
        title: `${article.title} | ${office}`,
        description: article.excerpt,
        path: route.path,
        type: 'article',
        schema: [
          {
            '@type': 'BlogPosting',
            headline: article.title,
            description: article.excerpt,
            datePublished: article.date,
            dateModified: article.date,
            inLanguage: 'pt-BR',
            mainEntityOfPage: abs(route.path),
            image: abs(site.images.og),
            author: { '@type': 'Person', name: site.lawyer.name },
            publisher: { '@id': abs('/#escritorio') },
            ...(area ? { about: area.title } : {}),
          },
          breadcrumb([
            { name: 'Início', path: '/' },
            { name: 'Blog', path: '/blog/' },
            ...(area ? [{ name: area.title, path: areaPath(area) }] : []),
            { name: article.title, path: route.path },
          ]),
        ],
      }
    }
    case 'schedule':
      return {
        title: `Agendar consulta | ${office}`,
        description: `Agende uma consulta jurídica presencial em ${site.location.city}/${site.location.stateCode} ou online. Escolha a área, o dia e o horário.`,
        path: route.path,
        type: 'website',
        schema: [breadcrumb([{ name: 'Início', path: '/' }, { name: 'Agendar consulta', path: route.path }])],
      }
    case 'privacy':
      return {
        title: `Política de Privacidade | ${office}`,
        description: `Como ${office} trata os dados pessoais recebidos pelo site, conforme a LGPD.`,
        path: route.path,
        type: 'website',
        schema: [],
      }
    case 'notFound':
      return {
        title: `Página não encontrada | ${office}`,
        description: 'A página procurada não existe ou foi movida.',
        path: route.path,
        type: 'website',
        noindex: true,
        schema: [],
      }
  }
}

/** Gera as tags do <head> de uma página. */
export function headFor(route: Route): string {
  const m = metaFor(route)
  const url = abs(m.path)
  const og = abs(site.images.og)
  const schema = m.schema.length
    ? `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': m.schema }).replace(/</g, '\\u003c')}</script>`
    : ''
  return [
    `<title>${esc(m.title)}</title>`,
    `<meta name="description" content="${esc(m.description)}" />`,
    m.noindex || !site.seo.indexable ? '<meta name="robots" content="noindex, nofollow" />' : '',
    m.noindex ? '' : `<link rel="canonical" href="${esc(url)}" />`,
    '<meta name="theme-color" content="#0B132B" />',
    '<meta name="format-detection" content="telephone=no" />',
    `<link rel="icon" href="${BASE}favicon.svg" type="image/svg+xml" />`,
    `<link rel="apple-touch-icon" href="${BASE}apple-touch-icon.png" />`,
    `<meta property="og:type" content="${m.type}" />`,
    '<meta property="og:locale" content="pt_BR" />',
    `<meta property="og:site_name" content="${esc(site.officeName)}" />`,
    `<meta property="og:title" content="${esc(m.title)}" />`,
    `<meta property="og:description" content="${esc(m.description)}" />`,
    `<meta property="og:url" content="${esc(url)}" />`,
    `<meta property="og:image" content="${esc(og)}" />`,
    '<meta property="og:image:width" content="1200" />',
    '<meta property="og:image:height" content="630" />',
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${esc(m.title)}" />`,
    `<meta name="twitter:description" content="${esc(m.description)}" />`,
    `<meta name="twitter:image" content="${esc(og)}" />`,
    `<meta name="geo.region" content="BR-${esc(site.location.stateCode)}" />`,
    `<meta name="geo.placename" content="${esc(site.location.city)}" />`,
    schema,
  ]
    .filter(Boolean)
    .join('\n    ')
}

export function sitemapXml(paths: string[]) {
  const today = new Date().toISOString().slice(0, 10)
  const urls = paths
    .map((p) => {
      const priority = p === '/' ? '1.0' : p.startsWith('/areas/') || p === '/agendar/' ? '0.8' : p === '/privacidade/' ? '0.3' : '0.6'
      return `  <url>\n    <loc>${abs(p)}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${priority}</priority>\n  </url>`
    })
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
}

/** Rastreamento liberado (para o buscador enxergar o noindex); sitemap só quando indexável. */
export const robotsTxt = () =>
  `User-agent: *\nAllow: /\n${site.seo.indexable ? `\nSitemap: ${abs('/sitemap.xml')}\n` : ''}`
