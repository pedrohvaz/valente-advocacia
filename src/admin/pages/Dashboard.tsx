import { useMemo } from 'react'
import { site } from '../../config/site'
import { Icon } from '../../components/ui/Icon'
import { agendaKinds, areaTitle, stageLabels, urgency } from '../labels'
import { brl, fmtDate, todayISO, toDay } from '../lib/legal'
import { caseById, isOverdue, useAdmin } from '../store'
import { Badge, Btn, Panel, StatCard, go } from '../ui'

const greeting = () => {
  const h = new Date().getHours()
  return h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite'
}

/** Gráfico de barras dos honorários recebidos nos últimos 6 meses (SVG, sem bibliotecas). */
function RevenueChart({ months }: { months: { label: string; value: number }[] }) {
  const max = Math.max(...months.map((m) => m.value), 1)
  return (
    <figure>
      <div className="flex h-44 items-end gap-3" role="img" aria-label={`Honorários recebidos: ${months.map((m) => `${m.label} ${brl(m.value)}`).join(', ')}`}>
        {months.map((m, i) => {
          const h = Math.max((m.value / max) * 100, 2)
          const current = i === months.length - 1
          return (
            <div key={m.label} className="group flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2">
              <span className="hidden text-[0.7rem] font-medium whitespace-nowrap text-muted opacity-0 transition-opacity group-hover:opacity-100 sm:block">
                {m.value ? brl(m.value).replace(',00', '') : '—'}
              </span>
              <div
                className={`w-full max-w-12 rounded-t-xl transition-colors ${current ? 'bg-gold-500' : 'bg-navy-950/85 group-hover:bg-navy-800'}`}
                style={{ height: `${h}%` }}
              />
              <span className="text-xs text-muted capitalize">{m.label}</span>
            </div>
          )
        })}
      </div>
    </figure>
  )
}

export function Dashboard() {
  const { data } = useAdmin()
  const today = todayISO()

  const stats = useMemo(() => {
    const activeCases = data.cases.filter((c) => c.status === 'ativo')
    const inWeek = toDay(new Date(Date.now() + 7 * 86_400_000))
    const pendingAgenda = data.agenda.filter((a) => !a.done)
    const weekDeadlines = pendingAgenda.filter((a) => a.kind === 'prazo' && a.date >= today && a.date <= inWeek)
    const overdueDeadlines = pendingAgenda.filter((a) => a.kind === 'prazo' && a.date < today)
    const receivable = data.fees.filter((f) => !f.paidAt && f.kind !== 'despesa' && f.amount > 0)
    const overdueFees = receivable.filter(isOverdue)
    return {
      activeCases: activeCases.length,
      weekDeadlines: weekDeadlines.length,
      overdueDeadlines: overdueDeadlines.length,
      newLeads: data.leads.filter((l) => l.stage === 'novo').length,
      receivable: receivable.reduce((s, f) => s + f.amount, 0),
      overdueAmount: overdueFees.reduce((s, f) => s + f.amount, 0),
    }
  }, [data, today])

  const upcoming = useMemo(
    () =>
      data.agenda
        .filter((a) => !a.done)
        .sort((a, b) => (a.date + (a.time ?? '')).localeCompare(b.date + (b.time ?? '')))
        .slice(0, 7),
    [data.agenda],
  )

  const months = useMemo(() => {
    const out: { label: string; value: number }[] = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date()
      d.setDate(1)
      d.setMonth(d.getMonth() - i)
      const key = toDay(d).slice(0, 7)
      const value = data.fees.filter((f) => f.paidAt?.startsWith(key) && f.kind !== 'despesa').reduce((s, f) => s + f.amount, 0)
      out.push({ label: new Intl.DateTimeFormat('pt-BR', { month: 'short' }).format(d).replace('.', ''), value })
    }
    return out
  }, [data.fees])

  const byArea = useMemo(() => {
    const counts = new Map<string, number>()
    data.cases.filter((c) => c.status !== 'encerrado').forEach((c) => counts.set(c.area, (counts.get(c.area) ?? 0) + 1))
    const total = [...counts.values()].reduce((a, b) => a + b, 0) || 1
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([area, n]) => ({ area, n, pct: (n / total) * 100 }))
  }, [data.cases])

  const recentLeads = useMemo(() => [...data.leads].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 4), [data.leads])
  const firstName = site.lawyer.name.split(' ')[0]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-muted first-letter:uppercase">
            {new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date())}
          </p>
          <h1 className="mt-1 font-display text-[1.9rem] leading-tight font-semibold tracking-[-0.04em] text-navy-950 sm:text-[2.2rem]">
            {greeting()}, {firstName}.
          </h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Btn icon="plus" onClick={() => go('/agenda?novo')}>Novo prazo</Btn>
          <Btn icon="plus" variant="primary" onClick={() => go('/processos?novo')}>Novo processo</Btn>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <StatCard label="Processos ativos" value={stats.activeCases} icon="folder" hint={`${data.clients.length} clientes cadastrados`} />
        <StatCard
          label="Prazos em 7 dias"
          value={stats.weekDeadlines}
          icon="clock"
          tone={stats.overdueDeadlines ? 'red' : 'neutral'}
          hint={stats.overdueDeadlines ? <span className="font-medium text-red-700">{stats.overdueDeadlines} vencido(s)</span> : 'Nenhum prazo vencido'}
        />
        <StatCard label="Novos contatos" value={stats.newLeads} icon="inbox" tone="gold" hint="Aguardando primeiro retorno" />
        <StatCard
          label="A receber"
          value={brl(stats.receivable).replace(',00', '')}
          icon="wallet"
          hint={stats.overdueAmount ? <span className="font-medium text-red-700">{brl(stats.overdueAmount)} em atraso</span> : 'Sem atrasos'}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5 lg:gap-6">
        <Panel
          className="lg:col-span-3"
          title="Próximos prazos e compromissos"
          action={
            <a href="#/agenda" className="text-sm font-medium text-navy-950 hover:text-gold-700">
              Ver agenda
            </a>
          }
        >
          {upcoming.length === 0 ? (
            <p className="text-sm text-muted">Nenhum compromisso pendente.</p>
          ) : (
            <ul className="divide-y divide-navy-950/[0.06]">
              {upcoming.map((a) => {
                const k = agendaKinds[a.kind]
                const u = urgency(a)
                const c = caseById(data, a.caseId)
                return (
                  <li key={a.id}>
                    <a href={c ? `#/processos/${c.id}` : '#/agenda'} className="-mx-2 flex items-center gap-3 rounded-xl px-2 py-3 hover:bg-mist">
                      <span className="w-12 shrink-0 text-center">
                        <span className="block font-display text-xl leading-none font-semibold text-navy-950">{fmtDate(a.date, { day: '2-digit' })}</span>
                        <span className="block text-[0.7rem] text-muted uppercase">{fmtDate(a.date, { month: 'short' }).replace('.', '')}</span>
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-navy-950">{a.title}</span>
                        <span className="block truncate text-xs text-muted">
                          {k.label}
                          {a.time ? ` · ${a.time}` : ''}
                          {c ? ` · ${c.title}` : ''}
                        </span>
                      </span>
                      <Badge tone={u.tone}>{u.text}</Badge>
                    </a>
                  </li>
                )
              })}
            </ul>
          )}
        </Panel>

        <Panel className="lg:col-span-2" title="Honorários recebidos" action={<span className="text-xs text-muted">últimos 6 meses</span>}>
          <RevenueChart months={months} />
          <p className="mt-4 border-t border-navy-950/[0.06] pt-4 text-sm text-muted">
            No mês atual: <strong className="text-navy-950">{brl(months[months.length - 1].value)}</strong>
          </p>
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
        <Panel
          title="Contatos recentes"
          action={
            <a href="#/contatos" className="text-sm font-medium text-navy-950 hover:text-gold-700">
              Ver funil
            </a>
          }
        >
          <ul className="space-y-2">
            {recentLeads.map((l) => (
              <li key={l.id} className="flex items-center gap-3 rounded-2xl bg-mist px-3.5 py-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-navy-950 text-xs font-semibold text-gold-500">
                  {l.name.split(' ').map((p) => p[0]).slice(0, 2).join('')}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-navy-950">{l.name}</span>
                  <span className="block truncate text-xs text-muted">{l.subject} · {fmtDate(l.createdAt, { day: '2-digit', month: 'short' })}</span>
                </span>
                <Badge tone={l.stage === 'novo' ? 'gold' : l.stage === 'contratado' ? 'green' : l.stage === 'perdido' ? 'neutral' : 'blue'}>
                  {stageLabels[l.stage]}
                </Badge>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Processos por área">
          <ul className="space-y-4">
            {byArea.map((a) => (
              <li key={a.area}>
                <div className="flex justify-between text-sm">
                  <span className="text-navy-950">{areaTitle(a.area)}</span>
                  <span className="text-muted">{a.n}</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-mist">
                  <div className="h-full rounded-full bg-navy-950" style={{ width: `${a.pct}%` }} />
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-5 flex items-center gap-2 text-xs text-muted">
            <Icon name="folder" size={14} /> Considera processos ativos e suspensos.
          </p>
        </Panel>
      </div>
    </div>
  )
}
