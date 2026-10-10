import type { ReactNode } from 'react'
import { CartDrawer } from '@/components/cart/cart-drawer'
import { CustomizerButton } from '@/components/customizer/customizer-button'
import { AnnouncementTicker } from '@/components/layout/announcement-ticker'
import type { NavCategory, NavEdit, StoreHelpSettings } from '@/components/layout/nav-types'
import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import { QuantelCreditPill } from '@/components/quantel/quantel-credit-pill'
import { getActivePromos, getNavigation, getSiteSettings } from '@/lib/sanity/data'
import { StoreHydration } from '@/stores/store-hydration'

export async function StoreShell({ children }: { children: ReactNode }) {
  const [navigation, promos, settings] = await Promise.all([
    getNavigation(),
    getActivePromos(),
    getSiteSettings(),
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

  return (
    <>
      <StoreHydration />
      <AnnouncementTicker messages={promos.map((promo) => promo.text)} />
      <SiteHeader categories={categories} edits={edits} />
      <main className="flex-1">{children}</main>
      <SiteFooter categories={categories} edits={edits} helpSettings={helpSettings} />
      <CartDrawer
        shippingSettings={
          settings
            ? {
                freeShippingThreshold: settings.freeShippingThreshold,
                shippingFee: settings.shippingFee,
              }
            : null
        }
      />
      <QuantelCreditPill />
      <CustomizerButton />
    </>
  )
}
