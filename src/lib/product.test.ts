import { describe, expect, it } from 'vitest'
import { cardBadges, colorSummary, effectivePrice, isOnSale, stockForSize } from '@/lib/product'

describe('isOnSale and effectivePrice', () => {
  it('uses the sale price only when it is lower', () => {
    expect(isOnSale({ price: 2499, salePrice: 1999 })).toBe(true)
    expect(effectivePrice({ price: 2499, salePrice: 1999 })).toBe(1999)
    expect(isOnSale({ price: 2499, salePrice: 2499 })).toBe(false)
    expect(effectivePrice({ price: 2499, salePrice: null })).toBe(2499)
  })
})

describe('cardBadges', () => {
  it('puts the sale badge first and keeps two badges at most', () => {
    const badges = cardBadges({
      price: 5499,
      salePrice: 4499,
      limitedRun: 50,
      flags: { isNewIn: true },
    })
    expect(badges).toEqual([
      { label: '18% off', tone: 'sale' },
      { label: 'Limited run', tone: 'limited' },
    ])
  })

  it('shows new in for regular products', () => {
    expect(cardBadges({ price: 2199, flags: { isNewIn: true } })).toEqual([
      { label: 'New in', tone: 'default' },
    ])
  })
})

describe('colorSummary', () => {
  it('names a single color and counts several', () => {
    expect(colorSummary([{ colorName: 'Washed Grey' }])).toBe('Washed Grey')
    expect(colorSummary([{ colorName: 'Washed Grey' }, { colorName: 'Sage Glaze' }])).toBe(
      '2 colors',
    )
  })
})

describe('stockForSize', () => {
  const sizes = [
    { size: 'S', stock: 4 },
    { size: 'M', stock: 0 },
  ]

  it('returns the stock of the selected size', () => {
    expect(stockForSize(sizes, 'S')).toBe(4)
    expect(stockForSize(sizes, 'M')).toBe(0)
  })

  it('returns 0 without a selection or for an unknown size', () => {
    expect(stockForSize(sizes, null)).toBe(0)
    expect(stockForSize(sizes, 'XL')).toBe(0)
  })
})
