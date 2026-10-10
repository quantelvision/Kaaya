'use client'

import { cn } from '@/lib/cn'
import { formatNumber } from '@/lib/format'
import { tierProgress, type LoyaltyTier } from '@/lib/pricing/loyalty'
import { useHasHydrated } from '@/stores/hydration-store'
import { useLoyaltyBalance } from '@/stores/loyalty-store'

type TierListProps = {
  tiers: LoyaltyTier[]
  startingPoints: number
}

export function TierList({ tiers, startingPoints }: TierListProps) {
  const hasHydrated = useHasHydrated()
  const balance = useLoyaltyBalance(startingPoints)
  const currentName = hasHydrated ? tierProgress(balance, tiers).current?.name : undefined

  return (
    <ol className="grid gap-4 md:grid-cols-3">
      {tiers.map((tier) => {
        const isCurrent = tier.name === currentName
        return (
          <li
            key={tier.name}
            aria-current={isCurrent ? 'true' : undefined}
            className={cn(
              'flex flex-col gap-3 rounded-card border p-5',
              isCurrent ? 'border-ink bg-surface' : 'border-line',
            )}
          >
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="heading-display text-2xl text-ink">{tier.name}</h3>
              {isCurrent && <span className="label-caps text-primary">Your tier</span>}
            </div>
            <p className="text-xs text-muted tabular-nums">
              {tier.minPoints === 0
                ? 'From your first order'
                : `From ${formatNumber(tier.minPoints)} points`}
            </p>
            <p className="text-sm text-ink">{tier.perk}</p>
          </li>
        )
      })}
    </ol>
  )
}
