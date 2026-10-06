import { practiceAreas, areaPath } from '../data/areas'
import { Button } from '../components/ui/Button'
import { Container } from '../components/ui/Container'
import { PageHero } from '../components/ui/PageHero'
import { to } from '../lib/paths'

export function NotFoundPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: 'Início', href: '/' }, { label: 'Página não encontrada' }]}
        eyebrow="Erro 404"
        title="Página não *encontrada*."
        description={<p>O endereço acessado não existe ou foi alterado. Veja abaixo alguns caminhos úteis.</p>}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button href={to('/')} variant="gold" size="lg">
            Voltar ao início
          </Button>
          <Button href={to('/agendar/')} variant="outlineLight" size="lg">
            Agendar consulta
          </Button>
        </div>
      </PageHero>
      <section className="bg-white py-16">
        <Container>
          <p className="eyebrow text-gold-700">Áreas de atuação</p>
          <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
            {practiceAreas.map((a) => (
              <li key={a.slug}>
                <a href={to(areaPath(a))} className="font-serif text-2xl text-navy-950 hover:text-gold-700">
                  {a.title}
                </a>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  )
}
