import Link from 'next/link'
import { KaayaLockup } from '@/components/brand/kaaya-lockup'
import { BagButton } from '@/components/cart/bag-button'
import { LooksMenu } from '@/components/layout/looks-menu'
import { MobileMenu } from '@/components/layout/mobile-menu'
import { navLinkClasses } from '@/components/layout/nav-link-classes'
import { RewardsLink } from '@/components/layout/rewards-link'
import type { NavCategory, NavEdit } from '@/components/layout/nav-types'
import { WishlistLink } from '@/components/layout/wishlist-link'
import { SearchLauncher } from '@/components/search/search-launcher'

type SiteHeaderProps = {
  categories: NavCategory[]
  edits: NavEdit[]
  popularSearches: string[]
  startingPoints: number | null
}

export function SiteHeader({
  categories,
  edits,
  popularSearches,
  startingPoints,
}: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-canvas">
      <div className="mx-auto flex h-header max-w-page items-center gap-2 gutter-x">
        <MobileMenu categories={categories} edits={edits} />
        <Link href="/" aria-label="Kaaya home" className="mr-4 inline-flex h-tap items-center">
          <KaayaLockup layout="horizontal" />
        </Link>
        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center">
            <li>
              <Link href="/shop" className={navLinkClasses()}>
                Shop
              </Link>
            </li>
            <li>
              <LooksMenu edits={edits} />
            </li>
            <li>
              <Link href="/shop/ethnic" className={navLinkClasses()}>
                Ethnic
              </Link>
            </li>
            <li>
              <Link href="/shop/footwear" className={navLinkClasses()}>
                Footwear
              </Link>
            </li>
            <li>
              <RewardsLink startingPoints={startingPoints} />
            </li>
          </ul>
        </nav>
        <div className="-mr-3 ml-auto flex items-center">
          <SearchLauncher popularSearches={popularSearches} />
          <WishlistLink className="hidden sm:inline-flex" />
          <BagButton />
        </div>
      </div>
    </header>
  )
}
