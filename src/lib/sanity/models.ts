import type {
  AllProductsQueryResult,
  EditPageQueryResult,
  FestiveSaleQueryResult,
  HeroSlidesQueryResult,
  HomeEditsQueryResult,
  NavigationQueryResult,
  ProductPageQueryResult,
  SiteSettingsQueryResult,
} from '@sanity-types'

export type ProductCardData = AllProductsQueryResult[number]
export type ProductVariantData = ProductCardData['variants'][number]
export type SanityImageData = ProductVariantData['images'][number]
export type ProductDetailData = NonNullable<ProductPageQueryResult>
export type HeroSlideData = HeroSlidesQueryResult[number]
export type HomeEditData = HomeEditsQueryResult[number]
export type LookData = NonNullable<NonNullable<EditPageQueryResult>['looks']>[number]
export type NavigationData = NavigationQueryResult
export type FestiveSaleData = NonNullable<FestiveSaleQueryResult>
export type SiteSettingsData = NonNullable<SiteSettingsQueryResult>
