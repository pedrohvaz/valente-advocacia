import { useState, type DragEvent, type FormEvent } from 'react'
import { Icon } from '../../components/ui/Icon'
import { contactSubjects } from '../../data/content'
import { formatPhone } from '../../lib/format'
import { sourceLabels, stageLabels, stageOrder } from '../labels'
import { fmtDate } from '../lib/legal'
import { useAdmin } from '../store'
import type { Lead, LeadStage } from '../types'
import { Badge, Btn, IconBtn, Input, Modal, PageHeader, Select, Textarea, go, useAutoOpen } from '../ui'

const stageTone: Record<LeadStage, string> = {
  novo: 'bg-gold-500',
  contato: 'bg-sky-500',
  agendado: 'bg-violet-500',
  contratado: 'bg-emerald-500',
  perdido: 'bg-navy-950/25',
}

function LeadForm({ onDone }: { onDone: () => void }) {
  const { saveLead } = useAdmin()
  const [f, setF] = useState({ name: '', phone: '', email: '', subject: contactSubjects[0], message: '', source: 'whatsapp' as Lead['source'] })
  const [error, setError] = useState('')
  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (f.name.trim().length < 2) return setError('Informe o nome.')
    saveLead({ ...f, name: f.name.trim(), stage: 'novo' })
    onDone()
  }
  return (
    <form onSubmit={submit} noValidate className="grid gap-4 sm:grid-cols-2">
      <Input className="sm:col-span-2" label="Nome" value={f.name} onChange={(e) => { setF({ ...f, name: e.target.value }); setError('') }} error={error} autoFocus />
      <Input label="Telefone / WhatsApp" type="tel" value={f.phone} onChange={(e) => setF({ ...f, phone: formatPhone(e.target.value) })} />
      <Input label="E-mail" type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
      <Select label="Assunto" value={f.subject} onChange={(e) => setF({ ...f, subject: e.target.value })}>
        {contactSubjects.map((s) => <option key={s}>{s}</option>)}
      </Select>
      <Select label="Origem" value={f.source} onChange={(e) => setF({ ...f, source: e.target.value as Lead['source'] })}>
        {Object.entries(sourceLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
      </Select>
      <Textarea className="sm:col-span-2" label="Resumo do caso" value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} />
      <div className="flex justify-end gap-2 sm:col-span-2">
        <Btn onClick={onDone}>Cancelar</Btn>
        <Btn type="submit" variant="primary">Adicionar contato</Btn>
      </div>
    </form>
  )
}

function LeadCard({ lead }: { lead: Lead }) {
  const { moveLead, removeLead, convertLead } = useAdmin()
  const idx = stageOrder.indexOf(lead.stage)
  const prev = stageOrder[idx - 1]
  const next = stageOrder[idx + 1]
  const phone = lead.phone.replace(/\D/g, '')

  const onDragStart = (e: DragEvent) => {
    e.dataTransfer.setData('text/plain', lead.id)
    e.dataTransfer.effectAllowed = 'move'
  }

  return (
    <article draggable onDragStart={onDragStart} className="cursor-grab rounded-2xl border border-navy-950/[0.07] bg-white p-4 shadow-[0_1px_2px_rgb(11_19_43/0.05)] active:cursor-grabbing">
      <div className="flex items-start justify-between gap-2">
        <h3 className="min-w-0 font-medium break-words text-navy-950">{lead.name}</h3>
        <span className="shrink-0 text-xs text-muted">{fmtDate(lead.createdAt, { day: '2-digit', month: 'short' })}</span>
      </div>
      <p className="mt-1 text-xs font-medium text-gold-700">{lead.subject}</p>
      {lead.message && <p className="mt-2 line-clamp-3 text-sm text-muted">{lead.message}</p>}
      {lead.preferred && (
        <p className="mt-2 flex items-center gap-1.5 rounded-lg bg-mist px-2 py-1 text-xs text-navy-950">
          <Icon name="calendar" size={13} /> Preferência: {lead.preferred.replace(/^(\d{4})-(\d{2})-(\d{2})/, '$3/$2')}
        </p>
      )}
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <Badge>{sourceLabels[lead.source]}</Badge>
        {lead.clientId && (
          <a href={`#/clientes/${lead.clientId}`} className="text-xs font-medium text-emerald-700 underline underline-offset-2">Ver cliente</a>
        )}
      </div>
      <div className="mt-3 flex items-center gap-0.5 border-t border-navy-950/[0.06] pt-2">
        {phone && (
          <a href={`https://wa.me/55${phone}`} target="_blank" rel="noopener noreferrer" aria-label={`WhatsApp de ${lead.name}`} title="WhatsApp" className="grid size-9 place-items-center rounded-full text-[#15803D] hover:bg-emerald-50">
            <Icon name="whatsapp" size={17} />
          </a>
        )}
        {prev && <IconBtn icon="chevronLeft" label={`Mover para ${stageLabels[prev]}`} onClick={() => moveLead(lead.id, prev)} />}
        {next && <IconBtn icon="chevronRight" label={`Mover para ${stageLabels[next]}`} onClick={() => moveLead(lead.id, next)} />}
        <span className="ml-auto">
          <IconBtn icon="trash" tone="danger" label="Excluir contato" onClick={() => window.confirm(`Excluir o contato ${lead.name}?`) && removeLead(lead.id)} />
        </span>
      </div>
      {!lead.clientId && lead.stage !== 'perdido' && (
        <button
          type="button"
          onClick={() => go(`/clientes/${convertLead(lead.id)}`)}
          className="mt-2 flex min-h-9 w-full items-center justify-center gap-1.5 rounded-full bg-navy-950 px-3 text-xs font-medium text-white hover:bg-navy-800"
        >
          <Icon name="users" size={14} /> Tornar cliente
        </button>
      )}
    </article>
  )
}

export function LeadsPage() {
  const { data, moveLead } = useAdmin()
  const [open, setOpen] = useState(false)
  const [over, setOver] = useState<LeadStage | null>(null)
  useAutoOpen(() => setOpen(true))

  const total = data.leads.length
  const won = data.leads.filter((l) => l.stage === 'contratado').length
  const closed = won + data.leads.filter((l) => l.stage === 'perdido').length
  const rate = closed ? Math.round((won / closed) * 100) : 0

  const onDrop = (e: DragEvent, stage: LeadStage) => {
    e.preventDefault()
    const id = e.dataTransfer.getData('text/plain')
    if (id) moveLead(id, stage)
    setOver(null)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Contatos"
        description={`${total} contatos no funil · taxa de conversão de ${rate}% entre os finalizados`}
        actions={<Btn variant="primary" icon="plus" onClick={() => setOpen(true)}>Novo contato</Btn>}
      />
      <p className="flex items-start gap-2 rounded-2xl bg-white p-4 text-sm text-muted">
        <Icon name="inbox" size={17} className="mt-0.5 shrink-0 text-gold-700" />
        <span>
          Mensagens do formulário de contato e solicitações do <a href="../agendar/" className="font-medium text-navy-950 underline underline-offset-2">agendamento online</a> entram
          automaticamente na coluna <strong className="text-navy-950">Novo</strong>. Arraste os cartões entre as colunas ou use as setas.
        </span>
      </p>

      <div className="-mx-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6">
        <div className="grid min-w-[68rem] grid-cols-5 gap-3">
          {stageOrder.map((stage) => {
            const list = data.leads.filter((l) => l.stage === stage).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
            return (
              <section
                key={stage}
                aria-label={stageLabels[stage]}
                onDragOver={(e) => {
                  e.preventDefault()
                  setOver(stage)
                }}
                onDragLeave={() => setOver((s) => (s === stage ? null : s))}
                onDrop={(e) => onDrop(e, stage)}
                className={`flex min-h-[24rem] flex-col rounded-3xl p-2.5 transition-colors ${over === stage ? 'bg-gold-500/15 ring-2 ring-gold-500/40' : 'bg-navy-950/[0.04]'}`}
              >
                <h2 className="flex items-center gap-2 px-2 pt-1 pb-3 text-sm font-semibold text-navy-950">
                  <span className={`size-2 rounded-full ${stageTone[stage]}`} />
                  {stageLabels[stage]}
                  <span className="ml-auto rounded-full bg-white px-2 py-0.5 text-xs font-medium text-muted">{list.length}</span>
                </h2>
                <div className="space-y-2.5">
                  {list.map((l) => (
                    <LeadCard key={l.id} lead={l} />
                  ))}
                  {list.length === 0 && <p className="rounded-2xl border border-dashed border-navy-950/15 p-4 text-center text-xs text-muted">Arraste um contato para cá</p>}
                </div>
              </section>
            )
          })}
        </div>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Novo contato">
        <LeadForm onDone={() => setOpen(false)} />
      </Modal>
    </div>
  )
}
