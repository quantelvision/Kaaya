import type { ImageLoaderProps } from 'next/image'

const DEFAULT_QUALITY = 80

// the src already carries crop and hotspot params from the url builder, so only size and quality change
export function sanityImageLoader({ src, width, quality }: ImageLoaderProps): string {
  const url = new URL(src)
  const baseWidth = Number(url.searchParams.get('w'))
  const baseHeight = Number(url.searchParams.get('h'))

  url.searchParams.set('w', String(width))
  if (baseWidth > 0 && baseHeight > 0) {
    url.searchParams.set('h', String(Math.round((width * baseHeight) / baseWidth)))
  }
  url.searchParams.set('q', String(quality ?? DEFAULT_QUALITY))
  if (!url.searchParams.has('auto')) url.searchParams.set('auto', 'format')

  return url.toString()
}
