import { useMemo, useState, type FormEvent } from 'react'
import { Icon } from '../../components/ui/Icon'
import { agendaKinds, urgency } from '../labels'
import { deadlineDate, fmtDate, isCourtDay, isRecess, parseDay, toDay, todayISO } from '../lib/legal'
import { caseById, useAdmin } from '../store'
import type { AgendaItem, AgendaKind } from '../types'
import { Badge, Btn, EmptyState, IconBtn, Input, Modal, PageHeader, Panel, Select, Textarea, useAutoOpen } from '../ui'

type Draft = Omit<AgendaItem, 'id'> & { id?: string }

export function AgendaForm({ initial, caseId, defaultDate, onDone }: { initial?: AgendaItem; caseId?: string; defaultDate?: string; onDone: () => void }) {
  const { data, saveAgenda } = useAdmin()
  const [f, setF] = useState<Draft>(
    initial ?? { kind: defaultDate ? 'reuniao' : 'prazo', title: '', date: defaultDate ?? todayISO(), time: '', caseId: caseId ?? '', done: false, notes: '' },
  )
  const [calc, setCalc] = useState({ start: todayISO(), amount: 15, mode: 'uteis' as 'uteis' | 'corridos' })
  const [error, setError] = useState('')
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setF((x) => ({ ...x, [k]: v }))

  const result = useMemo(() => (calc.amount > 0 ? deadlineDate(parseDay(calc.start), calc.amount, calc.mode) : null), [calc])
  const resultNote = useMemo(() => {
    if (!result) return ''
    const start = parseDay(calc.start)
    let recess = false
    for (const d = new Date(start); d <= result; d.setDate(d.getDate() + 1)) if (isRecess(d)) recess = true
    return [
      `Início em ${fmtDate(calc.start)} (dia do começo excluído — CPC, art. 224).`,
      calc.mode === 'uteis' ? `${calc.amount} dias úteis (art. 219), sem fins de semana e feriados.` : `${calc.amount} dias corridos, prorrogado se cair em dia não útil.`,
      recess ? 'Período inclui o recesso forense de 20/12 a 20/01 (art. 220).' : '',
    ]
      .filter(Boolean)
      .join(' ')
  }, [result, calc])

  const applyCalc = () => {
    if (!result) return
    setF((x) => ({ ...x, date: toDay(result), computation: resultNote }))
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (f.title.trim().length < 3) return setError('Descreva o prazo ou compromisso.')
    saveAgenda({ ...f, title: f.title.trim(), caseId: f.caseId || undefined, time: f.time || undefined })
    onDone()
  }

  const weekendOrHoliday = f.date && !isCourtDay(parseDay(f.date))

  return (
    <form onSubmit={submit} noValidate className="grid gap-4 sm:grid-cols-2">
      <fieldset className="sm:col-span-2">
        <legend className="text-sm font-medium text-navy-950">Tipo</legend>
        <div className="mt-1.5 flex flex-wrap gap-2">
          {(Object.keys(agendaKinds) as AgendaKind[]).map((k) => (
            <label key={k} className="flex cursor-pointer items-center gap-2 rounded-full border border-navy-950/12 px-3.5 py-1.5 text-sm has-checked:border-navy-950 has-checked:bg-navy-950 has-checked:text-white has-focus-visible:outline-2 has-focus-visible:outline-gold-500">
              <input type="radio" name="kind" className="sr-only" checked={f.kind === k} onChange={() => set('kind', k)} />
              <Icon name={agendaKinds[k].icon} size={15} />
              {agendaKinds[k].label}
            </label>
          ))}
        </div>
      </fieldset>

      <Input className="sm:col-span-2" label="Descrição" value={f.title} onChange={(e) => { set('title', e.target.value); setError('') }} error={error} placeholder={f.kind === 'prazo' ? 'Ex.: Contestação' : 'Ex.: Audiência de conciliação'} autoFocus />

      {f.kind === 'prazo' && (
        <div className="rounded-2xl border border-gold-500/30 bg-gold-500/[0.07] p-4 sm:col-span-2">
          <p className="flex items-center gap-2 text-sm font-semibold text-navy-950">
            <Icon name="clock" size={16} className="text-gold-700" /> Calculadora de prazo processual
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <Input label="Intimação / publicação" type="date" value={calc.start} onChange={(e) => setCalc({ ...calc, start: e.target.value })} />
            <Input label="Prazo (dias)" type="number" min={1} max={365} value={calc.amount} onChange={(e) => setCalc({ ...calc, amount: Number(e.target.value) })} />
            <Select label="Contagem" value={calc.mode} onChange={(e) => setCalc({ ...calc, mode: e.target.value as 'uteis' | 'corridos' })}>
              <option value="uteis">Dias úteis (processual)</option>
              <option value="corridos">Dias corridos (material)</option>
            </Select>
          </div>
          {result && (
            <div className="mt-3 flex flex-col gap-3 rounded-xl bg-white p-3 sm:flex-row sm:items-center">
              <p className="flex-1 text-sm">
                <span className="text-muted">Vencimento:</span>{' '}
                <strong className="text-navy-950 capitalize">{new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }).format(result)}</strong>
                <span className="mt-1 block text-xs text-muted">{resultNote}</span>
              </p>
              <Btn size="sm" variant="gold" onClick={applyCalc}>Usar esta data</Btn>
            </div>
          )}
          <p className="mt-2 text-xs text-muted">Considera feriados nacionais e o recesso forense. Confira feriados locais e suspensões do tribunal.</p>
        </div>
      )}

      <Input label={f.kind === 'prazo' ? 'Data de vencimento' : 'Data'} type="date" value={f.date} onChange={(e) => set('date', e.target.value)} hint={weekendOrHoliday ? '⚠ Data não é dia útil forense.' : undefined} />
      <Input label="Horário (opcional)" type="time" value={f.time ?? ''} onChange={(e) => set('time', e.target.value)} />
      <Select className="sm:col-span-2" label="Processo vinculado" value={f.caseId ?? ''} onChange={(e) => set('caseId', e.target.value)}>
        <option value="">Nenhum</option>
        {data.cases.filter((c) => c.status !== 'encerrado').map((c) => (
          <option key={c.id} value={c.id}>{c.title}</option>
        ))}
      </Select>
      <Textarea className="sm:col-span-2" label="Observações" value={f.notes ?? ''} onChange={(e) => set('notes', e.target.value)} rows={2} />
      <div className="flex justify-end gap-2 sm:col-span-2">
        <Btn onClick={onDone}>Cancelar</Btn>
        <Btn type="submit" variant="primary">Salvar</Btn>
      </div>
    </form>
  )
}

/** Calendário mensal com os compromissos de cada dia. */
function MonthCalendar({ items, onPick }: { items: AgendaItem[]; onPick: (iso: string) => void }) {
  const [cursor, setCursor] = useState(() => {
    const d = new Date()
    d.setDate(1)
    return d
  })
  const year = cursor.getFullYear()
  const month = cursor.getMonth()
  const first = new Date(year, month, 1)
  const days = new Date(year, month + 1, 0).getDate()
  const offset = first.getDay()
  const cells = [...Array(offset).fill(null), ...Array.from({ length: days }, (_, i) => new Date(year, month, i + 1, 12))]
  const today = todayISO()
  const byDay = useMemo(() => {
    const m = new Map<string, AgendaItem[]>()
    items.forEach((a) => m.set(a.date, [...(m.get(a.date) ?? []), a]))
    return m
  }, [items])
  const shift = (n: number) => setCursor(new Date(year, month + n, 1))

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold capitalize text-navy-950">
          {new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(cursor)}
        </h2>
        <div className="flex gap-1">
          <IconBtn icon="chevronLeft" label="Mês anterior" onClick={() => shift(-1)} />
          <Btn size="sm" onClick={() => setCursor(new Date(new Date().getFullYear(), new Date().getMonth(), 1))}>Hoje</Btn>
          <IconBtn icon="chevronRight" label="Próximo mês" onClick={() => shift(1)} />
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted">
        {['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'].map((d) => (
          <div key={d} className="py-1 uppercase">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (!d) return <div key={`x${i}`} />
          const iso = toDay(d)
          const list = byDay.get(iso) ?? []
          const off = !isCourtDay(d)
          return (
            <button
              key={iso}
              type="button"
              onClick={() => onPick(iso)}
              aria-label={`${fmtDate(iso, { day: 'numeric', month: 'long' })}: ${list.length} compromisso(s)`}
              className={`flex min-h-16 flex-col items-stretch rounded-xl border p-1.5 text-left transition-colors hover:border-navy-950/30 sm:min-h-24 ${
                iso === today ? 'border-gold-500 bg-gold-500/[0.08]' : off ? 'border-transparent bg-mist/70' : 'border-navy-950/[0.07] bg-white'
              }`}
            >
              <span className={`text-xs ${iso === today ? 'font-semibold text-gold-700' : off ? 'text-muted' : 'text-navy-950'}`}>{d.getDate()}</span>
              <span className="mt-1 hidden space-y-1 sm:block">
                {list.slice(0, 2).map((a) => (
                  <span key={a.id} className={`block truncate rounded-md px-1.5 py-0.5 text-[0.68rem] ${a.done ? 'bg-mist text-muted line-through' : a.kind === 'prazo' ? 'bg-red-50 text-red-700' : a.kind === 'audiencia' ? 'bg-sky-50 text-sky-700' : 'bg-gold-500/15 text-gold-700'}`}>
                    {a.time ? `${a.time} ` : ''}{a.title}
                  </span>
                ))}
                {list.length > 2 && <span className="block text-[0.68rem] text-muted">+{list.length - 2}</span>}
              </span>
              {list.length > 0 && (
                <span className="mt-auto flex gap-0.5 sm:hidden">
                  {list.slice(0, 3).map((a) => (
                    <span key={a.id} className={`size-1.5 rounded-full ${a.kind === 'prazo' ? 'bg-red-500' : 'bg-navy-950'}`} />
                  ))}
                </span>
              )}
            </button>
          )
        })}
      </div>
      <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
        <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-red-500" /> Prazo</span>
        <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-sky-500" /> Audiência</span>
        <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-gold-500" /> Reunião / tarefa</span>
        <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-navy-950/20" /> Sem expediente forense</span>
      </p>
    </div>
  )
}

export function AgendaPage() {
  const { data, toggleAgenda, removeAgenda } = useAdmin()
  const [view, setView] = useState<'lista' | 'calendario'>('lista')
  const [kind, setKind] = useState<AgendaKind | 'todos'>('todos')
  const [showDone, setShowDone] = useState(false)
  const [form, setForm] = useState<{ open: boolean; item?: AgendaItem; date?: string }>({ open: false })
  useAutoOpen(() => setForm({ open: true }))

  const items = useMemo(
    () =>
      data.agenda
        .filter((a) => kind === 'todos' || a.kind === kind)
        .filter((a) => showDone || !a.done)
        .sort((a, b) => (a.date + (a.time ?? '')).localeCompare(b.date + (b.time ?? ''))),
    [data.agenda, kind, showDone],
  )

  const today = todayISO()
  const groups = [
    { title: 'Vencidos', list: items.filter((a) => !a.done && a.date < today) },
    { title: 'Hoje', list: items.filter((a) => a.date === today) },
    { title: 'Próximos 7 dias', list: items.filter((a) => a.date > today && a.date <= toDay(new Date(Date.now() + 7 * 86_400_000))) },
    { title: 'Mais adiante', list: items.filter((a) => a.date > toDay(new Date(Date.now() + 7 * 86_400_000))) },
    { title: 'Concluídos anteriores', list: items.filter((a) => a.done && a.date < today) },
  ].filter((g) => g.list.length)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Agenda e prazos"
        description="Prazos processuais, audiências, reuniões e tarefas."
        actions={<Btn variant="primary" icon="plus" onClick={() => setForm({ open: true })}>Novo compromisso</Btn>}
      />

      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div role="group" aria-label="Visualização" className="inline-flex rounded-full border border-navy-950/10 bg-white p-1">
          {(['lista', 'calendario'] as const).map((v) => (
            <button key={v} type="button" aria-pressed={view === v} onClick={() => setView(v)} className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm ${view === v ? 'bg-navy-950 text-white' : 'text-muted hover:text-navy-950'}`}>
              <Icon name={v === 'lista' ? 'menu' : 'calendar'} size={15} />
              {v === 'lista' ? 'Lista' : 'Calendário'}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {(['todos', ...Object.keys(agendaKinds)] as (AgendaKind | 'todos')[]).map((k) => (
            <button key={k} type="button" aria-pressed={kind === k} onClick={() => setKind(k)} className={`rounded-full border px-3.5 py-1.5 text-sm ${kind === k ? 'border-navy-950 bg-navy-950 text-white' : 'border-navy-950/10 bg-white text-muted hover:text-navy-950'}`}>
              {k === 'todos' ? 'Todos' : agendaKinds[k].label}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm text-muted md:ml-auto">
          <input type="checkbox" checked={showDone} onChange={(e) => setShowDone(e.target.checked)} className="size-4 accent-navy-950" />
          Mostrar concluídos
        </label>
      </div>

      {view === 'calendario' ? (
        <Panel>
          <MonthCalendar items={items} onPick={(iso) => setForm({ open: true, date: iso })} />
        </Panel>
      ) : groups.length === 0 ? (
        <EmptyState icon="calendar" title="Nada pendente por aqui" text="Cadastre prazos e compromissos para acompanhar os vencimentos." />
      ) : (
        <div className="space-y-6">
          {groups.map((g) => (
            <section key={g.title}>
              <h2 className={`mb-2 text-sm font-semibold ${g.title === 'Vencidos' ? 'text-red-700' : 'text-navy-950'}`}>
                {g.title} <span className="font-normal text-muted">({g.list.length})</span>
              </h2>
              <ul className="space-y-2">
                {g.list.map((a) => {
                  const k = agendaKinds[a.kind]
                  const u = urgency(a)
                  const c = caseById(data, a.caseId)
                  return (
                    <li key={a.id} className={`flex items-start gap-3 rounded-2xl border bg-white p-4 ${!a.done && a.date < today ? 'border-red-200' : 'border-navy-950/[0.07]'}`}>
                      <input type="checkbox" checked={a.done} onChange={() => toggleAgenda(a.id)} aria-label={`Marcar como concluído: ${a.title}`} className="mt-1 size-4.5 shrink-0 accent-navy-950" />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge tone={k.tone}>{k.label}</Badge>
                          <Badge tone={u.tone}>{u.text}</Badge>
                        </div>
                        <p className={`mt-1.5 font-medium ${a.done ? 'text-muted line-through' : 'text-navy-950'}`}>{a.title}</p>
                        <p className="mt-0.5 text-sm text-muted">
                          {fmtDate(a.date, { weekday: 'short', day: '2-digit', month: 'short' })}
                          {a.time ? ` às ${a.time}` : ''}
                          {c && (
                            <>
                              {' · '}
                              <a href={`#/processos/${c.id}`} className="underline decoration-navy-950/20 underline-offset-2 hover:text-navy-950">{c.title}</a>
                            </>
                          )}
                        </p>
                        {(a.computation || a.notes) && <p className="mt-1.5 text-xs text-muted">{a.computation ?? a.notes}</p>}
                      </div>
                      <div className="flex shrink-0">
                        <IconBtn icon="edit" label="Editar" onClick={() => setForm({ open: true, item: a })} />
                        <IconBtn icon="trash" tone="danger" label="Excluir" onClick={() => window.confirm('Excluir este compromisso?') && removeAgenda(a.id)} />
                      </div>
                    </li>
                  )
                })}
              </ul>
            </section>
          ))}
        </div>
      )}

      <Modal open={form.open} onClose={() => setForm({ open: false })} title={form.item ? 'Editar compromisso' : 'Novo prazo ou compromisso'} wide>
        <AgendaForm
          key={form.item?.id ?? form.date ?? 'novo'}
          initial={form.item}
          defaultDate={form.date}
          onDone={() => setForm({ open: false })}
        />
      </Modal>
    </div>
  )
}
