import { describe, expect, it } from 'vitest'
import {
  pointsEarned,
  pointsValue,
  redeemablePoints,
  tierProgress,
  type LoyaltyRules,
} from '@/lib/pricing/loyalty'

const rules: LoyaltyRules = {
  earnRupeesPerPoint: 20,
  pointValueRupees: 1,
  maxRedeemPercent: 20,
  minRedeemPoints: 100,
}

const tiers = [
  { name: 'Icon', minPoints: 5000, perk: 'Styling call' },
  { name: 'Insider', minPoints: 0, perk: 'Points on every order' },
  { name: 'Muse', minPoints: 1500, perk: 'Early access' },
]

describe('redeemablePoints', () => {
  it('uses the whole balance when it is under the cap', () => {
    expect(redeemablePoints(640, 4999, rules)).toBe(640)
  })

  it('caps at 20% of the amount after the coupon', () => {
    expect(redeemablePoints(640, 2000, rules)).toBe(400)
  })

  it('allows exactly the minimum', () => {
    expect(redeemablePoints(640, 500, rules)).toBe(100)
  })

  it('returns 0 below the minimum redemption', () => {
    expect(redeemablePoints(640, 499, rules)).toBe(0)
    expect(redeemablePoints(99, 5000, rules)).toBe(0)
  })

  it('returns 0 for an empty bag', () => {
    expect(redeemablePoints(640, 0, rules)).toBe(0)
  })
})

describe('pointsValue and pointsEarned', () => {
  it('values one point at one rupee', () => {
    expect(pointsValue(640, rules)).toBe(640)
  })

  it('earns one point per ₹20 and rounds down', () => {
    expect(pointsEarned(1999, rules)).toBe(99)
    expect(pointsEarned(2000, rules)).toBe(100)
    expect(pointsEarned(19, rules)).toBe(0)
  })
})

describe('tierProgress', () => {
  it('places the starting balance in Insider on the way to Muse', () => {
    const progress = tierProgress(640, tiers)
    expect(progress.current?.name).toBe('Insider')
    expect(progress.next?.name).toBe('Muse')
    expect(progress.pointsToNext).toBe(860)
    expect(progress.progress).toBeCloseTo(640 / 1500)
  })

  it('moves to the next tier at its exact threshold', () => {
    expect(tierProgress(1500, tiers).current?.name).toBe('Muse')
  })

  it('reports full progress at the top tier', () => {
    const progress = tierProgress(7200, tiers)
    expect(progress.current?.name).toBe('Icon')
    expect(progress.next).toBeNull()
    expect(progress.progress).toBe(1)
  })
})
