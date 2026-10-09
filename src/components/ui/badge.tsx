import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

const toneClasses = {
  default: 'bg-wash text-ink',
  sale: 'bg-accent text-on-accent',
  limited: 'border border-ink text-ink',
  lowStock: 'text-danger',
} as const

export type BadgeTone = keyof typeof toneClasses

type BadgeProps = {
  tone?: BadgeTone
  className?: string
  children: ReactNode
}

export function Badge({ tone = 'default', className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-control px-2 py-1 label-caps whitespace-nowrap',
        toneClasses[tone],
        tone === 'lowStock' && 'px-0',
        className,
      )}
    >
      {children}
    </span>
  )
}
