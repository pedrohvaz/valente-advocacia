import { site } from '../config/site'

/** Monta o link do WhatsApp com a mensagem pré-preenchida. */
export function whatsappLink(message: string = site.contact.whatsappMessage): string {
  const text = encodeURIComponent(message)
  const number = site.contact.whatsapp.replace(/\D/g, '')
  return number ? `https://wa.me/${number}?text=${text}` : `https://wa.me/?text=${text}`
}

/** Props padrão para links externos que abrem o WhatsApp. */
export function whatsappProps(message?: string) {
  return { href: whatsappLink(message), target: '_blank', rel: 'noopener noreferrer' } as const
}
