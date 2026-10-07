/** Modelo de dados do painel administrativo. Datas no formato 'AAAA-MM-DD'. */

export type ID = string

export type Client = {
  id: ID
  kind: 'PF' | 'PJ'
  name: string
  /** CPF ou CNPJ, só dígitos */
  doc: string
  email: string
  phone: string
  address: string
  /** Profissão (PF) ou ramo de atividade (PJ) — usado nos documentos */
  occupation: string
  maritalStatus?: string
  notes: string
  createdAt: string
}

export type CaseStatus = 'ativo' | 'suspenso' | 'encerrado'
export type CasePhase = 'Extrajudicial' | 'Conhecimento' | 'Recursal' | 'Execução'

export type CaseEvent = {
  id: ID
  date: string
  text: string
  kind: 'andamento' | 'nota' | 'documento'
}

export type LegalCase = {
  id: ID
  /** Número CNJ formatado ('' para casos extrajudiciais) */
  number: string
  title: string
  clientId: ID
  /** slug da área (src/data/areas.ts) */
  area: string
  court: string
  opposingParty: string
  status: CaseStatus
  phase: CasePhase
  /** Valor da causa */
  value: number
  tags: string[]
  createdAt: string
  events: CaseEvent[]
}

export type AgendaKind = 'prazo' | 'audiencia' | 'reuniao' | 'tarefa'

export type AgendaItem = {
  id: ID
  kind: AgendaKind
  title: string
  date: string
  time?: string
  caseId?: ID
  done: boolean
  notes?: string
  /** Como o prazo foi calculado (exibido no detalhe) */
  computation?: string
}

export type LeadStage = 'novo' | 'contato' | 'agendado' | 'contratado' | 'perdido'

export type Lead = {
  id: ID
  name: string
  phone: string
  email: string
  subject: string
  message: string
  source: 'site' | 'agendamento' | 'whatsapp' | 'indicacao'
  stage: LeadStage
  createdAt: string
  /** Data/hora preferida, quando veio do agendamento online */
  preferred?: string
  clientId?: ID
}

export type FeeKind = 'contratual' | 'exito' | 'consulta' | 'despesa'

export type Fee = {
  id: ID
  clientId: ID
  caseId?: ID
  description: string
  kind: FeeKind
  amount: number
  dueDate: string
  paidAt?: string
}

export type AdminData = {
  version: 1
  clients: Client[]
  cases: LegalCase[]
  agenda: AgendaItem[]
  leads: Lead[]
  fees: Fee[]
}
