/**
 * CONTEÚDO DAS SEÇÕES
 * ------------------------------------------------------------------
 * Textos editáveis separados dos componentes. Para trocar as áreas de
 * atuação, FAQ, depoimentos etc., edite apenas este arquivo.
 *
 * Regra editorial: comunicação institucional, sem promessa de resultado
 * (Código de Ética e Disciplina da OAB e Provimento nº 205/2021).
 */
import type { IconName } from '../components/ui/Icon'
import { practiceAreas } from './areas'

export { practiceAreas, type PracticeArea } from './areas'

export type NavItem = { label: string; href: string }

export const navItems: NavItem[] = [
  { label: 'Início', href: '#inicio' },
  { label: 'Áreas de Atuação', href: '#areas' },
  { label: 'Sobre', href: '#sobre' },
  { label: 'Blog', href: '/blog/' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contato', href: '#contato' },
]

/**
 * Títulos das seções. Use *asteriscos* para o itálico dourado de destaque.
 */
export const headings = {
  areas: {
    eyebrow: 'Áreas de atuação',
    title: 'Atuação jurídica com *foco* na sua necessidade.',
    description: 'Orientação e representação em diferentes áreas do Direito, com análise individual de cada situação.',
  },
  benefits: {
    eyebrow: 'Diferenciais',
    title: 'Uma advocacia *próxima*, clara e criteriosa.',
    description:
      'Princípios que orientam a forma como cada cliente é atendido, do primeiro contato ao acompanhamento do caso.',
  },
  process: {
    eyebrow: 'Processo de atendimento',
    title: 'Como funciona o *atendimento*.',
    description: 'Um percurso claro, para que você saiba o que esperar em cada etapa.',
  },
  testimonials: { eyebrow: 'Depoimentos', title: 'A experiência de quem *já foi atendido*.' },
  faq: {
    eyebrow: 'Perguntas frequentes',
    title: 'Dúvidas *comuns*.',
    description:
      'Respostas objetivas sobre o atendimento. Se a sua dúvida não estiver aqui, fale diretamente com o escritório.',
  },
  contact: {
    eyebrow: 'Contato',
    title: 'Fale com o *escritório*.',
    description: 'Escolha o canal de sua preferência. O atendimento pode ser presencial ou online.',
  },
}

export const hero = {
  eyebrow: 'Escritório de advocacia',
  title: 'Defesa jurídica *estratégica* para proteger seus direitos.',
  subtitle:
    'Atendimento personalizado, orientação jurídica segura e atuação focada nas necessidades de cada cliente.',
  highlights: ['Atendimento personalizado', 'Orientação jurídica especializada', 'Atuação estratégica'],
}

export const about = {
  eyebrow: 'Sobre o escritório',
  title: 'Experiência, estratégia e *compromisso* com cada cliente.',
}

export type Benefit = { icon: IconName; title: string; description: string }

export const benefits: Benefit[] = [
  {
    icon: 'userCheck',
    title: 'Atendimento Personalizado',
    description: 'Cada caso é analisado individualmente para identificar a estratégia jurídica mais adequada.',
  },
  {
    icon: 'message',
    title: 'Comunicação Transparente',
    description: 'Informações claras para que o cliente compreenda cada etapa do processo.',
  },
  {
    icon: 'compass',
    title: 'Estratégia Jurídica',
    description: 'Atuação baseada em análise cuidadosa dos fatos e das possibilidades jurídicas.',
  },
  {
    icon: 'shield',
    title: 'Compromisso',
    description: 'Dedicação e responsabilidade em cada demanda.',
  },
]

export const helpCta = {
  title: 'Precisa de *orientação* jurídica?',
  text: 'Conte brevemente o que está acontecendo. Nossa equipe poderá avaliar sua situação inicial e orientar você sobre os próximos passos.',
  disclaimer: 'O contato inicial não substitui uma consulta jurídica formal.',
}

export type ProcessStep = { title: string; description: string }

export const processSteps: ProcessStep[] = [
  { title: 'Primeiro contato', description: 'O cliente entra em contato através do WhatsApp ou formulário.' },
  {
    title: 'Entendimento do caso',
    description: 'São coletadas as principais informações necessárias para compreender a situação.',
  },
  { title: 'Análise jurídica', description: 'O caso é analisado considerando os aspectos jurídicos aplicáveis.' },
  {
    title: 'Estratégia e acompanhamento',
    description: 'São apresentadas as possibilidades de atuação e os próximos passos.',
  },
]

export type Testimonial = { quote: string; author: string; context?: string }

/**
 * DEPOIMENTOS — os textos abaixo são FICTÍCIOS (projeto de portfólio).
 * Em um site real, use apenas depoimentos reais e autorizados por escrito,
 * e confirme a adequação às regras de publicidade da OAB.
 * Para ocultar a seção inteira, deixe o array vazio: [].
 */
export const testimonials: Testimonial[] = [
  {
    quote:
      'Fui atendida com muita atenção desde o primeiro contato. Cada etapa do processo de divórcio foi explicada com clareza, o que trouxe tranquilidade em um momento difícil.',
    author: 'M. C. S.',
    context: 'Direito de Família',
  },
  {
    quote:
      'O escritório revisou todos os contratos da nossa empresa e passou a nos acompanhar de forma contínua. A comunicação é objetiva e sempre recebemos retorno rápido.',
    author: 'R. A. L.',
    context: 'Direito Empresarial',
  },
  {
    quote:
      'Tive uma cobrança indevida que não conseguia resolver sozinho. Recebi uma orientação honesta sobre as possibilidades e me senti acompanhado do início ao fim.',
    author: 'J. P. M.',
    context: 'Direito do Consumidor',
  },
]

export type FaqItem = { question: string; answer: string }

export const faq: FaqItem[] = [
  {
    question: 'Como funciona o primeiro atendimento?',
    answer:
      'O primeiro contato pode ser feito pelo WhatsApp ou pelo formulário deste site. Nesse momento, você relata brevemente a situação e, se for o caso, agendamos um atendimento para entender os detalhes, esclarecer dúvidas e avaliar quais caminhos jurídicos podem ser considerados.',
  },
  {
    question: 'É possível realizar atendimento online?',
    answer:
      'Sim. Além do atendimento presencial, realizamos atendimentos por videochamada, com a mesma atenção e sigilo. O envio de documentos também pode ser feito de forma digital.',
  },
  {
    question: 'Quais documentos devo apresentar?',
    answer:
      'Depende do assunto. Em geral, é útil ter em mãos documento de identificação, comprovante de residência e todos os documentos relacionados ao caso, como contratos, comprovantes, mensagens e notificações. Após o primeiro contato, indicamos com precisão o que será necessário.',
  },
  {
    question: 'Quanto custa uma consulta jurídica?',
    answer:
      'Os honorários variam conforme a natureza e a complexidade de cada caso, observando a tabela de honorários da OAB da seccional. Os valores são informados com transparência antes do início de qualquer trabalho.',
  },
  {
    question: 'Como saber se meu caso possui solução jurídica?',
    answer:
      'Somente a análise dos fatos e dos documentos permite avaliar as possibilidades jurídicas de cada situação. No atendimento, você recebe uma orientação clara sobre os caminhos possíveis, seus riscos e as alternativas disponíveis, sem promessas de resultado.',
  },
  {
    question: 'Quanto tempo pode levar um processo?',
    answer:
      'O tempo de um processo depende de diversos fatores, como o tipo de ação, a complexidade do caso, a possibilidade de acordo e o andamento do Poder Judiciário. Não é possível garantir prazos, mas você será informado sobre cada etapa ao longo do acompanhamento.',
  },
]

export const finalCta = {
  title: 'Não deixe uma questão jurídica *sem orientação*.',
  text: 'Fale com nosso escritório e entenda quais caminhos podem ser avaliados para o seu caso.',
}

/** Opções do campo "Assunto" do formulário (geradas a partir das áreas). */
export const contactSubjects = [...practiceAreas.map((a) => a.title), 'Outro assunto']
