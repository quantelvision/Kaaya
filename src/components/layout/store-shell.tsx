import type { ReactNode } from 'react'
import { CartDrawer } from '@/components/cart/cart-drawer'
import { LoyaltyBootstrap } from '@/components/cart/loyalty-bootstrap'
import { CustomizerButton } from '@/components/customizer/customizer-button'
import { AnnouncementTicker } from '@/components/layout/announcement-ticker'
import type { NavCategory, NavEdit, StoreHelpSettings } from '@/components/layout/nav-types'
import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import { QuantelCreditPill } from '@/components/quantel/quantel-credit-pill'
import type { StorePricing } from '@/lib/pricing/settings'
import {
  getActivePromos,
  getLoyaltySettings,
  getNavigation,
  getSiteSettings,
} from '@/lib/sanity/data'
import { StoreHydration } from '@/stores/store-hydration'

export async function StoreShell({ children }: { children: ReactNode }) {
  const [navigation, promos, settings, loyalty] = await Promise.all([
    getNavigation(),
    getActivePromos(),
    getSiteSettings(),
    getLoyaltySettings(),
  ])

  const categories: NavCategory[] = navigation.categories.map((category) => ({
    title: category.title,
    slug: category.slug,
    iconKey: category.iconKey,
  }))
  const edits: NavEdit[] = navigation.edits.map((edit) => ({ title: edit.title, slug: edit.slug }))
  const helpSettings: StoreHelpSettings | null = settings
    ? {
        freeShippingThreshold: settings.freeShippingThreshold,
        shippingFee: settings.shippingFee,
        codFee: settings.codFee,
        returnWindowDays: settings.returnWindowDays,
      }
    : null

  const storePricing: StorePricing = {
    pricing: {
      freeShippingThreshold: settings?.freeShippingThreshold ?? 0,
      shippingFee: settings?.shippingFee ?? 0,
      codFee: settings?.codFee ?? 0,
    },
    loyalty: loyalty
      ? {
          earnRupeesPerPoint: loyalty.earnRupeesPerPoint,
          pointValueRupees: loyalty.pointValueRupees,
          maxRedeemPercent: loyalty.maxRedeemPercent,
          minRedeemPoints: loyalty.minRedeemPoints,
          startingPoints: loyalty.startingPoints,
        }
      : null,
  }

  return (
    <>
      <StoreHydration />
      {loyalty && <LoyaltyBootstrap startingPoints={loyalty.startingPoints} />}
      <AnnouncementTicker messages={promos.map((promo) => promo.text)} />
      <SiteHeader
        categories={categories}
        edits={edits}
        popularSearches={settings?.popularSearches ?? []}
      />
      <main className="flex-1">{children}</main>
      <SiteFooter categories={categories} edits={edits} helpSettings={helpSettings} />
      <CartDrawer storePricing={storePricing} />
      <QuantelCreditPill />
      <CustomizerButton />
    </>
  )
}
