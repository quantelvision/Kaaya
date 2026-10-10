'use client'

import { useNow } from '@/hooks/use-now'
import { cn } from '@/lib/cn'
import { saleEndsAt, timeParts, type CountdownSource } from '@/lib/festive-countdown'

type CountdownProps = {
  sale: CountdownSource
  variant: 'blocks' | 'inline'
  className?: string
}

const units = [
  { key: 'days', short: 'd', long: 'Days' },
  { key: 'hours', short: 'h', long: 'Hours' },
  { key: 'minutes', short: 'm', long: 'Min' },
  { key: 'seconds', short: 's', long: 'Sec' },
] as const

function pad(value: number): string {
  return String(value).padStart(2, '0')
}

export function Countdown({ sale, variant, className }: CountdownProps) {
  const now = useNow()
  const end = now === null ? null : saleEndsAt(sale, now)
  const parts = now !== null && end !== null ? timeParts(end - now) : null

  if (now !== null && end === null) return null

  if (variant === 'inline') {
    return (
      <span className={cn('tabular-nums', className)}>
        {units.map((unit) => (
          <span key={unit.key} className="mr-1.5 last:mr-0">
            {parts ? pad(parts[unit.key]) : '--'}
            {unit.short}
          </span>
        ))}
      </span>
    )
  }

  return (
    <div className={cn('flex gap-2', className)} role="timer" aria-live="off">
      {units.map((unit) => (
        <div
          key={unit.key}
          className="flex min-w-14 flex-col items-center rounded-card bg-accent px-2 py-2 text-on-accent"
        >
          <span className="font-display text-xl tabular-nums">
            {parts ? pad(parts[unit.key]) : '--'}
          </span>
          <span className="label-caps">{unit.long}</span>
        </div>
      ))}
    </div>
  )
}
