import type { IconName } from '../components/ui/Icon'
import { findArea } from '../data/areas'
import { courtDaysUntil, daysFromToday, parseDay } from './lib/legal'
import type { AgendaItem, AgendaKind, CaseStatus, FeeKind, Lead, LeadStage } from './types'
import type { Tone } from './ui'

export const stageLabels: Record<LeadStage, string> = {
  novo: 'Novo',
  contato: 'Em contato',
  agendado: 'Consulta agendada',
  contratado: 'Contratado',
  perdido: 'Não fechou',
}
export const stageOrder: LeadStage[] = ['novo', 'contato', 'agendado', 'contratado', 'perdido']

export const sourceLabels: Record<Lead['source'], string> = {
  site: 'Formulário do site',
  agendamento: 'Agendamento online',
  whatsapp: 'WhatsApp',
  indicacao: 'Indicação',
}

export const agendaKinds: Record<AgendaKind, { label: string; tone: Tone; icon: IconName }> = {
  prazo: { label: 'Prazo', tone: 'red', icon: 'clock' },
  audiencia: { label: 'Audiência', tone: 'blue', icon: 'users' },
  reuniao: { label: 'Reunião', tone: 'gold', icon: 'message' },
  tarefa: { label: 'Tarefa', tone: 'neutral', icon: 'check' },
}

export const statusTone: Record<CaseStatus, Tone> = { ativo: 'green', suspenso: 'amber', encerrado: 'neutral' }
export const statusLabels: Record<CaseStatus, string> = { ativo: 'Ativo', suspenso: 'Suspenso', encerrado: 'Encerrado' }

export const feeKinds: Record<FeeKind, string> = {
  contratual: 'Honorário contratual',
  exito: 'Honorário de êxito',
  consulta: 'Consulta',
  despesa: 'Despesa reembolsável',
}

export const areaTitle = (slug: string) => findArea(slug)?.title ?? slug

/** Rótulo e cor de urgência de um compromisso. Prazos contam em dias úteis forenses. */
export function urgency(item: Pick<AgendaItem, 'date' | 'done' | 'kind'>): { text: string; tone: Tone } {
  if (item.done) return { text: 'Concluído', tone: 'green' }
  const days = daysFromToday(item.date)
  if (days < 0) return { text: days === -1 ? 'Venceu ontem' : `Vencido há ${-days} dias`, tone: 'red' }
  if (days === 0) return { text: 'Hoje', tone: 'red' }
  if (days === 1) return { text: 'Amanhã', tone: 'amber' }
  if (item.kind === 'prazo') {
    const useful = courtDaysUntil(parseDay(item.date))
    return { text: `em ${useful} ${useful === 1 ? 'dia útil' : 'dias úteis'}`, tone: useful <= 3 ? 'amber' : 'neutral' }
  }
  return { text: `em ${days} dias`, tone: days <= 3 ? 'amber' : 'neutral' }
}
