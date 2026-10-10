'use client'

import Link from 'next/link'
import { navLinkClasses } from '@/components/layout/nav-link-classes'
import { useHasHydrated } from '@/stores/hydration-store'
import { useLoyaltyBalance } from '@/stores/loyalty-store'

export function RewardsLink({ startingPoints }: { startingPoints: number | null }) {
  const hasHydrated = useHasHydrated()
  const balance = useLoyaltyBalance(startingPoints ?? 0)
  const showBalance = hasHydrated && startingPoints !== null

  return (
    <Link
      href="/rewards"
      aria-label={showBalance ? `Kaaya rewards, ${balance} points` : 'Kaaya rewards'}
      className={navLinkClasses('gap-2')}
    >
      Rewards
      {showBalance && (
        <span className="hidden h-5 items-center rounded-full bg-wash px-2 text-2xs font-medium text-primary tabular-nums lg:inline-flex">
          {balance} pts
        </span>
      )}
    </Link>
  )
}
