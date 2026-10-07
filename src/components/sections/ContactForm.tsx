import { useId, useState, type ChangeEvent, type FormEvent } from 'react'
import { site } from '../../config/site'
import { contactSubjects } from '../../data/content'
import { track } from '../../lib/analytics'
import { formatPhone, isEmail, isPhone } from '../../lib/format'
import { pushInbox } from '../../lib/inbox'
import { whatsappLink } from '../../lib/whatsapp'
import { Button } from '../ui/Button'
import { Icon } from '../ui/Icon'
import { to } from '../../lib/paths'

type Fields = { name: string; email: string; whatsapp: string; subject: string; message: string; consent: boolean }
type Errors = Partial<Record<keyof Fields, string>>
type Status = 'idle' | 'sending' | 'sent' | 'error'

const initial: Fields = { name: '', email: '', whatsapp: '', subject: '', message: '', consent: false }

function validate(f: Fields): Errors {
  const e: Errors = {}
  if (f.name.trim().length < 2) e.name = 'Informe seu nome.'
  if (!isEmail(f.email)) e.email = 'Informe um e-mail válido.'
  if (!isPhone(f.whatsapp)) e.whatsapp = 'Informe um WhatsApp com DDD.'
  if (!f.subject) e.subject = 'Selecione um assunto.'
  if (f.message.trim().length < 10) e.message = 'Descreva brevemente sua situação.'
  if (!f.consent) e.consent = 'É necessário autorizar o contato.'
  return e
}

const inputBase =
  'mt-2 block w-full rounded-xl border bg-white px-4 py-3.5 text-base text-navy-950 placeholder:text-muted/70 transition-[border-color,box-shadow] duration-200 focus:border-navy-950 focus:shadow-[0_0_0_3px_rgba(28,49,94,0.15)] focus:outline-none'

export function ContactForm() {
  const [fields, setFields] = useState<Fields>(initial)
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<Status>('idle')
  const uid = useId()
  const fid = (name: keyof Fields) => `${uid}-${name}`

  const update = (name: keyof Fields) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target
    const value =
      target instanceof HTMLInputElement && target.type === 'checkbox'
        ? target.checked
        : name === 'whatsapp'
          ? formatPhone(target.value)
          : target.value
    setFields((f) => ({ ...f, [name]: value }))
    if (errors[name]) setErrors((err) => ({ ...err, [name]: undefined }))
  }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const found = validate(fields)
    setErrors(found)
    const firstInvalid = (Object.keys(found) as (keyof Fields)[])[0]
    if (firstInvalid) {
      document.getElementById(fid(firstInvalid))?.focus()
      return
    }

    track('contact_form_submit', { subject: fields.subject })
    pushInbox({ name: fields.name.trim(), phone: fields.whatsapp, email: fields.email.trim(), subject: fields.subject, message: fields.message.trim(), source: 'site' })

    // Sem endpoint configurado: envia a mensagem pelo WhatsApp.
    if (!site.form.endpoint) {
      const text = [
        'Olá! Gostaria de obter informações sobre atendimento jurídico.',
        '',
        `*Nome:* ${fields.name.trim()}`,
        `*E-mail:* ${fields.email.trim()}`,
        `*WhatsApp:* ${fields.whatsapp}`,
        `*Assunto:* ${fields.subject}`,
        '',
        fields.message.trim(),
      ].join('\n')
      window.open(whatsappLink(text), '_blank', 'noopener,noreferrer')
      setStatus('sent')
      setFields(initial)
      return
    }

    setStatus('sending')
    try {
      const res = await fetch(site.form.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(fields),
      })
      if (!res.ok) throw new Error(String(res.status))
      setStatus('sent')
      setFields(initial)
    } catch {
      setStatus('error')
    }
  }

  const errorProps = (name: keyof Fields) =>
    errors[name] ? { 'aria-invalid': true as const, 'aria-describedby': `${fid(name)}-error` } : {}

  const fieldClass = (name: keyof Fields) =>
    `${inputBase} ${errors[name] ? 'border-red-700' : 'border-navy-950/15 hover:border-navy-950/35'}`

  const errorMsg = (name: keyof Fields) =>
    errors[name] ? (
      <p id={`${fid(name)}-error`} className="mt-1.5 text-sm text-red-700">
        {errors[name]}
      </p>
    ) : null

  const label = 'block text-sm font-semibold text-navy-950'

  return (
    <form onSubmit={onSubmit} noValidate className="rounded-4xl border border-navy-950/[0.07] bg-white p-6 shadow-[0_30px_70px_-40px_rgba(11,19,43,0.35)] sm:p-10">
      <h3 className="font-display text-2xl tracking-[-0.03em] text-navy-950 sm:text-3xl">Envie uma mensagem</h3>
      <p className="mt-2 text-muted">Responderemos o mais breve possível, em horário de atendimento.</p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor={fid('name')} className={label}>
            Nome
          </label>
          <input id={fid('name')} name="name" type="text" autoComplete="name" required value={fields.name} onChange={update('name')} className={fieldClass('name')} {...errorProps('name')} />
          {errorMsg('name')}
        </div>

        <div>
          <label htmlFor={fid('email')} className={label}>
            E-mail
          </label>
          <input id={fid('email')} name="email" type="email" autoComplete="email" inputMode="email" required value={fields.email} onChange={update('email')} className={fieldClass('email')} {...errorProps('email')} />
          {errorMsg('email')}
        </div>

        <div>
          <label htmlFor={fid('whatsapp')} className={label}>
            WhatsApp
          </label>
          <input id={fid('whatsapp')} name="whatsapp" type="tel" autoComplete="tel-national" inputMode="tel" placeholder="(00) 00000-0000" required value={fields.whatsapp} onChange={update('whatsapp')} className={fieldClass('whatsapp')} {...errorProps('whatsapp')} />
          {errorMsg('whatsapp')}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor={fid('subject')} className={label}>
            Assunto
          </label>
          <div className="relative">
            <select id={fid('subject')} name="subject" required value={fields.subject} onChange={update('subject')} className={`${fieldClass('subject')} appearance-none pr-11 ${fields.subject ? '' : 'text-muted'}`} {...errorProps('subject')}>
              <option value="" disabled>
                Selecione um assunto
              </option>
              {contactSubjects.map((s) => (
                <option key={s} value={s} className="text-navy-950">
                  {s}
                </option>
              ))}
            </select>
            <Icon name="chevronDown" size={18} className="pointer-events-none absolute top-1/2 right-4 mt-1 -translate-y-1/2 text-muted" />
          </div>
          {errorMsg('subject')}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor={fid('message')} className={label}>
            Mensagem
          </label>
          <textarea id={fid('message')} name="message" rows={5} required value={fields.message} onChange={update('message')} placeholder="Conte brevemente o que está acontecendo." className={`${fieldClass('message')} resize-y`} {...errorProps('message')} />
          {errorMsg('message')}
        </div>

        <div className="sm:col-span-2">
          <div className="flex items-start gap-3">
            <input id={fid('consent')} name="consent" type="checkbox" checked={fields.consent} onChange={update('consent')} className="mt-0.5 size-5 shrink-0 rounded accent-navy-950" {...errorProps('consent')} />
            <label htmlFor={fid('consent')} className="text-sm leading-relaxed text-muted">
              Autorizo o uso dos meus dados para retorno do contato, conforme a{' '}
              <a href={to('/privacidade/')} className="font-medium text-navy-950 underline underline-offset-2">
                Política de Privacidade
              </a>
              .
            </label>
          </div>
          {errorMsg('consent')}
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit" variant="primary" size="lg" iconRight="arrowRight" disabled={status === 'sending'} className="w-full sm:w-auto">
          {status === 'sending' ? 'Enviando…' : 'Enviar mensagem'}
        </Button>
        <p className="text-xs leading-relaxed text-muted sm:max-w-[15rem]">
          O contato inicial não substitui uma consulta jurídica formal.
        </p>
      </div>

      <div role="status" aria-live="polite" className="empty:hidden">
        {status === 'sent' && (
          <p className="mt-6 flex items-start gap-3 rounded-2xl bg-mist p-4 text-sm text-ink">
            <Icon name="check" size={18} className="mt-px shrink-0 text-gold-700" />
            {site.form.endpoint
              ? 'Mensagem enviada. Agradecemos o contato e retornaremos em breve.'
              : 'Abrimos o WhatsApp com sua mensagem preenchida. Basta confirmar o envio por lá.'}
          </p>
        )}
        {status === 'error' && (
          <p className="mt-6 rounded-2xl bg-red-50 p-4 text-sm text-red-800">
            Não foi possível enviar agora. Tente novamente ou fale conosco pelo WhatsApp.
          </p>
        )}
      </div>
    </form>
  )
}
