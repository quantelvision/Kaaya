import type { SanityImageData } from '@/lib/sanity/models'

export const MAX_LINE_QUANTITY = 10

export type CartLine = {
  id: string
  productId: string
  slug: string
  title: string
  colorName: string
  colorSlug: string
  size: string
  unitPrice: number
  compareAtPrice: number | null
  image: SanityImageData | null
  stock: number
  quantity: number
}

export type CartLineInput = Omit<CartLine, 'id' | 'quantity'>

export type AddResult = {
  lines: CartLine[]
  status: 'added' | 'limit' | 'unavailable'
  quantity: number
}

export function cartLineId(productId: string, colorSlug: string, size: string): string {
  return `${productId}:${colorSlug}:${size}`
}

export function maxQuantityFor(stock: number): number {
  return Math.max(0, Math.min(MAX_LINE_QUANTITY, stock))
}

export function addToLines(lines: CartLine[], input: CartLineInput, quantity = 1): AddResult {
  const id = cartLineId(input.productId, input.colorSlug, input.size)
  const max = maxQuantityFor(input.stock)
  if (max === 0) return { lines, status: 'unavailable', quantity: 0 }

  const existing = lines.find((line) => line.id === id)
  const current = existing?.quantity ?? 0
  const next = Math.min(max, current + quantity)
  if (next === current) return { lines, status: 'limit', quantity: current }

  const nextLines = existing
    ? lines.map((line) => (line.id === id ? { ...line, ...input, quantity: next } : line))
    : [...lines, { ...input, id, quantity: next }]
  return { lines: nextLines, status: next === max ? 'limit' : 'added', quantity: next }
}

export function setLineQuantity(lines: CartLine[], id: string, quantity: number): CartLine[] {
  return lines.map((line) => {
    if (line.id !== id) return line
    const max = maxQuantityFor(line.stock)
    return { ...line, quantity: Math.max(1, Math.min(max, Math.round(quantity))) }
  })
}

export function removeLine(lines: CartLine[], id: string): CartLine[] {
  return lines.filter((line) => line.id !== id)
}

export function cartItemCount(lines: CartLine[]): number {
  return lines.reduce((count, line) => count + line.quantity, 0)
}

export function cartSubtotal(lines: CartLine[]): number {
  return lines.reduce((total, line) => total + line.unitPrice * line.quantity, 0)
}
