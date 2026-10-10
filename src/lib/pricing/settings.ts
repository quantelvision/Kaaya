import type { LoyaltyRules } from '@/lib/pricing/loyalty'
import type { PricingSettings } from '@/lib/pricing/totals'

export type StorePricing = {
  pricing: PricingSettings
  loyalty: (LoyaltyRules & { startingPoints: number }) | null
}

export function minimumBagForPoints(rules: LoyaltyRules): number {
  if (rules.maxRedeemPercent <= 0) return 0
  return Math.ceil((rules.minRedeemPoints * rules.pointValueRupees * 100) / rules.maxRedeemPercent)
}
