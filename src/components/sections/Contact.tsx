import type { ReactNode } from 'react'
import { fullAddress, mapsLink, oabLabel, site } from '../../config/site'
import { headings } from '../../data/content'
import { whatsappProps } from '../../lib/whatsapp'
import { Button } from '../ui/Button'
import { Container } from '../ui/Container'
import { Icon, type IconName } from '../ui/Icon'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'
import { MapEmbed } from '../ui/MapEmbed'
import { ContactForm } from './ContactForm'
import { to } from '../../lib/paths'

const { contact } = site

type Item = { icon: IconName; label: string; value: ReactNode }

const items: Item[] = [
  { icon: 'badge', label: 'Advogado responsável', value: <>{site.lawyer.name}<span className="block text-sm text-muted">{oabLabel}</span></> },
  {
    icon: 'whatsapp',
    label: 'WhatsApp',
    value: (
      <a {...whatsappProps()} className="link-underline">
        {contact.whatsappDisplay}
      </a>
    ),
  },
  ...(contact.phoneDisplay
    ? [
        {
          icon: 'phone' as const,
          label: 'Telefone',
          value: contact.phone ? (
            <a href={`tel:+${contact.phone}`} className="link-underline">
              {contact.phoneDisplay}
            </a>
          ) : (
            contact.phoneDisplay
          ),
        },
      ]
    : []),
  {
    icon: 'mail',
    label: 'E-mail',
    value: (
      <a href={`mailto:${contact.email}`} className="link-underline break-all">
        {contact.email}
      </a>
    ),
  },
  {
    icon: 'pin',
    label: 'Endereço',
    value: (
      <a href={mapsLink} target="_blank" rel="noopener noreferrer" className="link-underline">
        {fullAddress}
      </a>
    ),
  },
  { icon: 'clock', label: 'Horário de atendimento', value: contact.hours },
]

export function Contact() {
  return (
    <section id="contato" aria-labelledby="contato-title" className="section bg-mist">
      <Container className="grid gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <SectionHeading id="contato-title" {...headings.contact} />

          <Reveal as="ul" delay={100} className="mt-10 space-y-6">
            {items.map((item) => (
              <li key={item.label} className="flex gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-full border border-navy-950/10 bg-white text-navy-800">
                  <Icon name={item.icon} size={item.icon === 'whatsapp' ? 20 : 19} strokeWidth={1.5} />
                </span>
                <div className="min-w-0 pt-0.5">
                  <p className="text-xs font-semibold tracking-[0.16em] text-muted uppercase">{item.label}</p>
                  <div className="mt-1 font-medium break-words text-navy-950">{item.value}</div>
                </div>
              </li>
            ))}
          </Reveal>

          <Reveal delay={160} className="mt-10 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
            <Button {...whatsappProps()} variant="gold" size="lg" icon="whatsapp">
              Falar pelo WhatsApp
            </Button>
            <Button href={to('/agendar/')} variant="outline" size="lg">
              Agendar consulta
            </Button>
          </Reveal>
        </div>

        <Reveal delay={120} className="lg:col-span-7">
          <ContactForm />
        </Reveal>

        <Reveal className="lg:col-span-12">
          <MapEmbed />
        </Reveal>
      </Container>
    </section>
  )
}
