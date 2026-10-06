import type { SiteImage } from '../../config/site'

type PortraitProps = {
  image: SiteImage | null
  /** Texto exibido enquanto não houver foto. */
  placeholder: string
  /** Atributo `sizes` para o navegador escolher a largura certa do srcset. */
  sizes?: string
  /** true para a imagem da primeira dobra (carrega com prioridade). */
  priority?: boolean
  className?: string
  imgClassName?: string
}

/**
 * Foto com proporção fixa (4:5 por padrão), sem deslocamento de layout.
 * Sem imagem, exibe um placeholder sóbrio e claramente identificado.
 */
export function Portrait({
  image,
  placeholder,
  sizes = '(min-width: 1024px) 40vw, 100vw',
  priority = false,
  className = 'aspect-[4/5] rounded-4xl',
  imgClassName = '',
}: PortraitProps) {
  return (
    <div className={`relative w-full overflow-hidden bg-navy-900 ${className}`}>
      {image ? (
        <img
          src={image.src}
          srcSet={image.srcSet}
          sizes={image.srcSet ? sizes : undefined}
          alt={image.alt}
          width={960}
          height={1200}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          className={`absolute inset-0 h-full w-full object-cover ${imgClassName}`}
        />
      ) : (
        <div role="img" aria-label={placeholder} className="portrait-placeholder absolute inset-0">
          <div className="absolute inset-4 border border-gold-500/25 sm:inset-6" aria-hidden="true" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-8 pb-8 text-center" aria-hidden="true">
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none" className="text-gold-500/60">
              <circle cx="28" cy="20" r="9" stroke="currentColor" strokeWidth="1.2" />
              <path d="M10 50c0-10 8-17 18-17s18 7 18 17" stroke="currentColor" strokeWidth="1.2" />
            </svg>
            <span className="text-[0.7rem] font-semibold tracking-[0.22em] text-white/70 uppercase">{placeholder}</span>
          </div>
        </div>
      )}
    </div>
  )
}
