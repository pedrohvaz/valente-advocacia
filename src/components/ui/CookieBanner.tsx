import { useEffect, useId, useRef, useState } from 'react'
import { useConsent, type Consent } from '../../lib/consent'
import { Button } from './Button'
import { to } from '../../lib/paths'

/** Banner de cookies + painel de preferências (LGPD). */
export function CookieBanner() {
  const { ready, decided, settingsOpen, consent, save, openSettings, closeSettings } = useConsent()
  const [draft, setDraft] = useState<Consent>(consent)
  const dialogRef = useRef<HTMLDivElement>(null)
  const titleId = useId()

  useEffect(() => {
    if (settingsOpen) {
      setDraft(consent)
      dialogRef.current?.focus()
    }
  }, [settingsOpen, consent])

  useEffect(() => {
    if (!settingsOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeSettings()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [settingsOpen, closeSettings])

  if (!ready) return null

  if (settingsOpen) {
    const options: { key: keyof Consent; title: string; text: string }[] = [
      {
        key: 'analytics',
        title: 'Estatísticas',
        text: 'Medem, de forma agregada, quantas pessoas visitam o site e quais canais de contato utilizam.',
      },
      {
        key: 'media',
        title: 'Mídia externa',
        text: 'Permitem exibir o mapa do Google com a localização do escritório.',
      },
    ]
    return (
      <div className="fixed inset-0 z-[60] grid place-items-end bg-navy-950/60 p-4 backdrop-blur-sm sm:place-items-center">
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          tabIndex={-1}
          className="max-h-[90svh] w-full max-w-lg overflow-y-auto bg-white p-6 shadow-2xl outline-none sm:p-8"
        >
          <h2 id={titleId} className="font-serif text-3xl text-navy-950">
            Preferências de cookies
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Escolha quais categorias deseja permitir. Você pode alterar sua escolha a qualquer momento pelo link no rodapé.
          </p>

          <ul className="mt-6 divide-y divide-line border-y border-line">
            <li className="flex items-start justify-between gap-6 py-4">
              <div>
                <p className="font-semibold text-navy-950">Necessários</p>
                <p className="mt-1 text-sm text-muted">Guardam suas preferências neste site. Sempre ativos.</p>
              </div>
              <span className="shrink-0 text-xs font-semibold tracking-wide text-muted uppercase">Sempre</span>
            </li>
            {options.map((o) => (
              <li key={o.key} className="flex items-start justify-between gap-6 py-4">
                <label htmlFor={`${titleId}-${o.key}`} className="cursor-pointer">
                  <span className="block font-semibold text-navy-950">{o.title}</span>
                  <span className="mt-1 block text-sm text-muted">{o.text}</span>
                </label>
                <input
                  id={`${titleId}-${o.key}`}
                  type="checkbox"
                  role="switch"
                  checked={draft[o.key]}
                  onChange={(e) => setDraft((d) => ({ ...d, [o.key]: e.target.checked }))}
                  className="switch mt-1 shrink-0"
                />
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={closeSettings}>
              Cancelar
            </Button>
            <Button type="button" variant="primary" onClick={() => save(draft)}>
              Salvar preferências
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (decided) return null

  return (
    <div
      role="region"
      aria-label="Aviso de cookies"
      className="panel-in fixed inset-x-3 bottom-3 z-[55] border border-white/10 bg-navy-950 p-5 text-white shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] sm:inset-x-auto sm:bottom-6 sm:left-6 sm:max-w-md sm:p-6"
    >
      <p className="font-serif text-xl">Sua privacidade</p>
      <p className="mt-2 text-sm leading-relaxed text-white/75">
        Usamos cookies necessários e, com sua permissão, cookies de estatística e de mídia externa (mapa). Saiba mais na{' '}
        <a href={to('/privacidade/')} className="text-white underline underline-offset-2">
          Política de Privacidade
        </a>
        .
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        <Button type="button" variant="gold" onClick={() => save({ analytics: true, media: true })}>
          Aceitar todos
        </Button>
        <Button type="button" variant="outlineLight" onClick={() => save({ analytics: false, media: false })}>
          Recusar
        </Button>
        <button
          type="button"
          onClick={openSettings}
          className="min-h-11 px-3 text-sm font-semibold text-white/80 underline underline-offset-4 hover:text-white"
        >
          Personalizar
        </button>
      </div>
    </div>
  )
}
