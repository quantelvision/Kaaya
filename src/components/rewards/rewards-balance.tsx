'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { formatNumber } from '@/lib/format'
import { tierProgress, type LoyaltyTier } from '@/lib/pricing/loyalty'
import { useHasHydrated } from '@/stores/hydration-store'
import { useLoyaltyBalance } from '@/stores/loyalty-store'

type RewardsBalanceProps = {
  tiers: LoyaltyTier[]
  startingPoints: number
}

export function RewardsBalance({ tiers, startingPoints }: RewardsBalanceProps) {
  const hasHydrated = useHasHydrated()
  const balance = useLoyaltyBalance(startingPoints)

  if (!hasHydrated) {
    return (
      <div aria-hidden className="flex flex-col gap-4 rounded-card bg-wash p-6 md:p-8">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-14 w-48" />
        <Skeleton className="h-2 w-full" />
      </div>
    )
  }

  const progress = tierProgress(balance, tiers)

  return (
    <section
      aria-labelledby="balance-heading"
      className="flex flex-col gap-5 rounded-card bg-wash p-6 md:p-8"
    >
      <div className="flex flex-col gap-1">
        <h2 id="balance-heading" className="label-caps text-muted">
          Your balance
        </h2>
        <p className="heading-display text-5xl text-ink tabular-nums">
          {formatNumber(balance)}
          <span className="ml-2 font-body text-base text-muted">points</span>
        </p>
        {progress.current && (
          <p className="text-sm text-ink">
            Tier: <span className="font-medium">{progress.current.name}</span>
          </p>
        )}
      </div>
      {progress.next ? (
        <div className="flex flex-col gap-2">
          <div
            role="progressbar"
            aria-label={`Progress to ${progress.next.name}`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress.progress * 100)}
            className="h-1.5 overflow-hidden rounded-full bg-line"
          >
            <div
              className="h-full origin-left rounded-full bg-primary"
              style={{ transform: `scaleX(${progress.progress})` }}
            />
          </div>
          <p className="text-xs text-muted tabular-nums">
            {formatNumber(progress.pointsToNext)} points to {progress.next.name}
          </p>
        </div>
      ) : (
        <p className="text-xs text-muted">You have reached the top tier.</p>
      )}
    </section>
  )
}
