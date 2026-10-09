import { describe, expect, it } from 'vitest'
import { cacheTagForDocumentType } from '@/lib/sanity/cache-tags'

describe('cacheTagForDocumentType', () => {
  it('maps content types to their own tag', () => {
    expect(cacheTagForDocumentType('product')).toBe('product')
    expect(cacheTagForDocumentType('bannerPromo')).toBe('bannerPromo')
  })

  it('groups the singletons under settings', () => {
    expect(cacheTagForDocumentType('siteSettings')).toBe('settings')
    expect(cacheTagForDocumentType('loyaltySettings')).toBe('settings')
    expect(cacheTagForDocumentType('festiveSale')).toBe('settings')
  })

  it('returns null for unknown types', () => {
    expect(cacheTagForDocumentType('sanity.imageAsset')).toBeNull()
  })
})
