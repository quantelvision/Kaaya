import type { SeedPromo } from './types'

export const promos: SeedPromo[] = [
  {
    id: 'bannerPromo-free-delivery',
    text: 'Free delivery on orders above ₹1,499',
    isActive: true,
    order: 1,
  },
  {
    id: 'bannerPromo-festive-sale',
    text: 'The Festive Edit Sale is live. Up to 30% off',
    discountPercent: 30,
    isActive: true,
    order: 2,
  },
  {
    id: 'bannerPromo-welcome-coupon',
    text: 'Use WELCOME250 for ₹250 off your first order',
    isActive: true,
    order: 3,
  },
  {
    id: 'bannerPromo-loyalty-points',
    text: 'Earn Kaaya points on every order',
    isActive: false,
    order: 4,
  },
]
