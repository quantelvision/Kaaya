'use client'

import { ProductCard } from '@/components/product/product-card'
import { Rail } from '@/components/ui/rail'
import { cn } from '@/lib/cn'
import { useHasHydrated } from '@/stores/hydration-store'
import { useRecentlyViewedStore } from '@/stores/recently-viewed-store'

type RecentlyViewedRailProps = {
  excludeId?: string
  className?: string
}

export function RecentlyViewedRail({ excludeId, className }: RecentlyViewedRailProps) {
  const hasHydrated = useHasHydrated()
  const items = useRecentlyViewedStore((state) => state.items)
  const products = hasHydrated ? items.filter((item) => item._id !== excludeId) : []

  if (products.length === 0) return null

  return (
    <section
      aria-labelledby="recently-viewed-heading"
      className={cn('mx-auto mt-section max-w-page', className)}
    >
      <h2
        id="recently-viewed-heading"
        className="mb-6 gutter-x heading-display text-2xl text-ink md:text-3xl"
      >
        Recently viewed
      </h2>
      <Rail label="Recently viewed products">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            sizes="(min-width: 768px) 14rem, 11rem"
            className="w-44 shrink-0 snap-start md:w-56"
          />
        ))}
      </Rail>
    </section>
  )
}
