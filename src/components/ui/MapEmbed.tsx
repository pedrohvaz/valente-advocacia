import { fullAddress, mapsEmbedUrl, mapsLink, site } from '../../config/site'
import { useConsent } from '../../lib/consent'
import { Icon } from './Icon'

/**
 * Mapa do escritório. O iframe do Google (que define cookies) só é
 * carregado com consentimento de "mídia externa". Até lá, exibe uma
 * prévia estática com o endereço e o link para o Google Maps.
 */
export function MapEmbed() {
  const { consent, save } = useConsent()

  return (
    <div className="relative h-80 overflow-hidden bg-navy-950 sm:h-96">
      {consent.media ? (
        <iframe
          title={`Mapa: localização do escritório ${site.officeName}`}
          src={mapsEmbedUrl}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="map-frame absolute inset-0 h-full w-full border-0"
        />
      ) : (
        <div className="on-dark absolute inset-0 grid place-items-center p-6 text-center text-white">
          <div aria-hidden="true" className="map-placeholder absolute inset-0" />
          <div className="relative max-w-md">
            <span className="mx-auto grid size-14 place-items-center rounded-full border border-gold-500/50 text-gold-500">
              <Icon name="pin" size={26} strokeWidth={1.3} />
            </span>
            <p className="mt-5 font-serif text-2xl">{fullAddress}</p>
            <p className="mt-3 text-sm text-white/65">
              O mapa é fornecido pelo Google e só é carregado com a sua autorização.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => save({ ...consent, media: true })}
                className="min-h-11 rounded-sm bg-gold-500 px-5 text-sm font-semibold text-navy-950 transition-colors hover:bg-gold-400"
              >
                Carregar mapa
              </button>
              <a
                href={mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2 px-3 text-sm font-semibold text-white underline decoration-gold-500 underline-offset-4"
              >
                Abrir no Google Maps
                <Icon name="arrowRight" size={16} />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
