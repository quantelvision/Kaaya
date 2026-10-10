import { describe, expect, it } from 'vitest'
import { shippingFor } from '@/lib/pricing/shipping'

const settings = { freeShippingThreshold: 1499, shippingFee: 99 }

describe('shippingFor', () => {
  it('charges the fee below the threshold', () => {
    expect(shippingFor(1498, settings)).toBe(99)
  })

  it('is free at exactly the threshold and above', () => {
    expect(shippingFor(1499, settings)).toBe(0)
    expect(shippingFor(5000, settings)).toBe(0)
  })

  it('is free with a free shipping coupon', () => {
    expect(shippingFor(699, settings, { isFreeShippingCoupon: true })).toBe(0)
  })

  it('is zero for an empty bag', () => {
    expect(shippingFor(0, settings)).toBe(0)
  })
})
