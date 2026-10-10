'use client'

import Image from 'next/image'
import { cn } from '@/lib/cn'
import type { SanityImageData } from '@/lib/sanity/models'
import { urlForImage } from '@/lib/sanity/image'
import { sanityImageLoader } from '@/lib/sanity/image-loader'

const BASE_WIDTH = 1200

type SanityImageProps = {
  image: SanityImageData
  alt: string
  aspectRatio: number
  sizes: string
  isPriority?: boolean
  className?: string
}

export function SanityImage({
  image,
  alt,
  aspectRatio,
  sizes,
  isPriority = false,
  className,
}: SanityImageProps) {
  if (!image.asset) return null

  const src = urlForImage(image)
    .width(BASE_WIDTH)
    .height(Math.round(BASE_WIDTH / aspectRatio))
    .fit('crop')
    .url()

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      loader={sanityImageLoader}
      loading={isPriority ? 'eager' : 'lazy'}
      fetchPriority={isPriority ? 'high' : 'auto'}
      placeholder={image.lqip ? 'blur' : 'empty'}
      blurDataURL={image.lqip ?? undefined}
      className={cn('object-cover', className)}
    />
  )
}
