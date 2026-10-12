export type LoyaltyRules = {
  earnRupeesPerPoint: number
  pointValueRupees: number
  maxRedeemPercent: number
  minRedeemPoints: number
}

export type LoyaltyTier = {
  name: string
  minPoints: number
  perk: string
}

export type TierProgress = {
  current: LoyaltyTier | null
  next: LoyaltyTier | null
  pointsToNext: number
  progress: number
}

export function redeemablePoints(
  balance: number,
  amountAfterCoupon: number,
  rules: LoyaltyRules,
): number {
  if (balance <= 0 || amountAfterCoupon <= 0 || rules.pointValueRupees <= 0) return 0
  const capInRupees = (amountAfterCoupon * rules.maxRedeemPercent) / 100
  const capInPoints = Math.floor(capInRupees / rules.pointValueRupees)
  const points = Math.min(Math.floor(balance), capInPoints)
  return points >= rules.minRedeemPoints ? points : 0
}

// a request outside the allowed range snaps to the nearest end, and 0 always means no points
export function pointsToRedeem(
  requested: number,
  maxRedeemable: number,
  rules: LoyaltyRules,
): number {
  if (requested <= 0 || maxRedeemable <= 0) return 0
  return Math.min(maxRedeemable, Math.max(rules.minRedeemPoints, Math.floor(requested)))
}

export function pointsValue(points: number, rules: LoyaltyRules): number {
  return Math.round(points * rules.pointValueRupees)
}

export function pointsEarned(amountPaid: number, rules: LoyaltyRules): number {
  if (amountPaid <= 0 || rules.earnRupeesPerPoint <= 0) return 0
  return Math.floor(amountPaid / rules.earnRupeesPerPoint)
}

export function tierProgress(points: number, tiers: LoyaltyTier[]): TierProgress {
  const sorted = [...tiers].sort((a, b) => a.minPoints - b.minPoints)
  const current = [...sorted].reverse().find((tier) => points >= tier.minPoints) ?? null
  const next = sorted.find((tier) => tier.minPoints > points) ?? null
  if (!next) return { current, next: null, pointsToNext: 0, progress: 1 }
  const floor = current?.minPoints ?? 0
  const span = next.minPoints - floor
  return {
    current,
    next,
    pointsToNext: next.minPoints - points,
    progress: span > 0 ? Math.min(1, Math.max(0, (points - floor) / span)) : 0,
  }
}
