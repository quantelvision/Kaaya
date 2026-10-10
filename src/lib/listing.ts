import { sizeScales } from '@/lib/catalog'
import { formatPrice } from '@/lib/format'
import { effectivePrice } from '@/lib/product'

export type ListingProduct = {
  _id: string
  _createdAt: string
  price: number
  salePrice: number | null
  material: string
  fit: string
  gender: string
  featuredOrder: number | null
  flags: { isNewIn?: boolean; isBestSeller?: boolean; isArchive?: boolean } | null
  category: { title: string; slug: string }
  variants: {
    colorName: string
    colorSlug: string
    hex: string
    sizes: { size: string; stock: number }[]
  }[]
}

export const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price low to high' },
  { value: 'price-desc', label: 'Price high to low' },
] as const

export type SortKey = (typeof sortOptions)[number]['value']

export const collectionOptions = [
  { value: 'new-in', label: 'New in' },
  { value: 'best-sellers', label: 'Best sellers' },
  { value: 'archive', label: 'Archive' },
] as const

export type CollectionKey = (typeof collectionOptions)[number]['value']

export type Density = 'grid' | 'editorial'

export type ListingFilters = {
  sizes: string[]
  colors: string[]
  materials: string[]
  fits: string[]
  genders: string[]
  categories: string[]
  collection: CollectionKey | null
  price: [number, number] | null
}

export type ListingState = {
  filters: ListingFilters
  sort: SortKey
  density: Density
}

export type FilterKey = Exclude<keyof ListingFilters, 'price' | 'collection'>

const listParams: Record<FilterKey, string> = {
  sizes: 'size',
  colors: 'color',
  materials: 'material',
  fits: 'fit',
  genders: 'gender',
  categories: 'category',
}

export const emptyFilters: ListingFilters = {
  sizes: [],
  colors: [],
  materials: [],
  fits: [],
  genders: [],
  categories: [],
  collection: null,
  price: null,
}

type ReadableParams = { get(name: string): string | null }

function readList(params: ReadableParams, name: string): string[] {
  const raw = params.get(name)
  if (!raw) return []
  return [
    ...new Set(
      raw
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean),
    ),
  ]
}

function readPrice(raw: string | null): [number, number] | null {
  if (!raw) return null
  const match = /^(\d+)-(\d+)$/.exec(raw)
  if (!match) return null
  const min = Number(match[1])
  const max = Number(match[2])
  return min <= max ? [min, max] : [max, min]
}

function isSortKey(value: string | null): value is SortKey {
  return sortOptions.some((option) => option.value === value)
}

function isCollectionKey(value: string | null): value is CollectionKey {
  return collectionOptions.some((option) => option.value === value)
}

export function parseListingState(params: ReadableParams): ListingState {
  const sort = params.get('sort')
  const collection = params.get('collection')
  return {
    filters: {
      sizes: readList(params, listParams.sizes),
      colors: readList(params, listParams.colors),
      materials: readList(params, listParams.materials),
      fits: readList(params, listParams.fits),
      genders: readList(params, listParams.genders),
      categories: readList(params, listParams.categories),
      collection: isCollectionKey(collection) ? collection : null,
      price: readPrice(params.get('price')),
    },
    sort: isSortKey(sort) ? sort : 'featured',
    density: params.get('view') === 'editorial' ? 'editorial' : 'grid',
  }
}

export function serializeListingState(state: ListingState): string {
  const params = new URLSearchParams()
  for (const key of Object.keys(listParams) as FilterKey[]) {
    const values = state.filters[key]
    if (values.length > 0) params.set(listParams[key], values.join(','))
  }
  if (state.filters.collection) params.set('collection', state.filters.collection)
  if (state.filters.price)
    params.set('price', `${state.filters.price[0]}-${state.filters.price[1]}`)
  if (state.sort !== 'featured') params.set('sort', state.sort)
  if (state.density === 'editorial') params.set('view', 'editorial')
  return params.toString()
}

function matchesCollection(product: ListingProduct, collection: CollectionKey): boolean {
  if (collection === 'new-in') return Boolean(product.flags?.isNewIn)
  if (collection === 'best-sellers') return Boolean(product.flags?.isBestSeller)
  return Boolean(product.flags?.isArchive)
}

export function applyFilters<Product extends ListingProduct>(
  products: Product[],
  filters: ListingFilters,
): Product[] {
  return products.filter((product) => {
    if (filters.sizes.length > 0) {
      const hasSize = product.variants.some((variant) =>
        variant.sizes.some((entry) => entry.stock > 0 && filters.sizes.includes(entry.size)),
      )
      if (!hasSize) return false
    }
    if (
      filters.colors.length > 0 &&
      !product.variants.some((variant) => filters.colors.includes(variant.colorSlug))
    ) {
      return false
    }
    if (filters.materials.length > 0 && !filters.materials.includes(product.material)) return false
    if (filters.fits.length > 0 && !filters.fits.includes(product.fit)) return false
    if (filters.genders.length > 0 && !filters.genders.includes(product.gender)) return false
    if (filters.categories.length > 0 && !filters.categories.includes(product.category.slug)) {
      return false
    }
    if (filters.collection && !matchesCollection(product, filters.collection)) return false
    if (filters.price) {
      const price = effectivePrice(product)
      if (price < filters.price[0] || price > filters.price[1]) return false
    }
    return true
  })
}

// featured keeps the order the server sent, which is the edit order on edit pages
export function sortProducts<Product extends ListingProduct>(
  products: Product[],
  sort: SortKey,
): Product[] {
  const indexed = products.map((product, index) => ({ product, index }))
  const byIndex = (a: { index: number }, b: { index: number }) => a.index - b.index

  indexed.sort((a, b) => {
    if (sort === 'price-asc') {
      return effectivePrice(a.product) - effectivePrice(b.product) || byIndex(a, b)
    }
    if (sort === 'price-desc') {
      return effectivePrice(b.product) - effectivePrice(a.product) || byIndex(a, b)
    }
    if (sort === 'newest') {
      const newInDelta =
        Number(Boolean(b.product.flags?.isNewIn)) - Number(Boolean(a.product.flags?.isNewIn))
      const createdDelta = Date.parse(b.product._createdAt) - Date.parse(a.product._createdAt)
      return newInDelta || createdDelta || byIndex(a, b)
    }
    return byIndex(a, b)
  })

  return indexed.map((entry) => entry.product)
}

export type FacetOption = {
  value: string
  label: string
  count: number
  hex?: string
}

export type ListingFacets = {
  sizes: FacetOption[]
  colors: FacetOption[]
  materials: FacetOption[]
  fits: FacetOption[]
  genders: FacetOption[]
  categories: FacetOption[]
  priceRange: [number, number]
}

const sizeOrder: string[] = [
  ...new Set([...sizeScales.apparel, ...sizeScales.ethnic, ...sizeScales.footwear]),
]

const genderLabels: Record<string, string> = { women: 'Women', men: 'Men', unisex: 'Unisex' }

function countInto(map: Map<string, FacetOption>, value: string, label: string, hex?: string) {
  const existing = map.get(value)
  if (existing) existing.count += 1
  else map.set(value, { value, label, count: 1, hex })
}

export function buildFacets(products: ListingProduct[]): ListingFacets {
  const sizes = new Map<string, FacetOption>()
  const colors = new Map<string, FacetOption>()
  const materials = new Map<string, FacetOption>()
  const fits = new Map<string, FacetOption>()
  const genders = new Map<string, FacetOption>()
  const categories = new Map<string, FacetOption>()
  let min = Number.POSITIVE_INFINITY
  let max = 0

  for (const product of products) {
    const productSizes = new Set(
      product.variants.flatMap((variant) => variant.sizes.map((entry) => entry.size)),
    )
    productSizes.forEach((size) => countInto(sizes, size, size))
    const productColors = new Map(product.variants.map((variant) => [variant.colorSlug, variant]))
    productColors.forEach((variant) =>
      countInto(colors, variant.colorSlug, variant.colorName, variant.hex),
    )
    countInto(materials, product.material, product.material)
    countInto(fits, product.fit, product.fit)
    countInto(genders, product.gender, genderLabels[product.gender] ?? product.gender)
    countInto(categories, product.category.slug, product.category.title)
    const price = effectivePrice(product)
    min = Math.min(min, price)
    max = Math.max(max, price)
  }

  const byLabel = (a: FacetOption, b: FacetOption) => a.label.localeCompare(b.label)

  return {
    sizes: [...sizes.values()].sort(
      (a, b) => sizeOrder.indexOf(a.value) - sizeOrder.indexOf(b.value),
    ),
    colors: [...colors.values()].sort(byLabel),
    materials: [...materials.values()].sort(byLabel),
    fits: [...fits.values()].sort(byLabel),
    genders: [...genders.values()].sort(byLabel),
    categories: [...categories.values()],
    priceRange: products.length > 0 ? [min, max] : [0, 0],
  }
}

export type FilterPill = {
  id: string
  label: string
  remove: (filters: ListingFilters) => ListingFilters
}

export function filterPills(filters: ListingFilters, facets: ListingFacets): FilterPill[] {
  const pills: FilterPill[] = []
  const facetLabels: Record<FilterKey, FacetOption[]> = {
    sizes: facets.sizes,
    colors: facets.colors,
    materials: facets.materials,
    fits: facets.fits,
    genders: facets.genders,
    categories: facets.categories,
  }

  for (const key of Object.keys(listParams) as FilterKey[]) {
    for (const value of filters[key]) {
      const label = facetLabels[key].find((option) => option.value === value)?.label ?? value
      pills.push({
        id: `${key}:${value}`,
        label: key === 'sizes' ? `Size ${label}` : label,
        remove: (current) => ({ ...current, [key]: current[key].filter((item) => item !== value) }),
      })
    }
  }

  if (filters.collection) {
    const label = collectionOptions.find((option) => option.value === filters.collection)?.label
    pills.push({
      id: `collection:${filters.collection}`,
      label: label ?? filters.collection,
      remove: (current) => ({ ...current, collection: null }),
    })
  }

  if (filters.price) {
    const [min, max] = filters.price
    pills.push({
      id: 'price',
      label: `${formatPrice(min)} to ${formatPrice(max)}`,
      remove: (current) => ({ ...current, price: null }),
    })
  }

  return pills
}

export function toggleValue(values: string[], value: string): string[] {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value]
}
