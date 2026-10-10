'use client'

import { useState, type MouseEvent } from 'react'
import { SanityImage } from '@/components/ui/sanity-image'
import { cn } from '@/lib/cn'
import type { SanityImageData } from '@/lib/sanity/models'

const ZOOM_SCALE = 2
const PORTRAIT = 4 / 5

type ZoomableImageProps = {
  image: SanityImageData
  alt: string
  sizes: string
  isPriority?: boolean
}

export function ZoomableImage({ image, alt, sizes, isPriority = false }: ZoomableImageProps) {
  const [isZoomed, setIsZoomed] = useState(false)
  const [origin, setOrigin] = useState('50% 50%')

  const updateOrigin = (event: MouseEvent<HTMLButtonElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - bounds.left) / bounds.width) * 100
    const y = ((event.clientY - bounds.top) / bounds.height) * 100
    setOrigin(`${x}% ${y}%`)
  }

  return (
    <button
      type="button"
      aria-label={isZoomed ? 'Zoom out' : 'Zoom in'}
      aria-pressed={isZoomed}
      onClick={(event) => {
        updateOrigin(event)
        setIsZoomed((value) => !value)
      }}
      onPointerMove={(event) => {
        if (isZoomed) updateOrigin(event)
      }}
      onPointerLeave={() => setIsZoomed(false)}
      className={cn(
        'relative block aspect-portrait w-full overflow-hidden rounded-card bg-surface',
        isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in',
      )}
    >
      <span
        className="absolute inset-0 block transition-transform duration-300 ease-out motion-reduce:transition-none"
        style={{ transform: `scale(${isZoomed ? ZOOM_SCALE : 1})`, transformOrigin: origin }}
      >
        <SanityImage
          image={image}
          alt={alt}
          aspectRatio={PORTRAIT}
          sizes={sizes}
          isPriority={isPriority}
          className="mix-blend-multiply"
        />
      </span>
    </button>
  )
}
