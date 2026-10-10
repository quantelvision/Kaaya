'use client'

import { Heart } from '@phosphor-icons/react/ssr'
import { motion, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/cn'
import type { ProductCardData } from '@/lib/sanity/models'
import { useHasHydrated } from '@/stores/hydration-store'
import { useWishlistStore } from '@/stores/wishlist-store'

type WishlistButtonProps = {
  product: ProductCardData
  className?: string
}

export function WishlistButton({ product, className }: WishlistButtonProps) {
  const hasHydrated = useHasHydrated()
  const prefersReducedMotion = useReducedMotion()
  const isSaved = useWishlistStore(
    (state) => hasHydrated && state.items.some((item) => item._id === product._id),
  )
  const toggle = useWishlistStore((state) => state.toggle)

  return (
    <button
      type="button"
      aria-label={
        isSaved ? `Remove ${product.title} from wishlist` : `Save ${product.title} to wishlist`
      }
      aria-pressed={isSaved}
      onClick={() => toggle(product)}
      className={cn(
        'inline-flex size-tap items-center justify-center rounded-full transition-colors',
        isSaved ? 'text-primary' : 'text-ink hover:text-primary',
        className,
      )}
    >
      <motion.span
        key={isSaved ? 'saved' : 'empty'}
        initial={prefersReducedMotion || !hasHydrated ? false : { scale: 0.6 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 480, damping: 16 }}
        className="inline-flex"
      >
        <Heart weight={isSaved ? 'fill' : 'light'} className="size-5" aria-hidden />
      </motion.span>
    </button>
  )
}
