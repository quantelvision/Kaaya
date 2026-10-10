import Link from 'next/link'
import { WishlistButton } from '@/components/product/wishlist-button'
import { Badge } from '@/components/ui/badge'
import { Price } from '@/components/ui/price'
import { SanityImage } from '@/components/ui/sanity-image'
import { cn } from '@/lib/cn'
import { cardBadges, colorSummary } from '@/lib/product'
import type { ProductCardData } from '@/lib/sanity/models'

const PORTRAIT = 4 / 5

type ProductCardProps = {
  product: ProductCardData
  sizes: string
  isPriority?: boolean
  className?: string
}

export function ProductCard({ product, sizes, isPriority = false, className }: ProductCardProps) {
  const variant = product.variants[0]
  const [primaryImage, hoverImage] = variant?.images ?? []
  const altBase = variant ? `${product.title} in ${variant.colorName}` : product.title
  const badges = cardBadges(product)

  return (
    <article className={cn('group relative', className)}>
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-portrait overflow-hidden rounded-card bg-surface">
          {primaryImage && (
            <SanityImage
              image={primaryImage}
              alt={altBase}
              aspectRatio={PORTRAIT}
              sizes={sizes}
              isPriority={isPriority}
              className={cn(
                'mix-blend-multiply transition-[transform,opacity] duration-400 ease-out motion-reduce:transition-none',
                hoverImage
                  ? 'group-hover:scale-102 group-hover:opacity-0'
                  : 'group-hover:scale-103',
              )}
            />
          )}
          {hoverImage && (
            <SanityImage
              image={hoverImage}
              alt=""
              aspectRatio={PORTRAIT}
              sizes={sizes}
              className="opacity-0 mix-blend-multiply transition-[transform,opacity] duration-400 ease-out group-hover:scale-102 group-hover:opacity-100 motion-reduce:transition-none"
            />
          )}
        </div>
        <div className="mt-3 flex flex-col gap-1">
          <h3 className="text-sm text-ink">{product.title}</h3>
          <Price price={product.price} salePrice={product.salePrice} size="sm" />
          {variant && <p className="text-xs text-muted">{colorSummary(product.variants)}</p>}
        </div>
      </Link>
      {badges.length > 0 && (
        <div className="pointer-events-none absolute top-3 left-3 flex flex-wrap gap-1.5">
          {badges.map((badge) => (
            <Badge key={badge.label} tone={badge.tone}>
              {badge.label}
            </Badge>
          ))}
        </div>
      )}
      <WishlistButton productTitle={product.title} className="absolute top-1 right-1" />
    </article>
  )
}
