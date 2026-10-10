'use client'

import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { Check } from '@phosphor-icons/react/ssr'
import { useId } from 'react'
import { formatNumber, formatPrice } from '@/lib/format'
import type { LoyaltyRules } from '@/lib/pricing/loyalty'
import { minimumBagForPoints } from '@/lib/pricing/settings'
import { useCartStore } from '@/stores/cart-store'

type PointsToggleProps = {
  balance: number
  redeemablePoints: number
  pointsDiscount: number
  rules: LoyaltyRules
}

export function PointsToggle({
  balance,
  redeemablePoints,
  pointsDiscount,
  rules,
}: PointsToggleProps) {
  const id = useId()
  const usePoints = useCartStore((state) => state.usePoints)
  const setUsePoints = useCartStore((state) => state.setUsePoints)

  if (redeemablePoints <= 0) {
    const reason =
      balance < rules.minRedeemPoints
        ? `You have ${formatNumber(balance)} Kaaya points. You can use them from ${formatNumber(rules.minRedeemPoints)} points.`
        : `You have ${formatNumber(balance)} Kaaya points. They apply on bags of ${formatPrice(minimumBagForPoints(rules))} or more.`
    return <p className="text-xs text-muted">{reason}</p>
  }

  const savings = usePoints ? pointsDiscount : Math.round(redeemablePoints * rules.pointValueRupees)

  return (
    <div className="flex min-h-tap items-center gap-3 rounded-card border border-line px-3 py-2">
      <CheckboxPrimitive.Root
        id={id}
        checked={usePoints}
        onCheckedChange={(checked) => setUsePoints(checked === true)}
        className="inline-flex size-5 shrink-0 items-center justify-center rounded-control border border-muted bg-surface text-on-primary transition-colors hover:border-ink data-[state=checked]:border-primary data-[state=checked]:bg-primary"
      >
        <CheckboxPrimitive.Indicator>
          <Check weight="light" className="size-4" aria-hidden />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      <label htmlFor={id} className="flex flex-1 cursor-pointer flex-col">
        <span className="text-sm text-ink tabular-nums">
          Use {formatNumber(redeemablePoints)} points (save {formatPrice(savings)})
        </span>
        <span className="text-xs text-muted tabular-nums">
          Balance {formatNumber(balance)} points
        </span>
      </label>
    </div>
  )
}
