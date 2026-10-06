/**
 * ÁREAS DE ATUAÇÃO
 * ------------------------------------------------------------------
 * Cada área gera automaticamente:
 *  - um item no índice da página inicial;
 *  - uma página própria em /areas/<slug>/ (com SEO, FAQ e artigos relacionados);
 *  - uma opção nos formulários de contato e agendamento.
 *
 * Os textos são informativos e não prometem resultado.
 */
import type { IconName } from '../components/ui/Icon'

export type AreaService = { title: string; text: string }
export type AreaFaq = { question: string; answer: string }

export type PracticeArea = {
  slug: string
  icon: IconName
  title: string
  /** Resumo curto (índice da home e cards). */
  description: string
  /** Título de destaque da página da área — use *asteriscos* para o itálico dourado. */
  headline: string
  /** Parágrafos de introdução da página da área. */
  intro: string[]
  /** Exemplos de atuação (o título aparece no índice da home). */
  services: AreaService[]
  faq: AreaFaq[]
  /** Meta description da página da área. */
  seoDescription: string
}

export const practiceAreas: PracticeArea[] = [
  {
    slug: 'direito-civil',
    icon: 'contract',
    title: 'Direito Civil',
    description:
      'Atuação em questões contratuais, indenizações, obrigações e demais demandas relacionadas ao Direito Civil.',
    headline: 'Segurança jurídica nas relações *do dia a dia*.',
    intro: [
      'O Direito Civil regula grande parte das relações cotidianas: contratos, compras e vendas, locações, dívidas, danos e responsabilidades entre pessoas e empresas.',
      'O escritório atua tanto de forma preventiva — analisando e redigindo contratos antes da assinatura — quanto na solução de conflitos, buscando sempre o caminho mais adequado para cada situação, seja por negociação, seja pela via judicial.',
    ],
    services: [
      {
        title: 'Contratos e revisões contratuais',
        text: 'Elaboração, análise e revisão de contratos, com atenção a cláusulas, riscos e obrigações das partes.',
      },
      {
        title: 'Ações de indenização',
        text: 'Avaliação de situações que podem gerar reparação por danos materiais ou morais e condução do pedido.',
      },
      {
        title: 'Cobranças e obrigações',
        text: 'Cobrança de valores devidos e defesa em cobranças, priorizando acordos sempre que possível.',
      },
      {
        title: 'Questões possessórias e imobiliárias',
        text: 'Orientação em compra e venda de imóveis, locações, usucapião e disputas sobre posse.',
      },
    ],
    faq: [
      {
        question: 'Vale a pena revisar um contrato antes de assinar?',
        answer:
          'Sim. A revisão prévia permite identificar cláusulas desequilibradas, multas excessivas e obrigações pouco claras, o que costuma evitar conflitos e custos maiores no futuro.',
      },
      {
        question: 'Existe prazo para pedir indenização?',
        answer:
          'Sim. Em regra, a pretensão de reparação civil prescreve em três anos (art. 206, § 3º, V, do Código Civil), mas há prazos diferentes conforme o tipo de relação. Por isso é importante buscar orientação o quanto antes.',
      },
      {
        question: 'Toda cobrança precisa ir para a Justiça?',
        answer:
          'Não. Muitas situações podem ser resolvidas por notificação extrajudicial e negociação. A via judicial é avaliada quando as alternativas não são suficientes.',
      },
    ],
    seoDescription:
      'Advogado de Direito Civil em São Paulo: contratos, indenizações, cobranças e questões imobiliárias. Atendimento presencial e online.',
  },
  {
    slug: 'direito-de-familia',
    icon: 'family',
    title: 'Direito de Família',
    description:
      'Orientação e representação em questões familiares, sempre buscando soluções jurídicas adequadas para cada situação.',
    headline: 'Cuidado e discrição nas questões *mais pessoais*.',
    intro: [
      'Questões de família envolvem decisões delicadas e, muitas vezes, momentos difíceis. Por isso, o atendimento é conduzido com discrição, escuta atenta e linguagem clara.',
      'Sempre que possível, prioriza-se a solução consensual — acordos e procedimentos extrajudiciais —, que tendem a ser mais rápidos e menos desgastantes para todos os envolvidos, especialmente quando há filhos.',
    ],
    services: [
      {
        title: 'Divórcio e dissolução de união estável',
        text: 'Condução de divórcios consensuais ou litigiosos, inclusive em cartório quando a lei permite.',
      },
      {
        title: 'Guarda e convivência',
        text: 'Definição de guarda, regime de convivência e revisão de acordos, sempre considerando o interesse dos filhos.',
      },
      {
        title: 'Pensão alimentícia',
        text: 'Fixação, revisão e execução de alimentos, com análise das necessidades e possibilidades das partes.',
      },
      {
        title: 'Inventário e partilha',
        text: 'Inventários judiciais e extrajudiciais, planejamento da partilha e orientação aos herdeiros.',
      },
    ],
    faq: [
      {
        question: 'É possível fazer o divórcio em cartório?',
        answer:
          'Sim, quando há consenso entre as partes e observados os requisitos legais. A presença de advogado é obrigatória no procedimento extrajudicial. Se houver filhos menores ou incapazes, a viabilidade deve ser avaliada caso a caso.',
      },
      {
        question: 'Guarda compartilhada significa dividir o tempo igualmente?',
        answer:
          'Não necessariamente. A guarda compartilhada diz respeito à divisão de responsabilidades e decisões sobre os filhos. O tempo de convivência é definido conforme a rotina e o melhor interesse da criança.',
      },
      {
        question: 'O valor da pensão pode ser revisado?',
        answer:
          'Sim. Se houver mudança relevante nas necessidades de quem recebe ou nas possibilidades de quem paga, é possível pedir a revisão do valor.',
      },
    ],
    seoDescription:
      'Advogado de Direito de Família em São Paulo: divórcio, guarda, pensão alimentícia e inventário. Atendimento discreto, presencial e online.',
  },
  {
    slug: 'direito-trabalhista',
    icon: 'briefcase',
    title: 'Direito Trabalhista',
    description: 'Assessoria e representação em questões relacionadas às relações de trabalho.',
    headline: 'Relações de trabalho com *clareza* para os dois lados.',
    intro: [
      'O escritório atende trabalhadores e empregadores, com análise criteriosa de documentos, jornadas, contratos e verbas devidas em cada relação de trabalho.',
      'Para empresas, a atuação preventiva — revisão de contratos, rotinas e procedimentos — ajuda a reduzir riscos. Para trabalhadores, a orientação começa pela conferência dos direitos e dos documentos da rescisão.',
    ],
    services: [
      {
        title: 'Verbas rescisórias',
        text: 'Conferência dos valores pagos na rescisão e orientação sobre eventuais diferenças.',
      },
      {
        title: 'Horas extras e jornada',
        text: 'Análise de controles de ponto, jornadas, intervalos e adicionais.',
      },
      {
        title: 'Assessoria preventiva a empregadores',
        text: 'Revisão de contratos, políticas internas e rotinas trabalhistas para reduzir passivos.',
      },
      {
        title: 'Acordos trabalhistas',
        text: 'Negociação e formalização de acordos, judiciais ou extrajudiciais, com segurança para as partes.',
      },
    ],
    faq: [
      {
        question: 'Qual o prazo para entrar com uma ação trabalhista?',
        answer:
          'Em regra, até dois anos após o fim do contrato de trabalho, podendo-se reclamar direitos relativos aos últimos cinco anos (art. 7º, XXIX, da Constituição Federal).',
      },
      {
        question: 'Em quanto tempo a empresa deve pagar a rescisão?',
        answer:
          'A CLT prevê o prazo de até dez dias contados do término do contrato para o pagamento das verbas rescisórias e a entrega dos documentos (art. 477, § 6º).',
      },
      {
        question: 'O escritório atende empresas?',
        answer:
          'Sim. Além da defesa em processos, o escritório oferece assessoria preventiva e acompanhamento contínuo para empregadores.',
      },
    ],
    seoDescription:
      'Advogado trabalhista em São Paulo para trabalhadores e empresas: verbas rescisórias, horas extras, acordos e assessoria preventiva.',
  },
  {
    slug: 'direito-empresarial',
    icon: 'building',
    title: 'Direito Empresarial',
    description: 'Suporte jurídico para empresas, contratos, negociações e demandas empresariais.',
    headline: 'Suporte jurídico para empresas que *pensam adiante*.',
    intro: [
      'Empresas tomam decisões jurídicas todos os dias, muitas vezes sem perceber: ao contratar, vender, negociar, admitir sócios ou mudar a estrutura do negócio.',
      'O escritório oferece suporte pontual ou contínuo, com linguagem objetiva e foco em prevenção, para que as decisões sejam tomadas com segurança e os riscos sejam conhecidos com antecedência.',
    ],
    services: [
      {
        title: 'Elaboração e análise de contratos',
        text: 'Contratos com clientes, fornecedores e parceiros, adequados à realidade de cada negócio.',
      },
      {
        title: 'Constituição e alterações societárias',
        text: 'Abertura de empresas, acordos de sócios, alterações contratuais e reorganizações.',
      },
      {
        title: 'Negociações empresariais',
        text: 'Apoio jurídico em negociações, parcerias e operações, da proposta à formalização.',
      },
      {
        title: 'Assessoria jurídica contínua',
        text: 'Acompanhamento recorrente para dúvidas do dia a dia, com previsibilidade de custos.',
      },
    ],
    faq: [
      {
        question: 'Por que ter um acordo de sócios?',
        answer:
          'O acordo de sócios define regras para situações sensíveis — entrada e saída de sócios, tomada de decisões, distribuição de resultados e solução de impasses —, reduzindo o risco de conflitos futuros.',
      },
      {
        question: 'Como funciona a assessoria contínua?',
        answer:
          'É um acompanhamento recorrente, com escopo e honorários definidos em contrato, para atender às demandas jurídicas rotineiras da empresa de forma ágil.',
      },
      {
        question: 'O atendimento pode ser totalmente online?',
        answer:
          'Sim. Reuniões, análise de documentos e assinaturas podem ser feitas de forma digital, para empresas de qualquer localidade.',
      },
    ],
    seoDescription:
      'Advogado empresarial em São Paulo: contratos, questões societárias, negociações e assessoria jurídica contínua para empresas.',
  },
  {
    slug: 'direito-do-consumidor',
    icon: 'bag',
    title: 'Direito do Consumidor',
    description: 'Atuação na proteção dos direitos do consumidor e resolução de conflitos.',
    headline: 'Seus direitos como consumidor, *bem orientados*.',
    intro: [
      'Cobranças indevidas, produtos com defeito, serviços mal prestados e negativações irregulares estão entre os problemas mais comuns nas relações de consumo.',
      'O escritório analisa a situação, orienta sobre os canais de solução — como o atendimento da própria empresa, o Procon e a plataforma consumidor.gov.br — e, quando necessário, atua judicialmente com base no Código de Defesa do Consumidor.',
    ],
    services: [
      {
        title: 'Cobranças indevidas',
        text: 'Análise de cobranças e orientação sobre restituição de valores pagos indevidamente.',
      },
      {
        title: 'Produtos e serviços defeituosos',
        text: 'Orientação sobre troca, reparo, abatimento de preço ou devolução de valores.',
      },
      {
        title: 'Negativação indevida',
        text: 'Avaliação de inscrições irregulares em cadastros de inadimplentes e das medidas cabíveis.',
      },
      {
        title: 'Conflitos com bancos e operadoras',
        text: 'Atuação em questões com instituições financeiras, planos de saúde e empresas de telefonia.',
      },
    ],
    faq: [
      {
        question: 'Qual o prazo para reclamar de um produto com defeito?',
        answer:
          'Para vícios aparentes, o prazo é de 30 dias para produtos e serviços não duráveis e de 90 dias para duráveis (art. 26 do CDC). Para vícios ocultos, o prazo começa a contar quando o defeito aparece.',
      },
      {
        question: 'Fui negativado indevidamente. O que fazer?',
        answer:
          'Reúna comprovantes de pagamento ou documentos que demonstrem a irregularidade e busque orientação. Cada caso deve ser analisado, inclusive quanto à existência de outras anotações no nome.',
      },
      {
        question: 'Preciso tentar resolver com a empresa antes?',
        answer:
          'É recomendável registrar a reclamação nos canais da empresa e guardar protocolos. Esses registros ajudam a demonstrar a tentativa de solução e fortalecem a documentação do caso.',
      },
    ],
    seoDescription:
      'Advogado de Direito do Consumidor em São Paulo: cobranças indevidas, negativação, produtos com defeito e conflitos com bancos e operadoras.',
  },
]

export const findArea = (slug: string) => practiceAreas.find((a) => a.slug === slug)
export const areaPath = (area: Pick<PracticeArea, 'slug'>) => `/areas/${area.slug}/`
