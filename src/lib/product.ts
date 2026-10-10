import { percentOff } from '@/lib/format'

type PricedProduct = {
  price: number
  salePrice?: number | null
}

type BadgeSource = PricedProduct & {
  limitedRun?: number | null
  flags?: { isNewIn?: boolean } | null
}

export type CardBadge = {
  label: string
  tone: 'sale' | 'default' | 'limited'
}

export function isOnSale(product: PricedProduct): product is PricedProduct & { salePrice: number } {
  return typeof product.salePrice === 'number' && product.salePrice < product.price
}

export function effectivePrice(product: PricedProduct): number {
  return isOnSale(product) ? product.salePrice : product.price
}

export function cardBadges(product: BadgeSource): CardBadge[] {
  const badges: CardBadge[] = []
  if (isOnSale(product)) {
    badges.push({ label: `${percentOff(product.price, product.salePrice)}% off`, tone: 'sale' })
  }
  if (product.limitedRun) badges.push({ label: 'Limited run', tone: 'limited' })
  if (product.flags?.isNewIn) badges.push({ label: 'New in', tone: 'default' })
  return badges.slice(0, 2)
}

export function colorSummary(variants: { colorName: string }[]): string {
  if (variants.length === 1) return variants[0]?.colorName ?? ''
  return `${variants.length} colors`
}

export function stockForSize(
  sizes: { size: string; stock: number }[],
  size: string | null,
): number {
  if (!size) return 0
  return sizes.find((entry) => entry.size === size)?.stock ?? 0
}
