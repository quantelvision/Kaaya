import type { SeedCoupon } from './types'

export const coupons: SeedCoupon[] = [
  {
    code: 'KAAYA10',
    description: '10% off orders above ₹999',
    type: 'percent',
    value: 10,
    minCartValue: 999,
    firstOrderOnly: false,
    isActive: true,
  },
  {
    code: 'FESTIVE20',
    description: '20% off festive orders above ₹2,499',
    type: 'percent',
    value: 20,
    minCartValue: 2499,
    firstOrderOnly: false,
    isActive: true,
  },
  {
    code: 'WELCOME250',
    description: '₹250 off your first order',
    type: 'flat',
    value: 250,
    minCartValue: 1499,
    firstOrderOnly: true,
    isActive: true,
  },
  {
    code: 'FREESHIP',
    description: 'Free delivery on any order',
    type: 'freeShipping',
    value: 0,
    minCartValue: 0,
    firstOrderOnly: false,
    isActive: true,
  },
  {
    code: 'SUMMER15',
    description: '15% off the summer collection',
    type: 'percent',
    value: 15,
    minCartValue: 0,
    firstOrderOnly: false,
    isActive: false,
  },
]
