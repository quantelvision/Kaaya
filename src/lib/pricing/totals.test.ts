import { describe, expect, it } from 'vitest'
import type { CouponRule } from '@/lib/pricing/coupons'
import { computeOrderTotals, lineTotal, type TotalsInput } from '@/lib/pricing/totals'

const now = Date.parse('2026-10-10T12:00:00Z')

const coupons: Record<string, CouponRule> = {
  KAAYA10: {
    code: 'KAAYA10',
    type: 'percent',
    value: 10,
    minCartValue: 999,
    firstOrderOnly: false,
    isActive: true,
    expiresAt: null,
  },
  FESTIVE20: {
    code: 'FESTIVE20',
    type: 'percent',
    value: 20,
    minCartValue: 2499,
    firstOrderOnly: false,
    isActive: true,
    expiresAt: null,
  },
  WELCOME250: {
    code: 'WELCOME250',
    type: 'flat',
    value: 250,
    minCartValue: 1499,
    firstOrderOnly: true,
    isActive: true,
    expiresAt: null,
  },
  FREESHIP: {
    code: 'FREESHIP',
    type: 'freeShipping',
    value: 0,
    minCartValue: 0,
    firstOrderOnly: false,
    isActive: true,
    expiresAt: null,
  },
}

function input(overrides: Partial<TotalsInput> = {}): TotalsInput {
  return {
    lines: [{ unitPrice: 2199, quantity: 1 }],
    coupon: null,
    couponCode: null,
    hasPlacedOrder: false,
    pointsBalance: 640,
    usePoints: false,
    paymentMethod: null,
    settings: { freeShippingThreshold: 1499, shippingFee: 99, codFee: 49 },
    loyalty: {
      earnRupeesPerPoint: 20,
      pointValueRupees: 1,
      maxRedeemPercent: 20,
      minRedeemPoints: 100,
    },
    now,
    ...overrides,
  }
}

function withCoupon(code: string, overrides: Partial<TotalsInput> = {}) {
  return computeOrderTotals(
    input({ coupon: coupons[code] ?? null, couponCode: code, ...overrides }),
  )
}

describe('lineTotal', () => {
  it('multiplies unit price and quantity', () => {
    expect(lineTotal({ unitPrice: 999, quantity: 3 })).toBe(2997)
  })
})

describe('computeOrderTotals without extras', () => {
  it('ships free above the threshold', () => {
    const totals = computeOrderTotals(input())
    expect(totals).toMatchObject({ subtotal: 2199, shipping: 0, codFee: 0, total: 2199 })
    expect(totals.pointsEarned).toBe(109)
  })

  it('charges shipping below the threshold', () => {
    const totals = computeOrderTotals(input({ lines: [{ unitPrice: 699, quantity: 1 }] }))
    expect(totals).toMatchObject({ subtotal: 699, shipping: 99, total: 798 })
  })

  it('adds the cash on delivery fee', () => {
    expect(computeOrderTotals(input({ paymentMethod: 'cod' }))).toMatchObject({
      codFee: 49,
      total: 2248,
    })
  })
})

describe('computeOrderTotals with coupons', () => {
  it('applies a percent coupon on the subtotal after sale prices', () => {
    const totals = withCoupon('KAAYA10')
    expect(totals.couponDiscount).toBe(220)
    expect(totals.total).toBe(1979)
    expect(totals.coupon?.message).toBe('KAAYA10 applied. You save ₹220.')
  })

  it('shows the missing amount below the minimum and does not discount', () => {
    const totals = withCoupon('FESTIVE20')
    expect(totals.couponDiscount).toBe(0)
    expect(totals.coupon?.isApplied).toBe(false)
    expect(totals.coupon?.message).toBe('Add ₹300 more to use this code.')
  })

  it('accepts the exact minimum', () => {
    const totals = withCoupon('FESTIVE20', { lines: [{ unitPrice: 2499, quantity: 1 }] })
    expect(totals.coupon?.message).toBe('FESTIVE20 applied. You save ₹500.')
  })

  it('refuses a first order code after an order exists', () => {
    const totals = withCoupon('WELCOME250', { hasPlacedOrder: true })
    expect(totals.couponDiscount).toBe(0)
    expect(totals.coupon?.message).toBe('This code is for first orders only.')
  })

  it('reports unknown and inactive codes', () => {
    expect(withCoupon('NOPE').coupon?.message).toBe('This code does not exist.')
    const inactive = computeOrderTotals(
      input({ coupon: { ...coupons.KAAYA10!, isActive: false }, couponCode: 'SUMMER15' }),
    )
    expect(inactive.coupon?.message).toBe('This code is no longer active.')
  })

  it('removes shipping for a free shipping coupon on a small bag', () => {
    const totals = withCoupon('FREESHIP', { lines: [{ unitPrice: 699, quantity: 1 }] })
    expect(totals.shipping).toBe(0)
    expect(totals.total).toBe(699)
    expect(totals.coupon?.message).toBe('FREESHIP applied. You save ₹99.')
  })

  it('pushes shipping back on when a coupon takes the bag under the threshold', () => {
    const totals = withCoupon('WELCOME250', { lines: [{ unitPrice: 1599, quantity: 1 }] })
    expect(totals.amountAfterCoupon).toBe(1349)
    expect(totals.shipping).toBe(99)
    expect(totals.total).toBe(1448)
  })
})

describe('computeOrderTotals with points', () => {
  it('offers the full balance when it is under 20%', () => {
    const totals = computeOrderTotals(input({ lines: [{ unitPrice: 4999, quantity: 1 }] }))
    expect(totals.redeemablePoints).toBe(640)
    expect(totals.pointsRedeemed).toBe(0)
  })

  it('redeems after the coupon and caps at 20% of that amount', () => {
    const totals = withCoupon('KAAYA10', { usePoints: true })
    expect(totals.amountAfterCoupon).toBe(1979)
    expect(totals.pointsRedeemed).toBe(395)
    expect(totals.pointsDiscount).toBe(395)
    expect(totals.amountAfterPoints).toBe(1584)
    expect(totals.shipping).toBe(0)
    expect(totals.total).toBe(1584)
    expect(totals.pointsEarned).toBe(79)
  })

  it('charges shipping when points take the amount under the threshold', () => {
    const totals = computeOrderTotals(
      input({ lines: [{ unitPrice: 1799, quantity: 1 }], usePoints: true }),
    )
    expect(totals.pointsRedeemed).toBe(359)
    expect(totals.amountAfterPoints).toBe(1440)
    expect(totals.shipping).toBe(99)
    expect(totals.total).toBe(1539)
  })

  it('does not redeem below the minimum', () => {
    const totals = computeOrderTotals(
      input({ lines: [{ unitPrice: 499, quantity: 1 }], usePoints: true }),
    )
    expect(totals.redeemablePoints).toBe(0)
    expect(totals.pointsRedeemed).toBe(0)
  })

  it('earns points on the amount paid before shipping and the cash on delivery fee', () => {
    const totals = computeOrderTotals(
      input({ lines: [{ unitPrice: 699, quantity: 1 }], paymentMethod: 'cod' }),
    )
    expect(totals.total).toBe(699 + 99 + 49)
    expect(totals.pointsEarned).toBe(34)
  })
})

describe('computeOrderTotals with an empty bag', () => {
  it('charges nothing', () => {
    expect(computeOrderTotals(input({ lines: [], paymentMethod: 'cod' }))).toMatchObject({
      subtotal: 0,
      shipping: 0,
      codFee: 0,
      total: 0,
      pointsEarned: 0,
    })
  })
})
