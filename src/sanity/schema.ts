import type { SchemaTypeDefinition } from 'sanity'
import { bannerPromo } from './schema-types/banner-promo'
import { category } from './schema-types/category'
import { coupon } from './schema-types/coupon'
import { edit, look, lookHotspot } from './schema-types/edit'
import { festiveSale } from './schema-types/festive-sale'
import { heroSlide } from './schema-types/hero-slide'
import { loyaltySettings, loyaltyTier } from './schema-types/loyalty-settings'
import { product, productVariant, sizeStock } from './schema-types/product'
import { siteSettings } from './schema-types/site-settings'

export const schemaTypes: SchemaTypeDefinition[] = [
  siteSettings,
  loyaltySettings,
  loyaltyTier,
  festiveSale,
  category,
  product,
  productVariant,
  sizeStock,
  edit,
  look,
  lookHotspot,
  heroSlide,
  bannerPromo,
  coupon,
]

export const singletonTypes = new Set(['siteSettings', 'loyaltySettings', 'festiveSale'])
