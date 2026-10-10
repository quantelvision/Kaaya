import { describe, expect, it } from 'vitest'
import {
  addToLines,
  cartItemCount,
  cartSubtotal,
  maxQuantityFor,
  removeLine,
  setLineQuantity,
  type CartLineInput,
} from '@/lib/cart'

const hoodieM: CartLineInput = {
  productId: 'product-oversized-hoodie',
  slug: 'oversized-hoodie',
  title: 'Oversized Hoodie',
  colorName: 'Washed Grey',
  colorSlug: 'washed-grey',
  size: 'M',
  unitPrice: 2199,
  compareAtPrice: null,
  image: null,
  stock: 3,
  availableSizes: [
    { size: 'M', stock: 3 },
    { size: 'L', stock: 12 },
  ],
}

describe('maxQuantityFor', () => {
  it('caps at 10 and at the stock', () => {
    expect(maxQuantityFor(26)).toBe(10)
    expect(maxQuantityFor(3)).toBe(3)
    expect(maxQuantityFor(0)).toBe(0)
  })
})

describe('addToLines', () => {
  it('adds a new line and merges the same size and color', () => {
    const first = addToLines([], hoodieM)
    expect(first.status).toBe('added')
    const second = addToLines(first.lines, hoodieM)
    expect(second.lines).toHaveLength(1)
    expect(second.lines[0]?.quantity).toBe(2)
  })

  it('never goes above the stock of the size', () => {
    let lines = addToLines([], hoodieM, 2).lines
    const atLimit = addToLines(lines, hoodieM, 5)
    expect(atLimit.quantity).toBe(3)
    expect(atLimit.status).toBe('limit')
    lines = atLimit.lines
    const again = addToLines(lines, hoodieM)
    expect(again.status).toBe('limit')
    expect(again.lines[0]?.quantity).toBe(3)
  })

  it('refuses a sold out size', () => {
    const result = addToLines([], { ...hoodieM, stock: 0 })
    expect(result.status).toBe('unavailable')
    expect(result.lines).toEqual([])
  })

  it('keeps different sizes as separate lines', () => {
    const lines = addToLines(addToLines([], hoodieM).lines, { ...hoodieM, size: 'L' }).lines
    expect(lines).toHaveLength(2)
  })
})

describe('setLineQuantity and removeLine', () => {
  const lines = addToLines([], hoodieM).lines
  const id = lines[0]?.id ?? ''

  it('clamps between 1 and the stock', () => {
    expect(setLineQuantity(lines, id, 9)[0]?.quantity).toBe(3)
    expect(setLineQuantity(lines, id, 0)[0]?.quantity).toBe(1)
  })

  it('removes a line', () => {
    expect(removeLine(lines, id)).toEqual([])
  })
})

describe('cart totals', () => {
  it('counts pieces and adds line totals', () => {
    const lines = addToLines(addToLines([], hoodieM, 2).lines, {
      ...hoodieM,
      productId: 'product-baby-tee',
      unitPrice: 699,
      stock: 20,
    }).lines
    expect(cartItemCount(lines)).toBe(3)
    expect(cartSubtotal(lines)).toBe(2199 * 2 + 699)
  })
})
