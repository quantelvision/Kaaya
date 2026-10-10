export type ShippingSettings = {
  freeShippingThreshold: number
  shippingFee: number
}

export function shippingFor(
  amount: number,
  settings: ShippingSettings,
  { isFreeShippingCoupon = false } = {},
): number {
  if (amount <= 0 || isFreeShippingCoupon) return 0
  return amount >= settings.freeShippingThreshold ? 0 : settings.shippingFee
}
