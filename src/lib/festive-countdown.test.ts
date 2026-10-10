import { describe, expect, it } from 'vitest'
import { ROLLING_EPOCH_MS, saleEndsAt, timeParts } from '@/lib/festive-countdown'

const HOUR = 60 * 60 * 1000

describe('saleEndsAt in rolling mode', () => {
  const sale = { mode: 'rolling' as const, rollingHours: 62 }

  it('ends at the next multiple of the cycle after the epoch', () => {
    const now = ROLLING_EPOCH_MS + 10 * HOUR
    expect(saleEndsAt(sale, now)).toBe(ROLLING_EPOCH_MS + 62 * HOUR)
  })

  it('moves to the following cycle exactly at a boundary, so it never shows zero', () => {
    const boundary = ROLLING_EPOCH_MS + 124 * HOUR
    expect(saleEndsAt(sale, boundary)).toBe(ROLLING_EPOCH_MS + 186 * HOUR)
  })

  it('always leaves between zero and one full cycle', () => {
    const now = Date.UTC(2031, 6, 14, 9, 30)
    const end = saleEndsAt(sale, now)
    expect(end).not.toBeNull()
    const left = (end ?? 0) - now
    expect(left).toBeGreaterThan(0)
    expect(left).toBeLessThanOrEqual(62 * HOUR)
  })

  it('returns null without a cycle length', () => {
    expect(saleEndsAt({ mode: 'rolling', rollingHours: null }, ROLLING_EPOCH_MS)).toBeNull()
  })
})

describe('saleEndsAt in fixed mode', () => {
  it('returns the end date while it is in the future', () => {
    const endsAt = '2026-11-01T18:30:00.000Z'
    expect(saleEndsAt({ mode: 'fixed', endsAt }, Date.parse('2026-10-30T00:00:00Z'))).toBe(
      Date.parse(endsAt),
    )
  })

  it('returns null once the sale has ended or has no date', () => {
    const endsAt = '2026-11-01T18:30:00.000Z'
    expect(saleEndsAt({ mode: 'fixed', endsAt }, Date.parse('2026-11-02T00:00:00Z'))).toBeNull()
    expect(saleEndsAt({ mode: 'fixed', endsAt: null }, 0)).toBeNull()
  })
})

describe('timeParts', () => {
  it('splits milliseconds into days, hours, minutes and seconds', () => {
    const ms = ((2 * 24 + 5) * 60 * 60 + 7 * 60 + 9) * 1000 + 400
    expect(timeParts(ms)).toEqual({ days: 2, hours: 5, minutes: 7, seconds: 9 })
  })

  it('never goes negative', () => {
    expect(timeParts(-5000)).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  })
})
