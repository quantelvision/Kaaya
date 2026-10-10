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

export type Order = {
  id: string
  createdAt: string
  lines: CartLine[]
  totals: OrderTotals
  paymentMethod: PaymentMethod
  contact: { name: string; email: string; phone: string }
  address: { line: string; city: string; state: string; pinCode: string }
  pointsEarned: number
  statusIndex: number
  hasSeenGate: boolean
}
