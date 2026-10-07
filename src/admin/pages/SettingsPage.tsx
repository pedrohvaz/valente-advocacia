import { useRef, useState } from 'react'
import { fullAddress, oabLabel, site } from '../../config/site'
import { Icon } from '../../components/ui/Icon'
import { todayISO } from '../lib/legal'
import { useAdmin } from '../store'
import type { AdminData } from '../types'
import { Btn, PageHeader, Panel } from '../ui'

export function SettingsPage() {
  const { data, replaceAll, resetDemo } = useAdmin()
  const fileRef = useRef<HTMLInputElement>(null)
  const [msg, setMsg] = useState<{ tone: 'ok' | 'error'; text: string } | null>(null)

  const exportJson = () => {
    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }))
    const a = document.createElement('a')
    a.href = url
    a.download = `backup-painel-${todayISO()}.json`
    a.click()
    URL.revokeObjectURL(url)
    setMsg({ tone: 'ok', text: 'Backup gerado.' })
  }

  const importJson = async (file: File) => {
    try {
      const parsed = JSON.parse(await file.text()) as AdminData
      const valid = parsed.version === 1 && ['clients', 'cases', 'agenda', 'leads', 'fees'].every((k) => Array.isArray(parsed[k as keyof AdminData]))
      if (!valid) throw new Error('formato')
      if (window.confirm('Substituir todos os dados atuais pelo conteúdo do backup?')) {
        replaceAll(parsed)
        setMsg({ tone: 'ok', text: 'Backup restaurado.' })
      }
    } catch {
      setMsg({ tone: 'error', text: 'Arquivo inválido. Use um backup exportado por este painel.' })
    }
  }

  const counts = [
    ['Clientes', data.clients.length],
    ['Processos', data.cases.length],
    ['Compromissos', data.agenda.length],
    ['Contatos', data.leads.length],
    ['Lançamentos', data.fees.length],
  ] as const

  return (
    <div className="space-y-6">
      <PageHeader title="Configurações" description="Dados do escritório, backup e modo de demonstração." />
      {msg && (
        <p role="status" className={`rounded-2xl px-4 py-3 text-sm ${msg.tone === 'ok' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'}`}>
          {msg.text}
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
        <Panel title="Escritório">
          <dl className="space-y-3 text-sm">
            {[
              ['Nome', site.officeName],
              ['Responsável', `${site.lawyer.name} · ${oabLabel}`],
              ['Endereço', fullAddress],
              ['E-mail', site.contact.email],
              ['Horário', site.contact.hours],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-xs text-muted">{k}</dt>
                <dd className="mt-0.5 text-navy-950">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-xs text-muted">Estes dados vêm da configuração do site (src/config/site.ts) e são usados nos documentos.</p>
        </Panel>

        <Panel title="Backup dos dados">
          <ul className="grid grid-cols-5 gap-2 text-center">
            {counts.map(([k, n]) => (
              <li key={k} className="rounded-2xl bg-mist px-1 py-3">
                <span className="block font-display text-xl font-semibold text-navy-950">{n}</span>
                <span className="block text-[0.68rem] text-muted">{k}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-wrap gap-2">
            <Btn icon="download" onClick={exportJson}>Exportar backup (JSON)</Btn>
            <Btn icon="upload" onClick={() => fileRef.current?.click()}>Importar backup</Btn>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              className="sr-only"
              aria-label="Arquivo de backup"
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) importJson(f)
                e.target.value = ''
              }}
            />
          </div>
        </Panel>
      </div>

      <Panel title="Modo demonstração">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl space-y-2 text-sm leading-relaxed text-muted">
            <p>
              Esta versão do painel guarda os dados <strong className="text-navy-950">apenas neste navegador</strong> (armazenamento local), para
              demonstração. Nenhuma informação é enviada a servidores.
            </p>
            <p className="flex items-start gap-2">
              <Icon name="shield" size={16} className="mt-0.5 shrink-0 text-gold-700" />
              <span>
                Em produção, o painel deve usar banco de dados com acesso autenticado, verificação em duas etapas, controle de permissões,
                registro de acessos e backups — dados de clientes são protegidos pelo sigilo profissional e pela LGPD.
              </span>
            </p>
          </div>
          <Btn
            variant="danger"
            icon="trash"
            onClick={() => {
              if (window.confirm('Restaurar os dados de demonstração? As alterações feitas serão perdidas.')) {
                resetDemo()
                setMsg({ tone: 'ok', text: 'Dados de demonstração restaurados.' })
              }
            }}
          >
            Restaurar demonstração
          </Btn>
        </div>
      </Panel>
    </div>
  )
}
