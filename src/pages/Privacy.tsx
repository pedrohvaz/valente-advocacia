import { site } from '../config/site'
import { Container } from '../components/ui/Container'
import { PageHero } from '../components/ui/PageHero'

/**
 * POLÍTICA DE PRIVACIDADE — modelo base.
 * Revise o texto com o responsável pelo tratamento de dados antes de publicar.
 */
const sections: { title: string; body: string[] }[] = [
  {
    title: '1. Quem somos',
    body: [
      `Este site pertence a ${site.officeName}, escritório de advocacia sob responsabilidade de ${site.lawyer.name}, inscrito na OAB/${site.lawyer.oabState} sob o nº ${site.lawyer.oabNumber}, com endereço em ${site.location.street}, ${site.location.city}/${site.location.stateCode}.`,
    ],
  },
  {
    title: '2. Dados que coletamos',
    body: [
      'Coletamos apenas os dados que você nos fornece voluntariamente pelo formulário de contato ou pelo WhatsApp: nome, e-mail, número de telefone/WhatsApp, assunto e o conteúdo da mensagem.',
      'Recomendamos que, no primeiro contato, você não envie documentos ou informações sensíveis além do necessário para uma descrição inicial da situação.',
    ],
  },
  {
    title: '3. Finalidade do uso',
    body: [
      'Os dados são utilizados exclusivamente para responder ao seu contato, agendar atendimentos e prestar as informações solicitadas, com base no seu consentimento e no legítimo interesse, nos termos da Lei nº 13.709/2018 (LGPD).',
    ],
  },
  {
    title: '4. Sigilo e compartilhamento',
    body: [
      'As informações recebidas são tratadas com sigilo profissional, conforme o Estatuto da Advocacia e o Código de Ética e Disciplina da OAB. Não vendemos nem compartilhamos seus dados com terceiros para fins comerciais.',
      'O envio de mensagens pelo WhatsApp está sujeito também à política de privacidade do próprio aplicativo.',
    ],
  },
  {
    title: '5. Armazenamento e segurança',
    body: [
      'Os dados são mantidos pelo tempo necessário ao atendimento da finalidade para a qual foram coletados ou para cumprimento de obrigações legais, com medidas razoáveis de segurança para protegê-los.',
    ],
  },
  {
    title: '6. Seus direitos',
    body: [
      `Você pode, a qualquer momento, solicitar confirmação, acesso, correção, anonimização ou exclusão dos seus dados, bem como revogar o consentimento, pelo e-mail ${site.contact.email}.`,
    ],
  },
  {
    title: '7. Cookies',
    body: [
      'Utilizamos cookies e armazenamento local estritamente necessários para guardar suas preferências neste site.',
      'Com o seu consentimento, também podem ser utilizados: (i) cookies de estatística, para medir de forma agregada as visitas e os contatos realizados pelo site; e (ii) conteúdo de mídia externa, como o mapa do Google, que pode definir cookies próprios.',
      'Você pode aceitar, recusar ou alterar suas preferências a qualquer momento pelo link "Preferências de cookies", no rodapé do site.',
    ],
  },
]

export function Privacy() {
  return (
    <>
      <PageHero
        crumbs={[{ label: 'Início', href: '/' }, { label: 'Política de Privacidade' }]}
        eyebrow="Transparência"
        title="Política de *Privacidade*."
        description={<p>Última atualização: 6 de outubro de 2026</p>}
      />

      <section className="bg-white py-16 sm:py-24">
        <Container className="max-w-3xl">
          <div className="space-y-12">
            {sections.map((s) => (
              <section key={s.title}>
                <h2 className="font-serif text-[1.75rem] text-navy-950">{s.title}</h2>
                <div className="mt-4 space-y-4 text-lg leading-relaxed text-ink">
                  {s.body.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </Container>
      </section>
    </>
  )
}
