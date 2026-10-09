import { describe, expect, it } from 'vitest'
import { sanityImageLoader } from '@/lib/sanity/image-loader'

const base = 'https://cdn.sanity.io/images/abc123/production/hash-1600x2000.png'

describe('sanityImageLoader', () => {
  it('sets width, quality and auto format', () => {
    const url = new URL(sanityImageLoader({ src: base, width: 640 }))
    expect(url.searchParams.get('w')).toBe('640')
    expect(url.searchParams.get('q')).toBe('80')
    expect(url.searchParams.get('auto')).toBe('format')
  })

  it('keeps the aspect ratio of a cropped source', () => {
    const src = `${base}?rect=0,0,1600,2000&w=800&h=1000&fit=crop&auto=format`
    const url = new URL(sanityImageLoader({ src, width: 384, quality: 70 }))
    expect(url.searchParams.get('w')).toBe('384')
    expect(url.searchParams.get('h')).toBe('480')
    expect(url.searchParams.get('rect')).toBe('0,0,1600,2000')
    expect(url.searchParams.get('q')).toBe('70')
  })
})
