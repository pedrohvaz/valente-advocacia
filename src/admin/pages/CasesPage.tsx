import { useMemo, useState, type FormEvent } from 'react'
import { Icon } from '../../components/ui/Icon'
import { practiceAreas } from '../../data/areas'
import { agendaKinds, areaTitle, feeKinds, statusLabels, statusTone, urgency } from '../labels'
import { brl, cnjSegment, fmtDate, formatCNJ, isValidCNJ, todayISO } from '../lib/legal'
import { clientName, isOverdue, useAdmin } from '../store'
import type { CaseEvent, CasePhase, CaseStatus, LegalCase } from '../types'
import { Badge, Btn, EmptyState, IconBtn, Input, Modal, PageHeader, Panel, Select, Textarea, go, useAutoOpen } from '../ui'
import { AgendaForm } from './AgendaPage'

type Draft = Omit<LegalCase, 'id' | 'createdAt' | 'events'> & { id?: string }
const phases: CasePhase[] = ['Extrajudicial', 'Conhecimento', 'Recursal', 'Execução']
const statuses: CaseStatus[] = ['ativo', 'suspenso', 'encerrado']

function CaseForm({ initial, clientId, onDone }: { initial?: LegalCase; clientId?: string; onDone: (id?: string) => void }) {
  const { data, saveCase } = useAdmin()
  const [f, setF] = useState<Draft>(
    initial ?? {
      number: '',
      title: '',
      clientId: clientId ?? '',
      area: practiceAreas[0].slug,
      court: '',
      opposingParty: '',
      status: 'ativo',
      phase: 'Conhecimento',
      value: 0,
      tags: [],
    },
  )
  const [tags, setTags] = useState((initial?.tags ?? []).join(', '))
  const [errors, setErrors] = useState<Partial<Record<keyof Draft, string>>>({})
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setF((x) => ({ ...x, [k]: v }))
  const segment = isValidCNJ(f.number) ? cnjSegment(f.number) : ''

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const err: typeof errors = {}
    if (f.title.trim().length < 3) err.title = 'Descreva o objeto do processo.'
    if (!f.clientId) err.clientId = 'Selecione o cliente.'
    if (f.number && !isValidCNJ(f.number)) err.number = 'Número inválido: confira os 20 dígitos e o dígito verificador.'
    if (!f.number && f.phase !== 'Extrajudicial') err.number = 'Informe o número CNJ ou marque a fase como Extrajudicial.'
    setErrors(err)
    if (Object.keys(err).length) return
    onDone(
      saveCase({
        ...f,
        title: f.title.trim(),
        tags: tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      }),
    )
  }

  return (
    <form onSubmit={submit} noValidate className="grid gap-4 sm:grid-cols-2">
      <Input className="sm:col-span-2" label="Objeto / título" placeholder="Ex.: Ação de cobrança — contrato de prestação de serviços" value={f.title} onChange={(e) => set('title', e.target.value)} error={errors.title} autoFocus />
      <Input
        className="sm:col-span-2"
        label="Número do processo (padrão CNJ)"
        placeholder="0000000-00.0000.0.00.0000"
        inputMode="numeric"
        value={f.number}
        onChange={(e) => set('number', formatCNJ(e.target.value))}
        error={errors.number}
        hint={segment ? `✓ Número válido — ${segment}` : 'O dígito verificador é conferido automaticamente. Deixe vazio em casos extrajudiciais.'}
      />
      <Select label="Cliente" value={f.clientId} onChange={(e) => set('clientId', e.target.value)} error={errors.clientId}>
        <option value="">Selecione…</option>
        {[...data.clients].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR')).map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </Select>
      <Select label="Área" value={f.area} onChange={(e) => set('area', e.target.value)}>
        {practiceAreas.map((a) => (
          <option key={a.slug} value={a.slug}>
            {a.title}
          </option>
        ))}
      </Select>
      <Input label="Vara / órgão" placeholder="Ex.: 3ª Vara Cível — Foro Central" value={f.court} onChange={(e) => set('court', e.target.value)} />
      <Input label="Parte contrária" value={f.opposingParty} onChange={(e) => set('opposingParty', e.target.value)} />
      <Select label="Fase" value={f.phase} onChange={(e) => set('phase', e.target.value as CasePhase)}>
        {phases.map((p) => (
          <option key={p}>{p}</option>
        ))}
      </Select>
      <Select label="Situação" value={f.status} onChange={(e) => set('status', e.target.value as CaseStatus)}>
        {statuses.map((s) => (
          <option key={s} value={s}>
            {statusLabels[s]}
          </option>
        ))}
      </Select>
      <Input label="Valor da causa (R$)" type="number" min={0} step="0.01" value={f.value || ''} onChange={(e) => set('value', Number(e.target.value))} />
      <Input label="Etiquetas" placeholder="Separadas por vírgula" value={tags} onChange={(e) => setTags(e.target.value)} />
      <div className="flex justify-end gap-2 sm:col-span-2">
        <Btn onClick={() => onDone()}>Cancelar</Btn>
        <Btn type="submit" variant="primary">
          Salvar processo
        </Btn>
      </div>
    </form>
  )
}

export function CasesPage() {
  const { data } = useAdmin()
  const [q, setQ] = useState('')
  const [status, setStatus] = useState<CaseStatus | 'todos'>('ativo')
  const [area, setArea] = useState('todas')
  const [form, setForm] = useState<{ open: boolean; clientId?: string }>({ open: false })
  useAutoOpen((p) => setForm({ open: true, clientId: p.get('cliente') ?? undefined }))

  const list = useMemo(() => {
    const term = q.trim().toLowerCase()
    const digits = term.replace(/\D/g, '')
    return data.cases
      .filter((c) => status === 'todos' || c.status === status)
      .filter((c) => area === 'todas' || c.area === area)
      .filter(
        (c) =>
          !term ||
          c.title.toLowerCase().includes(term) ||
          clientName(data, c.clientId).toLowerCase().includes(term) ||
          (digits.length >= 3 && c.number.replace(/\D/g, '').includes(digits)),
      )
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }, [data, q, status, area])

  const nextDeadline = (caseId: string) =>
    data.agenda.filter((a) => a.caseId === caseId && !a.done).sort((a, b) => a.date.localeCompare(b.date))[0]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Processos"
        description={`${data.cases.filter((c) => c.status === 'ativo').length} ativos · ${data.cases.length} no total`}
        actions={
          <Btn variant="primary" icon="plus" onClick={() => setForm({ open: true })}>
            Novo processo
          </Btn>
        }
      />

      <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
        <div className="relative">
          <label htmlFor="case-q" className="sr-only">Filtrar processos</label>
          <Icon name="search" size={16} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted" />
          <input
            id="case-q"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Número, título ou cliente"
            className="min-h-11 w-full rounded-full border border-navy-950/10 bg-white pr-4 pl-10 text-sm focus:border-navy-950/30 focus:outline-none"
          />
        </div>
        <label className="sr-only" htmlFor="case-status">Situação</label>
        <select id="case-status" value={status} onChange={(e) => setStatus(e.target.value as CaseStatus | 'todos')} className="min-h-11 rounded-full border border-navy-950/10 bg-white px-4 text-sm">
          <option value="todos">Todas as situações</option>
          {statuses.map((s) => (
            <option key={s} value={s}>{statusLabels[s]}</option>
          ))}
        </select>
        <label className="sr-only" htmlFor="case-area">Área</label>
        <select id="case-area" value={area} onChange={(e) => setArea(e.target.value)} className="min-h-11 rounded-full border border-navy-950/10 bg-white px-4 text-sm">
          <option value="todas">Todas as áreas</option>
          {practiceAreas.map((a) => (
            <option key={a.slug} value={a.slug}>{a.title}</option>
          ))}
        </select>
      </div>

      {list.length === 0 ? (
        <EmptyState icon="folder" title="Nenhum processo encontrado" text="Ajuste os filtros ou cadastre um novo processo." />
      ) : (
        <ul className="space-y-3">
          {list.map((c) => {
            const next = nextDeadline(c.id)
            const u = next && urgency(next)
            return (
              <li key={c.id}>
                <a href={`#/processos/${c.id}`} className="card card-hover grid gap-3 p-5 md:grid-cols-[1fr_auto] md:items-center">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone={statusTone[c.status]}>{statusLabels[c.status]}</Badge>
                      <Badge>{c.phase}</Badge>
                      <span className="text-xs text-muted">{areaTitle(c.area)}</span>
                    </div>
                    <p className="mt-2 truncate font-medium text-navy-950">{c.title}</p>
                    <p className="mt-0.5 truncate text-sm text-muted">
                      <span className="font-mono text-[0.8rem]">{c.number || 'Extrajudicial'}</span> · {clientName(data, c.clientId)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 md:justify-end">
                    {next && u ? (
                      <span className="text-right text-xs">
                        <span className="block text-muted">Próximo: {agendaKinds[next.kind].label.toLowerCase()}</span>
                        <Badge tone={u.tone}>{u.text}</Badge>
                      </span>
                    ) : (
                      <span className="text-xs text-muted">Sem prazos pendentes</span>
                    )}
                    <Icon name="chevronRight" size={18} className="text-muted" />
                  </div>
                </a>
              </li>
            )
          })}
        </ul>
      )}

      <Modal open={form.open} onClose={() => setForm({ open: false })} title="Novo processo" wide>
        <CaseForm
          clientId={form.clientId}
          onDone={(id) => {
            setForm({ open: false })
            if (id) go(`/processos/${id}`)
          }}
        />
      </Modal>
    </div>
  )
}

const eventKinds: Record<CaseEvent['kind'], { label: string; icon: 'folder' | 'edit' | 'contract' }> = {
  andamento: { label: 'Andamento', icon: 'folder' },
  nota: { label: 'Nota interna', icon: 'edit' },
  documento: { label: 'Documento', icon: 'contract' },
}

export function CaseDetail({ id }: { id: string }) {
  const { data, addEvent, removeEvent, removeCase, toggleAgenda } = useAdmin()
  const [editing, setEditing] = useState(false)
  const [newAgenda, setNewAgenda] = useState(false)
  const [ev, setEv] = useState<{ text: string; kind: CaseEvent['kind']; date: string }>({ text: '', kind: 'andamento', date: todayISO() })
  const c = data.cases.find((x) => x.id === id)

  if (!c) return <EmptyState icon="folder" title="Processo não encontrado" action={<Btn onClick={() => go('/processos')}>Voltar para processos</Btn>} />

  const events = [...c.events].sort((a, b) => b.date.localeCompare(a.date))
  const agenda = data.agenda.filter((a) => a.caseId === id).sort((a, b) => Number(a.done) - Number(b.done) || a.date.localeCompare(b.date))
  const fees = data.fees.filter((f) => f.caseId === id)

  const copyNumber = () => c.number && navigator.clipboard?.writeText(c.number).catch(() => {})
  const remove = () => {
    if (window.confirm('Excluir este processo e seus prazos?')) {
      removeCase(id)
      go('/processos')
    }
  }
  const submitEvent = (e: FormEvent) => {
    e.preventDefault()
    if (!ev.text.trim()) return
    addEvent(id, { ...ev, text: ev.text.trim() })
    setEv({ text: '', kind: 'andamento', date: todayISO() })
  }

  return (
    <div className="space-y-6">
      <a href="#/processos" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-navy-950">
        <Icon name="chevronLeft" size={16} /> Processos
      </a>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={statusTone[c.status]}>{statusLabels[c.status]}</Badge>
            <Badge>{c.phase}</Badge>
            {c.tags.map((t) => (
              <Badge key={t} tone="gold">#{t}</Badge>
            ))}
          </div>
          <h1 className="mt-3 font-display text-[1.6rem] leading-tight font-semibold tracking-[-0.035em] text-navy-950 sm:text-[1.9rem]">{c.title}</h1>
          <p className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted">
            <span className="font-mono">{c.number || 'Caso extrajudicial'}</span>
            {c.number && <IconBtn icon="copy" label="Copiar número do processo" onClick={copyNumber} />}
            {c.number && <span>· {cnjSegment(c.number)}</span>}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <Btn icon="edit" onClick={() => setEditing(true)}>Editar</Btn>
          <Btn icon="trash" variant="danger" onClick={remove}>Excluir</Btn>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
        <div className="space-y-4 lg:space-y-6">
          <Panel title="Dados do processo">
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-xs text-muted">Cliente</dt>
                <dd className="mt-0.5"><a href={`#/clientes/${c.clientId}`} className="font-medium text-navy-950 underline decoration-gold-500 underline-offset-2">{clientName(data, c.clientId)}</a></dd>
              </div>
              {[
                ['Área', areaTitle(c.area)],
                ['Vara / órgão', c.court],
                ['Parte contrária', c.opposingParty],
                ['Valor da causa', c.value ? brl(c.value) : '—'],
                ['Cadastrado em', fmtDate(c.createdAt)],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-xs text-muted">{k}</dt>
                  <dd className="mt-0.5 text-navy-950">{v || '—'}</dd>
                </div>
              ))}
            </dl>
          </Panel>

          <Panel title="Prazos e compromissos" action={<Btn size="sm" icon="plus" onClick={() => setNewAgenda(true)}>Novo</Btn>}>
            {agenda.length === 0 ? (
              <p className="text-sm text-muted">Nenhum compromisso.</p>
            ) : (
              <ul className="space-y-2">
                {agenda.map((a) => {
                  const u = urgency(a)
                  return (
                    <li key={a.id} className="flex items-start gap-3 rounded-2xl bg-mist p-3">
                      <input type="checkbox" checked={a.done} onChange={() => toggleAgenda(a.id)} aria-label={`Concluir: ${a.title}`} className="mt-1 size-4 shrink-0 accent-navy-950" />
                      <span className="min-w-0 flex-1">
                        <span className={`block text-sm ${a.done ? 'text-muted line-through' : 'font-medium text-navy-950'}`}>{a.title}</span>
                        <span className="block text-xs text-muted">{agendaKinds[a.kind].label} · {fmtDate(a.date)}{a.time ? ` às ${a.time}` : ''}</span>
                      </span>
                      <Badge tone={u.tone}>{u.text}</Badge>
                    </li>
                  )
                })}
              </ul>
            )}
          </Panel>

          <Panel title="Honorários e despesas">
            {fees.length === 0 ? (
              <p className="text-sm text-muted">Nenhum lançamento vinculado.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {fees.map((f) => (
                  <li key={f.id} className="flex items-center justify-between gap-3">
                    <span className="min-w-0">
                      <span className="block truncate text-navy-950">{f.description}</span>
                      <span className="block text-xs text-muted">{feeKinds[f.kind]} · {fmtDate(f.dueDate)}</span>
                    </span>
                    <Badge tone={f.paidAt ? 'green' : isOverdue(f) ? 'red' : 'amber'}>{f.amount ? brl(f.amount) : 'A definir'}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>

        <Panel className="lg:col-span-2" title="Linha do tempo">
          <form onSubmit={submitEvent} className="mb-6 rounded-2xl bg-mist p-4">
            <Textarea label="Registrar andamento, nota ou documento" value={ev.text} onChange={(e) => setEv({ ...ev, text: e.target.value })} placeholder="Ex.: Publicada decisão deferindo a tutela de urgência." rows={2} />
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end">
              <Select label="Tipo" value={ev.kind} onChange={(e) => setEv({ ...ev, kind: e.target.value as CaseEvent['kind'] })} className="sm:w-44">
                {Object.entries(eventKinds).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </Select>
              <Input label="Data" type="date" value={ev.date} onChange={(e) => setEv({ ...ev, date: e.target.value })} className="sm:w-44" />
              <Btn type="submit" variant="primary" icon="plus" className="sm:ml-auto">Registrar</Btn>
            </div>
          </form>

          {events.length === 0 ? (
            <p className="text-sm text-muted">Sem registros ainda.</p>
          ) : (
            <ol className="relative space-y-5 before:absolute before:top-2 before:bottom-2 before:left-[1.05rem] before:w-px before:bg-navy-950/10">
              {events.map((e) => (
                <li key={e.id} className="relative flex gap-4">
                  <span className={`relative z-10 grid size-9 shrink-0 place-items-center rounded-full ring-4 ring-white ${e.kind === 'andamento' ? 'bg-navy-950 text-gold-500' : e.kind === 'documento' ? 'bg-gold-500 text-navy-950' : 'bg-mist text-navy-800'}`}>
                    <Icon name={eventKinds[e.kind].icon} size={15} />
                  </span>
                  <div className="min-w-0 flex-1 pt-1">
                    <p className="text-xs text-muted">
                      {fmtDate(e.date, { day: '2-digit', month: 'long', year: 'numeric' })} · {eventKinds[e.kind].label}
                    </p>
                    <p className="mt-0.5 text-sm text-navy-950">{e.text}</p>
                  </div>
                  <IconBtn icon="trash" tone="danger" label="Excluir registro" onClick={() => removeEvent(id, e.id)} />
                </li>
              ))}
            </ol>
          )}
        </Panel>
      </div>

      <Modal open={editing} onClose={() => setEditing(false)} title="Editar processo" wide>
        <CaseForm initial={c} onDone={() => setEditing(false)} />
      </Modal>
      <Modal open={newAgenda} onClose={() => setNewAgenda(false)} title="Novo prazo ou compromisso" wide>
        <AgendaForm caseId={id} onDone={() => setNewAgenda(false)} />
      </Modal>
    </div>
  )
}
