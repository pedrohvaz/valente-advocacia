import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { loadAnalytics } from './analytics'

/**
 * Consentimento de cookies (LGPD).
 * Categorias:
 *  - necessários: sempre ativos (preferências do próprio site);
 *  - estatísticas: Google Analytics / Plausible;
 *  - mídia externa: mapa do Google incorporado.
 * A escolha fica salva no navegador do visitante.
 */

export type Consent = { analytics: boolean; media: boolean }

type ConsentState = {
  consent: Consent
  /** O visitante já escolheu? (falso até a hidratação) */
  decided: boolean
  /** Já montou no navegador — evita divergência com o HTML pré-renderizado. */
  ready: boolean
  settingsOpen: boolean
  save: (c: Consent) => void
  openSettings: () => void
  closeSettings: () => void
}

const KEY = 'cookie-consent-v1'
const none: Consent = { analytics: false, media: false }

const ConsentContext = createContext<ConsentState | null>(null)

function read(): Consent | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<Consent>
    return { analytics: !!parsed.analytics, media: !!parsed.media }
  } catch {
    return null
  }
}

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<Consent>(none)
  const [decided, setDecided] = useState(false)
  const [ready, setReady] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

  useEffect(() => {
    const stored = read()
    if (stored) {
      setConsent(stored)
      setDecided(true)
    }
    setReady(true)
  }, [])

  useEffect(() => {
    if (consent.analytics) loadAnalytics()
  }, [consent.analytics])

  const save = useCallback((c: Consent) => {
    setConsent(c)
    setDecided(true)
    setSettingsOpen(false)
    try {
      localStorage.setItem(KEY, JSON.stringify({ ...c, date: new Date().toISOString() }))
    } catch {
      /* armazenamento indisponível: a escolha vale só nesta visita */
    }
  }, [])

  const value = useMemo(
    () => ({
      consent,
      decided,
      ready,
      settingsOpen,
      save,
      openSettings: () => setSettingsOpen(true),
      closeSettings: () => setSettingsOpen(false),
    }),
    [consent, decided, ready, settingsOpen, save],
  )

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>
}

export function useConsent() {
  const ctx = useContext(ConsentContext)
  if (!ctx) throw new Error('useConsent deve ser usado dentro de <ConsentProvider>')
  return ctx
}
