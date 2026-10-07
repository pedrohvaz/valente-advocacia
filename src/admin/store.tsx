/**
 * Estado do painel.
 * MODO DEMONSTRAÇÃO: os dados ficam no localStorage do navegador.
 * Para produção, substitua `load`/`persist` por chamadas a uma API
 * (ex.: Supabase) — as telas usam apenas as ações expostas aqui.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { takeInbox } from '../lib/inbox'
import { todayISO } from './lib/legal'
import { seedData } from './seed'
import type { AdminData, AgendaItem, CaseEvent, Client, Fee, ID, LegalCase, Lead } from './types'

const KEY = 'valente-admin-v1'

const uid = (prefix: string) => `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`

function load(): AdminData {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as AdminData
      if (parsed.version === 1) return parsed
    }
  } catch {
    /* dados corrompidos ou indisponíveis: recomeça com a demonstração */
  }
  return seedData()
}

function persist(data: AdminData) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data))
  } catch {
    /* sem armazenamento: o painel funciona até fechar a aba */
  }
}

type Actions = {
  saveClient: (c: Omit<Client, 'id' | 'createdAt'> & { id?: ID }) => ID
  removeClient: (id: ID) => void
  saveCase: (c: Omit<LegalCase, 'id' | 'createdAt' | 'events'> & { id?: ID }) => ID
  removeCase: (id: ID) => void
  addEvent: (caseId: ID, e: Omit<CaseEvent, 'id'>) => void
  removeEvent: (caseId: ID, eventId: ID) => void
  saveAgenda: (a: Omit<AgendaItem, 'id'> & { id?: ID }) => void
  toggleAgenda: (id: ID) => void
  removeAgenda: (id: ID) => void
  saveLead: (l: Omit<Lead, 'id' | 'createdAt'> & { id?: ID }) => void
  moveLead: (id: ID, stage: Lead['stage']) => void
  removeLead: (id: ID) => void
  convertLead: (id: ID) => ID
  saveFees: (fees: (Omit<Fee, 'id'> & { id?: ID })[]) => void
  togglePaid: (id: ID) => void
  removeFee: (id: ID) => void
  replaceAll: (data: AdminData) => void
  resetDemo: () => void
}

type Ctx = { data: AdminData; ready: boolean; inboxCount: number } & Actions

const AdminContext = createContext<Ctx | null>(null)

export function AdminProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AdminData>(() => ({ version: 1, clients: [], cases: [], agenda: [], leads: [], fees: [] }))
  const [ready, setReady] = useState(false)
  const [inboxCount, setInboxCount] = useState(0)

  // Carrega no navegador e incorpora o que chegou pelos formulários do site.
  useEffect(() => {
    const base = load()
    const inbox = takeInbox()
    if (inbox.length) {
      base.leads = [
        ...inbox.map((i) => ({ ...i, stage: 'novo' as const })),
        ...base.leads.filter((l) => !inbox.some((i) => i.id === l.id)),
      ]
      persist(base)
    }
    setInboxCount(inbox.length)
    setData(base)
    setReady(true)
  }, [])

  const update = useCallback((fn: (d: AdminData) => AdminData) => {
    setData((prev) => {
      const next = fn(prev)
      persist(next)
      return next
    })
  }, [])

  const actions = useMemo<Actions>(() => {
    const upsert = <T extends { id: ID }>(list: T[], item: T) =>
      list.some((x) => x.id === item.id) ? list.map((x) => (x.id === item.id ? item : x)) : [item, ...list]

    return {
      saveClient: (c) => {
        const id = c.id ?? uid('c')
        update((d) => {
          const prev = d.clients.find((x) => x.id === id)
          return { ...d, clients: upsert(d.clients, { ...c, id, createdAt: prev?.createdAt ?? todayISO() } as Client) }
        })
        return id
      },
      removeClient: (id) =>
        update((d) => {
          const caseIds = d.cases.filter((x) => x.clientId === id).map((x) => x.id)
          return {
            ...d,
            clients: d.clients.filter((x) => x.id !== id),
            cases: d.cases.filter((x) => x.clientId !== id),
            agenda: d.agenda.filter((a) => !a.caseId || !caseIds.includes(a.caseId)),
            fees: d.fees.filter((f) => f.clientId !== id),
          }
        }),
      saveCase: (c) => {
        const id = c.id ?? uid('p')
        update((d) => {
          const prev = d.cases.find((x) => x.id === id)
          const item: LegalCase = { ...c, id, createdAt: prev?.createdAt ?? todayISO(), events: prev?.events ?? [] }
          return { ...d, cases: upsert(d.cases, item) }
        })
        return id
      },
      removeCase: (id) =>
        update((d) => ({
          ...d,
          cases: d.cases.filter((x) => x.id !== id),
          agenda: d.agenda.filter((a) => a.caseId !== id),
          fees: d.fees.map((f) => (f.caseId === id ? { ...f, caseId: undefined } : f)),
        })),
      addEvent: (caseId, e) =>
        update((d) => ({
          ...d,
          cases: d.cases.map((c) => (c.id === caseId ? { ...c, events: [...c.events, { ...e, id: uid('e') }] } : c)),
        })),
      removeEvent: (caseId, eventId) =>
        update((d) => ({
          ...d,
          cases: d.cases.map((c) => (c.id === caseId ? { ...c, events: c.events.filter((e) => e.id !== eventId) } : c)),
        })),
      saveAgenda: (a) => update((d) => ({ ...d, agenda: upsert(d.agenda, { ...a, id: a.id ?? uid('a') } as AgendaItem) })),
      toggleAgenda: (id) => update((d) => ({ ...d, agenda: d.agenda.map((a) => (a.id === id ? { ...a, done: !a.done } : a)) })),
      removeAgenda: (id) => update((d) => ({ ...d, agenda: d.agenda.filter((a) => a.id !== id) })),
      saveLead: (l) =>
        update((d) => {
          const id = l.id ?? uid('l')
          const prev = d.leads.find((x) => x.id === id)
          return { ...d, leads: upsert(d.leads, { ...l, id, createdAt: prev?.createdAt ?? todayISO() } as Lead) }
        }),
      moveLead: (id, stage) => update((d) => ({ ...d, leads: d.leads.map((l) => (l.id === id ? { ...l, stage } : l)) })),
      removeLead: (id) => update((d) => ({ ...d, leads: d.leads.filter((l) => l.id !== id) })),
      convertLead: (id) => {
        const clientId = uid('c')
        update((d) => {
          const lead = d.leads.find((l) => l.id === id)
          if (!lead) return d
          const isCompany = /ltda|s\.a\.|eireli|me\b|comércio|grupo/i.test(lead.name)
          const client: Client = {
            id: clientId,
            kind: isCompany ? 'PJ' : 'PF',
            name: lead.name,
            doc: '',
            email: lead.email,
            phone: lead.phone,
            address: '',
            occupation: '',
            notes: `Origem: ${lead.subject}. ${lead.message}`,
            createdAt: todayISO(),
          }
          return {
            ...d,
            clients: [client, ...d.clients],
            leads: d.leads.map((l) => (l.id === id ? { ...l, stage: 'contratado', clientId } : l)),
          }
        })
        return clientId
      },
      saveFees: (fees) =>
        update((d) => fees.reduce((acc, f) => ({ ...acc, fees: upsert(acc.fees, { ...f, id: f.id ?? uid('f') } as Fee) }), d)),
      togglePaid: (id) =>
        update((d) => ({ ...d, fees: d.fees.map((f) => (f.id === id ? { ...f, paidAt: f.paidAt ? undefined : todayISO() } : f)) })),
      removeFee: (id) => update((d) => ({ ...d, fees: d.fees.filter((f) => f.id !== id) })),
      replaceAll: (next) => update(() => next),
      resetDemo: () => update(() => seedData()),
    }
  }, [update])

  const value = useMemo(() => ({ data, ready, inboxCount, ...actions }), [data, ready, inboxCount, actions])
  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
}

export function useAdmin() {
  const ctx = useContext(AdminContext)
  if (!ctx) throw new Error('useAdmin deve ser usado dentro de <AdminProvider>')
  return ctx
}

/* Seletores reutilizados em várias telas */
export const clientName = (data: AdminData, id?: ID) => data.clients.find((c) => c.id === id)?.name ?? '—'
export const caseById = (data: AdminData, id?: ID) => data.cases.find((c) => c.id === id)
export const isOverdue = (f: Fee) => !f.paidAt && f.dueDate < todayISO()
