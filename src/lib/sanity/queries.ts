import { defineQuery } from 'next-sanity'

const imageFields = `
  asset,
  hotspot,
  crop,
  "lqip": asset->metadata.lqip,
  "aspectRatio": asset->metadata.dimensions.aspectRatio
`

const productCardFields = `
  _id,
  _createdAt,
  title,
  "slug": slug.current,
  price,
  salePrice,
  badges,
  limitedRun,
  material,
  fit,
  gender,
  sizeScale,
  featuredOrder,
  flags,
  "category": category->{ title, "slug": slug.current },
  "variants": variants[]{
    _key,
    colorName,
    "colorSlug": colorSlug.current,
    hex,
    "images": images[0...2]{ ${imageFields} },
    sizes[]{ size, stock }
  }
`

const productDetailFields = `
  ${productCardFields},
  description,
  fitNote,
  composition,
  care,
  origin,
  "variantGalleries": variants[]{
    _key,
    "colorSlug": colorSlug.current,
    "images": images[]{ _key, ${imageFields} }
  }
`

const lookFields = `
  _key,
  "image": image{ ${imageFields} },
  hotspots[]{
    _key,
    x,
    y,
    "product": product->{ ${productCardFields} }
  }
`

export const siteSettingsQuery = defineQuery(`
  *[_type == "siteSettings"][0]{
    storeName,
    popularSearches,
    freeShippingThreshold,
    shippingFee,
    codFee,
    manifestoLines,
    lowStockThreshold,
    returnWindowDays
  }
`)

export const navigationQuery = defineQuery(`{
  "categories": *[_type == "category"] | order(order asc){
    _id,
    title,
    "slug": slug.current,
    iconKey,
    "productCount": count(*[_type == "product" && references(^._id)])
  },
  "edits": *[_type == "edit"] | order(order asc){
    _id,
    title,
    "slug": slug.current
  }
}`)

export const activePromosQuery = defineQuery(`
  *[_type == "bannerPromo" && isActive == true] | order(order asc){
    _id,
    text,
    discountPercent
  }
`)

export const heroSlidesQuery = defineQuery(`
  *[_type == "heroSlide"] | order(order asc){
    _id,
    badge,
    headline,
    subtext,
    ctaLabel,
    ctaHref,
    "image": image{ ${imageFields} }
  }
`)

export const festiveSaleQuery = defineQuery(`
  *[_type == "festiveSale"][0]{
    isActive,
    title,
    subtitle,
    mode,
    endsAt,
    rollingHours,
    "edit": edit->{
      title,
      "slug": slug.current,
      "productIds": products[]._ref
    }
  }
`)

export const homeEditsQuery = defineQuery(`
  *[_type == "edit"] | order(order asc)[0...2]{
    _id,
    title,
    "slug": slug.current,
    story,
    "coverImage": coverImage{ ${imageFields} },
    "look": looks[0]{ ${lookFields} },
    "products": products[0...2]->{ ${productCardFields} }
  }
`)

export const homeProductTabsQuery = defineQuery(`{
  "newIn": *[_type == "product" && flags.isNewIn == true] | order(featuredOrder asc, title asc){
    ${productCardFields}
  },
  "bestSellers": *[_type == "product" && flags.isBestSeller == true] | order(featuredOrder asc, title asc){
    ${productCardFields}
  },
  "archive": *[_type == "product" && flags.isArchive == true] | order(featuredOrder asc, title asc){
    ${productCardFields}
  }
}`)

export const allProductsQuery = defineQuery(`
  *[_type == "product"] | order(featuredOrder asc, title asc){
    ${productCardFields}
  }
`)

export const categoryPageQuery = defineQuery(`
  *[_type == "category" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    description,
    iconKey,
    "products": *[_type == "product" && references(^._id)] | order(featuredOrder asc, title asc){
      ${productCardFields}
    }
  }
`)

export const allEditsQuery = defineQuery(`
  *[_type == "edit"] | order(order asc){
    _id,
    title,
    "slug": slug.current,
    story,
    "coverImage": coverImage{ ${imageFields} },
    "productCount": count(products)
  }
`)

export const editPageQuery = defineQuery(`
  *[_type == "edit" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    story,
    "coverImage": coverImage{ ${imageFields} },
    "looks": looks[]{ ${lookFields} },
    "products": products[]->{ ${productCardFields} }
  }
`)

export const productPageQuery = defineQuery(`
  *[_type == "product" && slug.current == $slug][0]{
    ${productDetailFields},
    "edits": *[_type == "edit" && references(^._id)] | order(order asc){
      _id,
      title,
      "slug": slug.current,
      "products": products[]->{ ${productCardFields} }
    }
  }
`)

export const productSlugsQuery = defineQuery(`
  *[_type == "product" && defined(slug.current)]{ "slug": slug.current }
`)

export const categorySlugsQuery = defineQuery(`
  *[_type == "category" && defined(slug.current)]{ "slug": slug.current }
`)

export const editSlugsQuery = defineQuery(`
  *[_type == "edit" && defined(slug.current)]{ "slug": slug.current }
`)

export const searchProductsQuery = defineQuery(`
  *[
    _type == "product" && (
      title match $term ||
      category->title match $term ||
      material match $term ||
      badges[] match $term
    )
  ] | order(featuredOrder asc, title asc){
    ${productCardFields}
  }
`)

export const searchSuggestionsQuery = defineQuery(`{
  "products": *[
    _type == "product" && (
      title match $term ||
      category->title match $term ||
      material match $term ||
      badges[] match $term
    )
  ] | order(featuredOrder asc, title asc)[0...6]{
    _id,
    title,
    "slug": slug.current,
    price,
    salePrice,
    "image": variants[0].images[0]{ ${imageFields} }
  },
  "categories": *[_type == "category" && title match $term] | order(order asc){
    _id,
    title,
    "slug": slug.current
  },
  "edits": *[_type == "edit" && title match $term] | order(order asc){
    _id,
    title,
    "slug": slug.current
  }
}`)

export const productCardsByIdsQuery = defineQuery(`
  *[_type == "product" && _id in $ids]{
    ${productCardFields}
  }
`)

export const loyaltySettingsQuery = defineQuery(`
  *[_type == "loyaltySettings"][0]{
    earnRupeesPerPoint,
    pointValueRupees,
    maxRedeemPercent,
    minRedeemPoints,
    startingPoints,
    tiers[] | order(minPoints asc){ _key, name, minPoints, perk }
  }
`)

export const couponByCodeQuery = defineQuery(`
  *[_type == "coupon" && code == $code][0]{
    code,
    description,
    type,
    value,
    minCartValue,
    firstOrderOnly,
    isActive,
    expiresAt
  }
`)
