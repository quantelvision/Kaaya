'use client'

import { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Price } from '@/components/ui/price'
import { SanityImage } from '@/components/ui/sanity-image'
import { cn } from '@/lib/cn'
import type { SanityImageData } from '@/lib/sanity/models'

const PORTRAIT = 4 / 5
const FLOATING_OFFSET_PROPERTY = '--k-floating-offset'

type StickyAddBarProps = {
  isVisible: boolean
  image: SanityImageData | undefined
  title: string
  price: number
  salePrice: number | null
  selectedSize: string | null
  onAdd: () => void
}

export function StickyAddBar({
  isVisible,
  image,
  title,
  price,
  salePrice,
  selectedSize,
  onAdd,
}: StickyAddBarProps) {
  const barRef = useRef<HTMLDivElement>(null)

  // the credit pill and customizer button read this offset to sit above the bar
  useEffect(() => {
    const root = document.documentElement
    const height = barRef.current?.offsetHeight ?? 0
    root.style.setProperty(FLOATING_OFFSET_PROPERTY, isVisible ? `${height}px` : '0px')
    return () => {
      root.style.setProperty(FLOATING_OFFSET_PROPERTY, '0px')
    }
  }, [isVisible])

  return (
    <div
      ref={barRef}
      aria-hidden={!isVisible}
      inert={!isVisible}
      className={cn(
        'fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface pb-[env(safe-area-inset-bottom)] shadow-sheet transition-transform duration-300 ease-out motion-reduce:transition-none',
        isVisible ? 'translate-y-0' : 'translate-y-full',
      )}
    >
      <div className="mx-auto flex max-w-page items-center gap-3 gutter-x py-3">
        {image && (
          <div className="relative aspect-portrait w-11 shrink-0 overflow-hidden rounded-control bg-surface">
            <SanityImage
              image={image}
              alt=""
              aspectRatio={PORTRAIT}
              sizes="44px"
              className="mix-blend-multiply"
            />
          </div>
        )}
        <div className="flex min-w-0 flex-1 flex-col">
          <p className="truncate text-sm text-ink">{title}</p>
          <div className="flex items-center gap-2 text-xs text-muted">
            <Price price={price} salePrice={salePrice} size="sm" />
            <span aria-hidden className="hidden sm:inline">
              |
            </span>
            <span className="hidden sm:inline">
              {selectedSize ? `Size ${selectedSize}` : 'Select a size'}
            </span>
          </div>
        </div>
        <Button onClick={onAdd} className="shrink-0">
          Add to bag
        </Button>
      </div>
    </div>
  )
}
