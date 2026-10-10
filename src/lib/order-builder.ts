import type { CartLine } from '@/lib/cart'
import type { CheckoutForm } from '@/lib/checkout-validation'
import { formatIndianMobile, normalizeIndianMobile } from '@/lib/india'
import type { Order } from '@/lib/order'
import { cardBrand, maskCardNumber } from '@/lib/payment'
import type { OrderTotalsResult } from '@/lib/pricing/totals'
import { CONFIRMED_INDEX } from '@/lib/tracking'

export function paymentDetailFor(form: CheckoutForm): string {
  switch (form.paymentMethod) {
    case 'upi':
      return form.isUpiQr ? 'Paid with UPI QR' : form.upiId.trim()
    case 'card':
      return `${cardBrand(form.card.number) ?? 'Card'} ${maskCardNumber(form.card.number)}`
    case 'netbanking':
      return form.bank
    case 'cod':
      return 'Pay when it arrives'
  }
}

type BuildOrderInput = {
  id: string
  createdAt: Date
  form: CheckoutForm
  lines: CartLine[]
  totals: OrderTotalsResult
  pointsBalance: number
}

export function buildOrder({
  id,
  createdAt,
  form,
  lines,
  totals,
  pointsBalance,
}: BuildOrderInput): Order {
  const phone = normalizeIndianMobile(form.contact.phone)
  return {
    id,
    createdAt: createdAt.toISOString(),
    lines,
    totals: {
      subtotal: totals.subtotal,
      couponCode: totals.coupon?.isApplied ? totals.coupon.code : null,
      couponDiscount: totals.couponDiscount,
      pointsRedeemed: totals.pointsRedeemed,
      pointsDiscount: totals.pointsDiscount,
      shipping: totals.shipping,
      codFee: totals.codFee,
      total: totals.total,
    },
    paymentMethod: form.paymentMethod,
    paymentDetail: paymentDetailFor(form),
    contact: {
      name: form.contact.name.trim(),
      email: form.contact.email.trim(),
      phone: phone ? formatIndianMobile(phone) : form.contact.phone.trim(),
    },
    address: {
      line: form.address.line.trim(),
      city: form.address.city.trim(),
      state: form.address.state,
      pinCode: form.address.pinCode.trim(),
    },
    pointsEarned: totals.pointsEarned,
    pointsBalanceAfter: pointsBalance - totals.pointsRedeemed + totals.pointsEarned,
    statusIndex: CONFIRMED_INDEX,
    hasSeenGate: false,
    returns: [],
  }
}
