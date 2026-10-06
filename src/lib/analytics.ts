import { site } from '../config/site'

/**
 * Métricas de conversão.
 * Os scripts de GA4/Plausible só são injetados após consentimento
 * (ver src/lib/consent.tsx). Sem provedor configurado, os eventos são
 * apenas registrados no console em desenvolvimento.
 */

export type ConversionEvent =
  | 'whatsapp_click'
  | 'phone_click'
  | 'email_click'
  | 'contact_form_submit'
  | 'schedule_submit'

type Props = Record<string, string | number>

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
    plausible?: (event: string, options?: { props?: Props }) => void
  }
}

let loaded = false

export function loadAnalytics() {
  if (loaded || typeof document === 'undefined') return
  loaded = true
  const { ga4Id, plausibleDomain } = site.analytics

  if (ga4Id) {
    const s = document.createElement('script')
    s.async = true
    s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga4Id)}`
    document.head.appendChild(s)
    window.dataLayer = window.dataLayer || []
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments)
    }
    window.gtag('js', new Date())
    window.gtag('config', ga4Id, { anonymize_ip: true })
  }

  if (plausibleDomain) {
    const s = document.createElement('script')
    s.defer = true
    s.dataset.domain = plausibleDomain
    s.src = 'https://plausible.io/js/script.js'
    document.head.appendChild(s)
    window.plausible =
      window.plausible ||
      function (...args: unknown[]) {
        const q = ((window.plausible as unknown as { q?: unknown[] }).q ||= [])
        q.push(args)
      }
  }
}

/** Registra um evento de conversão nos provedores ativos. */
export function track(event: ConversionEvent, props: Props = {}) {
  if (typeof window === 'undefined') return
  if (import.meta.env.DEV) console.info('[conversão]', event, props)
  if (!loaded) return
  window.gtag?.('event', event, props)
  window.plausible?.(event, { props })
}

/**
 * Rastreia cliques em links de WhatsApp, telefone e e-mail em qualquer
 * ponto do site, identificando a seção de origem.
 */
export function trackOutboundClicks(): () => void {
  const onClick = (e: MouseEvent) => {
    const link = (e.target as HTMLElement | null)?.closest?.('a')
    if (!link) return
    const href = link.getAttribute('href') ?? ''
    const origin =
      link.closest('section[id]')?.id ??
      (link.closest('header') ? 'header' : link.closest('footer') ? 'footer' : link.dataset.track ?? 'pagina')
    const page = window.location.pathname
    if (href.includes('wa.me/')) track('whatsapp_click', { origin, page })
    else if (href.startsWith('tel:')) track('phone_click', { origin, page })
    else if (href.startsWith('mailto:')) track('email_click', { origin, page })
  }
  document.addEventListener('click', onClick)
  return () => document.removeEventListener('click', onClick)
}
