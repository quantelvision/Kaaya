import { describe, expect, it } from 'vitest'
import type { CartLine } from '@/lib/cart'
import {
  buildReturnItems,
  emptyReturnLine,
  exchangeSizes,
  refundPointsFor,
  validateReturn,
} from '@/lib/returns'

const hoodie: CartLine = {
  id: 'product-oversized-hoodie:washed-grey:M',
  productId: 'product-oversized-hoodie',
  slug: 'oversized-hoodie',
  title: 'Oversized Hoodie',
  colorName: 'Washed Grey',
  colorSlug: 'washed-grey',
  size: 'M',
  unitPrice: 2199,
  compareAtPrice: null,
  image: null,
  stock: 26,
  availableSizes: [
    { size: 'S', stock: 22 },
    { size: 'M', stock: 26 },
    { size: 'L', stock: 0 },
    { size: 'XL', stock: 16 },
  ],
  quantity: 1,
}

describe('exchangeSizes', () => {
  it('offers in stock sizes other than the one ordered', () => {
    expect(exchangeSizes(hoodie)).toEqual(['S', 'XL'])
  })
})

describe('refundPointsFor', () => {
  it('adds the 10% bonus', () => {
    expect(refundPointsFor(2199, 1)).toBe(2419)
  })
})

describe('validateReturn', () => {
  it('asks for an item and a slot', () => {
    expect(validateReturn([hoodie], {}, '')).toEqual({
      items: 'Choose at least one piece to return or exchange.',
      slot: 'Choose a pickup slot.',
    })
  })

  it('asks for a reason and an in stock exchange size', () => {
    const errors = validateReturn(
      [hoodie],
      {
        [hoodie.id]: {
          ...emptyReturnLine,
          isSelected: true,
          resolution: 'exchange',
          exchangeSize: 'L',
        },
      },
      'slot',
    )
    expect(errors).toEqual({
      [`${hoodie.id}.reason`]: 'Choose a reason.',
      [`${hoodie.id}.exchangeSize`]: 'Choose a size that is in stock.',
    })
  })

  it('accepts a complete request', () => {
    const drafts = {
      [hoodie.id]: { ...emptyReturnLine, isSelected: true, reason: 'Size too large' as const },
    }
    expect(validateReturn([hoodie], drafts, 'slot')).toEqual({})
  })
})

describe('buildReturnItems', () => {
  it('records refunds and exchanges', () => {
    const refundToPoints = buildReturnItems(
      [hoodie],
      {
        [hoodie.id]: {
          ...emptyReturnLine,
          isSelected: true,
          reason: 'Changed my mind',
          refundTo: 'points',
        },
      },
      1,
    )
    expect(refundToPoints).toEqual([
      {
        lineId: hoodie.id,
        reason: 'Changed my mind',
        resolution: 'refund',
        exchangeSize: null,
        refundTo: 'points',
        refundAmount: 2199,
        refundPoints: 2419,
      },
    ])

    const exchange = buildReturnItems(
      [hoodie],
      {
        [hoodie.id]: {
          ...emptyReturnLine,
          isSelected: true,
          reason: 'Size too small',
          resolution: 'exchange',
          exchangeSize: 'XL',
        },
      },
      1,
    )
    expect(exchange[0]).toMatchObject({
      resolution: 'exchange',
      exchangeSize: 'XL',
      refundAmount: 0,
    })
  })
})
