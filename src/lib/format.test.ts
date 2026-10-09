import { describe, expect, it } from 'vitest'
import { formatDate, formatNumber, formatPrice, formatShortDate, percentOff } from '@/lib/format'

describe('formatPrice', () => {
  it('formats whole rupees with indian grouping', () => {
    expect(formatPrice(1499)).toBe('₹1,499')
    expect(formatPrice(125000)).toBe('₹1,25,000')
  })

  it('drops paise', () => {
    expect(formatPrice(999.6)).toBe('₹1,000')
  })
})

describe('formatNumber', () => {
  it('uses indian grouping', () => {
    expect(formatNumber(150000)).toBe('1,50,000')
  })
})

describe('formatDate', () => {
  it('formats in en-IN for the india time zone', () => {
    expect(formatDate('2026-10-09T20:00:00Z')).toBe('10 Oct 2026')
  })
})

describe('formatShortDate', () => {
  it('includes the weekday', () => {
    expect(formatShortDate('2026-10-12T06:00:00Z')).toBe('Mon, 12 Oct')
  })
})

describe('percentOff', () => {
  it('rounds to a whole percent', () => {
    expect(percentOff(4999, 3999)).toBe(20)
    expect(percentOff(1299, 999)).toBe(23)
  })

  it('returns 0 when there is no discount', () => {
    expect(percentOff(1299, 1299)).toBe(0)
    expect(percentOff(0, 0)).toBe(0)
  })
})
