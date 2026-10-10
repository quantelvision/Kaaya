import type { Metadata } from 'next'
import { CheckoutView } from '@/components/checkout/checkout-view'
import { getStorePricing } from '@/lib/sanity/data'

export const metadata: Metadata = {
  title: 'Checkout',
  description: 'Guest checkout for the Kaaya demo store. No payment is taken.',
}

export default async function CheckoutPage() {
  const storePricing = await getStorePricing()
  return <CheckoutView storePricing={storePricing} />
}
