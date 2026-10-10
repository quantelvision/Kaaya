'use server'

import type { CouponRule } from '@/lib/pricing/coupons'
import { normalizeCouponCode } from '@/lib/pricing/coupons'
import { getCouponByCode } from '@/lib/sanity/data'

const codePattern = /^[A-Z0-9]{3,20}$/

export async function lookupCoupon(rawCode: unknown): Promise<CouponRule | null> {
  if (typeof rawCode !== 'string') return null
  const code = normalizeCouponCode(rawCode)
  if (!codePattern.test(code)) return null

  const coupon = await getCouponByCode(code)
  if (!coupon) return null
  return {
    code: coupon.code,
    type: coupon.type,
    value: coupon.value,
    minCartValue: coupon.minCartValue,
    firstOrderOnly: coupon.firstOrderOnly ?? false,
    isActive: coupon.isActive ?? false,
    expiresAt: coupon.expiresAt ?? null,
  }
}
