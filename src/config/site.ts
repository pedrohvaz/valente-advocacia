/**
 * CONFIGURAÇÃO CENTRAL DO SITE
 * ------------------------------------------------------------------
 * Todas as informações específicas do advogado/escritório ficam aqui.
 *
 * ATENÇÃO: os dados abaixo são FICTÍCIOS (projeto de portfólio).
 * Para usar o site com um cliente real, substitua todos os valores.
 *
 * Este arquivo também alimenta o SEO (title, meta tags, Open Graph,
 * dados estruturados, sitemap.xml e robots.txt) durante o build.
 * Não adicione aqui nada que dependa do navegador (window, document).
 */

/** Prefixo de publicação (ex.: '/valente-advocacia/' no GitHub Pages). */
const B = import.meta.env.BASE_URL

export type SiteImage = {
  src: string
  /** Versões em larguras diferentes, ex.: '/a-640.webp 640w, /a-960.webp 960w' */
  srcSet?: string
  alt: string
}

export const site = {
  /** Projeto de portfólio: exibe um aviso discreto de dados fictícios no rodapé. */
  isPortfolio: true,

  /** Nome do escritório, exibido no header, footer e SEO. */
  officeName: 'Valente Advocacia',
  /** Frase curta usada no footer. */
  tagline: 'Advocacia estratégica com atendimento personalizado.',

  /** Domínio final, sem barra no fim. Usado no sitemap, canonical e Open Graph. */
  url: (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, '') || 'https://www.valenteadvocacia.com.br',

  lawyer: {
    name: 'Henrique Valente',
    /** Número de inscrição na OAB. */
    oabNumber: '482.917',
    /** UF da seccional da OAB (ex.: SP, RJ, MG). */
    oabState: 'SP',
    /** Descrição profissional exibida na seção "Sobre". Cada item vira um parágrafo. */
    bio: [
      'Henrique Valente é advogado inscrito na OAB/SP sob o nº 482.917, com atuação dedicada à defesa dos interesses de seus clientes há mais de 15 anos.',
      'Graduado em Direito, com pós-graduação em Direito Civil e Processual Civil e em Direito Empresarial, conduz pessoalmente cada caso do escritório — da análise inicial ao acompanhamento final —, com atenção à realidade de cada cliente e comunicação clara em todas as etapas.',
    ],
    /** Ano de fundação, exibido em destaque sobre a foto da seção "Sobre" ('' para ocultar). */
    foundedYear: '2010',
    /** Indicadores exibidos na seção "Sobre". */
    stats: [
      { value: '15+', label: 'anos de atuação' },
      { value: '5', label: 'áreas de atuação' },
      { value: '27', label: 'estados atendidos online' },
    ],
  },

  location: {
    city: 'São Paulo',
    state: 'São Paulo',
    /** Sigla do estado (ex.: SP). Usada em SEO e textos curtos. */
    stateCode: 'SP',
    street: 'Rua Pamplona, 1.018 — 12º andar',
    district: 'Jardim Paulista',
    postalCode: '01405-001',
    /** Link do Google Maps para o endereço (opcional). Deixe '' para ocultar. */
    mapsUrl: '',
  },

  contact: {
    /**
     * WhatsApp somente com dígitos: código do país + DDD + número.
     * Ex.: 5511999999999. Vazio no portfólio para não direcionar mensagens a
     * um número real — os botões abrem o WhatsApp sem destinatário definido.
     */
    whatsapp: '',
    /** Número formatado para exibição. */
    whatsappDisplay: '(11) 98765-4321',
    /** Telefone fixo formatado (ou '' para ocultar). */
    phoneDisplay: '(11) 3456-7890',
    /** Telefone somente com dígitos, para o link tel: (ex.: 551130000000). */
    phone: '',
    email: 'contato@valenteadvocacia.com.br',
    hours: 'Segunda a sexta, das 9h às 18h',
    /** Formato schema.org — usado nos dados estruturados. */
    hoursSchema: ['Mo-Fr 09:00-18:00'],
    /** Mensagem automática ao abrir o WhatsApp. */
    whatsappMessage: 'Olá! Gostaria de obter informações sobre atendimento jurídico.',
  },

  social: {
    /** URLs completas. Deixe '' para ocultar o ícone. */
    instagram: 'https://www.instagram.com/',
    linkedin: 'https://www.linkedin.com/',
  },

  /**
   * Métricas de conversão (carregadas SOMENTE após consentimento de cookies).
   * Preencha um dos dois — ou ambos. Vazios: os eventos aparecem apenas no
   * console do navegador em desenvolvimento.
   *  - ga4Id: ID do Google Analytics 4 (ex.: 'G-XXXXXXXXXX')
   *  - plausibleDomain: domínio cadastrado no Plausible (ex.: 'valenteadvocacia.com.br')
   */
  analytics: {
    ga4Id: '',
    plausibleDomain: '',
  },

  /**
   * Agendamento online (/agendar/).
   * Sem `endpoint`, a solicitação é enviada pelo WhatsApp para confirmação.
   * Dias úteis apenas; feriados nacionais são bloqueados automaticamente.
   */
  scheduling: {
    endpoint: '',
    /** Quantos dias úteis à frente ficam disponíveis. */
    businessDaysAhead: 12,
    /** Antecedência mínima, em horas, para agendar. */
    minNoticeHours: 4,
    /** Horários oferecidos em cada dia útil. */
    slots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'],
    durationMinutes: 60,
  },

  /**
   * Formulário de contato.
   * - Se `endpoint` estiver vazio, o formulário abre o WhatsApp com a
   *   mensagem já preenchida (funciona sem servidor).
   * - Se preenchido (ex.: Formspree, Getform ou API própria), os dados
   *   são enviados via POST em JSON para esse endereço.
   */
  form: {
    endpoint: '',
  },

  /**
   * Imagens em /public/images (WebP comprimido, várias larguras).
   * Fotos ilustrativas do Unsplash (licença Unsplash). Use `null` para
   * exibir o placeholder.
   */
  images: {
    logo: '', // ex.: '/images/logo.svg' — vazio usa a marca tipográfica
    hero: {
      src: `${B}images/advogado-hero-960.webp`,
      srcSet: `${B}images/advogado-hero-640.webp 640w, ${B}images/advogado-hero-960.webp 960w, ${B}images/advogado-hero-1280.webp 1280w`,
      alt: 'Henrique Valente, advogado, de terno em escritório com luz natural',
    } as SiteImage | null,
    about: {
      src: `${B}images/escritorio-biblioteca-960.webp`,
      srcSet: `${B}images/escritorio-biblioteca-640.webp 640w, ${B}images/escritorio-biblioteca-960.webp 960w`,
      alt: 'Biblioteca jurídica do escritório, com estantes de livros de Direito',
    } as SiteImage | null,
    meeting: {
      src: `${B}images/reuniao-cliente-1080.webp`,
      srcSet: `${B}images/reuniao-cliente-640.webp 640w, ${B}images/reuniao-cliente-1080.webp 1080w`,
      alt: 'Advogado em reunião com cliente analisando documentos',
    } as SiteImage | null,
    ctaBackground: {
      src: `${B}images/biblioteca-fundo-1920.webp`,
      srcSet: `${B}images/biblioteca-fundo-960.webp 960w, ${B}images/biblioteca-fundo-1920.webp 1920w`,
      alt: '',
    } as SiteImage | null,
    og: '/og-image.jpg', // 1200x630, usada no compartilhamento em redes sociais
  },

  seo: {
    /**
     * Permitir que buscadores indexem o site? Em demonstração/portfólio use false
     * (adiciona noindex em todas as páginas). Em produção real, true.
     */
    indexable: false,
    /** Áreas citadas na meta description. */
    areasSummary: 'Direito Civil, Família, Trabalhista, Empresarial e do Consumidor',
    /** Ano exibido no copyright. */
    copyrightYear: 2026,
  },
}

export type SiteConfig = typeof site

export const seoTitle = `${site.officeName} | Advocacia em ${site.location.city}/${site.location.stateCode}`
export const seoDescription = `Escritório de advocacia em ${site.location.city}/${site.location.stateCode}, com atuação em ${site.seo.areasSummary}. Atendimento personalizado e orientação jurídica.`
export const oabLabel = `OAB/${site.lawyer.oabState} ${site.lawyer.oabNumber}`

/** Endereço completo em uma linha. */
export const fullAddress = `${site.location.street} — ${site.location.district}, ${site.location.city}/${site.location.stateCode}, ${site.location.postalCode}`

/** Link para abrir o endereço no Google Maps (usa `mapsUrl` se definido). */
export const mapsLink =
  site.location.mapsUrl ||
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress.replace(' — ', ', '))}`

/** URL do mapa incorporado (carregado apenas com consentimento de mídia externa). */
export const mapsEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(fullAddress.replace(' — ', ', '))}&output=embed`
