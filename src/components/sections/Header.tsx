import { useEffect, useRef, useState } from 'react'
import { site } from '../../config/site'
import { navItems } from '../../data/content'
import { useActiveSection } from '../../hooks/useActiveSection'
import { useScrolled } from '../../hooks/useScrolled'
import { whatsappProps } from '../../lib/whatsapp'
import type { Route } from '../../routes'
import { Button } from '../ui/Button'
import { Container } from '../ui/Container'
import { Icon } from '../ui/Icon'
import { Logo } from '../ui/Logo'
import { to } from '../../lib/paths'

const sectionIds = navItems.filter((item) => item.href.startsWith('#')).map((item) => item.href.slice(1))

export function Header({ route }: { route: Route }) {
  const isHome = route.kind === 'home'
  const scrolled = useScrolled()
  const activeSection = useActiveSection(sectionIds)

  /** Âncoras (#secao) apontam para a home quando estamos em outra página. */
  const resolve = (href: string) => to(href.startsWith('#') && !isHome ? (href === '#inicio' ? '/' : `/${href}`) : href)
  const isActive = (href: string) => {
    if (isHome) return href.startsWith('#') && activeSection === href.slice(1)
    if (href === '/blog/') return route.kind === 'blog' || route.kind === 'article'
    if (href === '#areas') return route.kind === 'area'
    return false
  }
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)

  // Menu mobile: trava a rolagem, fecha com Esc e mantém o foco dentro do header.
  useEffect(() => {
    if (!open) return
    document.documentElement.style.overflow = 'hidden'
    const header = wrapRef.current
    header?.querySelector<HTMLElement>('#mobile-menu a')?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
        return
      }
      if (e.key !== 'Tab' || !header) return
      const focusables = Array.from(
        header.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'),
      ).filter((el) => el.offsetParent !== null)
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    const onResize = () => window.innerWidth >= 1024 && setOpen(false)

    document.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize)
    return () => {
      document.documentElement.style.overflow = ''
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
    }
  }, [open])

  const solid = scrolled || open

  return (
    <div ref={wrapRef}>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,padding] duration-500 ease-out ${
          solid
            ? 'bg-navy-950/95 py-3 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.45)] backdrop-blur-md'
            : 'bg-transparent py-4 sm:py-6'
        }`}
      >
        <a
          href="#conteudo"
          className="sr-only z-50 bg-gold-500 px-4 py-2 font-semibold text-navy-950 focus:not-sr-only focus:absolute focus:top-3 focus:left-3"
        >
          Pular para o conteúdo
        </a>

        <Container className="flex items-center justify-between gap-4">
          <a href={isHome ? '#inicio' : to('/')} className="min-w-0 rounded-sm" onClick={() => setOpen(false)}>
            <Logo />
            <span className="sr-only"> — página inicial</span>
          </a>

          <nav aria-label="Navegação principal" className="hidden lg:block">
            <ul className="flex items-center gap-1 xl:gap-2">
              {navItems.map((item) => {
                const current = isActive(item.href)
                return (
                  <li key={item.href}>
                    <a
                      href={resolve(item.href)}
                      aria-current={current ? (item.href.startsWith('#') && isHome ? 'true' : 'page') : undefined}
                      className={`nav-link relative rounded-sm px-3 py-2 text-[0.85rem] font-medium transition-colors ${
                        current ? 'text-white' : 'text-white/70 hover:text-white'
                      }`}
                    >
                      {item.label}
                    </a>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <a
              href={to('/agendar/')}
              aria-current={route.kind === 'schedule' ? 'page' : undefined}
              className="mr-2 hidden items-center gap-2 text-[0.85rem] font-semibold text-white/85 transition-colors hover:text-gold-500 xl:inline-flex"
            >
              <Icon name="clock" size={17} />
              Agendar consulta
            </a>
            <div className="hidden lg:block">
              <Button {...whatsappProps()} variant="gold" icon="whatsapp">
                Falar com um advogado
              </Button>
            </div>

            <a
              {...whatsappProps()}
              aria-label="Falar com um advogado pelo WhatsApp"
              className="grid size-11 place-items-center rounded-full bg-gold-500 text-navy-950 transition-colors hover:bg-gold-400 lg:hidden"
            >
              <Icon name="whatsapp" size={22} />
            </a>

            <button
              ref={toggleRef}
              type="button"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Fechar menu' : 'Abrir menu'}
              onClick={() => setOpen((v) => !v)}
              className="grid size-11 place-items-center rounded-full text-white transition-colors hover:bg-white/10 lg:hidden"
            >
              <Icon name={open ? 'close' : 'menu'} size={24} />
            </button>
          </div>
        </Container>
      </header>

        {/* Menu mobile — fora do <header>: o backdrop-filter dele prenderia este painel fixed */}
        <div
          id="mobile-menu"
          hidden={!open}
          className="fixed inset-x-0 top-[68px] bottom-0 z-40 overflow-y-auto bg-navy-950 lg:hidden"
        >
          <Container className="flex min-h-full flex-col pt-6 pb-10">
            <nav aria-label="Navegação mobile">
              <ul className="divide-y divide-white/10 border-y border-white/10">
                {navItems.map((item, i) => (
                  <li key={item.href}>
                    <a
                      href={resolve(item.href)}
                      onClick={() => setOpen(false)}
                      className="menu-item flex items-center justify-between py-4 font-serif text-[1.65rem] text-white"
                      style={{ animationDelay: `${i * 40}ms` }}
                    >
                      {item.label}
                      <Icon name="arrowRight" size={20} className="text-gold-500" />
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="mt-auto space-y-3 pt-10">
              <Button {...whatsappProps()} variant="gold" size="lg" icon="whatsapp" className="w-full">
                Falar com um advogado
              </Button>
              <Button href={to('/agendar/')} variant="outlineLight" size="lg" className="w-full">
                Agendar consulta
              </Button>
              <dl className="mt-6 space-y-2 text-sm text-white/65">
                <div className="flex gap-2">
                  <dt className="sr-only">Horário</dt>
                  <dd>{site.contact.hours}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="sr-only">E-mail</dt>
                  <dd>{site.contact.email}</dd>
                </div>
              </dl>
            </div>
          </Container>
        </div>
    </div>
  )
}
