import type { Metadata } from 'next'
import { RecentlyViewedRail } from '@/components/product/recently-viewed-rail'
import { WishlistView } from '@/components/wishlist/wishlist-view'

export const metadata: Metadata = {
  title: 'Wishlist',
  description: 'Pieces you saved in the Kaaya demo store during this visit.',
}

export default function WishlistPage() {
  return (
    <>
      <header className="mx-auto max-w-page gutter-x pt-8 pb-6 md:pt-12 md:pb-8">
        <h1 className="heading-display text-4xl text-ink md:text-5xl">Wishlist</h1>
        <p className="mt-4 max-w-prose text-base text-muted">
          Saved pieces stay here until you close this tab.
        </p>
      </header>
      <WishlistView />
      <RecentlyViewedRail />
    </>
  )
}
