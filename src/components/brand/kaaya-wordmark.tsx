import { cn } from '@/lib/cn'

const sizeClasses = {
  sm: 'text-lg',
  md: 'text-xl lg:text-2xl',
  lg: 'wordmark-display text-4xl md:text-5xl',
} as const

type KaayaWordmarkProps = {
  size?: keyof typeof sizeClasses
  className?: string
}

export function KaayaWordmark({ size = 'md', className }: KaayaWordmarkProps) {
  return <span className={cn('inline-block wordmark', sizeClasses[size], className)}>Kaaya</span>
}
