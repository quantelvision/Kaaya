import { formatPrice } from '@/lib/format'

export type CouponRule = {
  code: string
  type: 'percent' | 'flat' | 'freeShipping'
  value: number
  minCartValue: number
  firstOrderOnly: boolean | null
  isActive: boolean | null
  expiresAt: string | null
}

export type CouponEligibility =
  | { status: 'unknown' }
  | { status: 'inactive' }
  | { status: 'firstOrderOnly' }
  | { status: 'belowMinimum'; shortfall: number }
  | { status: 'eligible' }

type EligibilityContext = {
  subtotal: number
  hasPlacedOrder: boolean
  now: number
}

export function normalizeCouponCode(code: string): string {
  return code.trim().toUpperCase()
}

export function couponEligibility(
  coupon: CouponRule | null,
  { subtotal, hasPlacedOrder, now }: EligibilityContext,
): CouponEligibility {
  if (!coupon) return { status: 'unknown' }
  const hasExpired = coupon.expiresAt !== null && Date.parse(coupon.expiresAt) <= now
  if (!coupon.isActive || hasExpired) return { status: 'inactive' }
  if (coupon.firstOrderOnly && hasPlacedOrder) return { status: 'firstOrderOnly' }
  if (subtotal < coupon.minCartValue) {
    return { status: 'belowMinimum', shortfall: coupon.minCartValue - subtotal }
  }
  return { status: 'eligible' }
}

export function couponDiscount(coupon: CouponRule, subtotal: number): number {
  if (coupon.type === 'percent') {
    return Math.min(subtotal, Math.round((subtotal * coupon.value) / 100))
  }
  if (coupon.type === 'flat') return Math.min(subtotal, coupon.value)
  return 0
}

export function couponMessage(
  eligibility: CouponEligibility,
  code: string,
  savings: number,
): string {
  switch (eligibility.status) {
    case 'unknown':
      return 'This code does not exist.'
    case 'inactive':
      return 'This code is no longer active.'
    case 'firstOrderOnly':
      return 'This code is for first orders only.'
    case 'belowMinimum':
      return `Add ${formatPrice(eligibility.shortfall)} more to use this code.`
    case 'eligible':
      return `${normalizeCouponCode(code)} applied. You save ${formatPrice(savings)}.`
  }
}
