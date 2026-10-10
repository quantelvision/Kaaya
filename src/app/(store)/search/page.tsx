import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { ListingHeader } from '@/components/listing/listing-header'
import { ListingPageSkeleton } from '@/components/listing/listing-page-skeleton'
import { ListingSkeleton } from '@/components/listing/listing-skeleton'
import { ListingView } from '@/components/listing/listing-view'
import { RecordSearch } from '@/components/search/record-search'
import { getSiteSettings, searchProducts } from '@/lib/sanity/data'
import { buildSearchTerm, normalizeQuery } from '@/lib/search'

export const metadata: Metadata = {
  title: 'Search',
  description: 'Search the Kaaya demo store by piece, fabric, category or detail.',
}

function PopularSearches({ terms }: { terms: string[] }) {
  if (terms.length === 0) return null
  return (
    <div className="flex flex-col gap-3">
      <p className="label-caps text-muted">Popular searches</p>
      <ul className="flex flex-wrap gap-2">
        {terms.map((term) => (
          <li key={term}>
            <Link
              href={`/search?q=${encodeURIComponent(term)}`}
              className="inline-flex h-tap items-center rounded-full border border-line px-4 text-sm text-ink transition-colors hover:border-ink"
            >
              {term}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

async function SearchPageContent({ searchParams }: Pick<PageProps<'/search'>, 'searchParams'>) {
  const { q } = await searchParams
  const query = typeof q === 'string' ? normalizeQuery(q) : ''
  const term = buildSearchTerm(query)
  const [products, settings] = await Promise.all([
    term ? searchProducts(term) : Promise.resolve([]),
    getSiteSettings(),
  ])
  const popularSearches = settings?.popularSearches ?? []

  if (!term) {
    return (
      <div className="mx-auto flex max-w-page flex-col gap-8 gutter-x pt-8 md:pt-12">
        <h1 className="heading-display text-4xl text-ink md:text-5xl">Search</h1>
        <p className="max-w-prose text-base text-muted">
          Search by piece, fabric or detail, for example linen, satin or garment dyed.
        </p>
        <PopularSearches terms={popularSearches} />
      </div>
    )
  }

  return (
    <>
      <RecordSearch query={query} />
      <ListingHeader
        eyebrow="Search"
        title={`Results for "${query}"`}
        productCount={products.length}
      />
      {products.length > 0 ? (
        <Suspense fallback={<ListingSkeleton />}>
          <ListingView products={products} showCategoryFacet />
        </Suspense>
      ) : (
        <div className="mx-auto flex max-w-page flex-col gap-8 gutter-x">
          <p className="max-w-prose text-base text-muted">
            No pieces match this search. Try a single word, a fabric or a category.
          </p>
          <PopularSearches terms={popularSearches} />
        </div>
      )}
    </>
  )
}

export default function SearchPage({ searchParams }: PageProps<'/search'>) {
  return (
    <Suspense fallback={<ListingPageSkeleton />}>
      <SearchPageContent searchParams={searchParams} />
    </Suspense>
  )
}
