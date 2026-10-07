import { oabLabel, site } from '../../config/site'
import { areaPath, practiceAreas } from '../../data/areas'
import { useConsent } from '../../lib/consent'
import { whatsappProps } from '../../lib/whatsapp'
import { Container } from '../ui/Container'
import { Icon } from '../ui/Icon'
import { Logo } from '../ui/Logo'
import { to } from '../../lib/paths'

/** Em páginas internas, as âncoras apontam para a home (ex.: /#sobre). */
export function Footer({ isHome = false }: { isHome?: boolean }) {
  const { openSettings } = useConsent()
  const base = isHome ? '' : '/'
  const links = [
    { label: 'Início', href: isHome ? '#inicio' : '/' },
    { label: 'Sobre', href: `${base}#sobre` },
    { label: 'Blog', href: '/blog/' },
    { label: 'Agendar consulta', href: '/agendar/' },
    { label: 'Contato', href: `${base}#contato` },
    { label: 'Política de Privacidade', href: '/privacidade/' },
  ]
  const socials = [
    { label: 'Instagram', href: site.social.instagram, icon: 'instagram' as const },
    { label: 'LinkedIn', href: site.social.linkedin, icon: 'linkedin' as const },
  ]

  return (
    <footer className="bg-navy-950 pt-20 pb-28 text-white/70 sm:pb-10">
      <Container>
        <div className="grid gap-12 border-b border-white/10 pb-14 sm:grid-cols-2 lg:grid-cols-12">
          <div className="sm:col-span-2 lg:col-span-4">
            <a href={isHome ? '#inicio' : to('/')} className="inline-flex max-w-full rounded-xl">
              <Logo />
              <span className="sr-only"> — voltar ao início</span>
            </a>
            <p className="mt-6 max-w-sm font-display text-xl leading-snug text-white">{site.tagline}</p>
            <div className="mt-7 flex gap-3">
              {socials.map((s) =>
                s.href ? (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${s.label} do escritório`}
                    className="grid size-11 place-items-center rounded-full border border-white/15 text-white transition-colors hover:border-gold-500 hover:text-gold-500"
                  >
                    <Icon name={s.icon} size={19} />
                  </a>
                ) : (
                  // Placeholder visível até o link real ser configurado em src/config/site.ts
                  <span
                    key={s.label}
                    title={`[${s.label.toUpperCase()}] — configure o link em src/config/site.ts`}
                    className="grid size-11 place-items-center rounded-full border border-dashed border-white/15 text-white/40"
                  >
                    <Icon name={s.icon} size={19} />
                    <span className="sr-only">{s.label} (link não configurado)</span>
                  </span>
                ),
              )}
            </div>
          </div>

          <nav aria-label="Links do rodapé" className="lg:col-span-2">
            <p className="text-xs font-semibold tracking-[0.2em] text-gold-500 uppercase">Navegação</p>
            <ul className="mt-5 space-y-3">
              {links.map((l) => (
                <li key={l.label}>
                  <a href={to(l.href)} className="transition-colors hover:text-white">
                    {l.label}
                  </a>
                </li>
              ))}
              <li>
                <button type="button" onClick={openSettings} className="text-left transition-colors hover:text-white">
                  Preferências de cookies
                </button>
              </li>
            </ul>
          </nav>

          <nav aria-label="Áreas de atuação" className="lg:col-span-3">
            <p className="text-xs font-semibold tracking-[0.2em] text-gold-500 uppercase">Áreas de atuação</p>
            <ul className="mt-5 space-y-3">
              {practiceAreas.map((a) => (
                <li key={a.slug}>
                  <a href={to(areaPath(a))} className="transition-colors hover:text-white">
                    {a.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="sm:col-span-2 lg:col-span-3">
            <p className="text-xs font-semibold tracking-[0.2em] text-gold-500 uppercase">Escritório</p>
            <address className="mt-5 space-y-3 not-italic">
              <p>{oabLabel}</p>
              <p>
                {site.location.city} - {site.location.state}
              </p>
              <p>
                <a href={`mailto:${site.contact.email}`} className="break-all transition-colors hover:text-white">
                  {site.contact.email}
                </a>
              </p>
              <p>
                <a {...whatsappProps()} className="transition-colors hover:text-white">
                  WhatsApp {site.contact.whatsappDisplay}
                </a>
              </p>
            </address>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-8 text-sm text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {site.seo.copyrightYear} {site.officeName}. Todos os direitos reservados.
          </p>
          <p className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>{site.lawyer.name} · {oabLabel}</span>
            <a href={to('/admin/')} className="inline-flex items-center gap-1.5 text-white/60 transition-colors hover:text-white">
              <Icon name="badge" size={14} /> Área do escritório
            </a>
          </p>
        </div>

        {site.isPortfolio && (
          <p className="mt-6 border-t border-white/5 pt-6 text-xs leading-relaxed text-white/50">
            Projeto fictício desenvolvido para portfólio. Nomes, números de inscrição, contatos e depoimentos são
            ilustrativos e não correspondem a pessoas ou escritórios reais. Fotos:{' '}
            <a href="https://unsplash.com/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-white">
              Unsplash
            </a>
            .
          </p>
        )}
      </Container>
    </footer>
  )
}
