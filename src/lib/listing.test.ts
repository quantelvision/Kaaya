import { describe, expect, it } from 'vitest'
import {
  applyFilters,
  buildFacets,
  emptyFilters,
  filterPills,
  parseListingState,
  serializeListingState,
  sortProducts,
  toggleValue,
  type ListingProduct,
} from '@/lib/listing'

function product(overrides: Partial<ListingProduct> & { _id: string }): ListingProduct {
  return {
    _createdAt: '2026-10-10T08:00:00Z',
    price: 1999,
    salePrice: null,
    material: 'Cotton',
    fit: 'Regular',
    gender: 'unisex',
    featuredOrder: 1,
    flags: null,
    category: { title: 'Tops', slug: 'tops' },
    variants: [
      {
        colorName: 'Jet Black',
        colorSlug: 'jet-black',
        hex: '#1B1B1B',
        sizes: [
          { size: 'S', stock: 4 },
          { size: 'M', stock: 0 },
        ],
      },
    ],
    ...overrides,
  }
}

const hoodie = product({
  _id: 'hoodie',
  price: 2199,
  fit: 'Oversized',
  category: { title: 'Outerwear', slug: 'outerwear' },
  flags: { isNewIn: true },
})
const slip = product({
  _id: 'slip',
  price: 2499,
  salePrice: 1999,
  material: 'Satin',
  gender: 'women',
  category: { title: 'Dresses and Sets', slug: 'dresses-and-sets' },
  variants: [
    {
      colorName: 'Garnet',
      colorSlug: 'garnet',
      hex: '#901A28',
      sizes: [
        { size: 'S', stock: 0 },
        { size: 'M', stock: 6 },
      ],
    },
  ],
  flags: { isBestSeller: true },
})
const tee = product({ _id: 'tee', price: 999, featuredOrder: 3 })
const products = [hoodie, slip, tee]

describe('parseListingState and serializeListingState', () => {
  it('reads filters, sort and view from the url', () => {
    const state = parseListingState(
      new URLSearchParams('size=S,M&color=garnet&price=900-2500&sort=price-asc&view=editorial'),
    )
    expect(state.filters.sizes).toEqual(['S', 'M'])
    expect(state.filters.colors).toEqual(['garnet'])
    expect(state.filters.price).toEqual([900, 2500])
    expect(state.sort).toBe('price-asc')
    expect(state.density).toBe('editorial')
  })

  it('falls back to defaults for unknown values', () => {
    const state = parseListingState(new URLSearchParams('sort=random&price=abc&collection=nope'))
    expect(state.sort).toBe('featured')
    expect(state.filters.price).toBeNull()
    expect(state.filters.collection).toBeNull()
    expect(state.density).toBe('grid')
  })

  it('round trips and leaves defaults out of the url', () => {
    const query = 'size=S&material=Polyester+blend&collection=best-sellers&sort=newest'
    const state = parseListingState(new URLSearchParams(query))
    expect(serializeListingState(state)).toBe(query)
    expect(
      serializeListingState({ filters: emptyFilters, sort: 'featured', density: 'grid' }),
    ).toBe('')
  })
})

describe('applyFilters', () => {
  it('matches a size only when it is in stock', () => {
    expect(applyFilters(products, { ...emptyFilters, sizes: ['M'] }).map((p) => p._id)).toEqual([
      'slip',
    ])
  })

  it('combines facets with and, values inside a facet with or', () => {
    const filtered = applyFilters(products, {
      ...emptyFilters,
      colors: ['jet-black', 'garnet'],
      materials: ['Cotton'],
    })
    expect(filtered.map((p) => p._id)).toEqual(['hoodie', 'tee'])
  })

  it('filters price on the sale price', () => {
    const filtered = applyFilters(products, { ...emptyFilters, price: [1500, 2000] })
    expect(filtered.map((p) => p._id)).toEqual(['slip'])
  })

  it('filters by collection flag', () => {
    expect(
      applyFilters(products, { ...emptyFilters, collection: 'new-in' }).map((p) => p._id),
    ).toEqual(['hoodie'])
  })
})

describe('sortProducts', () => {
  it('keeps the incoming order for featured', () => {
    expect(sortProducts(products, 'featured').map((p) => p._id)).toEqual(['hoodie', 'slip', 'tee'])
  })

  it('sorts by the price a shopper pays', () => {
    expect(sortProducts(products, 'price-asc').map((p) => p._id)).toEqual(['tee', 'slip', 'hoodie'])
    expect(sortProducts(products, 'price-desc').map((p) => p._id)).toEqual([
      'hoodie',
      'slip',
      'tee',
    ])
  })

  it('puts new in pieces first for newest', () => {
    expect(sortProducts([tee, slip, hoodie], 'newest')[0]?._id).toBe('hoodie')
  })
})

describe('buildFacets and filterPills', () => {
  it('counts facet values and finds the price range', () => {
    const facets = buildFacets(products)
    expect(facets.sizes.map((s) => s.value)).toEqual(['S', 'M'])
    expect(facets.colors.find((c) => c.value === 'jet-black')?.count).toBe(2)
    expect(facets.priceRange).toEqual([999, 2199])
  })

  it('builds removable pills', () => {
    const filters = {
      ...emptyFilters,
      sizes: ['S'],
      colors: ['garnet'],
      price: [999, 1999] as [number, number],
    }
    const pills = filterPills(filters, buildFacets(products))
    expect(pills.map((pill) => pill.label)).toEqual(['Size S', 'Garnet', '₹999 to ₹1,999'])
    const withoutColor = pills[1]?.remove(filters)
    expect(withoutColor?.colors).toEqual([])
    expect(withoutColor?.sizes).toEqual(['S'])
  })
})

describe('toggleValue', () => {
  it('adds and removes a value', () => {
    expect(toggleValue(['S'], 'M')).toEqual(['S', 'M'])
    expect(toggleValue(['S', 'M'], 'S')).toEqual(['M'])
  })
})
