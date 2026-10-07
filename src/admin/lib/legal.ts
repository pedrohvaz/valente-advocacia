/**
 * Regras de domínio jurídico usadas no painel:
 *  - número único de processo (CNJ, Resolução nº 65/2008);
 *  - CPF e CNPJ (dígitos verificadores);
 *  - contagem de prazos processuais em dias úteis (CPC, arts. 219, 220 e 224).
 */
import { isHoliday } from '../../lib/schedule'

const digits = (v: string) => v.replace(/\D/g, '')

/* ------------------------------------------------------------------
   Número CNJ: NNNNNNN-DD.AAAA.J.TR.OOOO
   ------------------------------------------------------------------ */

/** Dígito verificador CNJ: 98 − (N AAAA J TR OOOO 00 mod 97). */
function cnjCheck(n: string, year: string, j: string, tr: string, origin: string) {
  const base = BigInt(`${n}${year}${j}${tr}${origin}00`)
  return String(98n - (base % 97n)).padStart(2, '0')
}

export function formatCNJ(value: string) {
  const d = digits(value).slice(0, 20)
  const parts = [d.slice(0, 7), d.slice(7, 9), d.slice(9, 13), d.slice(13, 14), d.slice(14, 16), d.slice(16, 20)]
  const seps = ['-', '.', '.', '.', '.']
  return parts.reduce((acc, part, i) => (part ? acc + (i > 0 ? seps[i - 1] : '') + part : acc), '')
}

export function isValidCNJ(value: string) {
  const d = digits(value)
  if (d.length !== 20) return false
  return cnjCheck(d.slice(0, 7), d.slice(9, 13), d.slice(13, 14), d.slice(14, 16), d.slice(16, 20)) === d.slice(7, 9)
}

/** Monta um número CNJ válido (usado nos dados de demonstração). */
export function makeCNJ(seq: number, year: number, j: number, tr: number, origin: number) {
  const n = String(seq).padStart(7, '0')
  const y = String(year)
  const jj = String(j)
  const t = String(tr).padStart(2, '0')
  const o = String(origin).padStart(4, '0')
  return formatCNJ(`${n}${cnjCheck(n, y, jj, t, o)}${y}${jj}${t}${o}`)
}

const segments: Record<string, string> = {
  '1': 'STF',
  '2': 'CNJ',
  '3': 'STJ',
  '4': 'Justiça Federal',
  '5': 'Justiça do Trabalho',
  '6': 'Justiça Eleitoral',
  '7': 'Justiça Militar da União',
  '8': 'Justiça Estadual',
  '9': 'Justiça Militar Estadual',
}

/** Segmento do Judiciário indicado no número (dígito J). */
export const cnjSegment = (value: string) => segments[digits(value).charAt(13)] ?? ''

/* ------------------------------------------------------------------
   CPF / CNPJ
   ------------------------------------------------------------------ */

function cpfDigit(base: string) {
  const sum = [...base].reduce((acc, n, i) => acc + Number(n) * (base.length + 1 - i), 0)
  const r = (sum * 10) % 11
  return r === 10 ? 0 : r
}

export function isValidCPF(value: string) {
  const d = digits(value)
  if (d.length !== 11 || /^(\d)\1+$/.test(d)) return false
  return cpfDigit(d.slice(0, 9)) === Number(d[9]) && cpfDigit(d.slice(0, 10)) === Number(d[10])
}

function cnpjDigit(base: string) {
  const weights = base.length === 12 ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  const sum = [...base].reduce((acc, n, i) => acc + Number(n) * weights[i], 0)
  const r = sum % 11
  return r < 2 ? 0 : 11 - r
}

export function isValidCNPJ(value: string) {
  const d = digits(value)
  if (d.length !== 14 || /^(\d)\1+$/.test(d)) return false
  return cnpjDigit(d.slice(0, 12)) === Number(d[12]) && cnpjDigit(d.slice(0, 13)) === Number(d[13])
}

/** Gera CPF/CNPJ válidos a partir de uma base (dados de demonstração). */
export function makeCPF(base9: string) {
  const a = cpfDigit(base9)
  const b = cpfDigit(base9 + a)
  return `${base9}${a}${b}`
}
export function makeCNPJ(base12: string) {
  const a = cnpjDigit(base12)
  const b = cnpjDigit(base12 + a)
  return `${base12}${a}${b}`
}

export function formatDoc(value: string) {
  const d = digits(value)
  if (d.length <= 11) {
    return d
      .replace(/^(\d{3})(\d)/, '$1.$2')
      .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d{1,2})$/, '.$1-$2')
  }
  return d
    .slice(0, 14)
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d{1,2})$/, '$1-$2')
}

/* ------------------------------------------------------------------
   Prazos processuais
   ------------------------------------------------------------------ */

/** Recesso forense: prazos suspensos de 20/12 a 20/01 (CPC, art. 220). */
export function isRecess(d: Date) {
  const m = d.getMonth()
  const day = d.getDate()
  return (m === 11 && day >= 20) || (m === 0 && day <= 20)
}

export const isCourtDay = (d: Date) => d.getDay() !== 0 && d.getDay() !== 6 && !isHoliday(d) && !isRecess(d)

/**
 * Vencimento de um prazo processual.
 * Exclui o dia do começo e inclui o do vencimento (art. 224); em dias úteis,
 * conta só dias de expediente forense (art. 219), pulando fins de semana,
 * feriados nacionais e o recesso (art. 220). Em dias corridos, se o último
 * dia não for útil, prorroga para o próximo dia útil (art. 224, § 1º).
 */
export function deadlineDate(start: Date, amount: number, mode: 'uteis' | 'corridos' = 'uteis') {
  const d = new Date(start)
  d.setHours(12, 0, 0, 0)
  if (mode === 'corridos') {
    d.setDate(d.getDate() + amount)
    while (!isCourtDay(d)) d.setDate(d.getDate() + 1)
    return d
  }
  let counted = 0
  while (counted < amount) {
    d.setDate(d.getDate() + 1)
    if (isCourtDay(d)) counted++
  }
  return d
}

/** Dias úteis forenses entre hoje e a data (negativo se já passou). */
export function courtDaysUntil(target: Date, from = new Date()) {
  const a = new Date(from)
  a.setHours(12, 0, 0, 0)
  const b = new Date(target)
  b.setHours(12, 0, 0, 0)
  if (a.getTime() === b.getTime()) return 0
  const step = b > a ? 1 : -1
  let n = 0
  while (a.getTime() !== b.getTime()) {
    a.setDate(a.getDate() + step)
    if (isCourtDay(a) || a.getTime() === b.getTime()) n += step
  }
  return n
}

/* ------------------------------------------------------------------
   Formatação
   ------------------------------------------------------------------ */

export const brl = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

/** 'AAAA-MM-DD' → Date ao meio-dia local (evita deslocamento de fuso). */
export const parseDay = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d, 12)
}
export const toDay = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
export const todayISO = () => toDay(new Date())

export const fmtDate = (iso: string, opts: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' }) =>
  new Intl.DateTimeFormat('pt-BR', opts).format(parseDay(iso))

/** Diferença em dias corridos entre hoje e a data. */
export const daysFromToday = (iso: string) => Math.round((parseDay(iso).getTime() - parseDay(todayISO()).getTime()) / 86_400_000)
