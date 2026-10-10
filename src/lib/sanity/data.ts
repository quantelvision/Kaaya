import type { StorePricing } from '@/lib/pricing/settings'
import { sanityFetch } from '@/lib/sanity/fetch'
import {
  activePromosQuery,
  allEditsQuery,
  allProductsQuery,
  categoryPageQuery,
  categorySlugsQuery,
  couponByCodeQuery,
  editPageQuery,
  editSlugsQuery,
  festiveSaleQuery,
  heroSlidesQuery,
  homeEditsQuery,
  homeProductTabsQuery,
  loyaltySettingsQuery,
  navigationQuery,
  productPageQuery,
  productSlugsQuery,
  searchProductsQuery,
  searchSuggestionsQuery,
  siteSettingsQuery,
} from '@/lib/sanity/queries'

export function getNavigation() {
  return sanityFetch({ query: navigationQuery, tags: ['category', 'edit', 'product'] })
}

export function getActivePromos() {
  return sanityFetch({ query: activePromosQuery, tags: ['bannerPromo'] })
}

export function getSiteSettings() {
  return sanityFetch({ query: siteSettingsQuery, tags: ['settings'] })
}

export function getFestiveSale() {
  return sanityFetch({ query: festiveSaleQuery, tags: ['settings', 'edit'] })
}

export function getHeroSlides() {
  return sanityFetch({ query: heroSlidesQuery, tags: ['heroSlide'] })
}

export function getHomeEdits() {
  return sanityFetch({ query: homeEditsQuery, tags: ['edit', 'product', 'category'] })
}

export function getHomeProductTabs() {
  return sanityFetch({ query: homeProductTabsQuery, tags: ['product', 'category'] })
}

export function getAllProducts() {
  return sanityFetch({ query: allProductsQuery, tags: ['product', 'category'] })
}

export function getCategoryPage(slug: string) {
  return sanityFetch({
    query: categoryPageQuery,
    params: { slug },
    tags: ['category', 'product'],
  })
}

export function getAllEdits() {
  return sanityFetch({ query: allEditsQuery, tags: ['edit'] })
}

export function getEditPage(slug: string) {
  return sanityFetch({
    query: editPageQuery,
    params: { slug },
    tags: ['edit', 'product', 'category'],
  })
}

export function getProductPage(slug: string) {
  return sanityFetch({
    query: productPageQuery,
    params: { slug },
    tags: ['product', 'category', 'edit'],
  })
}

export function getProductSlugs() {
  return sanityFetch({ query: productSlugsQuery, tags: ['product'] })
}

export function getCategorySlugs() {
  return sanityFetch({ query: categorySlugsQuery, tags: ['category'] })
}

export function getEditSlugs() {
  return sanityFetch({ query: editSlugsQuery, tags: ['edit'] })
}

export function searchProducts(term: string) {
  return sanityFetch({
    query: searchProductsQuery,
    params: { term },
    tags: ['product', 'category'],
  })
}

export function getSearchSuggestions(term: string) {
  return sanityFetch({
    query: searchSuggestionsQuery,
    params: { term },
    tags: ['product', 'category', 'edit'],
  })
}

export function getLoyaltySettings() {
  return sanityFetch({ query: loyaltySettingsQuery, tags: ['settings'] })
}

export function getCouponByCode(code: string) {
  return sanityFetch({ query: couponByCodeQuery, params: { code }, tags: ['coupon'] })
}

export async function getStorePricing(): Promise<StorePricing> {
  const [settings, loyalty] = await Promise.all([getSiteSettings(), getLoyaltySettings()])
  return {
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
}
