import type { Metadata } from 'next'
import { Suspense } from 'react'
import { ListingHeader } from '@/components/listing/listing-header'
import { ListingSkeleton } from '@/components/listing/listing-skeleton'
import { ListingView } from '@/components/listing/listing-view'
import { getAllProducts } from '@/lib/sanity/data'

export const metadata: Metadata = {
  title: 'Shop',
  description: 'Every piece in the Kaaya demo store, from festive ethnic wear to everyday denim.',
}

export default async function ShopPage() {
  const products = await getAllProducts()

  return (
    <>
      <ListingHeader
        title="Shop all"
        description="Every piece in the store, from festive ethnic wear to everyday denim."
        productCount={products.length}
      />
      <Suspense fallback={<ListingSkeleton />}>
        <ListingView products={products} showCategoryFacet />
      </Suspense>
    </>
  )
}
