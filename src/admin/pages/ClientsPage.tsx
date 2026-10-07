import { useMemo, useState, type FormEvent } from 'react'
import { Icon } from '../../components/ui/Icon'
import { formatPhone, isEmail } from '../../lib/format'
import { areaTitle, feeKinds, statusLabels, statusTone } from '../labels'
import { brl, fmtDate, formatDoc, isValidCNPJ, isValidCPF } from '../lib/legal'
import { isOverdue, useAdmin } from '../store'
import type { Client } from '../types'
import { Badge, Btn, EmptyState, Input, Modal, PageHeader, Panel, Select, Textarea, go, useAutoOpen } from '../ui'

type Draft = Omit<Client, 'id' | 'createdAt'> & { id?: string }
const empty: Draft = { kind: 'PF', name: '', doc: '', email: '', phone: '', address: '', occupation: '', maritalStatus: '', notes: '' }

export function ClientForm({ initial, onDone }: { initial?: Client; onDone: (id?: string) => void }) {
  const { saveClient } = useAdmin()
  const [f, setF] = useState<Draft>(initial ?? empty)
  const [errors, setErrors] = useState<Partial<Record<keyof Draft, string>>>({})
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setF((x) => ({ ...x, [k]: v }))

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const err: typeof errors = {}
    if (f.name.trim().length < 3) err.name = 'Informe o nome completo ou a razão social.'
    const doc = f.doc.replace(/\D/g, '')
    if (doc && f.kind === 'PF' && !isValidCPF(doc)) err.doc = 'CPF inválido (dígitos verificadores não conferem).'
    if (doc && f.kind === 'PJ' && !isValidCNPJ(doc)) err.doc = 'CNPJ inválido (dígitos verificadores não conferem).'
    if (f.email && !isEmail(f.email)) err.email = 'E-mail inválido.'
    setErrors(err)
    if (Object.keys(err).length) return
    onDone(saveClient({ ...f, doc, name: f.name.trim() }))
  }

  return (
    <form onSubmit={submit} noValidate className="grid gap-4 sm:grid-cols-2">
      <fieldset className="sm:col-span-2">
        <legend className="text-sm font-medium text-navy-950">Tipo de cliente</legend>
        <div className="mt-1.5 inline-flex rounded-full bg-mist p-1">
          {(['PF', 'PJ'] as const).map((k) => (
            <label key={k} className="cursor-pointer rounded-full px-4 py-1.5 text-sm has-checked:bg-white has-checked:font-medium has-checked:shadow-sm has-focus-visible:outline-2 has-focus-visible:outline-gold-500">
              <input type="radio" name="kind" className="sr-only" checked={f.kind === k} onChange={() => set('kind', k)} />
              {k === 'PF' ? 'Pessoa física' : 'Pessoa jurídica'}
            </label>
          ))}
        </div>
      </fieldset>
      <Input className="sm:col-span-2" label={f.kind === 'PF' ? 'Nome completo' : 'Razão social'} value={f.name} onChange={(e) => set('name', e.target.value)} error={errors.name} autoFocus />
      <Input
        label={f.kind === 'PF' ? 'CPF' : 'CNPJ'}
        inputMode="numeric"
        value={formatDoc(f.doc)}
        onChange={(e) => set('doc', e.target.value.replace(/\D/g, '').slice(0, f.kind === 'PF' ? 11 : 14))}
        error={errors.doc}
        hint="Validado pelos dígitos verificadores."
      />
      <Input label={f.kind === 'PF' ? 'Profissão' : 'Ramo de atividade'} value={f.occupation} onChange={(e) => set('occupation', e.target.value)} />
      <Input label="E-mail" type="email" value={f.email} onChange={(e) => set('email', e.target.value)} error={errors.email} />
      <Input label="Telefone / WhatsApp" type="tel" value={f.phone} onChange={(e) => set('phone', formatPhone(e.target.value))} />
      {f.kind === 'PF' && (
        <Select label="Estado civil" value={f.maritalStatus ?? ''} onChange={(e) => set('maritalStatus', e.target.value)}>
          <option value="">Não informado</option>
          {['solteiro(a)', 'casado(a)', 'divorciado(a)', 'viúvo(a)', 'em união estável'].map((o) => (
            <option key={o} value={o.replace('(a)', '').replace('o(a)', 'o')}>
              {o}
            </option>
          ))}
        </Select>
      )}
      <Input className={f.kind === 'PF' ? '' : 'sm:col-span-2'} label="Endereço" value={f.address} onChange={(e) => set('address', e.target.value)} />
      <Textarea className="sm:col-span-2" label="Observações" value={f.notes} onChange={(e) => set('notes', e.target.value)} />
      <div className="flex justify-end gap-2 sm:col-span-2">
        <Btn onClick={() => onDone()}>Cancelar</Btn>
        <Btn type="submit" variant="primary">
          Salvar cliente
        </Btn>
      </div>
    </form>
  )
}

export function ClientsPage() {
  const { data } = useAdmin()
  const [q, setQ] = useState('')
  const [kind, setKind] = useState<'todos' | 'PF' | 'PJ'>('todos')
  const [open, setOpen] = useState(false)
  useAutoOpen(() => setOpen(true))

  const list = useMemo(() => {
    const term = q.trim().toLowerCase()
    return data.clients
      .filter((c) => kind === 'todos' || c.kind === kind)
      .filter((c) => !term || c.name.toLowerCase().includes(term) || c.email.toLowerCase().includes(term) || (term.replace(/\D/g, '') && c.doc.includes(term.replace(/\D/g, ''))))
      .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
  }, [data.clients, q, kind])

  const caseCount = (id: string) => data.cases.filter((c) => c.clientId === id && c.status !== 'encerrado').length

  return (
    <div className="space-y-6">
      <PageHeader
        title="Clientes"
        description={`${data.clients.length} clientes cadastrados`}
        actions={
          <Btn variant="primary" icon="plus" onClick={() => setOpen(true)}>
            Novo cliente
          </Btn>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <label htmlFor="client-q" className="sr-only">Filtrar clientes</label>
          <Icon name="search" size={16} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted" />
          <input
            id="client-q"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Nome, e-mail ou CPF/CNPJ"
            className="min-h-11 w-full rounded-full border border-navy-950/10 bg-white pr-4 pl-10 text-sm focus:border-navy-950/30 focus:outline-none"
          />
        </div>
        <div role="group" aria-label="Tipo de cliente" className="inline-flex rounded-full border border-navy-950/10 bg-white p-1">
          {(['todos', 'PF', 'PJ'] as const).map((k) => (
            <button
              key={k}
              type="button"
              aria-pressed={kind === k}
              onClick={() => setKind(k)}
              className={`rounded-full px-4 py-1.5 text-sm transition-colors ${kind === k ? 'bg-navy-950 text-white' : 'text-muted hover:text-navy-950'}`}
            >
              {k === 'todos' ? 'Todos' : k}
            </button>
          ))}
        </div>
      </div>

      {list.length === 0 ? (
        <EmptyState icon="users" title="Nenhum cliente encontrado" text="Ajuste a busca ou cadastre um novo cliente." />
      ) : (
        <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {list.map((c) => (
            <li key={c.id}>
              <a href={`#/clientes/${c.id}`} className="card card-hover flex h-full flex-col p-5">
                <div className="flex items-start gap-3">
                  <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-navy-950 text-sm font-semibold text-gold-500">
                    {c.name.split(' ').filter((p) => p.length > 2).map((p) => p[0]).slice(0, 2).join('')}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium text-navy-950">{c.name}</span>
                    <span className="block text-xs text-muted">{c.doc ? formatDoc(c.doc) : 'Documento não informado'}</span>
                  </span>
                  <Badge tone={c.kind === 'PJ' ? 'blue' : 'neutral'}>{c.kind}</Badge>
                </div>
                <div className="mt-4 space-y-1.5 text-sm text-muted">
                  {c.phone && <p className="flex items-center gap-2"><Icon name="phone" size={14} /> {c.phone}</p>}
                  {c.email && <p className="flex items-center gap-2 truncate"><Icon name="mail" size={14} /> {c.email}</p>}
                </div>
                <p className="mt-auto pt-4 text-xs text-muted">
                  <span className="font-medium text-navy-950">{caseCount(c.id)}</span> processo(s) em andamento
                </p>
              </a>
            </li>
          ))}
        </ul>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Novo cliente" wide>
        <ClientForm
          onDone={(id) => {
            setOpen(false)
            if (id) go(`/clientes/${id}`)
          }}
        />
      </Modal>
    </div>
  )
}

export function ClientDetail({ id }: { id: string }) {
  const { data, removeClient } = useAdmin()
  const [editing, setEditing] = useState(false)
  const client = data.clients.find((c) => c.id === id)

  if (!client) {
    return <EmptyState icon="users" title="Cliente não encontrado" action={<Btn onClick={() => go('/clientes')}>Voltar para clientes</Btn>} />
  }

  const cases = data.cases.filter((c) => c.clientId === id)
  const fees = data.fees.filter((f) => f.clientId === id).sort((a, b) => b.dueDate.localeCompare(a.dueDate))
  const paid = fees.filter((f) => f.paidAt && f.kind !== 'despesa').reduce((s, f) => s + f.amount, 0)
  const pending = fees.filter((f) => !f.paidAt && f.kind !== 'despesa').reduce((s, f) => s + f.amount, 0)

  const remove = () => {
    if (window.confirm(`Excluir ${client.name}? Os processos, prazos e lançamentos vinculados também serão excluídos.`)) {
      removeClient(id)
      go('/clientes')
    }
  }

  return (
    <div className="space-y-6">
      <a href="#/clientes" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-navy-950">
        <Icon name="chevronLeft" size={16} /> Clientes
      </a>
      <PageHeader
        title={client.name}
        description={`${client.kind === 'PF' ? 'Pessoa física' : 'Pessoa jurídica'}${client.doc ? ` · ${formatDoc(client.doc)}` : ''} · cliente desde ${fmtDate(client.createdAt, { month: 'long', year: 'numeric' })}`}
        actions={
          <>
            <Btn icon="contract" onClick={() => go(`/documentos?cliente=${id}`)}>Gerar documento</Btn>
            <Btn icon="edit" onClick={() => setEditing(true)}>Editar</Btn>
            <Btn icon="trash" variant="danger" onClick={remove}>Excluir</Btn>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
        <Panel title="Dados de contato">
          <dl className="space-y-3 text-sm">
            {[
              ['Telefone', client.phone],
              ['E-mail', client.email],
              ['Endereço', client.address],
              [client.kind === 'PF' ? 'Profissão' : 'Atividade', client.occupation],
              ...(client.kind === 'PF' ? [['Estado civil', client.maritalStatus ?? '']] : []),
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-xs text-muted">{k}</dt>
                <dd className="mt-0.5 break-words text-navy-950">{v || '—'}</dd>
              </div>
            ))}
          </dl>
          {client.phone && (
            <a
              href={`https://wa.me/55${client.phone.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#15803D] px-4 py-2 text-sm font-medium text-white hover:bg-[#116932]"
            >
              <Icon name="whatsapp" size={16} /> Conversar
            </a>
          )}
          {client.notes && <p className="mt-5 rounded-2xl bg-mist p-3.5 text-sm text-ink">{client.notes}</p>}
        </Panel>

        <Panel
          className="lg:col-span-2"
          title={`Processos (${cases.length})`}
          action={<Btn size="sm" icon="plus" onClick={() => go(`/processos?novo&cliente=${id}`)}>Novo</Btn>}
        >
          {cases.length === 0 ? (
            <p className="text-sm text-muted">Nenhum processo vinculado.</p>
          ) : (
            <ul className="space-y-2">
              {cases.map((c) => (
                <li key={c.id}>
                  <a href={`#/processos/${c.id}`} className="flex flex-col gap-1 rounded-2xl bg-mist px-4 py-3 hover:bg-[#eceef2] sm:flex-row sm:items-center sm:gap-4">
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-navy-950">{c.title}</span>
                      <span className="block text-xs text-muted">{c.number || 'Extrajudicial'} · {areaTitle(c.area)}</span>
                    </span>
                    <Badge tone={statusTone[c.status]}>{statusLabels[c.status]}</Badge>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      <Panel
        title="Financeiro do cliente"
        action={
          <span className="text-sm whitespace-normal text-muted">
            Recebido <strong className="text-navy-950">{brl(paid)}</strong> · a receber <strong className="text-navy-950">{brl(pending)}</strong>
          </span>
        }
      >
        {fees.length === 0 ? (
          <p className="text-sm text-muted">Nenhum lançamento.</p>
        ) : (
          <ul className="divide-y divide-navy-950/[0.06]">
            {fees.map((f) => (
              <li key={f.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 py-3 text-sm">
                <span className="min-w-0 flex-1">
                  <span className="block text-navy-950">{f.description}</span>
                  <span className="block text-xs text-muted">{feeKinds[f.kind]} · vencimento {fmtDate(f.dueDate)}</span>
                </span>
                <span className="font-medium text-navy-950">{f.amount ? brl(f.amount) : 'A definir'}</span>
                <Badge tone={f.paidAt ? 'green' : isOverdue(f) ? 'red' : 'amber'}>{f.paidAt ? 'Pago' : isOverdue(f) ? 'Em atraso' : 'Pendente'}</Badge>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <Modal open={editing} onClose={() => setEditing(false)} title="Editar cliente" wide>
        <ClientForm initial={client} onDone={() => setEditing(false)} />
      </Modal>
    </div>
  )
}
