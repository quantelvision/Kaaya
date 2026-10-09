import { cn } from '@/lib/cn'

export function navLinkClasses(className?: string): string {
  return cn(
    'inline-flex h-tap items-center px-3 text-sm text-ink decoration-1 underline-offset-8 transition-colors hover:underline',
    className,
  )
}
