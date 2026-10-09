import type { CategoryIconKey } from '../../../src/components/icons/category-icon-paths'
import type { Fit, Gender, Material, SizeScale } from '../../../src/lib/catalog'
import { sizeScales } from '../../../src/lib/catalog'

export type SeedCategory = {
  slug: string
  title: string
  order: number
  iconKey: CategoryIconKey
  description: string
}

export type SeedSize = {
  size: string
  stock: number
}

export type SeedVariant = {
  colorName: string
  colorSlug: string
  hex: string
  sizes: SeedSize[]
}

export type SeedProduct = {
  slug: string
  title: string
  categorySlug: string
  gender: Gender
  price: number
  salePrice?: number
  description: string
  badges: string[]
  limitedRun?: number
  material: Material
  fit: Fit
  fitNote: string
  composition: string
  care: string[]
  origin: string
  sizeScale: SizeScale
  variant: SeedVariant
  flags: { isNewIn: boolean; isBestSeller: boolean; isArchive: boolean }
  featuredOrder: number
}

export type SeedEdit = {
  slug: string
  title: string
  order: number
  story: string
  productSlugs: string[]
}

export type SeedHeroSlide = {
  id: string
  badge: string
  headline: string
  subtext: string
  ctaLabel: string
  ctaHref: string
  lookEditSlug: string
  order: number
}

export type SeedPromo = {
  id: string
  text: string
  discountPercent?: number
  isActive: boolean
  order: number
}

export type SeedCoupon = {
  code: string
  description: string
  type: 'percent' | 'flat' | 'freeShipping'
  value: number
  minCartValue: number
  firstOrderOnly: boolean
  isActive: boolean
}

export function sizesFor(scale: SizeScale, stock: number[]): SeedSize[] {
  const sizes = sizeScales[scale]
  if (stock.length !== sizes.length) {
    throw new Error(`Expected ${sizes.length} stock values for the ${scale} scale`)
  }
  return sizes.map((size, index) => ({ size, stock: stock[index] ?? 0 }))
}
