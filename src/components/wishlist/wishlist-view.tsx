'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ListingSkeleton } from '@/components/listing/listing-skeleton'
import { ProductCard } from '@/components/product/product-card'
import { Button, buttonClasses } from '@/components/ui/button'
import { MoveToBagDialog } from '@/components/wishlist/move-to-bag-dialog'
import type { ProductCardData } from '@/lib/sanity/models'
import { useHasHydrated } from '@/stores/hydration-store'
import { useWishlistStore } from '@/stores/wishlist-store'

export function WishlistView() {
  const hasHydrated = useHasHydrated()
  const items = useWishlistStore((state) => state.items)
  const remove = useWishlistStore((state) => state.remove)
  const [movingProduct, setMovingProduct] = useState<ProductCardData | null>(null)

  if (!hasHydrated) return <ListingSkeleton />

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-page flex-col items-start gap-5 gutter-x py-10">
        <h2 className="heading-display text-2xl text-ink md:text-3xl">Nothing saved yet</h2>
        <p className="max-w-prose text-sm text-muted">
          Tap the heart on any piece to keep it here for this visit.
        </p>
        <Link href="/shop" className={buttonClasses()}>
          Shop all
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-page gutter-x">
      <p aria-live="polite" className="mb-8 text-sm text-muted tabular-nums">
        {items.length} saved {items.length === 1 ? 'piece' : 'pieces'}
      </p>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
        {items.map((product) => (
          <li key={product._id} className="flex flex-col gap-3">
            <ProductCard
              product={product}
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            />
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
              <Button variant="secondary" size="sm" onClick={() => setMovingProduct(product)}>
                Move to bag
              </Button>
              <button
                type="button"
                onClick={() => remove(product._id)}
                className="inline-flex h-tap items-center text-xs text-muted underline underline-offset-4 hover:text-ink"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
      <MoveToBagDialog
        product={movingProduct}
        onOpenChange={(open) => {
          if (!open) setMovingProduct(null)
        }}
      />
    </div>
  )
}
