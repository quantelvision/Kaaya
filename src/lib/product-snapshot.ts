import type { ProductCardData } from '@/lib/sanity/models'

// session stores keep only the card fields, so a saved product renders without another fetch
export function toCardSnapshot(product: ProductCardData): ProductCardData {
  return {
    _id: product._id,
    _createdAt: product._createdAt,
    title: product.title,
    slug: product.slug,
    price: product.price,
    salePrice: product.salePrice,
    badges: product.badges,
    limitedRun: product.limitedRun,
    material: product.material,
    fit: product.fit,
    gender: product.gender,
    sizeScale: product.sizeScale,
    featuredOrder: product.featuredOrder,
    flags: product.flags,
    category: product.category,
    variants: product.variants.map((variant) => ({
      _key: variant._key,
      colorName: variant.colorName,
      colorSlug: variant.colorSlug,
      hex: variant.hex,
      images: variant.images.slice(0, 2),
      sizes: variant.sizes,
    })),
  }
}
