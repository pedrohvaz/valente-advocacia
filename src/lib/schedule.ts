import { site } from '../config/site'

/**
 * Datas e horários disponíveis para o agendamento online.
 * Considera apenas dias úteis e bloqueia feriados nacionais.
 * Feriados estaduais/municipais podem ser incluídos em `extraHolidays`.
 */

/** Feriados adicionais no formato 'MM-DD' (ex.: aniversário da cidade). */
const extraHolidays: string[] = ['01-25'] // 25/01 — aniversário de São Paulo (exemplo)

const fixedNational = ['01-01', '04-21', '05-01', '09-07', '10-12', '11-02', '11-15', '11-20', '12-25']

/** Domingo de Páscoa (algoritmo de Meeus/Jones/Butcher). */
function easter(year: number) {
  const a = year % 19
  const b = Math.floor(year / 100)
  const c = year % 100
  const d = Math.floor(b / 4)
  const e = b % 4
  const f = Math.floor((b + 8) / 25)
  const g = Math.floor((b - f + 1) / 3)
  const h = (19 * a + b - d - g + 15) % 30
  const i = Math.floor(c / 4)
  const k = c % 4
  const l = (32 + 2 * e + 2 * i - h - k) % 7
  const m = Math.floor((a + 11 * h + 22 * l) / 451)
  const month = Math.floor((h + l - 7 * m + 114) / 31)
  const day = ((h + l - 7 * m + 114) % 31) + 1
  return new Date(year, month - 1, day)
}

const mmdd = (d: Date) => `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

export function isHoliday(d: Date) {
  const key = mmdd(d)
  if (fixedNational.includes(key) || extraHolidays.includes(key)) return true
  const goodFriday = easter(d.getFullYear())
  goodFriday.setDate(goodFriday.getDate() - 2)
  return mmdd(goodFriday) === key
}

export const isBusinessDay = (d: Date) => d.getDay() !== 0 && d.getDay() !== 6 && !isHoliday(d)

const slotDate = (day: Date, slot: string) => {
  const [h, m] = slot.split(':').map(Number)
  const d = new Date(day)
  d.setHours(h, m, 0, 0)
  return d
}

/** Horários ainda disponíveis em um dia, respeitando a antecedência mínima. */
export function slotsFor(day: Date, now = new Date()) {
  const limit = now.getTime() + site.scheduling.minNoticeHours * 3_600_000
  return site.scheduling.slots.filter((s) => slotDate(day, s).getTime() >= limit)
}

/** Próximos dias úteis com ao menos um horário livre. */
export function availableDays(now = new Date()) {
  const days: Date[] = []
  const cursor = new Date(now)
  cursor.setHours(0, 0, 0, 0)
  while (days.length < site.scheduling.businessDaysAhead) {
    if (isBusinessDay(cursor) && slotsFor(cursor, now).length > 0) days.push(new Date(cursor))
    cursor.setDate(cursor.getDate() + 1)
  }
  return days
}

export const dayKey = (d: Date) => `${d.getFullYear()}-${mmdd(d)}`

export const formatDay = (d: Date, opts: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat('pt-BR', opts).format(d).replace('.', '')

export const formatLongDate = (d: Date) =>
  formatDay(d, { weekday: 'long', day: 'numeric', month: 'long' })
