import type { PaymentMethod } from '@/lib/order'
import {
  couponDiscount,
  couponEligibility,
  couponMessage,
  type CouponEligibility,
  type CouponRule,
} from '@/lib/pricing/coupons'
import {
  pointsEarned,
  pointsValue,
  redeemablePoints,
  type LoyaltyRules,
} from '@/lib/pricing/loyalty'
import { shippingFor, type ShippingSettings } from '@/lib/pricing/shipping'

export type PricingSettings = ShippingSettings & { codFee: number }

export type PricedLine = {
  unitPrice: number
  quantity: number
}

export type TotalsInput = {
  lines: PricedLine[]
  coupon: CouponRule | null
  couponCode: string | null
  hasPlacedOrder: boolean
  pointsBalance: number
  usePoints: boolean
  paymentMethod: PaymentMethod | null
  settings: PricingSettings
  loyalty: LoyaltyRules | null
  now: number
}

export type CouponResult = {
  code: string
  eligibility: CouponEligibility
  message: string
  isApplied: boolean
}

export type OrderTotalsResult = {
  subtotal: number
  coupon: CouponResult | null
  couponDiscount: number
  amountAfterCoupon: number
  redeemablePoints: number
  pointsRedeemed: number
  pointsDiscount: number
  amountAfterPoints: number
  shipping: number
  codFee: number
  total: number
  pointsEarned: number
}

export function lineTotal(line: PricedLine): number {
  return line.unitPrice * line.quantity
}

export function cartLinesSubtotal(lines: PricedLine[]): number {
  return lines.reduce((total, line) => total + lineTotal(line), 0)
}

// order of calculation: subtotal, coupon, points, shipping, cash on delivery fee, total
export function computeOrderTotals(input: TotalsInput): OrderTotalsResult {
  const subtotal = cartLinesSubtotal(input.lines)

  const eligibility =
    input.couponCode === null
      ? null
      : couponEligibility(input.coupon, {
          subtotal,
          hasPlacedOrder: input.hasPlacedOrder,
          now: input.now,
        })
  const appliedCoupon = eligibility?.status === 'eligible' ? input.coupon : null
  const discount = appliedCoupon ? couponDiscount(appliedCoupon, subtotal) : 0
  const amountAfterCoupon = subtotal - discount

  const redeemable = input.loyalty
    ? redeemablePoints(input.pointsBalance, amountAfterCoupon, input.loyalty)
    : 0
  const pointsRedeemed = input.usePoints ? redeemable : 0
  const pointsDiscount = input.loyalty ? pointsValue(pointsRedeemed, input.loyalty) : 0
  const amountAfterPoints = amountAfterCoupon - pointsDiscount

  const shippingBeforeCoupon = shippingFor(amountAfterPoints, input.settings)
  const isFreeShipping = appliedCoupon?.type === 'freeShipping'
  const shipping = isFreeShipping ? 0 : shippingBeforeCoupon
  const codFee = input.paymentMethod === 'cod' && subtotal > 0 ? input.settings.codFee : 0

  const savings = isFreeShipping ? shippingBeforeCoupon : discount
  const coupon =
    eligibility && input.couponCode !== null
      ? {
          code: input.couponCode,
          eligibility,
          message: couponMessage(eligibility, input.couponCode, savings),
          isApplied: eligibility.status === 'eligible',
        }
      : null

  return {
    subtotal,
    coupon,
    couponDiscount: discount,
    amountAfterCoupon,
    redeemablePoints: redeemable,
    pointsRedeemed,
    pointsDiscount,
    amountAfterPoints,
    shipping,
    codFee,
    total: amountAfterPoints + shipping + codFee,
    pointsEarned: input.loyalty ? pointsEarned(amountAfterPoints, input.loyalty) : 0,
  }
}
