import type { ComponentProps } from 'react'
import { Spinner } from '@/components/ui/spinner'
import { cn } from '@/lib/cn'

const variantClasses = {
  primary: 'bg-primary text-on-primary hover:bg-primary-hover disabled:hover:bg-primary',
  secondary: 'border border-ink bg-transparent text-ink hover:bg-ink hover:text-canvas',
  ghost: 'bg-transparent text-ink underline-offset-4 hover:underline',
} as const

const sizeClasses = {
  sm: 'h-11 px-4 text-xs',
  md: 'h-12 px-6 text-sm',
  lg: 'h-14 px-8 text-sm',
} as const

export type ButtonVariant = keyof typeof variantClasses
export type ButtonSize = keyof typeof sizeClasses

type ButtonStyleOptions = {
  variant?: ButtonVariant
  size?: ButtonSize
  isFullWidth?: boolean
  className?: string
}

export function buttonClasses({
  variant = 'primary',
  size = 'md',
  isFullWidth = false,
  className,
}: ButtonStyleOptions = {}): string {
  return cn(
    'relative inline-flex min-w-tap items-center justify-center gap-2 rounded-btn font-medium whitespace-nowrap transition-colors duration-200 select-none disabled:cursor-not-allowed disabled:opacity-50',
    variantClasses[variant],
    sizeClasses[size],
    isFullWidth && 'w-full',
    className,
  )
}

type ButtonProps = ComponentProps<'button'> &
  Omit<ButtonStyleOptions, 'className'> & {
    isLoading?: boolean
  }

export function Button({
  variant,
  size,
  isFullWidth,
  isLoading = false,
  disabled,
  className,
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      className={buttonClasses({ variant, size, isFullWidth, className })}
      {...props}
    >
      {isLoading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <Spinner />
        </span>
      )}
      <span className={cn('inline-flex items-center gap-2', isLoading && 'invisible')}>
        {children}
      </span>
    </button>
  )
}
