import { useMemo, useState } from 'react'
import { fullAddress, oabLabel, site } from '../../config/site'
import { Icon, type IconName } from '../../components/ui/Icon'
import { extenso } from '../lib/extenso'
import { brl, fmtDate, formatDoc, todayISO } from '../lib/legal'
import { useAdmin } from '../store'
import type { Client, LegalCase } from '../types'
import { Btn, Input, PageHeader, Panel, Select, hashParams } from '../ui'

type TemplateId = 'procuracao' | 'contrato' | 'hipossuficiencia' | 'recibo'

const templates: { id: TemplateId; title: string; text: string; icon: IconName }[] = [
  { id: 'procuracao', title: 'Procuração ad judicia et extra', text: 'Poderes gerais para o foro, com poderes especiais opcionais.', icon: 'badge' },
  { id: 'contrato', title: 'Contrato de honorários', text: 'Prestação de serviços advocatícios, valores e condições.', icon: 'contract' },
  { id: 'hipossuficiencia', title: 'Declaração de hipossuficiência', text: 'Para pedido de gratuidade da justiça (pessoa física).', icon: 'shield' },
  { id: 'recibo', title: 'Recibo de honorários', text: 'Com valor por extenso.', icon: 'wallet' },
]

/** Campo ausente aparece destacado para preenchimento manual. */
const blank = (v: string | undefined, label: string) => (v && v.trim() ? v : `[${label}]`)

function qualification(c: Client) {
  if (c.kind === 'PJ') {
    return `${c.name}, pessoa jurídica de direito privado, inscrita no CNPJ sob o nº ${blank(c.doc && formatDoc(c.doc), 'CNPJ')}, com sede em ${blank(c.address, 'ENDEREÇO')}, neste ato representada por seu representante legal`
  }
  return `${c.name}, brasileiro(a), ${blank(c.maritalStatus, 'ESTADO CIVIL')}, ${blank(c.occupation, 'PROFISSÃO')}, inscrito(a) no CPF sob o nº ${blank(c.doc && formatDoc(c.doc), 'CPF')}, residente e domiciliado(a) em ${blank(c.address, 'ENDEREÇO')}`
}

const lawyerQualification = () =>
  `${site.lawyer.name}, advogado, inscrito na OAB/${site.lawyer.oabState} sob o nº ${site.lawyer.oabNumber}, com escritório profissional em ${fullAddress}, e-mail ${site.contact.email}`

const place = () => `${site.location.city}, ${new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date())}.`

type Opts = { specialPowers: boolean; amount: number; payment: string; reference: string }

function buildDocument(id: TemplateId, c: Client, k: LegalCase | undefined, o: Opts): { title: string; paragraphs: string[]; signature: string } {
  const object = k ? `${k.title}${k.number ? `, processo nº ${k.number}` : ''}${k.court && k.court !== 'Consultivo' ? `, em trâmite perante ${k.court}` : ''}` : '[OBJETO DA CONTRATAÇÃO]'

  switch (id) {
    case 'procuracao':
      return {
        title: 'PROCURAÇÃO AD JUDICIA ET EXTRA',
        paragraphs: [
          `OUTORGANTE: ${qualification(c)}.`,
          `OUTORGADO: ${lawyerQualification()}.`,
          `PODERES: pelo presente instrumento particular de procuração, o(a) outorgante nomeia e constitui seu bastante procurador o outorgado, a quem confere os poderes da cláusula ad judicia et extra para o foro em geral, podendo representá-lo(a) em qualquer juízo, instância ou tribunal, bem como perante órgãos e repartições públicas, propor as ações competentes e defendê-lo(a) nas contrárias, seguindo umas e outras até final decisão, interpor recursos, requerer, alegar, juntar e desentranhar documentos, e praticar todos os demais atos necessários ao fiel cumprimento deste mandato${o.specialPowers ? ', inclusive os poderes especiais para receber citação, confessar, reconhecer a procedência do pedido, transigir, desistir, renunciar ao direito sobre o qual se funda a ação, receber, dar quitação, firmar compromisso e assinar declaração de hipossuficiência econômica (CPC, art. 105)' : ''}, podendo ainda substabelecer, com ou sem reserva de poderes.`,
          `FINALIDADE ESPECÍFICA: ${k ? object : 'atuação em defesa dos interesses do(a) outorgante'}.`,
          place(),
        ],
        signature: c.name,
      }
    case 'contrato':
      return {
        title: 'CONTRATO DE PRESTAÇÃO DE SERVIÇOS ADVOCATÍCIOS',
        paragraphs: [
          `CONTRATANTE: ${qualification(c)}.`,
          `CONTRATADO: ${lawyerQualification()}.`,
          `As partes acima qualificadas celebram o presente contrato de prestação de serviços advocatícios, regido pela Lei nº 8.906/1994 (Estatuto da Advocacia e da OAB) e pelo Código de Ética e Disciplina da OAB, mediante as cláusulas seguintes.`,
          `CLÁUSULA 1ª — DO OBJETO. O CONTRATADO prestará serviços jurídicos ao CONTRATANTE referentes a: ${object}.`,
          `CLÁUSULA 2ª — DOS HONORÁRIOS. Pelos serviços, o CONTRATANTE pagará ao CONTRATADO o valor de ${o.amount ? `${brl(o.amount)} (${extenso(o.amount)})` : '[VALOR]'}, ${blank(o.payment, 'FORMA DE PAGAMENTO')}. Os honorários de sucumbência, se houver, pertencem ao CONTRATADO (Lei nº 8.906/1994, art. 23).`,
          `CLÁUSULA 3ª — DAS DESPESAS. Custas, emolumentos, diligências, perícias e demais despesas necessárias ao andamento do caso correrão por conta do CONTRATANTE, mediante prévia comunicação.`,
          `CLÁUSULA 4ª — DAS OBRIGAÇÕES. O CONTRATADO compromete-se a atuar com zelo e diligência e a manter o CONTRATANTE informado sobre o andamento do caso. O CONTRATANTE compromete-se a fornecer documentos e informações verdadeiras e completas. O CONTRATADO não garante resultado, assumindo obrigação de meio.`,
          `CLÁUSULA 5ª — DA RESCISÃO. Qualquer das partes poderá rescindir o contrato mediante comunicação por escrito, sendo devidos os honorários proporcionais aos serviços já prestados.`,
          `CLÁUSULA 6ª — DO FORO. Fica eleito o foro da comarca de ${site.location.city}/${site.location.stateCode} para dirimir questões oriundas deste contrato.`,
          `E, por estarem de acordo, assinam o presente em duas vias de igual teor.`,
          place(),
        ],
        signature: `${c.name}  ·  ${site.lawyer.name}`,
      }
    case 'hipossuficiencia':
      return {
        title: 'DECLARAÇÃO DE HIPOSSUFICIÊNCIA ECONÔMICA',
        paragraphs: [
          `Eu, ${qualification(c)}, DECLARO, para os fins dos arts. 98 e seguintes do Código de Processo Civil, que não possuo condições de arcar com as custas, despesas processuais e honorários advocatícios sem prejuízo do meu próprio sustento e do de minha família, razão pela qual requeiro os benefícios da gratuidade da justiça.`,
          `Declaro estar ciente de que a falsidade desta declaração poderá sujeitar-me às sanções civis, administrativas e criminais previstas em lei.`,
          place(),
        ],
        signature: c.name,
      }
    case 'recibo':
      return {
        title: 'RECIBO DE HONORÁRIOS ADVOCATÍCIOS',
        paragraphs: [
          `Recebi de ${c.name}, inscrito(a) no ${c.kind === 'PJ' ? 'CNPJ' : 'CPF'} sob o nº ${blank(c.doc && formatDoc(c.doc), c.kind === 'PJ' ? 'CNPJ' : 'CPF')}, a importância de ${o.amount ? `${brl(o.amount)} (${extenso(o.amount)})` : '[VALOR]'}, referente a ${blank(o.reference, 'REFERÊNCIA')}, dando por este a mais plena e geral quitação do valor recebido.`,
          place(),
        ],
        signature: `${site.lawyer.name} · ${oabLabel}`,
      }
  }
}

export function DocumentsPage() {
  const { data } = useAdmin()
  const [tpl, setTpl] = useState<TemplateId>('procuracao')
  const [clientId, setClientId] = useState(() => hashParams().get('cliente') ?? data.clients[0]?.id ?? '')
  const [caseId, setCaseId] = useState('')
  const [opts, setOpts] = useState<Opts>({ specialPowers: false, amount: 0, payment: 'em parcela única, mediante transferência bancária', reference: 'honorários advocatícios' })
  const [copied, setCopied] = useState(false)

  const client = data.clients.find((c) => c.id === clientId)
  const cases = data.cases.filter((c) => c.clientId === clientId)
  const kase = cases.find((c) => c.id === caseId)
  const paidFees = data.fees.filter((f) => f.clientId === clientId && f.paidAt && f.amount > 0)

  const doc = useMemo(() => (client ? buildDocument(tpl, client, kase, opts) : null), [tpl, client, kase, opts])
  const plain = doc ? [doc.title, '', ...doc.paragraphs.flatMap((p) => [p, '']), '_______________________________', doc.signature].join('\n') : ''

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(plain)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* área de transferência indisponível */
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Documentos" description="Modelos preenchidos automaticamente com os dados do cliente e do processo." />

      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {templates.map((t) => (
          <li key={t.id}>
            <button
              type="button"
              aria-pressed={tpl === t.id}
              onClick={() => setTpl(t.id)}
              className={`flex h-full w-full items-start gap-3 rounded-2xl border p-4 text-left transition-colors ${tpl === t.id ? 'border-navy-950 bg-navy-950 text-white' : 'border-navy-950/[0.08] bg-white hover:border-navy-950/25'}`}
            >
              <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${tpl === t.id ? 'bg-gold-500 text-navy-950' : 'bg-mist text-navy-800'}`}>
                <Icon name={t.icon} size={19} />
              </span>
              <span>
                <span className="block text-sm font-semibold">{t.title}</span>
                <span className={`mt-0.5 block text-xs ${tpl === t.id ? 'text-white/70' : 'text-muted'}`}>{t.text}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[22rem_1fr] lg:gap-6">
        <Panel title="Dados" className="h-fit">
          <div className="space-y-4">
            <Select label="Cliente" value={clientId} onChange={(e) => { setClientId(e.target.value); setCaseId('') }}>
              {[...data.clients].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR')).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
            {tpl !== 'hipossuficiencia' && tpl !== 'recibo' && (
              <Select label="Processo" value={caseId} onChange={(e) => setCaseId(e.target.value)} disabled={!cases.length} hint={!cases.length ? 'Cliente sem processos cadastrados.' : undefined}>
                <option value="">Não vincular</option>
                {cases.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
              </Select>
            )}
            {tpl === 'procuracao' && (
              <label className="flex items-start gap-3 rounded-2xl bg-mist p-3 text-sm">
                <input type="checkbox" checked={opts.specialPowers} onChange={(e) => setOpts({ ...opts, specialPowers: e.target.checked })} className="mt-0.5 size-4 accent-navy-950" />
                <span>
                  <span className="font-medium text-navy-950">Incluir poderes especiais</span>
                  <span className="block text-xs text-muted">Receber, dar quitação, transigir, desistir etc. — exigem cláusula expressa (CPC, art. 105).</span>
                </span>
              </label>
            )}
            {(tpl === 'contrato' || tpl === 'recibo') && (
              <Input label="Valor (R$)" type="number" min={0} step="0.01" value={opts.amount || ''} onChange={(e) => setOpts({ ...opts, amount: Number(e.target.value) })} hint={opts.amount ? extenso(opts.amount) : undefined} />
            )}
            {tpl === 'recibo' && paidFees.length > 0 && (
              <Select label="Preencher a partir de um pagamento" value="" onChange={(e) => { const f = paidFees.find((x) => x.id === e.target.value); if (f) setOpts({ ...opts, amount: f.amount, reference: f.description.toLowerCase() }) }}>
                <option value="">Selecione…</option>
                {paidFees.map((f) => <option key={f.id} value={f.id}>{f.description} — {brl(f.amount)} ({fmtDate(f.paidAt ?? todayISO())})</option>)}
              </Select>
            )}
            {tpl === 'contrato' && <Input label="Forma de pagamento" value={opts.payment} onChange={(e) => setOpts({ ...opts, payment: e.target.value })} />}
            {tpl === 'recibo' && <Input label="Referente a" value={opts.reference} onChange={(e) => setOpts({ ...opts, reference: e.target.value })} />}
            {tpl === 'hipossuficiencia' && client?.kind === 'PJ' && (
              <p className="rounded-2xl bg-amber-50 p-3 text-xs text-amber-800">Para pessoa jurídica, a gratuidade exige comprovação da insuficiência de recursos (Súmula 481 do STJ).</p>
            )}
            <p className="text-xs text-muted">Campos entre [colchetes] não estão no cadastro e devem ser preenchidos antes da assinatura.</p>
          </div>
        </Panel>

        <div>
          <div className="mb-3 flex flex-wrap justify-end gap-2">
            <Btn icon={copied ? 'check' : 'copy'} onClick={copy}>{copied ? 'Copiado' : 'Copiar texto'}</Btn>
            <Btn icon="printer" variant="primary" onClick={() => window.print()}>Imprimir / PDF</Btn>
          </div>
          {doc ? (
            <article id="doc-print" className="rounded-3xl border border-navy-950/[0.07] bg-white px-6 py-10 shadow-[0_20px_50px_-35px_rgba(11,19,43,0.4)] sm:px-14 sm:py-14">
              <h2 className="text-center font-display text-lg font-semibold tracking-wide text-navy-950">{doc.title}</h2>
              <div className="mt-8 space-y-4 text-[0.95rem] leading-[1.75] text-justify text-ink">
                {doc.paragraphs.map((p, i) => (
                  <p key={i} className={i === doc.paragraphs.length - 1 ? 'pt-4 text-right' : ''}>
                    {p.split(/(\[[^\]]+\])/g).map((part, j) =>
                      part.startsWith('[') ? <mark key={j} className="rounded bg-gold-500/20 px-1 text-gold-700">{part}</mark> : part,
                    )}
                  </p>
                ))}
              </div>
              <div className="mx-auto mt-16 max-w-sm border-t border-navy-950/40 pt-2 text-center text-sm text-navy-950">{doc.signature}</div>
            </article>
          ) : (
            <p className="text-muted">Cadastre um cliente para gerar documentos.</p>
          )}
          <p className="mt-3 text-xs text-muted">Modelos de referência. Revise o conteúdo e adapte-o a cada caso antes de utilizar.</p>
        </div>
      </div>
    </div>
  )
}
