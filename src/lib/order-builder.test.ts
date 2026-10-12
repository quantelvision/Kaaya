import { describe, expect, it } from 'vitest'
import { checkoutTestData } from '@/lib/checkout-test-data'
import { emptyCheckoutForm, type CheckoutForm } from '@/lib/checkout-validation'
import { buildOrder, paymentDetailFor } from '@/lib/order-builder'
import { computeOrderTotals } from '@/lib/pricing/totals'

const form: CheckoutForm = {
  ...emptyCheckoutForm,
  contact: { ...checkoutTestData.contact, phone: '9000000000' },
  address: checkoutTestData.address,
  upiId: checkoutTestData.upiId,
  card: checkoutTestData.card,
  bank: checkoutTestData.bank,
}

const line = {
  id: 'product-baby-tee:obsidian-black:M',
  productId: 'product-baby-tee',
  slug: 'baby-tee',
  title: 'Baby Tee',
  colorName: 'Obsidian Black',
  colorSlug: 'obsidian-black',
  size: 'M',
  unitPrice: 699,
  compareAtPrice: null,
  image: null,
  stock: 28,
  availableSizes: [{ size: 'M', stock: 28 }],
  quantity: 2,
}

describe('paymentDetailFor', () => {
  it('describes each payment method', () => {
    expect(paymentDetailFor({ ...form, paymentMethod: 'upi' })).toBe('priya@okdemo')
    expect(paymentDetailFor({ ...form, paymentMethod: 'upi', isUpiQr: true })).toBe(
      'Paid with UPI QR',
    )
    expect(paymentDetailFor({ ...form, paymentMethod: 'card' })).toBe('Visa ending 1111')
    expect(paymentDetailFor({ ...form, paymentMethod: 'netbanking' })).toBe('State Bank of India')
    expect(paymentDetailFor({ ...form, paymentMethod: 'cod' })).toBe('Pay when it arrives')
  })
})

describe('buildOrder', () => {
  it('stores totals, formatted contact and the new points balance', () => {
    const totals = computeOrderTotals({
      lines: [line],
      coupon: null,
      couponCode: null,
      hasPlacedOrder: false,
      pointsBalance: 640,
      pointsToUse: 640,
      paymentMethod: 'cod',
      settings: { freeShippingThreshold: 1499, shippingFee: 99, codFee: 49 },
      loyalty: {
        earnRupeesPerPoint: 20,
        pointValueRupees: 1,
        maxRedeemPercent: 20,
        minRedeemPoints: 100,
      },
      now: 0,
    })
    const order = buildOrder({
      id: 'KY-261010-0421',
      createdAt: new Date('2026-10-10T08:30:00Z'),
      form: { ...form, paymentMethod: 'cod' },
      lines: [line],
      totals,
      pointsBalance: 640,
    })

    expect(order.totals).toEqual({
      subtotal: 1398,
      couponCode: null,
      couponDiscount: 0,
      pointsRedeemed: 279,
      pointsDiscount: 279,
      shipping: 99,
      codFee: 49,
      total: 1267,
    })
    expect(order.contact.phone).toBe('+91 90000 00000')
    expect(order.pointsEarned).toBe(55)
    expect(order.pointsBalanceAfter).toBe(640 - 279 + 55)
    expect(order.statusIndex).toBe(1)
    expect(order.hasSeenGate).toBe(false)
    expect(order.returns).toEqual([])
  })
})
