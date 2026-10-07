/**
 * Caixa de entrada do painel (modo demonstração).
 * Os formulários do site (contato e agendamento) gravam aqui; o painel
 * /admin/ lê e transforma cada item em um contato no funil.
 * Fica no navegador de quem enviou — em produção, troque por uma API.
 */
export type InboxItem = {
  id: string
  name: string
  phone: string
  email: string
  subject: string
  message: string
  source: 'site' | 'agendamento'
  createdAt: string
  preferred?: string
}

export const INBOX_KEY = 'valente-admin-inbox'

export function pushInbox(item: Omit<InboxItem, 'id' | 'createdAt'>) {
  try {
    const list: InboxItem[] = JSON.parse(localStorage.getItem(INBOX_KEY) ?? '[]')
    const now = new Date()
    const createdAt = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
    list.push({ ...item, id: `in-${now.getTime()}`, createdAt })
    localStorage.setItem(INBOX_KEY, JSON.stringify(list))
  } catch {
    /* armazenamento indisponível: segue apenas o envio por WhatsApp */
  }
}

export function takeInbox(): InboxItem[] {
  try {
    const list: InboxItem[] = JSON.parse(localStorage.getItem(INBOX_KEY) ?? '[]')
    localStorage.removeItem(INBOX_KEY)
    return Array.isArray(list) ? list : []
  } catch {
    return []
  }
}
