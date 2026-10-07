/**
 * Dados FICTÍCIOS de demonstração. Datas relativas ao dia de hoje, para
 * que o painel sempre tenha prazos próximos, atrasos e histórico recente.
 */
import { makeCNJ, makeCNPJ, makeCPF, toDay } from './lib/legal'
import type { AdminData, AgendaItem, Client, Fee, LegalCase, Lead } from './types'

const rel = (days: number) => {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return toDay(d)
}
/** Dia do mês relativo a N meses atrás. */
const monthAgo = (months: number, day: number) => {
  const d = new Date()
  d.setMonth(d.getMonth() - months, day)
  return toDay(d)
}

export function seedData(): AdminData {
  const year = new Date().getFullYear()

  const clients: Client[] = [
    { id: 'c1', kind: 'PF', name: 'Mariana Costa Souza', doc: makeCPF('314159265'), email: 'mariana.souza@exemplo.com', phone: '(11) 98123-4501', address: 'Rua Augusta, 1200, apto 54 — Consolação, São Paulo/SP', occupation: 'arquiteta', maritalStatus: 'casada', notes: 'Prefere contato por WhatsApp no fim da tarde.', createdAt: rel(-120) },
    { id: 'c2', kind: 'PF', name: 'Roberto Almeida Lima', doc: makeCPF('271828182'), email: 'roberto.lima@exemplo.com', phone: '(11) 97456-1290', address: 'Av. Rebouças, 3400 — Pinheiros, São Paulo/SP', occupation: 'analista de sistemas', maritalStatus: 'solteiro', notes: '', createdAt: rel(-95) },
    { id: 'c3', kind: 'PJ', name: 'Ateliê Moraes Ltda.', doc: makeCNPJ('456789120001'), email: 'financeiro@ateliemoraes.exemplo.com', phone: '(11) 3322-8890', address: 'Rua Oscar Freire, 820 — Jardins, São Paulo/SP', occupation: 'comércio de móveis planejados', notes: 'Assessoria contínua — contrato mensal.', createdAt: rel(-210) },
    { id: 'c4', kind: 'PF', name: 'João Pedro Martins', doc: makeCPF('161803398'), email: 'jp.martins@exemplo.com', phone: '(11) 99654-7712', address: 'Rua Vergueiro, 2100 — Vila Mariana, São Paulo/SP', occupation: 'motorista', maritalStatus: 'casado', notes: '', createdAt: rel(-60) },
    { id: 'c5', kind: 'PF', name: 'Fernanda Ribeiro Dias', doc: makeCPF('141421356'), email: 'fernanda.dias@exemplo.com', phone: '(11) 98777-3021', address: 'Rua Tuiuti, 455 — Tatuapé, São Paulo/SP', occupation: 'professora', maritalStatus: 'divorciada', notes: 'Dois filhos menores.', createdAt: rel(-45) },
    { id: 'c6', kind: 'PJ', name: 'Construtora Horizonte S.A.', doc: makeCNPJ('987654320001'), email: 'juridico@horizonte.exemplo.com', phone: '(11) 3055-2200', address: 'Av. Brigadeiro Luís Antônio, 4100 — Jardim Paulista, São Paulo/SP', occupation: 'construção civil', notes: 'Contato: Dra. Paula (jurídico interno).', createdAt: rel(-300) },
    { id: 'c7', kind: 'PF', name: 'Carlos Eduardo Nunes', doc: makeCPF('173205080'), email: 'carlos.nunes@exemplo.com', phone: '(11) 96543-8810', address: 'Rua Domingos de Morais, 900 — Vila Mariana, São Paulo/SP', occupation: 'engenheiro', maritalStatus: 'casado', notes: '', createdAt: rel(-30) },
    { id: 'c8', kind: 'PF', name: 'Luciana Prado Teixeira', doc: makeCPF('223606797'), email: 'luciana.teixeira@exemplo.com', phone: '(11) 98110-5566', address: 'Rua Haddock Lobo, 300 — Cerqueira César, São Paulo/SP', occupation: 'empresária', maritalStatus: 'casada', notes: 'Indicação de Mariana Souza.', createdAt: rel(-12) },
  ]

  const ev = (id: string, date: string, text: string, kind: 'andamento' | 'nota' | 'documento' = 'andamento') => ({ id, date, text, kind })

  const cases: LegalCase[] = [
    {
      id: 'p1', number: makeCNJ(1045872, year - 1, 8, 26, 100), title: 'Divórcio litigioso com partilha de bens', clientId: 'c5', area: 'direito-de-familia',
      court: '3ª Vara da Família e Sucessões — Foro Central', opposingParty: 'Marcelo Dias', status: 'ativo', phase: 'Conhecimento', value: 480000, tags: ['partilha', 'guarda'], createdAt: rel(-44),
      events: [ev('e1', rel(-40), 'Petição inicial distribuída.'), ev('e2', rel(-21), 'Despacho: designada audiência de conciliação.'), ev('e3', rel(-3), 'Juntada de contestação pela parte contrária.'), ev('e4', rel(-2), 'Cliente enviou matrícula atualizada do imóvel.', 'documento')],
    },
    {
      id: 'p2', number: makeCNJ(1002931, year, 5, 2, 61), title: 'Reclamação trabalhista — horas extras e verbas rescisórias', clientId: 'c4', area: 'direito-trabalhista',
      court: '61ª Vara do Trabalho de São Paulo', opposingParty: 'Transportes Rápido Sul Ltda.', status: 'ativo', phase: 'Conhecimento', value: 86500, tags: ['horas extras'], createdAt: rel(-58),
      events: [ev('e5', rel(-55), 'Ação ajuizada.'), ev('e6', rel(-18), 'Audiência inicial: proposta de acordo recusada.'), ev('e7', rel(-1), 'Intimação para manifestação sobre documentos da reclamada.')],
    },
    {
      id: 'p3', number: makeCNJ(1120448, year - 1, 8, 26, 100), title: 'Ação indenizatória — negativação indevida', clientId: 'c2', area: 'direito-do-consumidor',
      court: '2ª Vara do Juizado Especial Cível — Vergueiro', opposingParty: 'Banco Exemplo S.A.', status: 'ativo', phase: 'Recursal', value: 25000, tags: ['dano moral'], createdAt: rel(-94),
      events: [ev('e8', rel(-90), 'Petição inicial protocolada.'), ev('e9', rel(-35), 'Sentença de parcial procedência.'), ev('e10', rel(-12), 'Recurso inominado interposto pela ré.'), ev('e11', rel(-4), 'Intimação para contrarrazões.')],
    },
    {
      id: 'p4', number: '', title: 'Revisão e padronização de contratos com fornecedores', clientId: 'c3', area: 'direito-empresarial',
      court: 'Consultivo', opposingParty: '—', status: 'ativo', phase: 'Extrajudicial', value: 0, tags: ['assessoria', 'contratos'], createdAt: rel(-200),
      events: [ev('e12', rel(-30), 'Entregue minuta padrão de contrato de fornecimento.', 'documento'), ev('e13', rel(-6), 'Reunião de alinhamento com a diretoria.', 'nota')],
    },
    {
      id: 'p5', number: makeCNJ(1033517, year - 2, 8, 26, 100), title: 'Ação de cobrança — inadimplemento contratual', clientId: 'c6', area: 'direito-civil',
      court: '12ª Vara Cível — Foro Central', opposingParty: 'Incorporadora Vale Verde Ltda.', status: 'ativo', phase: 'Execução', value: 312000, tags: ['cumprimento de sentença'], createdAt: rel(-290),
      events: [ev('e14', rel(-280), 'Ação distribuída.'), ev('e15', rel(-70), 'Trânsito em julgado.'), ev('e16', rel(-20), 'Pedido de cumprimento de sentença.'), ev('e17', rel(-5), 'Penhora online parcialmente frutífera.')],
    },
    {
      id: 'p6', number: makeCNJ(1018204, year, 8, 26, 100), title: 'Guarda compartilhada e regulamentação de convivência', clientId: 'c1', area: 'direito-de-familia',
      court: '1ª Vara da Família e Sucessões — Foro Regional de Pinheiros', opposingParty: 'Ricardo Souza', status: 'ativo', phase: 'Conhecimento', value: 1000, tags: ['guarda'], createdAt: rel(-110),
      events: [ev('e18', rel(-105), 'Ação proposta.'), ev('e19', rel(-30), 'Estudo psicossocial determinado.')],
    },
    {
      id: 'p7', number: makeCNJ(1009876, year - 1, 5, 2, 14), title: 'Defesa em reclamação trabalhista', clientId: 'c6', area: 'direito-trabalhista',
      court: '14ª Vara do Trabalho de São Paulo', opposingParty: 'Antônio Ferreira', status: 'suspenso', phase: 'Conhecimento', value: 54000, tags: ['defesa'], createdAt: rel(-160),
      events: [ev('e20', rel(-150), 'Contestação apresentada.'), ev('e21', rel(-40), 'Processo suspenso aguardando perícia.')],
    },
    {
      id: 'p8', number: makeCNJ(1101119, year - 2, 8, 26, 100), title: 'Inventário extrajudicial', clientId: 'c8', area: 'direito-de-familia',
      court: '7º Tabelião de Notas', opposingParty: '—', status: 'encerrado', phase: 'Extrajudicial', value: 950000, tags: ['inventário'], createdAt: rel(-12),
      events: [ev('e22', rel(-10), 'Escritura de inventário lavrada.', 'documento')],
    },
    {
      id: 'p9', number: makeCNJ(1056601, year, 8, 26, 100), title: 'Rescisão de contrato e devolução de valores — imóvel na planta', clientId: 'c7', area: 'direito-civil',
      court: '28ª Vara Cível — Foro Central', opposingParty: 'Construtora Exemplar Ltda.', status: 'ativo', phase: 'Conhecimento', value: 210000, tags: ['distrato'], createdAt: rel(-28),
      events: [ev('e23', rel(-25), 'Petição inicial distribuída.'), ev('e24', rel(-7), 'Citação da ré realizada.')],
    },
  ]

  const agenda: AgendaItem[] = [
    { id: 'a1', kind: 'prazo', title: 'Manifestação sobre documentos da reclamada', date: rel(4), caseId: 'p2', done: false, computation: 'Intimação recebida; prazo de 5 dias úteis.' },
    { id: 'a2', kind: 'prazo', title: 'Contrarrazões ao recurso inominado', date: rel(6), caseId: 'p3', done: false, computation: 'Prazo de 10 dias úteis (Lei 9.099/95, art. 42, § 2º).' },
    { id: 'a3', kind: 'audiencia', title: 'Audiência de conciliação', date: rel(2), time: '14:30', caseId: 'p1', done: false, notes: 'Levar proposta de partilha revisada.' },
    { id: 'a4', kind: 'reuniao', title: 'Reunião com diretoria — Ateliê Moraes', date: rel(1), time: '10:00', caseId: 'p4', done: false },
    { id: 'a5', kind: 'prazo', title: 'Réplica à contestação', date: rel(11), caseId: 'p1', done: false, computation: 'Prazo de 15 dias úteis (CPC, art. 351).' },
    { id: 'a6', kind: 'tarefa', title: 'Atualizar cálculo do débito para nova penhora', date: rel(0), caseId: 'p5', done: false },
    { id: 'a7', kind: 'prazo', title: 'Pagamento das custas de preparo', date: rel(-1), caseId: 'p9', done: false, notes: 'Confirmar guia com o cliente.' },
    { id: 'a8', kind: 'audiencia', title: 'Audiência de instrução e julgamento', date: rel(16), time: '09:15', caseId: 'p2', done: false, notes: 'Arrolar duas testemunhas.' },
    { id: 'a9', kind: 'reuniao', title: 'Primeira consulta — Luciana Teixeira', date: rel(3), time: '16:00', done: false },
    { id: 'a10', kind: 'tarefa', title: 'Enviar minuta de acordo de sócios', date: rel(8), caseId: 'p4', done: false },
    { id: 'a11', kind: 'prazo', title: 'Manifestação sobre estudo psicossocial', date: rel(21), caseId: 'p6', done: false },
    { id: 'a12', kind: 'prazo', title: 'Emenda à petição inicial', date: rel(-6), caseId: 'p9', done: true },
    { id: 'a13', kind: 'reuniao', title: 'Retorno à cliente sobre andamento', date: rel(-2), caseId: 'p1', done: true },
  ]

  const leads: Lead[] = [
    { id: 'l1', name: 'Patrícia Gomes', phone: '(11) 98000-1122', email: 'patricia.gomes@exemplo.com', subject: 'Direito do Consumidor', message: 'Recebi cobranças de um serviço que cancelei há três meses.', source: 'site', stage: 'novo', createdAt: rel(0) },
    { id: 'l2', name: 'Eduardo Santana', phone: '(11) 97111-3344', email: 'eduardo.s@exemplo.com', subject: 'Direito Trabalhista', message: 'Fui demitido e não recebi as verbas rescisórias no prazo.', source: 'agendamento', stage: 'novo', createdAt: rel(-1), preferred: `${rel(3)} 11:00 · online` },
    { id: 'l3', name: 'Beatriz Fontes', phone: '(11) 96222-5566', email: 'beatriz.fontes@exemplo.com', subject: 'Direito de Família', message: 'Gostaria de entender como funciona o divórcio consensual.', source: 'whatsapp', stage: 'contato', createdAt: rel(-3) },
    { id: 'l4', name: 'Grupo Lume Comércio Ltda.', phone: '(11) 3344-0099', email: 'contato@lume.exemplo.com', subject: 'Direito Empresarial', message: 'Precisamos revisar contratos de franquia.', source: 'indicacao', stage: 'contato', createdAt: rel(-5) },
    { id: 'l5', name: 'Luciana Prado Teixeira', phone: '(11) 98110-5566', email: 'luciana.teixeira@exemplo.com', subject: 'Direito de Família', message: 'Inventário dos bens do meu pai.', source: 'indicacao', stage: 'contratado', createdAt: rel(-14), clientId: 'c8' },
    { id: 'l6', name: 'Rafael Moura', phone: '(11) 95555-7788', email: 'rafael.moura@exemplo.com', subject: 'Direito Civil', message: 'Problema com vizinho sobre infiltração.', source: 'site', stage: 'agendado', createdAt: rel(-4), preferred: `${rel(5)} 15:00 · presencial` },
    { id: 'l7', name: 'Tânia Oliveira', phone: '(11) 94444-2211', email: 'tania.o@exemplo.com', subject: 'Direito do Consumidor', message: 'Voo cancelado sem reacomodação.', source: 'site', stage: 'perdido', createdAt: rel(-20) },
  ]

  const fees: Fee[] = [
    // Histórico recebido (gráfico dos últimos meses)
    { id: 'f1', clientId: 'c3', caseId: 'p4', description: 'Assessoria mensal', kind: 'contratual', amount: 4500, dueDate: monthAgo(5, 10), paidAt: monthAgo(5, 10) },
    { id: 'f2', clientId: 'c3', caseId: 'p4', description: 'Assessoria mensal', kind: 'contratual', amount: 4500, dueDate: monthAgo(4, 10), paidAt: monthAgo(4, 9) },
    { id: 'f3', clientId: 'c6', caseId: 'p5', description: 'Honorários — fase de execução', kind: 'contratual', amount: 9000, dueDate: monthAgo(4, 20), paidAt: monthAgo(4, 22) },
    { id: 'f4', clientId: 'c3', caseId: 'p4', description: 'Assessoria mensal', kind: 'contratual', amount: 4500, dueDate: monthAgo(3, 10), paidAt: monthAgo(3, 10) },
    { id: 'f5', clientId: 'c2', caseId: 'p3', description: 'Honorários iniciais', kind: 'contratual', amount: 3000, dueDate: monthAgo(3, 15), paidAt: monthAgo(3, 15) },
    { id: 'f6', clientId: 'c3', caseId: 'p4', description: 'Assessoria mensal', kind: 'contratual', amount: 4500, dueDate: monthAgo(2, 10), paidAt: monthAgo(2, 11) },
    { id: 'f7', clientId: 'c1', caseId: 'p6', description: 'Honorários — parcela 1/3', kind: 'contratual', amount: 2800, dueDate: monthAgo(2, 5), paidAt: monthAgo(2, 5) },
    { id: 'f8', clientId: 'c8', caseId: 'p8', description: 'Honorários de inventário', kind: 'contratual', amount: 14250, dueDate: monthAgo(1, 18), paidAt: monthAgo(1, 18) },
    { id: 'f9', clientId: 'c3', caseId: 'p4', description: 'Assessoria mensal', kind: 'contratual', amount: 4500, dueDate: monthAgo(1, 10), paidAt: monthAgo(1, 12) },
    { id: 'f10', clientId: 'c1', caseId: 'p6', description: 'Honorários — parcela 2/3', kind: 'contratual', amount: 2800, dueDate: monthAgo(1, 5), paidAt: monthAgo(1, 6) },
    { id: 'f11', clientId: 'c7', description: 'Consulta inicial', kind: 'consulta', amount: 500, dueDate: rel(-28), paidAt: rel(-28) },
    { id: 'f12', clientId: 'c5', caseId: 'p1', description: 'Honorários — parcela 1/4', kind: 'contratual', amount: 3500, dueDate: rel(-30), paidAt: rel(-29) },
    { id: 'f21', clientId: 'c7', caseId: 'p9', description: 'Honorários iniciais — distrato', kind: 'contratual', amount: 6000, dueDate: rel(-1), paidAt: rel(-1) },
    // Em aberto / atrasados / futuros
    { id: 'f13', clientId: 'c1', caseId: 'p6', description: 'Honorários — parcela 3/3', kind: 'contratual', amount: 2800, dueDate: rel(-8) },
    { id: 'f14', clientId: 'c5', caseId: 'p1', description: 'Honorários — parcela 2/4', kind: 'contratual', amount: 3500, dueDate: rel(1) },
    { id: 'f15', clientId: 'c5', caseId: 'p1', description: 'Honorários — parcela 3/4', kind: 'contratual', amount: 3500, dueDate: rel(31) },
    { id: 'f16', clientId: 'c5', caseId: 'p1', description: 'Honorários — parcela 4/4', kind: 'contratual', amount: 3500, dueDate: rel(61) },
    { id: 'f17', clientId: 'c3', caseId: 'p4', description: 'Assessoria mensal', kind: 'contratual', amount: 4500, dueDate: rel(3) },
    { id: 'f18', clientId: 'c4', caseId: 'p2', description: 'Honorários de êxito (30% do resultado)', kind: 'exito', amount: 0, dueDate: rel(120) },
    { id: 'f19', clientId: 'c7', caseId: 'p9', description: 'Custas de preparo (reembolsável)', kind: 'despesa', amount: 1240.5, dueDate: rel(-1) },
    { id: 'f20', clientId: 'c6', caseId: 'p5', description: 'Diligência — certidões de imóveis', kind: 'despesa', amount: 380, dueDate: rel(-15), paidAt: rel(-14) },
  ]

  return { version: 1, clients, cases, agenda, leads, fees }
}
