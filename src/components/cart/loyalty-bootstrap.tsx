'use client'

import { useEffect } from 'react'
import { useHasHydrated } from '@/stores/hydration-store'
import { useLoyaltyStore } from '@/stores/loyalty-store'

// the demo guest gets the starting balance from sanity once, after the session state is loaded
export function LoyaltyBootstrap({ startingPoints }: { startingPoints: number }) {
  const hasHydrated = useHasHydrated()
  const initialize = useLoyaltyStore((state) => state.initialize)

  useEffect(() => {
    if (hasHydrated) initialize(startingPoints)
  }, [hasHydrated, initialize, startingPoints])

  return null
}
