import { describe, expect, it } from 'vitest'
import { normalizeHex, pickOnColor, relativeLuminance } from '@/lib/theme/color'

describe('normalizeHex', () => {
  it('expands short hex and uppercases', () => {
    expect(normalizeHex('#abc')).toBe('#AABBCC')
  })

  it('adds a missing hash', () => {
    expect(normalizeHex('6b1d2f')).toBe('#6B1D2F')
  })

  it('rejects invalid input', () => {
    expect(normalizeHex('#12345')).toBeNull()
    expect(normalizeHex('burgundy')).toBeNull()
  })
})

describe('relativeLuminance', () => {
  it('returns 0 for black and 1 for white', () => {
    expect(relativeLuminance('#000000')).toBe(0)
    expect(relativeLuminance('#FFFFFF')).toBe(1)
  })
})

describe('pickOnColor', () => {
  it('uses white text on dark colors', () => {
    expect(pickOnColor('#6B1D2F')).toBe('#FFFFFF')
    expect(pickOnColor('#2E3A8C')).toBe('#FFFFFF')
  })

  it('uses dark text on light colors', () => {
    expect(pickOnColor('#D4FF3A')).toBe('#111111')
    expect(pickOnColor('#C8861A')).toBe('#111111')
  })
})
