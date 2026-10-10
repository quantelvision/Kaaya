'use client'

import { useEffect, useRef, useState } from 'react'
import { ZoomableImage } from '@/components/product/zoomable-image'
import { SanityImage } from '@/components/ui/sanity-image'
import { cn } from '@/lib/cn'
import type { SanityImageData } from '@/lib/sanity/models'

const PORTRAIT = 4 / 5
const MAIN_SIZES = '(min-width: 768px) 55vw, 100vw'

type GalleryImage = SanityImageData & { _key: string }

type ProductGalleryProps = {
  images: GalleryImage[]
  alt: string
}

function MobileCarousel({ images, alt }: ProductGalleryProps) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) return
    const update = () => {
      const index = Math.round(scroller.scrollLeft / Math.max(1, scroller.clientWidth))
      setActiveIndex(Math.min(images.length - 1, Math.max(0, index)))
    }
    scroller.addEventListener('scroll', update, { passive: true })
    return () => scroller.removeEventListener('scroll', update)
  }, [images.length])

  return (
    <div className="md:hidden">
      <div
        ref={scrollerRef}
        role="region"
        aria-label="Product images"
        tabIndex={0}
        className="-mx-gutter scrollbar-none flex snap-x snap-mandatory overflow-x-auto"
      >
        {images.map((image, index) => (
          <div key={image._key} className="w-full shrink-0 snap-center px-gutter">
            <div className="relative aspect-portrait overflow-hidden rounded-card bg-surface">
              <SanityImage
                image={image}
                alt={`${alt}, image ${index + 1} of ${images.length}`}
                aspectRatio={PORTRAIT}
                sizes="100vw"
                isPriority={index === 0}
                className="mix-blend-multiply"
              />
            </div>
          </div>
        ))}
      </div>
      <div aria-hidden className="mt-4 h-px overflow-hidden bg-line">
        <div
          className="h-full bg-ink transition-transform duration-300 ease-out"
          style={{
            width: `${100 / images.length}%`,
            transform: `translateX(${activeIndex * 100}%)`,
          }}
        />
      </div>
    </div>
  )
}

function DesktopGallery({ images, alt }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeImage = images[activeIndex] ?? images[0]
  if (!activeImage) return null

  return (
    <div className="hidden gap-4 md:grid md:grid-cols-[5rem_1fr]">
      <ul className="flex flex-col gap-3" aria-label="Choose an image">
        {images.map((image, index) => (
          <li key={image._key}>
            <button
              type="button"
              aria-label={`Show image ${index + 1}`}
              aria-current={index === activeIndex}
              onClick={() => setActiveIndex(index)}
              className={cn(
                'relative block aspect-portrait w-full overflow-hidden rounded-control border bg-surface transition-colors',
                index === activeIndex ? 'border-ink' : 'border-transparent hover:border-line',
              )}
            >
              <SanityImage
                image={image}
                alt=""
                aspectRatio={PORTRAIT}
                sizes="80px"
                className="mix-blend-multiply"
              />
            </button>
          </li>
        ))}
      </ul>
      <ZoomableImage
        key={activeImage._key}
        image={activeImage}
        alt={alt}
        sizes={MAIN_SIZES}
        isPriority
      />
    </div>
  )
}

export function ProductGallery({ images, alt }: ProductGalleryProps) {
  const [firstImage] = images
  if (!firstImage) return null

  if (images.length === 1) {
    return <ZoomableImage image={firstImage} alt={alt} sizes={MAIN_SIZES} isPriority />
  }

  return (
    <>
      <MobileCarousel images={images} alt={alt} />
      <DesktopGallery images={images} alt={alt} />
    </>
  )
}
