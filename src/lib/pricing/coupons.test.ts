import { describe, expect, it } from 'vitest'
import {
  couponDiscount,
  couponEligibility,
  couponMessage,
  normalizeCouponCode,
  type CouponRule,
} from '@/lib/pricing/coupons'

const now = Date.parse('2026-10-10T12:00:00Z')

const kaaya10: CouponRule = {
  code: 'KAAYA10',
  type: 'percent',
  value: 10,
  minCartValue: 999,
  firstOrderOnly: false,
  isActive: true,
  expiresAt: null,
}
const welcome250: CouponRule = {
  code: 'WELCOME250',
  type: 'flat',
  value: 250,
  minCartValue: 1499,
  firstOrderOnly: true,
  isActive: true,
  expiresAt: null,
}
const summer15: CouponRule = {
  ...kaaya10,
  code: 'SUMMER15',
  value: 15,
  minCartValue: 0,
  isActive: false,
}

const context = { subtotal: 2000, hasPlacedOrder: false, now }

describe('couponEligibility', () => {
  it('reports an unknown code', () => {
    expect(couponEligibility(null, context)).toEqual({ status: 'unknown' })
  })

  it('reports an inactive code', () => {
    expect(couponEligibility(summer15, context)).toEqual({ status: 'inactive' })
  })

  it('treats an expired code as inactive', () => {
    const expired = { ...kaaya10, expiresAt: '2026-10-01T00:00:00Z' }
    expect(couponEligibility(expired, context)).toEqual({ status: 'inactive' })
  })

  it('accepts a code that expires later', () => {
    const later = { ...kaaya10, expiresAt: '2026-12-31T00:00:00Z' }
    expect(couponEligibility(later, context)).toEqual({ status: 'eligible' })
  })

  it('blocks a first order code once the session has an order', () => {
    expect(couponEligibility(welcome250, { ...context, hasPlacedOrder: true })).toEqual({
      status: 'firstOrderOnly',
    })
  })

  it('reports how much is missing below the minimum', () => {
    expect(couponEligibility(kaaya10, { ...context, subtotal: 899 })).toEqual({
      status: 'belowMinimum',
      shortfall: 100,
    })
  })

  it('accepts the exact minimum', () => {
    expect(couponEligibility(kaaya10, { ...context, subtotal: 999 })).toEqual({
      status: 'eligible',
    })
  })
})

describe('couponDiscount', () => {
  it('rounds percent discounts to whole rupees', () => {
    expect(couponDiscount(kaaya10, 1299)).toBe(130)
  })

  it('never takes a flat discount below zero', () => {
    expect(couponDiscount({ ...welcome250, minCartValue: 0 }, 199)).toBe(199)
    expect(couponDiscount(welcome250, 2000)).toBe(250)
  })

  it('gives no price discount for free shipping', () => {
    expect(couponDiscount({ ...kaaya10, type: 'freeShipping', value: 0 }, 2000)).toBe(0)
  })
})

describe('couponMessage', () => {
  it('uses the exact copy for every outcome', () => {
    expect(couponMessage({ status: 'unknown' }, 'nope', 0)).toBe('This code does not exist.')
    expect(couponMessage({ status: 'inactive' }, 'SUMMER15', 0)).toBe(
      'This code is no longer active.',
    )
    expect(couponMessage({ status: 'firstOrderOnly' }, 'WELCOME250', 0)).toBe(
      'This code is for first orders only.',
    )
    expect(couponMessage({ status: 'belowMinimum', shortfall: 1250 }, 'FESTIVE20', 0)).toBe(
      'Add ₹1,250 more to use this code.',
    )
    expect(couponMessage({ status: 'eligible' }, 'kaaya10', 200)).toBe(
      'KAAYA10 applied. You save ₹200.',
    )
  })
})

describe('normalizeCouponCode', () => {
  it('trims and uppercases', () => {
    expect(normalizeCouponCode('  welcome250 ')).toBe('WELCOME250')
  })
})
