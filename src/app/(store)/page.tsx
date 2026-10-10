import { CategoryScroller } from '@/components/home/category-scroller'
import { LooksGallery } from '@/components/home/looks-gallery'
import { FestiveStrip } from '@/components/home/festive-strip'
import { HeroCarousel } from '@/components/home/hero-carousel'
import { ManifestoMarquee } from '@/components/home/manifesto-marquee'
import { ProductTabs } from '@/components/home/product-tabs'
import { RecentlyViewedRail } from '@/components/product/recently-viewed-rail'
import {
  getFestiveSale,
  getHeroSlides,
  getHomeEdits,
  getHomeProductTabs,
  getNavigation,
  getSiteSettings,
} from '@/lib/sanity/data'

export default async function HomePage() {
  const [heroSlides, festiveSale, navigation, homeEdits, productTabs, settings] = await Promise.all(
    [
      getHeroSlides(),
      getFestiveSale(),
      getNavigation(),
      getHomeEdits(),
      getHomeProductTabs(),
      getSiteSettings(),
    ],
  )

  return (
    <>
      <h1 className="sr-only">Kaaya, a demo fashion store by Quantel Vision</h1>
      <HeroCarousel slides={heroSlides} />
      {festiveSale && <FestiveStrip sale={festiveSale} />}
      <CategoryScroller categories={navigation.categories} />
      <LooksGallery edits={homeEdits} />
      <ManifestoMarquee lines={settings?.manifestoLines ?? []} />
      <ProductTabs
        tabs={[
          { id: 'new-in', label: 'New In', products: productTabs.newIn },
          { id: 'best-sellers', label: 'Best Sellers', products: productTabs.bestSellers },
          { id: 'archive', label: 'Archive', products: productTabs.archive },
        ]}
      />
      <RecentlyViewedRail />
    </>
  )
}
