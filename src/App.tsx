import { lazy, Suspense, useEffect, useState } from 'react'
import { Footer } from './components/sections/Footer'
import { Header } from './components/sections/Header'
import { WhatsAppButton } from './components/sections/WhatsAppButton'
import { CookieBanner } from './components/ui/CookieBanner'
import { trackOutboundClicks } from './lib/analytics'
import { ConsentProvider } from './lib/consent'
import { AreaPage } from './pages/AreaPage'
import { ArticlePage } from './pages/ArticlePage'
import { BlogPage } from './pages/BlogPage'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { Privacy } from './pages/Privacy'
import { SchedulePage } from './pages/SchedulePage'
import { matchRoute, type Route } from './routes'
import { metaFor } from './seo'

// Painel carregado sob demanda: não pesa no site público.
const AdminApp = lazy(() => import('./admin/AdminApp'))

function Page({ route }: { route: Route }) {
  switch (route.kind) {
    case 'home':
      return <HomePage />
    case 'area':
      return <AreaPage area={route.area} />
    case 'blog':
      return <BlogPage />
    case 'article':
      return <ArticlePage article={route.article} />
    case 'schedule':
      return <SchedulePage />
    case 'privacy':
      return <Privacy />
    case 'notFound':
    case 'admin':
      return <NotFoundPage />
  }
}

/**
 * O painel só existe no navegador (dados locais): o HTML pré-renderizado
 * traz apenas o fundo, e o código do painel é baixado após a montagem.
 */
function AdminRoot() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const shell = <div className="min-h-svh bg-navy-950" />
  return mounted ? <Suspense fallback={shell}>{<AdminApp />}</Suspense> : shell
}

/** `path` vem de window.location no navegador e da lista de rotas no build. */
export default function App({ path }: { path: string }) {
  const route = matchRoute(path)

  useEffect(() => trackOutboundClicks(), [])

  // Em desenvolvimento não há HTML pré-renderizado: define o título da aba.
  useEffect(() => {
    if (import.meta.env.DEV) document.title = metaFor(route).title
  }, [route])

  if (route.kind === 'admin') return <AdminRoot />

  return (
    <ConsentProvider>
      <Header route={route} />
      <main id="conteudo" tabIndex={-1} className="outline-none">
        <Page route={route} />
      </main>
      <Footer isHome={route.kind === 'home'} />
      <WhatsAppButton />
      <CookieBanner />
    </ConsentProvider>
  )
}
