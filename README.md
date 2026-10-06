# Site institucional — Escritório de Advocacia

> **Projeto de portfólio.** O escritório "Valente Advocacia", o advogado, a OAB, os contatos e os depoimentos são fictícios. Fotos ilustrativas do [Unsplash](https://unsplash.com/) (licença Unsplash). Para usar com um cliente real, troque os dados em `src/config/site.ts` e `src/data/content.ts` e defina `isPortfolio: false` (remove o aviso do rodapé).

React + TypeScript + Tailwind CSS v4 (Vite). HTML pré-renderizado no build (SEO e carregamento rápido), hidratado no navegador.

## Comandos

```bash
npm install
npm run dev       # desenvolvimento em http://localhost:5173
npm run build     # gera /dist (estático, pronto para Netlify, Vercel, Hostinger etc.)
npm run preview   # serve o /dist localmente
```

## Páginas

Todas são geradas como HTML estático no build, com título, descrição, Open Graph e dados estruturados próprios.

| URL | Conteúdo |
|---|---|
| `/` | Página inicial |
| `/areas/<slug>/` | Uma página por área de atuação (gerada de `src/data/areas.ts`) |
| `/blog/` e `/blog/<slug>/` | Blog com filtro por área e artigos (gerados de `src/data/blog.ts`) |
| `/agendar/` | Agendamento online — aceita `?area=<slug>` para pré-selecionar o assunto |
| `/privacidade/` | Política de Privacidade |
| `/404.html` | Página não encontrada |

`sitemap.xml` e `robots.txt` são gerados automaticamente com todas as páginas.

## Personalização: onde editar

| O quê | Arquivo |
|---|---|
| Dados do escritório, contatos, endereço, redes, imagens, domínio | `src/config/site.ts` |
| Áreas de atuação (índice da home + páginas próprias + FAQ por área) | `src/data/areas.ts` |
| Artigos do blog | `src/data/blog.ts` |
| Títulos das seções, diferenciais, processo, depoimentos, FAQ | `src/data/content.ts` |
| Horários e regras do agendamento | `site.scheduling` em `src/config/site.ts`; feriados extras em `src/lib/schedule.ts` |
| Métricas (GA4 / Plausible) | `site.analytics` em `src/config/site.ts` |
| SEO por página | `src/seo.ts` |
| Cores e tipografia | bloco `@theme` em `src/index.css` |

Nos títulos, `*palavra*` vira o itálico dourado de destaque.

### Novo artigo ou nova área
Adicione um item em `src/data/blog.ts` ou `src/data/areas.ts` e rode `npm run build`. A página, os links do rodapé, o sitemap e o SEO são criados automaticamente.

### WhatsApp
Preencha `contact.whatsapp` só com dígitos (ex.: `5511999999999`).

### Formulário e agendamento
Sem `endpoint`, ambos abrem o WhatsApp com a mensagem pronta. Com `form.endpoint` / `scheduling.endpoint` (Formspree, API própria etc.), enviam um POST em JSON.

### Cookies (LGPD) e métricas
O banner pede consentimento para **estatísticas** e **mídia externa**. GA4/Plausible só carregam após o aceite, e o mapa do Google só é incorporado com consentimento (antes disso, mostra uma prévia com link para o Maps). As preferências podem ser alteradas pelo link no rodapé.

Eventos de conversão registrados: `whatsapp_click`, `phone_click`, `email_click` (com a seção de origem), `contact_form_submit` e `schedule_submit`. Em desenvolvimento, aparecem no console.

## Antes de publicar
- [ ] Substituir todos os campos `[ENTRE COLCHETES]`
- [ ] Usar somente depoimentos reais, com autorização por escrito, e confirmar a adequação às regras de publicidade da OAB (Provimento nº 205/2021). Para ocultar a seção, deixe `testimonials = []`
- [ ] Revisar a Política de Privacidade e preencher a data
- [ ] Gerar uma nova `public/og-image.jpg` com o nome do escritório real
- [ ] Cadastrar o domínio no Google Search Console e enviar o `sitemap.xml`
- [ ] Criar/atualizar o Perfil da Empresa no Google (essencial para buscas locais)
- [ ] Configurar o servidor para servir `404.html` em rotas inexistentes (Netlify e Vercel fazem isso automaticamente)
- [ ] Revisar os artigos do blog com o advogado responsável

## Estrutura

```
src/
  config/site.ts          configuração central
  data/                   areas.ts, blog.ts, content.ts
  routes.ts               rotas do site
  seo.ts                  meta tags, JSON-LD e sitemap por página
  pages/                  Home, Area, Blog, Article, Schedule, Privacy, NotFound
  components/sections/    seções da home, Header, Footer, WhatsAppButton
  components/ui/          Button, Icon, PageHero, ArticleCard, CookieBanner, MapEmbed…
  lib/                    analytics, consent (LGPD), schedule (dias úteis/feriados), whatsapp, format
scripts/prerender.mjs     gera o HTML estático de todas as páginas
```
