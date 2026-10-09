export const cacheTags = [
  'product',
  'category',
  'edit',
  'heroSlide',
  'bannerPromo',
  'coupon',
  'settings',
] as const

export type CacheTag = (typeof cacheTags)[number]

const cacheTagByDocumentType: Record<string, CacheTag> = {
  product: 'product',
  category: 'category',
  edit: 'edit',
  heroSlide: 'heroSlide',
  bannerPromo: 'bannerPromo',
  coupon: 'coupon',
  siteSettings: 'settings',
  loyaltySettings: 'settings',
  festiveSale: 'settings',
}

export function cacheTagForDocumentType(documentType: string): CacheTag | null {
  return cacheTagByDocumentType[documentType] ?? null
}
