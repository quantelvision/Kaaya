import { sanityFetch } from '@/lib/sanity/fetch'
import {
  activePromosQuery,
  allEditsQuery,
  allProductsQuery,
  categoryPageQuery,
  categorySlugsQuery,
  editPageQuery,
  editSlugsQuery,
  festiveSaleQuery,
  heroSlidesQuery,
  homeEditsQuery,
  homeProductTabsQuery,
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
