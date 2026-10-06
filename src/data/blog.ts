/**
 * BLOG — artigos informativos
 * ------------------------------------------------------------------
 * Cada artigo gera uma página em /blog/<slug>/ com SEO próprio
 * (title, description, Open Graph e dados estruturados BlogPosting).
 *
 * O corpo é uma lista de blocos: parágrafo, subtítulo, lista ou destaque.
 * Conteúdo de caráter informativo — não substitui consulta jurídica e
 * não deve prometer resultados (Provimento nº 205/2021 da OAB).
 */

export type Block =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'quote'; text: string }

export type Article = {
  slug: string
  title: string
  excerpt: string
  /** slug da área relacionada (src/data/areas.ts) */
  area: string
  /** ISO 8601 (AAAA-MM-DD) */
  date: string
  readingMinutes: number
  body: Block[]
}

export const articles: Article[] = [
  {
    slug: 'verbas-rescisorias-o-que-voce-deve-receber',
    title: 'Verbas rescisórias: o que você deve receber ao sair de um emprego',
    excerpt:
      'Saldo de salário, férias, 13º, aviso prévio e FGTS: entenda quais valores podem ser devidos em cada tipo de desligamento e qual é o prazo para pagamento.',
    area: 'direito-trabalhista',
    date: '2026-09-22',
    readingMinutes: 5,
    body: [
      {
        type: 'p',
        text: 'O fim de um contrato de trabalho costuma gerar muitas dúvidas. Quais valores são devidos? Em quanto tempo a empresa deve pagar? O que muda se a demissão foi sem justa causa ou se o pedido partiu do trabalhador? Este artigo reúne os pontos principais de forma objetiva.',
      },
      { type: 'h2', text: 'O que são verbas rescisórias' },
      {
        type: 'p',
        text: 'São os valores pagos ao trabalhador no encerramento do contrato. A composição exata depende do tipo de desligamento, do tempo de serviço e das particularidades de cada contrato.',
      },
      { type: 'h2', text: 'Dispensa sem justa causa' },
      { type: 'p', text: 'Na dispensa sem justa causa, em geral são devidos:' },
      {
        type: 'ul',
        items: [
          'saldo de salário pelos dias trabalhados no mês;',
          'aviso prévio, trabalhado ou indenizado, proporcional ao tempo de serviço;',
          'férias vencidas e proporcionais, acrescidas de um terço;',
          '13º salário proporcional;',
          'saque do FGTS e multa de 40% sobre os depósitos;',
          'guias para requerimento do seguro-desemprego, quando preenchidos os requisitos.',
        ],
      },
      { type: 'h2', text: 'Pedido de demissão' },
      {
        type: 'p',
        text: 'Quando o próprio trabalhador pede demissão, permanecem devidos o saldo de salário, as férias vencidas e proporcionais com um terço e o 13º proporcional. Não há, porém, saque do FGTS nem multa de 40%, e o aviso prévio passa a ser um dever do empregado.',
      },
      { type: 'h2', text: 'Acordo entre as partes' },
      {
        type: 'p',
        text: 'Desde a Reforma Trabalhista, a CLT permite o encerramento do contrato por acordo (art. 484-A). Nesse caso, o aviso prévio indenizado e a multa do FGTS são pagos pela metade, e o trabalhador pode movimentar até 80% do saldo do FGTS, sem direito ao seguro-desemprego.',
      },
      { type: 'h2', text: 'Qual é o prazo para pagamento' },
      {
        type: 'p',
        text: 'A empresa deve pagar as verbas rescisórias e entregar os documentos do desligamento em até dez dias contados do término do contrato (art. 477, § 6º, da CLT). O atraso pode gerar multa em favor do trabalhador.',
      },
      {
        type: 'quote',
        text: 'Guarde o termo de rescisão, os holerites e os comprovantes de depósito do FGTS. São esses documentos que permitem conferir se os valores foram calculados corretamente.',
      },
      { type: 'h2', text: 'Quando buscar orientação' },
      {
        type: 'p',
        text: 'Se houver dúvida sobre os valores recebidos, horas extras não pagas ou diferenças salariais, vale buscar uma análise dos documentos. Lembre-se de que o prazo para reclamar direitos trabalhistas na Justiça é, em regra, de dois anos após o fim do contrato.',
      },
    ],
  },
  {
    slug: 'guarda-compartilhada-como-funciona',
    title: 'Guarda compartilhada: como funciona na prática',
    excerpt:
      'Guarda compartilhada não significa necessariamente dividir o tempo em partes iguais. Entenda o que a lei prevê e como as decisões sobre os filhos são tomadas.',
    area: 'direito-de-familia',
    date: '2026-09-08',
    readingMinutes: 4,
    body: [
      {
        type: 'p',
        text: 'Quando um casal com filhos se separa, uma das primeiras dúvidas é sobre a guarda. A guarda compartilhada é a regra no Brasil desde a Lei nº 13.058/2014, mas o seu funcionamento ainda gera muitas dúvidas.',
      },
      { type: 'h2', text: 'O que é guarda compartilhada' },
      {
        type: 'p',
        text: 'Na guarda compartilhada, pai e mãe dividem as responsabilidades e as decisões importantes sobre a vida dos filhos — escola, saúde, atividades e rotina. O foco está na corresponsabilidade, não apenas no local de moradia.',
      },
      { type: 'h2', text: 'Tempo igual para cada um?' },
      {
        type: 'p',
        text: 'Não necessariamente. A lei prevê que o tempo de convívio seja dividido de forma equilibrada, considerando as condições de fato e o interesse dos filhos. Na prática, a criança costuma ter uma residência de referência, e a convivência com o outro genitor é organizada conforme a rotina da família.',
      },
      { type: 'h2', text: 'Quando a guarda compartilhada não se aplica' },
      {
        type: 'p',
        text: 'A guarda compartilhada pode deixar de ser aplicada, por exemplo, quando um dos genitores declara que não deseja a guarda ou em situações que coloquem a criança em risco. Cada caso é avaliado à luz do melhor interesse da criança.',
      },
      { type: 'h2', text: 'Guarda e pensão alimentícia' },
      {
        type: 'p',
        text: 'Um equívoco comum é imaginar que a guarda compartilhada elimina a pensão. As duas questões são independentes: os alimentos consideram as necessidades dos filhos e as possibilidades de cada genitor.',
      },
      {
        type: 'quote',
        text: 'Acordos bem construídos — com regras claras de convivência, férias e datas especiais — tendem a reduzir conflitos e trazer mais estabilidade para os filhos.',
      },
      { type: 'h2', text: 'Como formalizar' },
      {
        type: 'p',
        text: 'Havendo consenso, a guarda e a convivência podem ser definidas em acordo, submetido à homologação judicial. Não havendo consenso, cabe ao Judiciário decidir, muitas vezes com apoio de estudo psicossocial.',
      },
    ],
  },
  {
    slug: 'nome-negativado-indevidamente-o-que-fazer',
    title: 'Nome negativado indevidamente: o que fazer',
    excerpt:
      'Uma inscrição irregular em cadastros de inadimplentes pode trazer transtornos sérios. Veja os primeiros passos, quais documentos reunir e quais são os seus direitos.',
    area: 'direito-do-consumidor',
    date: '2026-08-25',
    readingMinutes: 4,
    body: [
      {
        type: 'p',
        text: 'Descobrir o nome negativado por uma dívida já paga, desconhecida ou contestada é uma situação comum — e que pode dificultar o acesso a crédito, financiamentos e até contratações. O Código de Defesa do Consumidor traz regras importantes sobre o tema.',
      },
      { type: 'h2', text: 'Você tem direito a ser comunicado' },
      {
        type: 'p',
        text: 'O CDC prevê que o consumidor deve ser comunicado por escrito antes da abertura de cadastro em seu nome (art. 43, § 2º). Também é direito do consumidor ter acesso às informações registradas e exigir a correção de dados inexatos.',
      },
      { type: 'h2', text: 'Primeiros passos' },
      {
        type: 'ul',
        items: [
          'consulte os cadastros de proteção ao crédito e identifique a empresa responsável pela anotação;',
          'reúna comprovantes de pagamento, contratos, faturas e protocolos de atendimento;',
          'registre a reclamação junto à empresa e guarde o número do protocolo;',
          'se não houver solução, avalie os canais do Procon e da plataforma consumidor.gov.br.',
        ],
      },
      { type: 'h2', text: 'Dívida paga: prazo para retirada' },
      {
        type: 'p',
        text: 'Quitada a dívida, cabe ao credor providenciar a exclusão do registro. O Superior Tribunal de Justiça entende que essa retirada deve ocorrer no prazo de cinco dias úteis após o pagamento (Súmula 548 do STJ).',
      },
      { type: 'h2', text: 'E a indenização?' },
      {
        type: 'p',
        text: 'A negativação indevida pode gerar direito à reparação por danos morais, mas cada caso exige análise. Um ponto relevante: se já existir outra anotação legítima no nome do consumidor, a jurisprudência do STJ entende que não cabe indenização por dano moral, ressalvado o direito ao cancelamento (Súmula 385).',
      },
      {
        type: 'quote',
        text: 'Organizar a documentação desde o início faz toda a diferença: datas, comprovantes e protocolos são a base de qualquer análise.',
      },
    ],
  },
  {
    slug: 'clausulas-essenciais-em-contratos-empresariais',
    title: 'Cláusulas essenciais em contratos empresariais',
    excerpt:
      'Objeto, preço, prazos, multas, rescisão e foro: conheça os pontos que merecem atenção antes de assinar um contrato com clientes, fornecedores ou parceiros.',
    area: 'direito-empresarial',
    date: '2026-08-11',
    readingMinutes: 5,
    body: [
      {
        type: 'p',
        text: 'Contratos bem redigidos são uma das formas mais eficientes de prevenir conflitos. Muitas disputas empresariais nascem de cláusulas vagas, omissas ou desequilibradas. A seguir, os pontos que merecem atenção em qualquer contrato empresarial.',
      },
      { type: 'h2', text: '1. Objeto bem definido' },
      {
        type: 'p',
        text: 'O contrato deve descrever com precisão o que será entregue ou prestado: escopo, especificações, padrões de qualidade e o que não está incluído. Quanto mais claro o objeto, menor o espaço para interpretações divergentes.',
      },
      { type: 'h2', text: '2. Preço, reajuste e forma de pagamento' },
      {
        type: 'p',
        text: 'Valores, datas de vencimento, índices de reajuste, encargos por atraso e condições de faturamento devem estar expressos, evitando discussões futuras.',
      },
      { type: 'h2', text: '3. Prazos e entregas' },
      {
        type: 'p',
        text: 'Prazos de vigência, de entrega e de aceite precisam estar alinhados à realidade operacional das partes, com previsão do que acontece em caso de atraso.',
      },
      { type: 'h2', text: '4. Multas e limitação de responsabilidade' },
      {
        type: 'p',
        text: 'Cláusulas penais devem ser proporcionais. Também é comum — e recomendável — prever limites de responsabilidade e as hipóteses em que eles não se aplicam.',
      },
      { type: 'h2', text: '5. Rescisão' },
      {
        type: 'p',
        text: 'Defina como cada parte pode encerrar o contrato, com que antecedência, em quais situações e com quais consequências financeiras.',
      },
      { type: 'h2', text: '6. Confidencialidade e dados pessoais' },
      {
        type: 'p',
        text: 'Quando houver troca de informações estratégicas ou tratamento de dados pessoais, o contrato deve estabelecer deveres de sigilo e responsabilidades compatíveis com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).',
      },
      { type: 'h2', text: '7. Foro e solução de conflitos' },
      {
        type: 'p',
        text: 'Indique o foro competente e avalie mecanismos alternativos, como mediação ou arbitragem, que podem trazer mais agilidade e especialização na solução de disputas.',
      },
      {
        type: 'quote',
        text: 'Um contrato não é apenas uma formalidade: é o documento que vai orientar a relação quando surgir uma divergência.',
      },
    ],
  },
]

export const findArticle = (slug: string) => articles.find((a) => a.slug === slug)
export const articlePath = (a: Pick<Article, 'slug'>) => `/blog/${a.slug}/`
/** Artigos em ordem do mais recente para o mais antigo. */
export const sortedArticles = () => [...articles].sort((a, b) => b.date.localeCompare(a.date))
