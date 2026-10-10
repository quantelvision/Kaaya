import { describe, expect, it } from 'vitest'
import {
  addressSchema,
  cardSchema,
  collectErrors,
  contactSchema,
  netBankingSchema,
  upiSchema,
} from '@/lib/checkout-validation'
import {
  formatIndianMobile,
  indiaDateStamp,
  indianStates,
  isPinCode,
  normalizeIndianMobile,
} from '@/lib/india'
import { leadSchema } from '@/lib/lead'
import { createOrderId, createReturnId, uniqueId } from '@/lib/order-id'
import {
  cardBrand,
  formatCardNumber,
  formatExpiry,
  isFutureExpiry,
  passesLuhn,
} from '@/lib/payment'
import { nextStatusIndex, pickupSlots, trackingSteps } from '@/lib/tracking'

const now = new Date('2026-10-10T08:30:00Z')

describe('indian formats', () => {
  it('normalizes mobile numbers with or without +91', () => {
    expect(normalizeIndianMobile('+91 90000 00000')).toBe('9000000000')
    expect(normalizeIndianMobile('09000000000')).toBe('9000000000')
    expect(normalizeIndianMobile('5000000000')).toBeNull()
    expect(normalizeIndianMobile('90000')).toBeNull()
    expect(formatIndianMobile('9000000000')).toBe('+91 90000 00000')
  })

  it('checks PIN codes', () => {
    expect(isPinCode('600099')).toBe(true)
    expect(isPinCode('060099')).toBe(false)
    expect(isPinCode('60009')).toBe(false)
  })

  it('lists states and union territories', () => {
    expect(indianStates).toHaveLength(36)
    expect(indianStates).toContain('Tamil Nadu')
    expect(indianStates).toContain('Puducherry')
  })

  it('stamps dates in india time', () => {
    expect(indiaDateStamp(new Date('2026-10-10T20:00:00Z'))).toBe('261011')
  })
})

describe('order and return ids', () => {
  it('uses the KY and RT formats with four digits', () => {
    expect(createOrderId(now, () => 0.0421)).toBe('KY-261010-0421')
    expect(createReturnId(now, () => 0)).toBe('RT-261010-0000')
    expect(createOrderId(now)).toMatch(/^KY-261010-\d{4}$/)
  })

  it('retries until the id is new', () => {
    const values = [0.1, 0.1, 0.2]
    const random = () => values.shift() ?? 0.3
    expect(uniqueId(createOrderId, now, new Set(['KY-261010-1000']), random)).toBe('KY-261010-2000')
  })
})

describe('tracking', () => {
  it('marks placed and confirmed complete and dates the later steps', () => {
    const steps = trackingSteps('2026-10-10T08:30:00.000Z', 1)
    expect(steps.map((step) => step.state)).toEqual([
      'complete',
      'current',
      'upcoming',
      'upcoming',
      'upcoming',
      'upcoming',
    ])
    expect(steps[2]?.expectedAt.slice(0, 10)).toBe('2026-10-11')
    expect(steps[3]?.expectedAt.slice(0, 10)).toBe('2026-10-12')
    expect(steps[4]?.expectedAt.slice(0, 10)).toBe('2026-10-14')
    expect(steps[5]?.expectedAt.slice(0, 10)).toBe('2026-10-14')
  })

  it('advances one step at a time and stops at delivered', () => {
    expect(nextStatusIndex(1)).toBe(2)
    expect(nextStatusIndex(5)).toBe(5)
  })

  it('offers morning and evening pickups on the next three days', () => {
    const slots = pickupSlots(now)
    expect(slots).toHaveLength(6)
    expect(slots[0]?.id).toBe('2026-10-11-morning')
    expect(slots[5]?.id).toBe('2026-10-13-evening')
  })
})

describe('card helpers', () => {
  it('detects card brands', () => {
    expect(cardBrand('4111 1111 1111 1111')).toBe('Visa')
    expect(cardBrand('5500 0000 0000 0004')).toBe('Mastercard')
    expect(cardBrand('6521 0000 0000 0000')).toBe('RuPay')
    expect(cardBrand('3714 496353 98431')).toBe('American Express')
    expect(cardBrand('9999')).toBeNull()
  })

  it('checks the luhn digit', () => {
    expect(passesLuhn('4111 1111 1111 1111')).toBe(true)
    expect(passesLuhn('4111 1111 1111 1112')).toBe(false)
  })

  it('formats number and expiry as you type', () => {
    expect(formatCardNumber('41111111111111111')).toBe('4111 1111 1111 1111 1')
    expect(formatExpiry('1230')).toBe('12/30')
    expect(formatExpiry('1')).toBe('1')
  })

  it('accepts only future expiry dates', () => {
    expect(isFutureExpiry('12/30', now)).toBe(true)
    expect(isFutureExpiry('10/26', now)).toBe(true)
    expect(isFutureExpiry('09/26', now)).toBe(false)
    expect(isFutureExpiry('13/30', now)).toBe(false)
  })
})

describe('checkout schemas', () => {
  it('accepts the test data', () => {
    expect(
      contactSchema.safeParse({
        name: 'Priya Raman',
        email: 'priya.raman@kaaya.test',
        phone: '+91 90000 00000',
      }).success,
    ).toBe(true)
    expect(
      addressSchema.safeParse({
        line: '12, Lake View Road, Kolathur',
        city: 'Chennai',
        state: 'Tamil Nadu',
        pinCode: '600099',
      }).success,
    ).toBe(true)
    expect(
      cardSchema(now).safeParse({
        number: '4111 1111 1111 1111',
        expiry: '12/30',
        cvv: '123',
        name: 'Priya Raman',
      }).success,
    ).toBe(true)
    expect(upiSchema.safeParse({ upiId: 'priya@okdemo' }).success).toBe(true)
    expect(netBankingSchema.safeParse({ bank: 'Indian Bank' }).success).toBe(true)
  })

  it('returns one clear message per field', () => {
    const errors = collectErrors(
      contactSchema.safeParse({ name: 'P', email: 'priya', phone: '123' }),
      'contact',
    )
    expect(errors).toEqual({
      'contact.name': 'Enter your full name.',
      'contact.email': 'Enter an email address like name@example.com.',
      'contact.phone': 'Enter a 10 digit mobile number.',
    })
  })

  it('rejects an unknown state and a bad UPI ID', () => {
    expect(
      addressSchema.safeParse({
        line: '12 Road',
        city: 'Chennai',
        state: 'Madras',
        pinCode: '600099',
      }).success,
    ).toBe(false)
    expect(upiSchema.safeParse({ upiId: 'priya' }).success).toBe(false)
  })
})

describe('lead schema', () => {
  const lead = {
    name: 'Arjun Mehta',
    businessName: 'Mehta Textiles',
    phone: '98400 12345',
    email: 'arjun@mehtatextiles.in',
    consent: true,
  }

  it('accepts a complete lead with defaults', () => {
    const result = leadSchema.safeParse(lead)
    expect(result.success).toBe(true)
    expect(result.data?.source).toBe('credit-pill')
  })

  it('requires consent', () => {
    expect(leadSchema.safeParse({ ...lead, consent: false }).success).toBe(false)
  })

  it('rejects a filled honeypot', () => {
    expect(leadSchema.safeParse({ ...lead, website: 'http://spam.example' }).success).toBe(false)
  })

  it('rejects an invalid phone and a malformed order id', () => {
    expect(leadSchema.safeParse({ ...lead, phone: '12345' }).success).toBe(false)
    expect(leadSchema.safeParse({ ...lead, orderId: 'ORDER-1' }).success).toBe(false)
  })
})
