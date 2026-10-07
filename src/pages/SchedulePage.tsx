import { useEffect, useId, useState, type FormEvent, type ReactNode } from 'react'
import { fullAddress, site } from '../config/site'
import { contactSubjects } from '../data/content'
import { findArea } from '../data/areas'
import { Button } from '../components/ui/Button'
import { Container } from '../components/ui/Container'
import { Icon, type IconName } from '../components/ui/Icon'
import { PageHero } from '../components/ui/PageHero'
import { track } from '../lib/analytics'
import { formatPhone, isEmail, isPhone } from '../lib/format'
import { pushInbox } from '../lib/inbox'
import { availableDays, dayKey, formatDay, formatLongDate, slotsFor } from '../lib/schedule'
import { whatsappLink } from '../lib/whatsapp'
import { to } from '../lib/paths'

type Modality = 'presencial' | 'online'
type Form = {
  modality: Modality | ''
  subject: string
  day: string
  slot: string
  name: string
  phone: string
  email: string
  notes: string
  consent: boolean
}
type Errors = Partial<Record<keyof Form, string>>

const empty: Form = { modality: '', subject: '', day: '', slot: '', name: '', phone: '', email: '', notes: '', consent: false }

const modalities: { value: Modality; icon: IconName; title: string; text: string }[] = [
  { value: 'presencial', icon: 'pin', title: 'Presencial', text: `No escritório — ${site.location.district}, ${site.location.city}` },
  { value: 'online', icon: 'globe', title: 'Online', text: 'Por videochamada, de qualquer lugar' },
]

function validate(f: Form): Errors {
  const e: Errors = {}
  if (!f.modality) e.modality = 'Escolha o formato do atendimento.'
  if (!f.subject) e.subject = 'Escolha o assunto.'
  if (!f.day) e.day = 'Escolha uma data.'
  if (!f.slot) e.slot = 'Escolha um horário.'
  if (f.name.trim().length < 2) e.name = 'Informe seu nome.'
  if (!isPhone(f.phone)) e.phone = 'Informe um WhatsApp com DDD.'
  if (!isEmail(f.email)) e.email = 'Informe um e-mail válido.'
  if (!f.consent) e.consent = 'É necessário autorizar o contato.'
  return e
}

/** Bloco numerado de cada etapa do formulário. */
function Step({ n, title, error, errorId, children }: { n: number; title: string; error?: string; errorId: string; children: ReactNode }) {
  return (
    <fieldset className="min-w-0 border-t border-line pt-8 first:border-t-0 first:pt-0" aria-describedby={error ? errorId : undefined}>
      <legend className="flex items-center gap-3.5 font-display text-xl tracking-[-0.02em] text-navy-950">
        <span className="grid size-9 place-items-center rounded-full bg-navy-950 font-display text-sm font-semibold text-gold-500">{n}</span>
        {title}
      </legend>
      <div className="mt-6">{children}</div>
      {error && (
        <p id={errorId} className="mt-3 text-sm text-red-700">
          {error}
        </p>
      )}
    </fieldset>
  )
}

const chip =
  'relative flex cursor-pointer items-center justify-center rounded-xl border border-navy-950/15 bg-white text-navy-950 transition-colors hover:border-navy-950/40 has-checked:border-navy-950 has-checked:bg-navy-950 has-checked:text-white has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-gold-500 has-disabled:cursor-not-allowed has-disabled:opacity-40'

export function SchedulePage() {
  const uid = useId()
  const [form, setForm] = useState<Form>(empty)
  const [errors, setErrors] = useState<Errors>({})
  const [days, setDays] = useState<Date[] | null>(null)
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [sentLink, setSentLink] = useState('')

  // Datas calculadas só no navegador (o HTML é gerado no build).
  useEffect(() => {
    setDays(availableDays())
    const area = findArea(new URLSearchParams(window.location.search).get('area') ?? '')
    if (area) setForm((f) => ({ ...f, subject: area.title }))
  }, [])

  const set = <K extends keyof Form>(key: K, value: Form[K]) => {
    setForm((f) => ({ ...f, [key]: value, ...(key === 'day' ? { slot: '' } : {}) }))
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }))
  }

  const selectedDay = days?.find((d) => dayKey(d) === form.day)
  const slots = selectedDay ? slotsFor(selectedDay) : []
  const id = (k: keyof Form) => `${uid}-${k}`
  const err = (k: keyof Form) => `${uid}-${k}-error`

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const found = validate(form)
    setErrors(found)
    const first = (Object.keys(found) as (keyof Form)[])[0]
    if (first) {
      document.getElementById(['modality', 'subject', 'day', 'slot'].includes(first) ? `${id(first)}-group` : id(first))?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      document.getElementById(id(first))?.focus({ preventScroll: true })
      return
    }

    track('schedule_submit', { subject: form.subject, modality: form.modality })
    const when = selectedDay ? `${formatLongDate(selectedDay)}, às ${form.slot}` : ''
    pushInbox({
      name: form.name.trim(),
      phone: form.phone,
      email: form.email.trim(),
      subject: form.subject,
      message: form.notes.trim() || 'Solicitação de agendamento pelo site.',
      source: 'agendamento',
      preferred: `${form.day} ${form.slot} · ${form.modality}`,
    })

    if (!site.scheduling.endpoint) {
      const text = [
        'Olá! Gostaria de agendar uma consulta.',
        '',
        `*Formato:* ${form.modality === 'online' ? 'Online (videochamada)' : 'Presencial'}`,
        `*Assunto:* ${form.subject}`,
        `*Data e horário:* ${when}`,
        `*Nome:* ${form.name.trim()}`,
        `*WhatsApp:* ${form.phone}`,
        `*E-mail:* ${form.email.trim()}`,
        ...(form.notes.trim() ? ['', form.notes.trim()] : []),
      ].join('\n')
      const link = whatsappLink(text)
      setSentLink(link)
      window.open(link, '_blank', 'noopener,noreferrer')
      setStatus('sent')
      return
    }

    setStatus('sending')
    try {
      const res = await fetch(site.scheduling.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...form, date: form.day, when }),
      })
      if (!res.ok) throw new Error(String(res.status))
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  const input =
    'mt-2 block w-full rounded-xl border border-navy-950/15 bg-white px-4 py-3.5 text-base text-navy-950 placeholder:text-muted/70 transition-[border-color,box-shadow] hover:border-navy-950/35 focus:border-navy-950 focus:shadow-[0_0_0_3px_rgba(28,49,94,0.15)] focus:outline-none aria-invalid:border-red-700'

  return (
    <>
      <PageHero
        crumbs={[{ label: 'Início', href: '/' }, { label: 'Agendar consulta' }]}
        eyebrow="Agendamento online"
        title="Agende sua *consulta*."
        description={
          <p>
            Escolha o formato, o assunto, o dia e o horário. A solicitação é confirmada pela equipe do escritório em
            seguida.
          </p>
        }
      />

      <section aria-label="Formulário de agendamento" className="bg-mist py-14 sm:py-20">
        <Container className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-8">
            {status === 'sent' ? (
              <div role="status" className="panel-in rounded-4xl bg-white p-8 shadow-[0_30px_70px_-40px_rgba(11,19,43,0.35)] sm:p-12">
                <span className="grid size-14 place-items-center rounded-full bg-navy-950 text-gold-500">
                  <Icon name="check" size={28} />
                </span>
                <h2 className="mt-6 font-display text-4xl text-navy-950">Solicitação enviada</h2>
                <p className="mt-4 text-lg leading-relaxed text-muted">
                  {site.scheduling.endpoint
                    ? 'Recebemos sua solicitação. A equipe do escritório entrará em contato para confirmar o horário.'
                    : 'Abrimos o WhatsApp com os dados do agendamento. Basta confirmar o envio da mensagem — a equipe responderá para confirmar o horário.'}
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  {sentLink && (
                    <Button href={sentLink} target="_blank" rel="noopener noreferrer" variant="gold" icon="whatsapp">
                      Abrir o WhatsApp novamente
                    </Button>
                  )}
                  <Button href={to('/')} variant="outline">
                    Voltar ao início
                  </Button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={onSubmit}
                noValidate
                className="space-y-10 rounded-4xl border border-navy-950/[0.07] bg-white p-6 shadow-[0_30px_70px_-40px_rgba(11,19,43,0.35)] sm:p-10"
              >
                <Step n={1} title="Formato do atendimento" error={errors.modality} errorId={err('modality')}>
                  <div id={`${id('modality')}-group`} className="grid gap-3 sm:grid-cols-2">
                    {modalities.map((m, i) => (
                      <label key={m.value} className={`${chip} items-start justify-start gap-4 p-5 text-left`}>
                        <input
                          id={i === 0 ? id('modality') : undefined}
                          type="radio"
                          name="modality"
                          value={m.value}
                          checked={form.modality === m.value}
                          onChange={() => set('modality', m.value)}
                          className="sr-only"
                        />
                        <Icon name={m.icon} size={22} strokeWidth={1.4} className="mt-0.5 shrink-0" />
                        <span>
                          <span className="block font-semibold">{m.title}</span>
                          <span className="mt-1 block text-sm opacity-75">{m.text}</span>
                        </span>
                      </label>
                    ))}
                  </div>
                </Step>

                <Step n={2} title="Assunto" error={errors.subject} errorId={err('subject')}>
                  <div id={`${id('subject')}-group`} className="flex flex-wrap gap-2">
                    {contactSubjects.map((s, i) => (
                      <label key={s} className={`${chip} min-h-11 px-4 text-sm font-medium`}>
                        <input
                          id={i === 0 ? id('subject') : undefined}
                          type="radio"
                          name="subject"
                          value={s}
                          checked={form.subject === s}
                          onChange={() => set('subject', s)}
                          className="sr-only"
                        />
                        {s}
                      </label>
                    ))}
                  </div>
                </Step>

                <Step n={3} title="Data" error={errors.day} errorId={err('day')}>
                  <div id={`${id('day')}-group`} className="-mx-1 flex snap-x gap-2 overflow-x-auto px-1 pb-2">
                    {days === null ? (
                      <p className="text-muted">Carregando datas disponíveis…</p>
                    ) : (
                      days.map((d, i) => (
                        <label key={dayKey(d)} className={`${chip} w-[4.75rem] shrink-0 snap-start flex-col py-3`}>
                          <input
                            id={i === 0 ? id('day') : undefined}
                            type="radio"
                            name="day"
                            value={dayKey(d)}
                            checked={form.day === dayKey(d)}
                            onChange={() => set('day', dayKey(d))}
                            aria-label={formatLongDate(d)}
                            className="sr-only"
                          />
                          <span className="text-[0.7rem] font-semibold tracking-[0.12em] uppercase opacity-70">
                            {formatDay(d, { weekday: 'short' })}
                          </span>
                          <span className="mt-1 font-display text-3xl leading-none">{d.getDate()}</span>
                          <span className="mt-1 text-xs opacity-70">{formatDay(d, { month: 'short' })}</span>
                        </label>
                      ))
                    )}
                  </div>
                </Step>

                <Step n={4} title="Horário" error={errors.slot} errorId={err('slot')}>
                  <div id={`${id('slot')}-group`} className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-7">
                    {site.scheduling.slots.map((s, i) => {
                      const disabled = !selectedDay || !slots.includes(s)
                      return (
                        <label key={s} className={`${chip} min-h-12 text-sm font-semibold`}>
                          <input
                            id={i === 0 ? id('slot') : undefined}
                            type="radio"
                            name="slot"
                            value={s}
                            disabled={disabled}
                            checked={form.slot === s}
                            onChange={() => set('slot', s)}
                            className="sr-only"
                          />
                          {s}
                        </label>
                      )
                    })}
                  </div>
                  {!selectedDay && <p className="mt-3 text-sm text-muted">Escolha uma data para ver os horários.</p>}
                </Step>

                <Step n={5} title="Seus dados" errorId={err('name')}>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label htmlFor={id('name')} className="block text-sm font-semibold text-navy-950">Nome</label>
                      <input id={id('name')} autoComplete="name" value={form.name} onChange={(e) => set('name', e.target.value)} aria-invalid={!!errors.name} aria-describedby={errors.name ? err('name') : undefined} className={input} />
                      {errors.name && <p id={err('name')} className="mt-1.5 text-sm text-red-700">{errors.name}</p>}
                    </div>
                    <div>
                      <label htmlFor={id('phone')} className="block text-sm font-semibold text-navy-950">WhatsApp</label>
                      <input id={id('phone')} type="tel" inputMode="tel" autoComplete="tel-national" placeholder="(00) 00000-0000" value={form.phone} onChange={(e) => set('phone', formatPhone(e.target.value))} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? err('phone') : undefined} className={input} />
                      {errors.phone && <p id={err('phone')} className="mt-1.5 text-sm text-red-700">{errors.phone}</p>}
                    </div>
                    <div>
                      <label htmlFor={id('email')} className="block text-sm font-semibold text-navy-950">E-mail</label>
                      <input id={id('email')} type="email" inputMode="email" autoComplete="email" value={form.email} onChange={(e) => set('email', e.target.value)} aria-invalid={!!errors.email} aria-describedby={errors.email ? err('email') : undefined} className={input} />
                      {errors.email && <p id={err('email')} className="mt-1.5 text-sm text-red-700">{errors.email}</p>}
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor={id('notes')} className="block text-sm font-semibold text-navy-950">
                        Resumo do caso <span className="font-normal text-muted">(opcional)</span>
                      </label>
                      <textarea id={id('notes')} rows={4} value={form.notes} onChange={(e) => set('notes', e.target.value)} placeholder="Conte brevemente o que está acontecendo. Evite enviar dados sensíveis neste momento." className={`${input} resize-y`} />
                    </div>
                    <div className="sm:col-span-2">
                      <div className="flex items-start gap-3">
                        <input id={id('consent')} type="checkbox" checked={form.consent} onChange={(e) => set('consent', e.target.checked)} aria-invalid={!!errors.consent} aria-describedby={errors.consent ? err('consent') : undefined} className="mt-0.5 size-5 shrink-0 accent-navy-950" />
                        <label htmlFor={id('consent')} className="text-sm leading-relaxed text-muted">
                          Autorizo o uso dos meus dados para contato e confirmação do agendamento, conforme a{' '}
                          <a href={to('/privacidade/')} className="font-medium text-navy-950 underline underline-offset-2">Política de Privacidade</a>.
                        </label>
                      </div>
                      {errors.consent && <p id={err('consent')} className="mt-1.5 text-sm text-red-700">{errors.consent}</p>}
                    </div>
                  </div>
                </Step>

                <div className="flex flex-col gap-4 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
                  <Button type="submit" variant="primary" size="lg" iconRight="arrowRight" disabled={status === 'sending'} className="w-full sm:w-auto">
                    {status === 'sending' ? 'Enviando…' : 'Solicitar agendamento'}
                  </Button>
                  <p className="text-xs leading-relaxed text-muted sm:max-w-[16rem]">
                    O horário fica reservado após a confirmação do escritório.
                  </p>
                </div>
                {status === 'error' && (
                  <p role="alert" className="rounded-2xl bg-red-50 p-4 text-sm text-red-800">
                    Não foi possível enviar agora. Tente novamente ou fale conosco pelo WhatsApp.
                  </p>
                )}
              </form>
            )}
          </div>

          {/* Resumo */}
          <aside aria-label="Resumo do agendamento" className="lg:col-span-4">
            <div className="on-dark relative overflow-hidden rounded-4xl bg-navy-950 p-7 text-white sm:p-8 lg:sticky lg:top-28">
              <div aria-hidden="true" className="pattern-lines absolute inset-0 opacity-70" />
              <div className="relative">
                <p className="eyebrow text-gold-500">Resumo</p>
                <dl className="mt-6 divide-y divide-white/10 border-y border-white/10 text-sm">
                  {[
                    ['Formato', form.modality ? modalities.find((m) => m.value === form.modality)!.title : '—'],
                    ['Assunto', form.subject || '—'],
                    ['Data', selectedDay ? formatLongDate(selectedDay) : '—'],
                    ['Horário', form.slot ? `${form.slot} · ${site.scheduling.durationMinutes} min` : '—'],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-4 py-3.5">
                      <dt className="text-white/60">{k}</dt>
                      <dd className="text-right font-medium first-letter:uppercase">{v}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-6 text-sm leading-relaxed text-white/70">
                  {form.modality === 'online'
                    ? 'O link da videochamada é enviado após a confirmação.'
                    : `Endereço: ${fullAddress}.`}
                </p>
                <p className="mt-4 text-xs leading-relaxed text-white/55">
                  Os honorários são informados com transparência antes de qualquer contratação.
                </p>
              </div>
            </div>
          </aside>
        </Container>
      </section>
    </>
  )
}
