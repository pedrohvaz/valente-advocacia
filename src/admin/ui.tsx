/** Componentes de interface do painel. */
import { useEffect, useId, useRef, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react'
import { Icon, type IconName } from '../components/ui/Icon'

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-[1.75rem] leading-tight tracking-[-0.035em] text-navy-950 sm:text-[2rem]">{title}</h1>
        {description && <p className="mt-1.5 text-muted">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  )
}

export function Panel({ title, action, children, className = '' }: { title?: ReactNode; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-3xl border border-navy-950/[0.07] bg-white p-5 shadow-[0_1px_2px_rgb(11_19_43/0.04)] sm:p-6 ${className}`}>
      {(title || action) && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
          {title && <h2 className="font-display text-lg font-semibold tracking-[-0.02em] text-navy-950">{title}</h2>}
          {action && <div className="shrink-0 whitespace-nowrap">{action}</div>}
        </div>
      )}
      {children}
    </section>
  )
}

const tones = {
  neutral: 'bg-navy-950/[0.06] text-navy-800',
  gold: 'bg-gold-500/15 text-gold-700',
  green: 'bg-emerald-50 text-emerald-700',
  red: 'bg-red-50 text-red-700',
  blue: 'bg-sky-50 text-sky-700',
  amber: 'bg-amber-50 text-amber-800',
  dark: 'bg-navy-950 text-white',
} as const
export type Tone = keyof typeof tones

export function Badge({ tone = 'neutral', children }: { tone?: Tone; children: ReactNode }) {
  return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${tones[tone]}`}>{children}</span>
}

type BtnProps = {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'ghost' | 'danger' | 'gold'
  icon?: IconName
  type?: 'button' | 'submit'
  size?: 'sm' | 'md'
  className?: string
  disabled?: boolean
  'aria-label'?: string
}

export function Btn({ children, onClick, variant = 'ghost', icon, type = 'button', size = 'md', className = '', disabled, ...rest }: BtnProps) {
  const styles = {
    primary: 'bg-navy-950 text-white hover:bg-navy-800',
    gold: 'bg-gold-500 text-navy-950 hover:bg-gold-400',
    ghost: 'border border-navy-950/12 bg-white text-navy-950 hover:bg-mist',
    danger: 'border border-red-200 bg-white text-red-700 hover:bg-red-50',
  }[variant]
  const sz = size === 'sm' ? 'min-h-9 px-3 text-[0.8rem]' : 'min-h-10 px-4 text-sm'
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors disabled:opacity-50 ${styles} ${sz} ${className}`}
      {...rest}
    >
      {icon && <Icon name={icon} size={size === 'sm' ? 15 : 17} />}
      {children}
    </button>
  )
}

export function IconBtn({ icon, label, onClick, tone = 'default' }: { icon: IconName; label: string; onClick: () => void; tone?: 'default' | 'danger' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`grid size-9 shrink-0 place-items-center rounded-full transition-colors ${
        tone === 'danger' ? 'text-red-600 hover:bg-red-50' : 'text-muted hover:bg-mist hover:text-navy-950'
      }`}
    >
      <Icon name={icon} size={17} />
    </button>
  )
}

/* ------------------------------ Formulários ------------------------------ */

const control =
  'mt-1.5 block w-full rounded-xl border border-navy-950/15 bg-white px-3.5 py-2.5 text-[0.95rem] text-navy-950 transition-[border-color,box-shadow] placeholder:text-muted/60 focus:border-navy-950 focus:shadow-[0_0_0_3px_rgba(28,49,94,0.12)] focus:outline-none aria-invalid:border-red-600'

type FieldBase = { label: string; error?: string; hint?: string; className?: string }

function FieldShell({ id, label, error, hint, className = '', children }: FieldBase & { id: string; children: ReactNode }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-navy-950">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-msg`} className="mt-1 text-xs text-red-700">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-msg`} className="mt-1 text-xs text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

export function Input({ label, error, hint, className, ...props }: FieldBase & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId()
  return (
    <FieldShell id={id} label={label} error={error} hint={hint} className={className}>
      <input id={id} aria-invalid={!!error} aria-describedby={error || hint ? `${id}-msg` : undefined} className={control} {...props} />
    </FieldShell>
  )
}

export function Select({ label, error, hint, className, children, ...props }: FieldBase & SelectHTMLAttributes<HTMLSelectElement>) {
  const id = useId()
  return (
    <FieldShell id={id} label={label} error={error} hint={hint} className={className}>
      <select id={id} aria-invalid={!!error} aria-describedby={error || hint ? `${id}-msg` : undefined} className={control} {...props}>
        {children}
      </select>
    </FieldShell>
  )
}

export function Textarea({ label, error, hint, className, ...props }: FieldBase & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId()
  return (
    <FieldShell id={id} label={label} error={error} hint={hint} className={className}>
      <textarea id={id} aria-invalid={!!error} aria-describedby={error || hint ? `${id}-msg` : undefined} className={`${control} resize-y`} rows={3} {...props} />
    </FieldShell>
  )
}

/* -------------------------------- Modal --------------------------------- */

/** Modal com <dialog> nativo: foco preso, Esc fecha e o fundo fica inerte. */
export function Modal({ open, onClose, title, children, wide = false }: { open: boolean; onClose: () => void; title: string; children: ReactNode; wide?: boolean }) {
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) d.showModal()
    if (!open && d.open) d.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      className={`m-auto max-h-[92svh] w-[calc(100%-1.5rem)] overflow-y-auto rounded-3xl bg-white p-0 text-ink shadow-2xl backdrop:bg-navy-950/50 backdrop:backdrop-blur-sm ${wide ? 'max-w-3xl' : 'max-w-xl'}`}
    >
      {open && (
        <div className="p-6 sm:p-7">
          <div className="mb-5 flex items-start justify-between gap-4">
            <h2 id={titleId} className="font-display text-xl font-semibold tracking-[-0.025em] text-navy-950">
              {title}
            </h2>
            <IconBtn icon="close" label="Fechar" onClick={onClose} />
          </div>
          {children}
        </div>
      )}
    </dialog>
  )
}

export function EmptyState({ icon, title, text, action }: { icon: IconName; title: string; text?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-dashed border-navy-950/15 px-6 py-12 text-center">
      <span className="grid size-12 place-items-center rounded-2xl bg-mist text-muted">
        <Icon name={icon} size={22} />
      </span>
      <p className="mt-4 font-medium text-navy-950">{title}</p>
      {text && <p className="mt-1 max-w-sm text-sm text-muted">{text}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export function StatCard({ label, value, hint, icon, tone = 'neutral' }: { label: string; value: ReactNode; hint?: ReactNode; icon: IconName; tone?: 'neutral' | 'red' | 'gold' }) {
  const iconTone = { neutral: 'bg-mist text-navy-800', red: 'bg-red-50 text-red-600', gold: 'bg-gold-500/15 text-gold-700' }[tone]
  return (
    <div className="min-w-0 rounded-3xl border border-navy-950/[0.07] bg-white p-4 shadow-[0_1px_2px_rgb(11_19_43/0.04)] sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-muted">{label}</p>
        <span className={`grid size-9 place-items-center rounded-xl ${iconTone}`}>
          <Icon name={icon} size={18} />
        </span>
      </div>
      <p className="mt-3 font-display text-[1.3rem] leading-none font-semibold tracking-[-0.04em] break-words text-navy-950 tabular-nums sm:text-[1.85rem]">{value}</p>
      {hint && <p className="mt-2 text-xs text-muted">{hint}</p>}
    </div>
  )
}

/** Navegação interna do painel (rotas por hash: #/clientes/c1). */
export const go = (path: string) => {
  window.location.hash = `#${path}`
}

/** Parâmetros da rota por hash (ex.: #/processos?novo&cliente=c1). */
export const hashParams = () => new URLSearchParams(window.location.hash.split('?')[1] ?? '')

/** Executa `fn` com os parâmetros da rota quando ela chega com "?novo" e limpa a URL. */
export function useAutoOpen(fn: (params: URLSearchParams) => void) {
  useEffect(() => {
    const params = hashParams()
    if (params.has('novo')) {
      fn(params)
      history.replaceState(null, '', window.location.hash.split('?')[0])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
