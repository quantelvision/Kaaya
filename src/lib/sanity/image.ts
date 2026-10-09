import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url'
import { dataset, projectId } from '@/sanity/env'

const builder = createImageUrlBuilder({ projectId, dataset })

export function urlForImage(source: SanityImageSource) {
  return builder.image(source).auto('format')
}

export function imageUrlWithAspect(source: SanityImageSource, width: number, height: number) {
  return urlForImage(source).width(width).height(height).fit('crop').url()
}
