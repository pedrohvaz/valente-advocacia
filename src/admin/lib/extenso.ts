/** Valor monetário por extenso em português (até 999 milhões). Ex.: 1250.5 → "mil, duzentos e cinquenta reais e cinquenta centavos". */

const units = ['', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove', 'dez', 'onze', 'doze', 'treze', 'quatorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove']
const tens = ['', '', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa']
const hundreds = ['', 'cento', 'duzentos', 'trezentos', 'quatrocentos', 'quinhentos', 'seiscentos', 'setecentos', 'oitocentos', 'novecentos']

function upTo999(n: number): string {
  if (n === 0) return ''
  if (n === 100) return 'cem'
  const c = Math.floor(n / 100)
  const rest = n % 100
  const parts: string[] = []
  if (c) parts.push(hundreds[c])
  if (rest) {
    if (rest < 20) parts.push(units[rest])
    else {
      const t = Math.floor(rest / 10)
      const u = rest % 10
      parts.push(u ? `${tens[t]} e ${units[u]}` : tens[t])
    }
  }
  return parts.join(' e ')
}

function integer(n: number): string {
  if (n === 0) return 'zero'
  const millions = Math.floor(n / 1_000_000)
  const thousands = Math.floor((n % 1_000_000) / 1000)
  const rest = n % 1000
  const parts: string[] = []
  if (millions) parts.push(millions === 1 ? 'um milhão' : `${upTo999(millions)} milhões`)
  if (thousands) parts.push(thousands === 1 ? 'mil' : `${upTo999(thousands)} mil`)
  if (rest) parts.push(upTo999(rest))
  // "e" antes do último grupo quando ele é < 100 ou centena exata
  if (parts.length > 1 && (rest < 100 || rest % 100 === 0) && rest) {
    const last = parts.pop()
    return `${parts.join(' ')} e ${last}`
  }
  return parts.join(' ')
}

export function extenso(value: number): string {
  const cents = Math.round(value * 100)
  const reais = Math.floor(cents / 100)
  const c = cents % 100
  const r = reais ? `${integer(reais)}${reais % 1_000_000 === 0 && reais >= 1_000_000 ? ' de' : ''} ${reais === 1 ? 'real' : 'reais'}` : ''
  const ct = c ? `${integer(c)} ${c === 1 ? 'centavo' : 'centavos'}` : ''
  return [r, ct].filter(Boolean).join(' e ') || 'zero reais'
}
