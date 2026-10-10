'use client'

import { useMemo } from 'react'
import { useNow } from '@/hooks/use-now'
import type { CartLine } from '@/lib/cart'
import type { PaymentMethod } from '@/lib/order'
import type { StorePricing } from '@/lib/pricing/settings'
import { computeOrderTotals } from '@/lib/pricing/totals'
import { useCartStore } from '@/stores/cart-store'
import { useHasHydrated } from '@/stores/hydration-store'
import { useLoyaltyBalance } from '@/stores/loyalty-store'
import { useOrdersStore } from '@/stores/orders-store'

const CLOCK_INTERVAL_MS = 60_000
const NO_LINES: CartLine[] = []

export function useCartTotals(storePricing: StorePricing, paymentMethod: PaymentMethod | null) {
  const hasHydrated = useHasHydrated()
  const lines = useCartStore((state) => state.lines)
  const coupon = useCartStore((state) => state.coupon)
  const couponCode = useCartStore((state) => state.couponCode)
  const usePoints = useCartStore((state) => state.usePoints)
  const balance = useLoyaltyBalance(storePricing.loyalty?.startingPoints ?? 0)
  const hasPlacedOrder = useOrdersStore((state) => state.orders.length > 0)
  const now = useNow(CLOCK_INTERVAL_MS)

  const visibleLines = hasHydrated ? lines : NO_LINES
  const totals = useMemo(
    () =>
      computeOrderTotals({
        lines: visibleLines,
        coupon,
        couponCode,
        hasPlacedOrder,
        pointsBalance: balance,
        usePoints,
        paymentMethod,
        settings: storePricing.pricing,
        loyalty: storePricing.loyalty,
        now: now ?? 0,
      }),
    [
      visibleLines,
      coupon,
      couponCode,
      hasPlacedOrder,
      balance,
      usePoints,
      paymentMethod,
      storePricing,
      now,
    ],
  )

  return { totals, lines: visibleLines, balance, hasHydrated }
}
