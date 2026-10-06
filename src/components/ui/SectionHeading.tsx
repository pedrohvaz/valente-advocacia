import type { ReactNode } from 'react'
import { rich } from '../../lib/rich'
import { Reveal } from './Reveal'

type SectionHeadingProps = {
  eyebrow: string
  title: ReactNode
  description?: ReactNode
  id?: string
  align?: 'left' | 'center'
  tone?: 'light' | 'dark'
  className?: string
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  id,
  align = 'left',
  tone = 'light',
  className = '',
}: SectionHeadingProps) {
  const centered = align === 'center'
  const dark = tone === 'dark'
  return (
    <Reveal className={`${centered ? 'mx-auto text-center' : ''} ${dark ? 'on-dark' : ''} max-w-2xl ${className}`}>
      <p
        className={`eyebrow ${centered ? 'justify-center' : ''} ${dark ? 'text-gold-500' : 'text-gold-700'}`}
      >
        {eyebrow}
      </p>
      <h2 id={id} className={`mt-4 font-serif text-display-md text-balance ${dark ? 'text-white' : 'text-navy-950'}`}>
        {typeof title === 'string' ? rich(title) : title}
      </h2>
      {description && (
        <p className={`mt-5 text-lg leading-relaxed text-pretty ${dark ? 'text-white/75' : 'text-muted'}`}>{description}</p>
      )}
    </Reveal>
  )
}
