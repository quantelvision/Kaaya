'use client'

import Link from 'next/link'
import { Price } from '@/components/ui/price'
import { SanityImage } from '@/components/ui/sanity-image'
import type { SearchSuggestionsQueryResult } from '@sanity-types'

const PORTRAIT = 4 / 5

type SearchResultsProps = {
  results: SearchSuggestionsQueryResult
  query: string
  onNavigate: () => void
}

export function SearchResults({ results, query, onNavigate }: SearchResultsProps) {
  const hasProducts = results.products.length > 0
  const links = [
    ...results.categories.map((category) => ({
      id: category._id,
      label: category.title,
      kind: 'Category',
      href: `/shop/${category.slug}`,
    })),
    ...results.edits.map((edit) => ({
      id: edit._id,
      label: edit.title,
      kind: 'Edit',
      href: `/edits/${edit.slug}`,
    })),
  ]

  if (!hasProducts && links.length === 0) {
    return (
      <p className="text-sm text-muted">
        No pieces match &quot;{query}&quot;. Try a fabric like linen, or a piece like hoodie.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      {links.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="label-caps text-muted">Categories and edits</p>
          <ul className="flex flex-wrap gap-2">
            {links.map((link) => (
              <li key={link.id}>
                <Link
                  href={link.href}
                  onNavigate={onNavigate}
                  className="inline-flex h-tap items-center gap-2 rounded-full border border-line px-4 text-sm text-ink transition-colors hover:border-ink"
                >
                  {link.label}
                  <span className="text-xs text-muted">{link.kind}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {hasProducts && (
        <div className="flex flex-col gap-3">
          <p className="label-caps text-muted">Pieces</p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {results.products.map((product) => (
              <li key={product._id}>
                <Link
                  href={`/product/${product.slug}`}
                  onNavigate={onNavigate}
                  className="flex items-center gap-4 rounded-card p-2 transition-colors hover:bg-wash"
                >
                  <span className="relative block aspect-portrait w-14 shrink-0 overflow-hidden rounded-control bg-surface">
                    {product.image && (
                      <SanityImage
                        image={product.image}
                        alt=""
                        aspectRatio={PORTRAIT}
                        sizes="56px"
                        className="mix-blend-multiply"
                      />
                    )}
                  </span>
                  <span className="flex min-w-0 flex-col gap-1">
                    <span className="truncate text-sm text-ink">{product.title}</span>
                    <Price price={product.price} salePrice={product.salePrice} size="sm" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
