import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import { Icon, type IconName } from './Icon'

type Variant = 'gold' | 'primary' | 'outline' | 'outlineLight'
type Size = 'md' | 'lg'

const base =
  'group/btn inline-flex items-center justify-center gap-2.5 rounded-full font-medium transition-[background-color,color,border-color,box-shadow,transform] duration-300 ease-out select-none disabled:pointer-events-none disabled:opacity-60 motion-safe:active:scale-[0.98]'

const variants: Record<Variant, string> = {
  gold: 'bg-gold-500 text-navy-950 hover:bg-gold-400 shadow-[0_10px_30px_-12px_rgba(201,162,39,0.6),inset_0_1px_0_rgba(255,255,255,0.35)]',
  primary: 'bg-navy-950 text-white hover:bg-navy-800 shadow-[0_10px_30px_-14px_rgba(11,19,43,0.6),inset_0_1px_0_rgba(255,255,255,0.12)]',
  outline: 'border border-navy-950/15 bg-white text-navy-950 hover:border-navy-950/40 hover:bg-mist',
  outlineLight: 'glass text-white hover:bg-white/15',
}

const sizes: Record<Size, string> = {
  md: 'min-h-11 px-5 text-sm',
  lg: 'min-h-13 px-7 text-[0.95rem]',
}

type CommonProps = {
  variant?: Variant
  size?: Size
  icon?: IconName
  iconRight?: IconName
  children: ReactNode
  className?: string
}

type LinkProps = CommonProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }
type NativeButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined }

export function Button(props: LinkProps | NativeButtonProps) {
  const { variant = 'primary', size = 'md', icon, iconRight, children, className = '', ...rest } = props
  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`
  const content = (
    <>
      {icon && <Icon name={icon} size={icon === 'whatsapp' ? 20 : 18} />}
      <span>{children}</span>
      {iconRight && (
        <Icon name={iconRight} size={18} className="transition-transform duration-300 group-hover/btn:translate-x-0.5" />
      )}
    </>
  )

  if ('href' in rest && rest.href !== undefined) {
    return (
      <a className={classes} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {content}
      </a>
    )
  }
  return (
    <button className={classes} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {content}
    </button>
  )
}
