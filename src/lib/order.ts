import type { CartLine } from '@/lib/cart'

export const orderStatuses = [
  { key: 'placed', label: 'Placed' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'packed', label: 'Packed' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'outForDelivery', label: 'Out for delivery' },
  { key: 'delivered', label: 'Delivered' },
] as const

export type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'cod'

export type OrderTotals = {
  subtotal: number
  couponCode: string | null
  couponDiscount: number
  pointsRedeemed: number
  pointsDiscount: number
  shipping: number
  codFee: number
  total: number
}

export const returnReasons = [
  'Size too small',
  'Size too large',
  'Not as expected',
  'Quality issue',
  'Changed my mind',
] as const

export type ReturnReason = (typeof returnReasons)[number]

export type ReturnItem = {
  lineId: string
  reason: ReturnReason
  resolution: 'exchange' | 'refund'
  exchangeSize: string | null
  refundTo: 'original' | 'points' | null
  refundAmount: number
  refundPoints: number
}

export type ReturnRequest = {
  id: string
  createdAt: string
  items: ReturnItem[]
  pickup: { date: string; window: 'morning' | 'evening' }
  status: 'pickupScheduled'
}

export type Order = {
  id: string
  createdAt: string
  lines: CartLine[]
  totals: OrderTotals
  paymentMethod: PaymentMethod
  paymentDetail: string
  contact: { name: string; email: string; phone: string }
  address: { line: string; city: string; state: string; pinCode: string }
  pointsEarned: number
  pointsBalanceAfter: number
  statusIndex: number
  hasSeenGate: boolean
  returns: ReturnRequest[]
}
