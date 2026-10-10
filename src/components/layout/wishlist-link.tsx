'use client'

import { Heart } from '@phosphor-icons/react/ssr'
import Link from 'next/link'
import { CountBadge } from '@/components/layout/count-badge'
import { iconButtonClasses } from '@/components/ui/icon-button'
import { useHasHydrated } from '@/stores/hydration-store'
import { useWishlistStore } from '@/stores/wishlist-store'

export function WishlistLink({ className }: { className?: string }) {
  const hasHydrated = useHasHydrated()
  const count = useWishlistStore((state) => (hasHydrated ? state.items.length : 0))

  return (
    <Link
      href="/wishlist"
      aria-label={count > 0 ? `Wishlist, ${count} saved` : 'Wishlist'}
      className={iconButtonClasses('ghost', className)}
    >
      <Heart weight="light" className="size-6" aria-hidden />
      <CountBadge count={count} />
    </Link>
  )
}
