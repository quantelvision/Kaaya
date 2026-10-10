import Link from 'next/link'
import { CategoryIcon } from '@/components/icons/category-icon'
import { Rail } from '@/components/ui/rail'
import type { NavigationData } from '@/lib/sanity/models'

type CategoryScrollerProps = {
  categories: NavigationData['categories']
}

export function CategoryScroller({ categories }: CategoryScrollerProps) {
  return (
    <section aria-labelledby="categories-heading" className="mx-auto mt-section max-w-page">
      <h2 id="categories-heading" className="mb-6 gutter-x heading-display text-2xl md:text-3xl">
        Shop by category
      </h2>
      <Rail label="Categories">
        {categories.map((category) => (
          <Link
            key={category._id}
            href={`/shop/${category.slug}`}
            className="flex w-40 shrink-0 snap-start flex-col gap-10 rounded-card border border-line bg-surface p-5 transition-colors hover:border-ink md:w-48"
          >
            <CategoryIcon iconKey={category.iconKey} className="size-9 text-ink" />
            <span className="flex flex-col gap-1">
              <span className="text-base text-ink">{category.title}</span>
              <span className="text-xs text-muted tabular-nums">
                {category.productCount} {category.productCount === 1 ? 'piece' : 'pieces'}
              </span>
            </span>
          </Link>
        ))}
      </Rail>
    </section>
  )
}
