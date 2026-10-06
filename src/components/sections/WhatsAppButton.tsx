import { useScrolled } from '../../hooks/useScrolled'
import { whatsappProps } from '../../lib/whatsapp'
import { Icon } from '../ui/Icon'

/** Botão flutuante do WhatsApp — aparece após a primeira rolagem. */
export function WhatsAppButton() {
  const visible = useScrolled(240)

  return (
    <a
      {...whatsappProps()}
      aria-label="Falar com um advogado pelo WhatsApp"
      data-track="botao-flutuante"
      className={`group fixed right-4 bottom-4 z-40 flex items-center gap-3 rounded-full bg-[#15803D] p-3.5 text-white shadow-[0_14px_34px_-10px_rgba(0,0,0,0.45)] transition-[opacity,transform,background-color] duration-500 ease-out hover:bg-[#116932] sm:right-6 sm:bottom-6 ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
      }`}
      tabIndex={visible ? 0 : -1}
      aria-hidden={visible ? undefined : true}
    >
      <Icon name="whatsapp" size={28} />
      <span className="hidden pr-2 text-sm font-semibold sm:inline">Fale conosco</span>
    </a>
  )
}
