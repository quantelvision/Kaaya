import { createHash } from 'node:crypto'
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { createClient, type IdentifiedSanityDocumentStub } from '@sanity/client'
import { isSizeInScale } from '../../src/lib/catalog'
import { categories } from './content/categories'
import { coupons } from './content/coupons'
import { edits } from './content/edits'
import { heroSlides } from './content/hero-slides'
import { products } from './content/products'
import { promos } from './content/promos'
import { festiveSale, loyaltySettings, siteSettings } from './content/settings'
import type { SeedProduct, SeedSize, SeedVariant } from './content/types'
import { colorNameFromSlug, heroVariantProducts, variantFilePattern } from './image-map'
import { hotspotForPiece, lookImageFileName, lookLayouts } from './look-layouts'
import { sampleDominantHex } from './sample-color'

const imagesDir = path.join(process.cwd(), 'scripts', 'seed', 'images')
const hexPattern = /^#[0-9A-F]{6}$/

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Missing environment variable: ${name}`)
  return value
}

const client = createClient({
  projectId: requireEnv('NEXT_PUBLIC_SANITY_PROJECT_ID'),
  dataset: requireEnv('NEXT_PUBLIC_SANITY_DATASET'),
  apiVersion: requireEnv('NEXT_PUBLIC_SANITY_API_VERSION'),
  token: requireEnv('SANITY_API_WRITE_TOKEN'),
  useCdn: false,
})

type ImageField = {
  _type: 'image'
  _key?: string
  asset: { _type: 'reference'; _ref: string }
}

const assetIdsByFile = new Map<string, string>()
const imageStats = { uploaded: 0, reused: 0 }

// sanity stores the sha1 of every asset, so a file that is already there is reused instead of uploaded again
async function assetIdFor(fileName: string): Promise<string> {
  const cached = assetIdsByFile.get(fileName)
  if (cached) return cached

  const buffer = await readFile(path.join(imagesDir, fileName))
  const sha1 = createHash('sha1').update(buffer).digest('hex')
  const existingId = await client.fetch<string | null>(
    '*[_type == "sanity.imageAsset" && sha1hash == $sha1][0]._id',
    { sha1 },
  )

  let assetId = existingId
  if (assetId) {
    imageStats.reused += 1
  } else {
    const asset = await client.assets.upload('image', buffer, { filename: fileName })
    assetId = asset._id
    imageStats.uploaded += 1
  }

  assetIdsByFile.set(fileName, assetId)
  return assetId
}

async function imageField(fileName: string, key?: string): Promise<ImageField> {
  return {
    _type: 'image',
    ...(key ? { _key: key } : {}),
    asset: { _type: 'reference', _ref: await assetIdFor(fileName) },
  }
}

function reference(id: string, key?: string) {
  return { _type: 'reference' as const, _ref: id, ...(key ? { _key: key } : {}) }
}

function slugField(current: string) {
  return { _type: 'slug' as const, current }
}

function keyFor(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-')
}

function productImageFiles(fileNames: string[], productSlug: string, colorSlug: string): string[] {
  const prefix = `${productSlug}_${colorSlug}_`
  return fileNames.filter((name) => name.startsWith(prefix) && name.endsWith('.webp')).sort()
}

function extraColorSlugs(fileNames: string[], product: SeedProduct): string[] {
  if (!heroVariantProducts.includes(product.slug)) return []
  const slugs = new Set<string>()
  for (const fileName of fileNames) {
    const match = variantFilePattern.exec(fileName)
    if (match?.[1] === product.slug && match[2] && match[2] !== product.variant.colorSlug) {
      slugs.add(match[2])
    }
  }
  return [...slugs].sort()
}

// an added color reuses the size run of the main color with the stock shifted by one size
function shiftedSizes(sizes: SeedSize[]): SeedSize[] {
  return sizes.map((entry, index) => ({
    size: entry.size,
    stock: Math.max(4, sizes[(index + 1) % sizes.length]?.stock ?? 8),
  }))
}

function validateContent(fileNames: string[]): void {
  const problems: string[] = []
  const categorySlugs = new Set(categories.map((category) => category.slug))
  const productSlugs = new Set<string>()
  const featuredOrders = new Set<number>()

  for (const product of products) {
    if (productSlugs.has(product.slug)) problems.push(`Duplicate product slug ${product.slug}`)
    productSlugs.add(product.slug)
    if (featuredOrders.has(product.featuredOrder)) {
      problems.push(`Duplicate featuredOrder ${product.featuredOrder} on ${product.slug}`)
    }
    featuredOrders.add(product.featuredOrder)
    if (!categorySlugs.has(product.categorySlug)) {
      problems.push(`${product.slug} uses unknown category ${product.categorySlug}`)
    }
    if (product.salePrice !== undefined && product.salePrice >= product.price) {
      problems.push(`${product.slug} has a sale price that is not lower than the price`)
    }
    if (!hexPattern.test(product.variant.hex)) problems.push(`${product.slug} has an invalid hex`)
    for (const entry of product.variant.sizes) {
      if (!isSizeInScale(entry.size, product.sizeScale)) {
        problems.push(
          `${product.slug} has size ${entry.size} outside the ${product.sizeScale} scale`,
        )
      }
    }
    if (product.variant.sizes.every((entry) => entry.stock === 0)) {
      problems.push(`${product.slug} has no stock in any size`)
    }
    if (productImageFiles(fileNames, product.slug, product.variant.colorSlug).length === 0) {
      problems.push(`${product.slug} has no image for ${product.variant.colorSlug}`)
    }
  }

  for (const edit of edits) {
    for (const slug of edit.productSlugs) {
      if (!productSlugs.has(slug)) problems.push(`Edit ${edit.slug} lists unknown product ${slug}`)
    }
    for (const piece of lookLayouts[edit.slug] ?? []) {
      if (!edit.productSlugs.includes(piece.productSlug)) {
        problems.push(`Look for ${edit.slug} shows ${piece.productSlug}, which is not in the edit`)
      }
    }
    if (!fileNames.includes(lookImageFileName(edit.slug))) {
      problems.push(`Missing look image for ${edit.slug}`)
    }
  }

  for (const slide of heroSlides) {
    if (!fileNames.includes(lookImageFileName(slide.lookEditSlug))) {
      problems.push(`Hero slide ${slide.id} has no look image`)
    }
  }

  if (problems.length > 0) {
    throw new Error(`Seed content has problems:\n${problems.map((line) => `  ${line}`).join('\n')}`)
  }
}

async function variantField(product: SeedProduct, variant: SeedVariant, fileNames: string[]) {
  const files = productImageFiles(fileNames, product.slug, variant.colorSlug)
  return {
    _type: 'productVariant',
    _key: variant.colorSlug,
    colorName: variant.colorName,
    colorSlug: slugField(variant.colorSlug),
    hex: variant.hex,
    images: await Promise.all(
      files.map((fileName, index) => imageField(fileName, `${variant.colorSlug}-${index + 1}`)),
    ),
    sizes: variant.sizes.map((entry) => ({
      _type: 'sizeStock',
      _key: keyFor(entry.size),
      size: entry.size,
      stock: entry.stock,
    })),
  }
}

async function productDocument(product: SeedProduct, fileNames: string[]) {
  const extraVariants: SeedVariant[] = []
  for (const colorSlug of extraColorSlugs(fileNames, product)) {
    const firstImage = productImageFiles(fileNames, product.slug, colorSlug)[0]
    if (!firstImage) continue
    extraVariants.push({
      colorName: colorNameFromSlug(colorSlug),
      colorSlug,
      hex: await sampleDominantHex(path.join(imagesDir, firstImage)),
      sizes: shiftedSizes(product.variant.sizes),
    })
  }

  return {
    document: {
      _id: `product-${product.slug}`,
      _type: 'product',
      title: product.title,
      slug: slugField(product.slug),
      category: reference(`category-${product.categorySlug}`),
      gender: product.gender,
      price: product.price,
      salePrice: product.salePrice,
      description: product.description,
      badges: product.badges,
      limitedRun: product.limitedRun,
      material: product.material,
      fit: product.fit,
      fitNote: product.fitNote,
      composition: product.composition,
      care: product.care,
      origin: product.origin,
      sizeScale: product.sizeScale,
      variants: await Promise.all(
        [product.variant, ...extraVariants].map((variant) =>
          variantField(product, variant, fileNames),
        ),
      ),
      flags: product.flags,
      featuredOrder: product.featuredOrder,
    },
    extraColors: extraVariants.length,
  }
}

async function main() {
  const fileNames = (await readdir(imagesDir)).sort()
  validateContent(fileNames)

  const documents: IdentifiedSanityDocumentStub[] = []
  let extraColors = 0

  for (const category of categories) {
    documents.push({
      _id: `category-${category.slug}`,
      _type: 'category',
      title: category.title,
      slug: slugField(category.slug),
      order: category.order,
      iconKey: category.iconKey,
      description: category.description,
    })
  }

  for (const product of products) {
    const result = await productDocument(product, fileNames)
    documents.push(result.document)
    extraColors += result.extraColors
  }

  for (const edit of edits) {
    const firstProduct = products.find((product) => product.slug === edit.productSlugs[0])
    const coverFile = firstProduct
      ? productImageFiles(fileNames, firstProduct.slug, firstProduct.variant.colorSlug)[0]
      : undefined
    if (!coverFile) throw new Error(`No cover image for edit ${edit.slug}`)

    documents.push({
      _id: `edit-${edit.slug}`,
      _type: 'edit',
      title: edit.title,
      slug: slugField(edit.slug),
      order: edit.order,
      story: edit.story,
      coverImage: await imageField(coverFile),
      products: edit.productSlugs.map((slug) => reference(`product-${slug}`, slug)),
      looks: [
        {
          _type: 'look',
          _key: `look-${edit.slug}`,
          image: await imageField(lookImageFileName(edit.slug)),
          hotspots: (lookLayouts[edit.slug] ?? []).map((piece) => ({
            _type: 'lookHotspot',
            _key: piece.productSlug,
            ...hotspotForPiece(piece),
            product: reference(`product-${piece.productSlug}`),
          })),
        },
      ],
    })
  }

  for (const slide of heroSlides) {
    documents.push({
      _id: slide.id,
      _type: 'heroSlide',
      badge: slide.badge,
      headline: slide.headline,
      subtext: slide.subtext,
      ctaLabel: slide.ctaLabel,
      ctaHref: slide.ctaHref,
      image: await imageField(lookImageFileName(slide.lookEditSlug)),
      order: slide.order,
    })
  }

  for (const promo of promos) {
    documents.push({
      _id: promo.id,
      _type: 'bannerPromo',
      text: promo.text,
      discountPercent: promo.discountPercent,
      isActive: promo.isActive,
      order: promo.order,
    })
  }

  for (const coupon of coupons) {
    documents.push({ _id: `coupon-${coupon.code.toLowerCase()}`, _type: 'coupon', ...coupon })
  }

  documents.push({ _id: 'siteSettings', _type: 'siteSettings', ...siteSettings })
  documents.push({
    _id: 'loyaltySettings',
    _type: 'loyaltySettings',
    ...loyaltySettings,
    tiers: loyaltySettings.tiers.map(({ key, ...tier }) => ({
      _type: 'loyaltyTier',
      _key: key,
      ...tier,
    })),
  })
  documents.push({
    _id: 'festiveSale',
    _type: 'festiveSale',
    isActive: festiveSale.isActive,
    title: festiveSale.title,
    subtitle: festiveSale.subtitle,
    edit: reference(`edit-${festiveSale.editSlug}`),
    mode: festiveSale.mode,
    rollingHours: festiveSale.rollingHours,
  })

  const transaction = client.transaction()
  for (const document of documents) {
    transaction.createOrReplace(document)
    transaction.delete(`drafts.${document._id}`)
  }
  await transaction.commit({ visibility: 'sync' })

  const countsByType = documents.reduce<Record<string, number>>((counts, document) => {
    counts[document._type] = (counts[document._type] ?? 0) + 1
    return counts
  }, {})
  const summary = Object.entries(countsByType)
    .map(([type, count]) => `  ${type}: ${count}`)
    .join('\n')

  process.stdout.write(
    `Seeded ${documents.length} documents:\n${summary}\nImages: ${imageStats.uploaded} uploaded, ${imageStats.reused} reused. Extra hero colors: ${extraColors}.\n`,
  )
}

main().catch((error: unknown) => {
  process.stderr.write(
    `${error instanceof Error ? (error.stack ?? error.message) : String(error)}\n`,
  )
  process.exit(1)
})
