'use client'

import Link from 'next/link'
import { QuantityStepper } from '@/components/cart/quantity-stepper'
import { Price } from '@/components/ui/price'
import { SanityImage } from '@/components/ui/sanity-image'
import { maxQuantityFor, type CartLine } from '@/lib/cart'
import { formatPrice } from '@/lib/format'

const PORTRAIT = 4 / 5

type CartLineItemProps = {
  line: CartLine
  onQuantityChange: (quantity: number) => void
  onRemove: () => void
  onNavigate: () => void
}

export function CartLineItem({ line, onQuantityChange, onRemove, onNavigate }: CartLineItemProps) {
  const max = maxQuantityFor(line.stock)

  return (
    <li className="flex gap-4 border-b border-line py-4 last:border-b-0">
      <Link
        href={`/product/${line.slug}`}
        onNavigate={onNavigate}
        className="relative aspect-portrait w-20 shrink-0 overflow-hidden rounded-control bg-surface"
      >
        {line.image && (
          <SanityImage
            image={line.image}
            alt={`${line.title} in ${line.colorName}`}
            aspectRatio={PORTRAIT}
            sizes="80px"
            className="mix-blend-multiply"
          />
        )}
      </Link>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-3">
          <Link
            href={`/product/${line.slug}`}
            onNavigate={onNavigate}
            className="text-sm text-ink hover:underline"
          >
            {line.title}
          </Link>
          <span className="text-sm text-ink tabular-nums">
            {formatPrice(line.unitPrice * line.quantity)}
          </span>
        </div>
        <p className="text-xs text-muted">
          {line.colorName}, size {line.size}
        </p>
        <Price price={line.compareAtPrice ?? line.unitPrice} salePrice={line.unitPrice} size="sm" />
        <div className="mt-1 flex items-center justify-between gap-3">
          <QuantityStepper
            quantity={line.quantity}
            max={max}
            label={line.title}
            onChange={onQuantityChange}
          />
          <button
            type="button"
            onClick={onRemove}
            className="inline-flex h-tap items-center text-xs text-muted underline underline-offset-4 hover:text-ink"
          >
            Remove
          </button>
        </div>
        {line.quantity >= max && (
          <p className="text-xs text-muted">
            {max === line.stock
              ? `All ${line.stock} in stock are in your bag.`
              : `Up to ${max} per order.`}
          </p>
        )}
      </div>
    </li>
  )
}
