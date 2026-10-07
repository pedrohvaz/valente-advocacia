import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { oabLabel, site } from '../config/site'
import { Icon, type IconName } from '../components/ui/Icon'
import { to } from '../lib/paths'
import { AdminProvider, useAdmin } from './store'
import { formatDoc } from './lib/legal'
import { go } from './ui'
import { AgendaPage } from './pages/AgendaPage'
import { CaseDetail, CasesPage } from './pages/CasesPage'
import { ClientDetail, ClientsPage } from './pages/ClientsPage'
import { Dashboard } from './pages/Dashboard'
import { DocumentsPage } from './pages/DocumentsPage'
import { FinancePage } from './pages/FinancePage'
import { LeadsPage } from './pages/LeadsPage'
import { SettingsPage } from './pages/SettingsPage'

const SESSION = 'valente-admin-session'

const nav: { path: string; label: string; icon: IconName }[] = [
  { path: '/', label: 'Visão geral', icon: 'grid' },
  { path: '/agenda', label: 'Agenda e prazos', icon: 'calendar' },
  { path: '/processos', label: 'Processos', icon: 'folder' },
  { path: '/clientes', label: 'Clientes', icon: 'users' },
  { path: '/contatos', label: 'Contatos', icon: 'inbox' },
  { path: '/financeiro', label: 'Financeiro', icon: 'wallet' },
  { path: '/documentos', label: 'Documentos', icon: 'contract' },
  { path: '/configuracoes', label: 'Configurações', icon: 'settings' },
]

function useHashPath() {
  const read = () => window.location.hash.replace(/^#/, '') || '/'
  const [path, setPath] = useState('/')
  useEffect(() => {
    const onChange = () => {
      setPath(read())
      document.getElementById('admin-main')?.focus({ preventScroll: true })
      window.scrollTo({ top: 0 })
    }
    setPath(read())
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return path
}

function Router({ path }: { path: string }) {
  const [, section, id] = path.split('?')[0].split('/')
  switch (section) {
    case '':
    case undefined:
      return <Dashboard />
    case 'agenda':
      return <AgendaPage />
    case 'processos':
      return id ? <CaseDetail id={id} /> : <CasesPage />
    case 'clientes':
      return id ? <ClientDetail id={id} /> : <ClientsPage />
    case 'contatos':
      return <LeadsPage />
    case 'financeiro':
      return <FinancePage />
    case 'documentos':
      return <DocumentsPage />
    case 'configuracoes':
      return <SettingsPage />
    default:
      return <Dashboard />
  }
}

/** Busca global por clientes (nome, CPF/CNPJ) e processos (número, título). */
function GlobalSearch() {
  const { data } = useAdmin()
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const results = useMemo(() => {
    const term = q.trim().toLowerCase()
    if (term.length < 2) return []
    const digits = term.replace(/\D/g, '')
    const clients = data.clients
      .filter((c) => c.name.toLowerCase().includes(term) || (digits.length >= 3 && c.doc.includes(digits)))
      .map((c) => ({ key: c.id, label: c.name, meta: c.doc ? formatDoc(c.doc) : 'Cliente', path: `/clientes/${c.id}`, icon: 'users' as IconName }))
    const cases = data.cases
      .filter((p) => p.title.toLowerCase().includes(term) || (digits.length >= 3 && p.number.replace(/\D/g, '').includes(digits)))
      .map((p) => ({ key: p.id, label: p.title, meta: p.number || 'Extrajudicial', path: `/processos/${p.id}`, icon: 'folder' as IconName }))
    return [...clients, ...cases].slice(0, 8)
  }, [q, data])

  const pick = (path: string) => {
    go(path)
    setQ('')
    setOpen(false)
    inputRef.current?.blur()
  }

  return (
    <div className="relative w-full max-w-md">
      <label htmlFor="admin-search" className="sr-only">
        Buscar clientes e processos
      </label>
      <Icon name="search" size={17} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted" />
      <input
        ref={inputRef}
        id="admin-search"
        type="search"
        autoComplete="off"
        placeholder="Buscar cliente, CPF ou nº do processo…"
        value={q}
        onChange={(e) => {
          setQ(e.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onKeyDown={(e) => e.key === 'Enter' && results[0] && pick(results[0].path)}
        className="min-h-10 w-full rounded-full border border-navy-950/10 bg-mist pr-14 pl-10 text-sm text-navy-950 placeholder:text-muted/70 focus:border-navy-950/30 focus:bg-white focus:outline-none"
      />
      <kbd className="pointer-events-none absolute top-1/2 right-3 hidden -translate-y-1/2 rounded-md border border-navy-950/10 bg-white px-1.5 text-[0.65rem] text-muted sm:block">
        Ctrl K
      </kbd>
      {open && q.trim().length >= 2 && (
        <ul role="listbox" aria-label="Resultados" className="absolute inset-x-0 top-12 z-30 overflow-hidden rounded-2xl border border-navy-950/10 bg-white p-1.5 shadow-xl">
          {results.length === 0 ? (
            <li className="px-3 py-3 text-sm text-muted">Nenhum resultado.</li>
          ) : (
            results.map((r) => (
              <li key={r.key} role="option" aria-selected="false">
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => pick(r.path)}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-mist"
                >
                  <Icon name={r.icon} size={16} className="shrink-0 text-muted" />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-navy-950">{r.label}</span>
                    <span className="block truncate text-xs text-muted">{r.meta}</span>
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  )
}

function Sidebar({ path, onNavigate }: { path: string; onNavigate?: () => void }) {
  const { data } = useAdmin()
  const newLeads = data.leads.filter((l) => l.stage === 'novo').length
  const section = `/${path.split('/')[1] ?? ''}`.replace(/\/$/, '') || '/'

  return (
    <nav aria-label="Menu do painel" className="flex h-full flex-col">
      <a href={to('/')} className="flex items-center gap-3 px-2 pb-6">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-gold-400 to-gold-500 font-accent text-2xl text-navy-950">§</span>
        <span className="min-w-0 leading-tight">
          <span className="block truncate font-display font-semibold text-white">{site.officeName}</span>
          <span className="block text-xs text-white/50">Painel do escritório</span>
        </span>
      </a>
      <ul className="space-y-1">
        {nav.map((item) => {
          const active = item.path === section || (item.path === '/' && section === '/')
          return (
            <li key={item.path}>
              <a
                href={`#${item.path}`}
                onClick={onNavigate}
                aria-current={active ? 'page' : undefined}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                  active ? 'bg-white/10 font-medium text-white' : 'text-white/65 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon name={item.icon} size={18} className={active ? 'text-gold-500' : ''} />
                {item.label}
                {item.path === '/contatos' && newLeads > 0 && (
                  <span className="ml-auto rounded-full bg-gold-500 px-2 py-0.5 text-[0.7rem] font-semibold text-navy-950">{newLeads}</span>
                )}
              </a>
            </li>
          )
        })}
      </ul>
      <div className="mt-auto space-y-3 pt-6">
        <div className="rounded-2xl bg-white/5 p-3.5 text-xs leading-relaxed text-white/60">
          <span className="mb-1 flex items-center gap-1.5 font-semibold text-gold-500">
            <Icon name="alert" size={14} /> Modo demonstração
          </span>
          Dados fictícios, salvos apenas neste navegador.
        </div>
        <a href={to('/')} className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-white/65 hover:bg-white/5 hover:text-white">
          <Icon name="globe" size={17} /> Ver site
        </a>
      </div>
    </nav>
  )
}

function Shell({ children, path, onLogout }: { children: ReactNode; path: string; onLogout: () => void }) {
  const { ready, inboxCount } = useAdmin()
  const [menu, setMenu] = useState(false)
  const [notice, setNotice] = useState(true)

  return (
    <div className="min-h-svh bg-mist">
      {/* Menu lateral (desktop) */}
      <aside className="hero-bg fixed inset-y-0 left-0 z-30 hidden w-64 bg-navy-950 p-4 lg:block">
        <Sidebar path={path} />
      </aside>

      {/* Menu recolhível (mobile) */}
      {menu && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button type="button" aria-label="Fechar menu" className="absolute inset-0 bg-navy-950/50" onClick={() => setMenu(false)} />
          <aside className="hero-bg absolute inset-y-0 left-0 w-72 max-w-[85vw] overflow-y-auto bg-navy-950 p-4">
            <Sidebar path={path} onNavigate={() => setMenu(false)} />
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-navy-950/[0.06] bg-mist/85 px-4 py-3 backdrop-blur-xl sm:px-6">
          <button
            type="button"
            onClick={() => setMenu(true)}
            aria-label="Abrir menu"
            className="grid size-10 shrink-0 place-items-center rounded-full border border-navy-950/10 bg-white lg:hidden"
          >
            <Icon name="menu" size={19} />
          </button>
          <GlobalSearch />
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden text-right text-sm leading-tight md:block">
              <span className="block font-medium text-navy-950">{site.lawyer.name}</span>
              <span className="block text-xs text-muted">{oabLabel}</span>
            </span>
            <img src={site.images.hero?.src.replace('-960', '-640')} alt="" className="size-10 shrink-0 rounded-full object-cover object-[50%_15%]" />
            <button
              type="button"
              onClick={onLogout}
              aria-label="Sair do painel"
              title="Sair"
              className="grid size-10 shrink-0 place-items-center rounded-full text-muted hover:bg-white hover:text-navy-950"
            >
              <Icon name="logout" size={18} />
            </button>
          </div>
        </header>

        <main id="admin-main" tabIndex={-1} className="mx-auto max-w-7xl px-4 py-6 outline-none sm:px-6 sm:py-8">
          {inboxCount > 0 && notice && (
            <div role="status" className="mb-6 flex items-center gap-3 rounded-2xl border border-gold-500/30 bg-gold-500/10 px-4 py-3 text-sm text-navy-950">
              <Icon name="inbox" size={18} className="shrink-0 text-gold-700" />
              <span className="flex-1">
                <strong>{inboxCount}</strong> {inboxCount === 1 ? 'novo contato chegou' : 'novos contatos chegaram'} pelo site.{' '}
                <a href="#/contatos" className="font-medium underline underline-offset-2">
                  Ver contatos
                </a>
              </span>
              <button type="button" aria-label="Dispensar aviso" onClick={() => setNotice(false)} className="text-muted hover:text-navy-950">
                <Icon name="close" size={16} />
              </button>
            </div>
          )}
          {ready ? children : <p className="py-20 text-center text-muted">Carregando painel…</p>}
        </main>
      </div>
    </div>
  )
}

function Login({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="hero-bg on-dark relative grid min-h-svh place-items-center overflow-hidden bg-navy-950 p-4 text-white">
      <div className="relative w-full max-w-md">
        <div className="glass rounded-4xl p-8 sm:p-10">
          <span className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-gold-400 to-gold-500 font-accent text-3xl text-navy-950">§</span>
          <h1 className="mt-6 font-display text-3xl font-semibold tracking-[-0.035em]">
            Painel do <em>escritório</em>
          </h1>
          <p className="mt-2 text-white/70">{site.officeName} · gestão de clientes, processos, prazos e honorários.</p>

          <div className="mt-8 rounded-2xl bg-white/5 p-4 text-sm leading-relaxed text-white/75">
            <p className="flex items-center gap-2 font-semibold text-gold-500">
              <Icon name="alert" size={16} /> Versão de demonstração
            </p>
            <p className="mt-1.5">
              Os dados são fictícios e ficam salvos apenas neste navegador. Fique à vontade para criar, editar e excluir registros —
              é possível restaurar os dados originais em Configurações.
            </p>
          </div>

          <button
            type="button"
            onClick={onEnter}
            autoFocus
            className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-gold-500 font-medium text-navy-950 shadow-[0_10px_30px_-12px_rgba(201,162,39,0.6)] transition-colors hover:bg-gold-400"
          >
            Entrar na demonstração
            <Icon name="arrowRight" size={18} />
          </button>
          <p className="mt-4 text-center text-xs text-white/50">
            Em produção, o acesso é protegido por login com verificação em duas etapas.
          </p>
        </div>
        <a href={to('/')} className="mt-6 flex items-center justify-center gap-2 text-sm text-white/60 hover:text-white">
          <Icon name="arrowRight" size={15} className="rotate-180" /> Voltar ao site
        </a>
      </div>
    </div>
  )
}

/** Raiz do painel em /admin/. Renderiza só no navegador (dados locais). */
export default function AdminApp() {
  const [mounted, setMounted] = useState(false)
  const [logged, setLogged] = useState(false)
  const path = useHashPath()

  useEffect(() => {
    try {
      setLogged(sessionStorage.getItem(SESSION) === '1')
    } catch {
      /* sessão indisponível: pede para entrar */
    }
    setMounted(true)
  }, [])

  if (!mounted) return <div className="min-h-svh bg-navy-950" />

  const enter = () => {
    try {
      sessionStorage.setItem(SESSION, '1')
    } catch {
      /* segue sem lembrar a sessão */
    }
    setLogged(true)
  }
  const leave = () => {
    try {
      sessionStorage.removeItem(SESSION)
    } catch {
      /* nada a limpar */
    }
    setLogged(false)
  }

  if (!logged) return <Login onEnter={enter} />

  return (
    <AdminProvider>
      <Shell path={path} onLogout={leave}>
        <Router path={path} />
      </Shell>
    </AdminProvider>
  )
}
