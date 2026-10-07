import { useMemo, useState, type FormEvent } from 'react'
import { feeKinds } from '../labels'
import { brl, fmtDate, parseDay, toDay, todayISO } from '../lib/legal'
import { clientName, isOverdue, useAdmin } from '../store'
import type { FeeKind } from '../types'
import { Badge, Btn, EmptyState, IconBtn, Input, Modal, PageHeader, Select, StatCard, useAutoOpen } from '../ui'

function FeeForm({ onDone }: { onDone: () => void }) {
  const { data, saveFees } = useAdmin()
  const [f, setF] = useState({ clientId: '', caseId: '', description: 'Honorários contratuais', kind: 'contratual' as FeeKind, total: 0, installments: 1, firstDue: todayISO() })
  const [error, setError] = useState('')
  const cases = data.cases.filter((c) => c.clientId === f.clientId)
  const each = f.installments > 0 ? Math.round((f.total / f.installments) * 100) / 100 : 0

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!f.clientId) return setError('Selecione o cliente.')
    if (f.kind !== 'exito' && f.total <= 0) return setError('Informe o valor.')
    const n = Math.max(1, Math.min(48, f.installments))
    const base = parseDay(f.firstDue)
    // Última parcela absorve a diferença de arredondamento
    const values = Array.from({ length: n }, (_, i) => (i === n - 1 ? Math.round((f.total - each * (n - 1)) * 100) / 100 : each))
    saveFees(
      values.map((amount, i) => {
        const due = new Date(base)
        due.setMonth(due.getMonth() + i)
        return {
          clientId: f.clientId,
          caseId: f.caseId || undefined,
          description: n > 1 ? `${f.description} — parcela ${i + 1}/${n}` : f.description,
          kind: f.kind,
          amount,
          dueDate: toDay(due),
        }
      }),
    )
    onDone()
  }

  return (
    <form onSubmit={submit} noValidate className="grid gap-4 sm:grid-cols-2">
      <Select label="Cliente" value={f.clientId} onChange={(e) => { setF({ ...f, clientId: e.target.value, caseId: '' }); setError('') }} error={!f.clientId ? error : undefined}>
        <option value="">Selecione…</option>
        {[...data.clients].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR')).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
      </Select>
      <Select label="Processo (opcional)" value={f.caseId} onChange={(e) => setF({ ...f, caseId: e.target.value })} disabled={!cases.length}>
        <option value="">Nenhum</option>
        {cases.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
      </Select>
      <Select label="Tipo" value={f.kind} onChange={(e) => setF({ ...f, kind: e.target.value as FeeKind })}>
        {Object.entries(feeKinds).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
      </Select>
      <Input label="Descrição" value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} />
      <Input label="Valor total (R$)" type="number" min={0} step="0.01" value={f.total || ''} onChange={(e) => { setF({ ...f, total: Number(e.target.value) }); setError('') }} error={f.clientId ? error : undefined} hint={f.kind === 'exito' ? 'Pode ficar em branco até o resultado.' : undefined} />
      <Input label="Parcelas" type="number" min={1} max={48} value={f.installments} onChange={(e) => setF({ ...f, installments: Number(e.target.value) })} hint={f.installments > 1 && f.total ? `${f.installments}x de ${brl(each)}, mensais` : undefined} />
      <Input label="Primeiro vencimento" type="date" value={f.firstDue} onChange={(e) => setF({ ...f, firstDue: e.target.value })} />
      <div className="flex items-end justify-end gap-2">
        <Btn onClick={onDone}>Cancelar</Btn>
        <Btn type="submit" variant="primary">Lançar</Btn>
      </div>
    </form>
  )
}

type Filter = 'todos' | 'pendente' | 'atrasado' | 'pago'

export function FinancePage() {
  const { data, togglePaid, removeFee } = useAdmin()
  const [filter, setFilter] = useState<Filter>('pendente')
  const [open, setOpen] = useState(false)
  useAutoOpen(() => setOpen(true))
  const month = todayISO().slice(0, 7)

  const totals = useMemo(() => {
    const fees = data.fees.filter((f) => f.kind !== 'despesa')
    return {
      receivedMonth: fees.filter((f) => f.paidAt?.startsWith(month)).reduce((s, f) => s + f.amount, 0),
      pending: fees.filter((f) => !f.paidAt && !isOverdue(f)).reduce((s, f) => s + f.amount, 0),
      overdue: fees.filter((f) => isOverdue(f)).reduce((s, f) => s + f.amount, 0),
      expenses: data.fees.filter((f) => f.kind === 'despesa' && !f.paidAt).reduce((s, f) => s + f.amount, 0),
    }
  }, [data.fees, month])

  const list = useMemo(
    () =>
      data.fees
        .filter((f) => {
          if (filter === 'pago') return !!f.paidAt
          if (filter === 'atrasado') return isOverdue(f)
          if (filter === 'pendente') return !f.paidAt
          return true
        })
        .sort((a, b) => (filter === 'pago' ? (b.paidAt ?? '').localeCompare(a.paidAt ?? '') : a.dueDate.localeCompare(b.dueDate))),
    [data.fees, filter],
  )

  const exportCsv = () => {
    const rows = [
      ['Cliente', 'Descrição', 'Tipo', 'Valor', 'Vencimento', 'Pago em'],
      ...list.map((f) => [clientName(data, f.clientId), f.description, feeKinds[f.kind], f.amount.toFixed(2).replace('.', ','), fmtDate(f.dueDate), f.paidAt ? fmtDate(f.paidAt) : '']),
    ]
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(';')).join('\n')
    const url = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }))
    const a = document.createElement('a')
    a.href = url
    a.download = `financeiro-${filter}-${todayISO()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Financeiro"
        description="Honorários, parcelas e despesas reembolsáveis."
        actions={
          <>
            <Btn icon="download" onClick={exportCsv}>Exportar CSV</Btn>
            <Btn variant="primary" icon="plus" onClick={() => setOpen(true)}>Novo lançamento</Btn>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <StatCard label="Recebido no mês" value={brl(totals.receivedMonth)} icon="check" tone="gold" />
        <StatCard label="A receber" value={brl(totals.pending)} icon="wallet" hint="Em dia" />
        <StatCard label="Em atraso" value={brl(totals.overdue)} icon="alert" tone={totals.overdue ? 'red' : 'neutral'} />
        <StatCard label="Despesas a reembolsar" value={brl(totals.expenses)} icon="contract" />
      </div>

      <div role="group" aria-label="Filtrar lançamentos" className="inline-flex flex-wrap rounded-full border border-navy-950/10 bg-white p-1">
        {([['pendente', 'Em aberto'], ['atrasado', 'Em atraso'], ['pago', 'Pagos'], ['todos', 'Todos']] as [Filter, string][]).map(([k, label]) => (
          <button key={k} type="button" aria-pressed={filter === k} onClick={() => setFilter(k)} className={`rounded-full px-4 py-1.5 text-sm ${filter === k ? 'bg-navy-950 text-white' : 'text-muted hover:text-navy-950'}`}>
            {label}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <EmptyState icon="wallet" title="Nenhum lançamento neste filtro" />
      ) : (
        <div className="overflow-hidden rounded-3xl border border-navy-950/[0.07] bg-white">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Lançamentos financeiros</caption>
            <thead className="hidden bg-mist text-xs text-muted md:table-header-group">
              <tr>
                <th scope="col" className="px-5 py-3 font-medium">Descrição</th>
                <th scope="col" className="px-5 py-3 font-medium">Vencimento</th>
                <th scope="col" className="px-5 py-3 text-right font-medium">Valor</th>
                <th scope="col" className="px-5 py-3 font-medium">Situação</th>
                <th scope="col" className="px-5 py-3"><span className="sr-only">Ações</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-950/[0.06]">
              {list.map((f) => {
                const late = isOverdue(f)
                return (
                  <tr key={f.id} className="grid grid-cols-[1fr_auto] gap-x-3 gap-y-1 px-4 py-3.5 md:table-row md:p-0">
                    <td className="md:px-5 md:py-3.5">
                      <a href={`#/clientes/${f.clientId}`} className="block font-medium text-navy-950 hover:underline">{clientName(data, f.clientId)}</a>
                      <span className="block text-xs text-muted">{f.description} · {feeKinds[f.kind]}</span>
                    </td>
                    <td className="order-3 text-xs text-muted md:order-none md:px-5 md:py-3.5 md:text-sm md:text-navy-950">
                      <span className="md:hidden">Vence </span>{fmtDate(f.dueDate)}
                      {f.paidAt && <span className="block text-xs text-muted">pago em {fmtDate(f.paidAt)}</span>}
                    </td>
                    <td className="text-right font-medium text-navy-950 md:px-5 md:py-3.5">{f.amount ? brl(f.amount) : 'A definir'}</td>
                    <td className="order-4 justify-self-end md:px-5 md:py-3.5">
                      <Badge tone={f.paidAt ? 'green' : late ? 'red' : 'amber'}>{f.paidAt ? 'Pago' : late ? 'Em atraso' : 'Pendente'}</Badge>
                    </td>
                    <td className="order-5 col-span-2 flex justify-end gap-1 md:table-cell md:px-5 md:py-3.5">
                      <div className="flex justify-end gap-1">
                        <Btn size="sm" variant={f.paidAt ? 'ghost' : 'primary'} onClick={() => togglePaid(f.id)}>
                          {f.paidAt ? 'Desfazer' : 'Marcar pago'}
                        </Btn>
                        <IconBtn icon="trash" tone="danger" label="Excluir lançamento" onClick={() => window.confirm('Excluir este lançamento?') && removeFee(f.id)} />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Novo lançamento" wide>
        <FeeForm onDone={() => setOpen(false)} />
      </Modal>
    </div>
  )
}
