'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { FilterSheet } from '@/components/listing/filter-sheet'
import { ListingToolbar } from '@/components/listing/listing-toolbar'
import { useListingState } from '@/components/listing/use-listing-state'
import { ProductCard } from '@/components/product/product-card'
import { Button, buttonClasses } from '@/components/ui/button'
import { cn } from '@/lib/cn'
import {
  applyFilters,
  buildFacets,
  emptyFilters,
  filterPills,
  sortProducts,
  type Density,
} from '@/lib/listing'
import type { ProductCardData } from '@/lib/sanity/models'

const gridClasses: Record<Density, string> = {
  grid: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  editorial: 'grid-cols-1 md:grid-cols-2',
}

const imageSizes: Record<Density, string> = {
  grid: '(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw',
  editorial: '(min-width: 768px) 50vw, 100vw',
}

type ListingViewProps = {
  products: ProductCardData[]
  showCategoryFacet: boolean
}

export function ListingView({ products, showCategoryFacet }: ListingViewProps) {
  const [state, setState] = useListingState()
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const facets = useMemo(() => buildFacets(products), [products])
  const visibleProducts = useMemo(
    () => sortProducts(applyFilters(products, state.filters), state.sort),
    [products, state.filters, state.sort],
  )
  const pills = filterPills(state.filters, facets)
  const lastPill = pills.at(-1)

  const clearFilters = () => setState({ ...state, filters: emptyFilters })

  return (
    <>
      <ListingToolbar
        resultCount={visibleProducts.length}
        pills={pills}
        sort={state.sort}
        density={state.density}
        onOpenFilters={() => setIsFilterOpen(true)}
        onRemovePill={(pill) => setState({ ...state, filters: pill.remove(state.filters) })}
        onClearAll={clearFilters}
        onSortChange={(sort) => setState({ ...state, sort })}
        onDensityChange={(density) => setState({ ...state, density })}
      />

      <FilterSheet
        open={isFilterOpen}
        onOpenChange={setIsFilterOpen}
        facets={facets}
        filters={state.filters}
        resultCount={visibleProducts.length}
        showCategoryFacet={showCategoryFacet}
        onChange={(filters) => setState({ ...state, filters })}
        onClear={clearFilters}
      />

      <div className="mx-auto max-w-page gutter-x pt-8">
        {visibleProducts.length > 0 ? (
          <div className={cn('grid gap-x-4 gap-y-10 md:gap-x-6', gridClasses[state.density])}>
            {visibleProducts.map((product, index) => (
              <ProductCard
                key={product._id}
                product={product}
                sizes={imageSizes[state.density]}
                isPriority={index < 2}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-start gap-5 py-16">
            <h2 className="heading-display text-2xl text-ink md:text-3xl">
              No pieces match these filters
            </h2>
            <p className="max-w-prose text-sm text-muted">
              Try removing a filter, or start from the pieces people buy most.
            </p>
            <div className="flex flex-wrap gap-3">
              {lastPill && (
                <Button
                  variant="secondary"
                  onClick={() => setState({ ...state, filters: lastPill.remove(state.filters) })}
                >
                  Remove {lastPill.label}
                </Button>
              )}
              <Link href="/shop?collection=best-sellers" className={buttonClasses()}>
                See best sellers
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
