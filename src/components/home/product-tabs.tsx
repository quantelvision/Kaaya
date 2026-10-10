'use client'

import * as Tabs from '@radix-ui/react-tabs'
import { ProductCard } from '@/components/product/product-card'
import type { ProductCardData } from '@/lib/sanity/models'

const MAX_PRODUCTS = 8

type ProductTab = {
  id: string
  label: string
  products: ProductCardData[]
}

export function ProductTabs({ tabs }: { tabs: ProductTab[] }) {
  const visibleTabs = tabs.filter((tab) => tab.products.length > 0)
  const firstTab = visibleTabs[0]
  if (!firstTab) return null

  return (
    <section aria-labelledby="tabs-heading" className="mx-auto mt-section max-w-page gutter-x">
      <h2 id="tabs-heading" className="sr-only">
        Products
      </h2>
      <Tabs.Root defaultValue={firstTab.id}>
        <Tabs.List
          aria-label="Product groups"
          className="mb-8 scrollbar-none flex gap-6 overflow-x-auto border-b border-line"
        >
          {visibleTabs.map((tab) => (
            <Tabs.Trigger
              key={tab.id}
              value={tab.id}
              className="-mb-px inline-flex min-h-tap shrink-0 cursor-pointer items-end border-b border-transparent pt-1 pb-3 heading-display text-xl text-muted transition-colors hover:text-ink data-[state=active]:border-ink data-[state=active]:text-ink sm:text-2xl md:pb-4 md:text-3xl"
            >
              {tab.label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
        {visibleTabs.map((tab) => (
          <Tabs.Content key={tab.id} value={tab.id} className="outline-none">
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
              {tab.products.slice(0, MAX_PRODUCTS).map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  sizes="(min-width: 768px) 25vw, 50vw"
                />
              ))}
            </div>
          </Tabs.Content>
        ))}
      </Tabs.Root>
    </section>
  )
}
