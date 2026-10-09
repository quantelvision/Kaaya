import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'

type IconButtonProps = Omit<ComponentProps<'button'>, 'aria-label'> & {
  label: string
  variant?: 'ghost' | 'outline' | 'solid'
}

const variantClasses = {
  ghost: 'text-ink hover:bg-wash',
  outline: 'border border-line text-ink hover:border-ink',
  solid: 'bg-primary text-on-primary hover:bg-primary-hover',
} as const

export function iconButtonClasses(
  variant: IconButtonProps['variant'] = 'ghost',
  className?: string,
) {
  return cn(
    'relative inline-flex size-tap shrink-0 items-center justify-center rounded-btn transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50',
    variantClasses[variant],
    className,
  )
}

export function IconButton({
  label,
  variant = 'ghost',
  className,
  type = 'button',
  children,
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      className={iconButtonClasses(variant, className)}
      {...props}
    >
      {children}
    </button>
  )
}
