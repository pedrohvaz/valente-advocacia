import { site } from '../../config/site'
import { to } from '../../lib/paths'

/**
 * [LOGO] — se `site.images.logo` estiver definido, usa a imagem.
 * Caso contrário, exibe uma marca tipográfica provisória.
 */
export function Logo({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const light = tone === 'light'
  if (site.images.logo) {
    return <img src={to(site.images.logo)} alt={site.officeName} width={180} height={48} className="h-10 w-auto sm:h-11" />
  }
  return (
    <span className="flex min-w-0 items-center gap-3">
      <span
        aria-hidden="true"
        className="grid size-10 shrink-0 place-items-center border border-gold-500/70 font-serif text-xl text-gold-500"
      >
        §
      </span>
      <span className="min-w-0 leading-none">
        <span className={`block truncate font-serif text-[1.15rem] font-semibold tracking-wide sm:text-xl ${light ? 'text-white' : 'text-navy-950'}`}>
          {site.officeName}
        </span>
        <span className={`mt-1 block text-[0.62rem] font-semibold tracking-[0.28em] uppercase ${light ? 'text-white/55' : 'text-muted'}`}>
          {site.location.city} · {site.location.stateCode}
        </span>
      </span>
    </span>
  )
}
