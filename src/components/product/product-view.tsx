'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Countdown } from '@/components/home/countdown'
import { ColorSwatches } from '@/components/product/color-swatches'
import { ProductGallery } from '@/components/product/product-gallery'
import { SizePicker } from '@/components/product/size-picker'
import { StickyAddBar } from '@/components/product/sticky-add-bar'
import { WishlistButton } from '@/components/product/wishlist-button'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Price } from '@/components/ui/price'
import { useMediaQuery } from '@/hooks/use-media-query'
import type { CountdownSource } from '@/lib/festive-countdown'
import { stockForSize } from '@/lib/product'
import type { ProductDetailData } from '@/lib/sanity/models'

type ProductViewProps = {
  product: ProductDetailData
  lowStockThreshold: number
  festiveSale: (CountdownSource & { title: string }) | null
  details: ReactNode
}

export function ProductView({
  product,
  lowStockThreshold,
  festiveSale,
  details,
}: ProductViewProps) {
  const [variantKey, setVariantKey] = useState(product.variants[0]?._key ?? '')
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [sizeError, setSizeError] = useState<string | null>(null)
  const [isStickyVisible, setIsStickyVisible] = useState(false)
  const mainButtonRef = useRef<HTMLButtonElement>(null)
  const sizePickerRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

  const variant = product.variants.find((entry) => entry._key === variantKey) ?? product.variants[0]
  const gallery = product.variantGalleries.find((entry) => entry.colorSlug === variant?.colorSlug)
  const galleryImages =
    gallery?.images ??
    (variant?.images ?? []).map((image, index) => ({ ...image, _key: `${variantKey}-${index}` }))
  const sizes = variant?.sizes ?? []
  const selectedStock = stockForSize(sizes, selectedSize)
  const isLowStock =
    selectedSize !== null && selectedStock > 0 && selectedStock <= lowStockThreshold
  const altText = variant ? `${product.title} in ${variant.colorName}` : product.title

  useEffect(() => {
    const button = mainButtonRef.current
    if (!button) return
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry) return
      setIsStickyVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0)
    })
    observer.observe(button)
    return () => observer.disconnect()
  }, [])

  const selectVariant = (key: string) => {
    const nextVariant = product.variants.find((entry) => entry._key === key)
    setVariantKey(key)
    if (selectedSize && stockForSize(nextVariant?.sizes ?? [], selectedSize) === 0) {
      setSelectedSize(null)
    }
  }

  const handleAdd = () => {
    if (!selectedSize) {
      setSizeError('Select a size to add this piece to your bag.')
      sizePickerRef.current?.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'center',
      })
      sizePickerRef.current?.focus({ preventScroll: true })
      return
    }
    setSizeError(null)
  }

  return (
    <>
      <div className="grid gap-8 md:grid-cols-12 md:gap-12">
        <div className="md:col-span-7">
          <ProductGallery images={galleryImages} alt={altText} />
        </div>

        <div className="flex flex-col gap-6 self-start md:sticky md:top-24 md:col-span-5">
          <div className="flex flex-col gap-3">
            {product.badges && product.badges.length > 0 && (
              <ul className="flex flex-wrap gap-x-4 gap-y-1 label-caps text-muted">
                {product.badges.map((badge) => (
                  <li key={badge}>{badge}</li>
                ))}
              </ul>
            )}
            <h1 className="heading-display text-3xl text-ink md:text-4xl">{product.title}</h1>
            <div className="flex flex-col gap-1">
              <Price price={product.price} salePrice={product.salePrice} size="lg" showPercentOff />
              <p className="text-xs text-muted">Inclusive of all taxes</p>
            </div>
            {festiveSale && (
              <p className="text-xs text-ink">
                <span className="font-medium">{festiveSale.title}</span> ends in{' '}
                <Countdown sale={festiveSale} variant="inline" />
              </p>
            )}
            {product.limitedRun && (
              <Badge tone="limited" className="self-start">
                Limited run: {product.limitedRun} units
              </Badge>
            )}
          </div>

          <ColorSwatches
            variants={product.variants}
            selectedKey={variantKey}
            onSelect={selectVariant}
          />

          <div className="flex flex-col gap-2">
            <SizePicker
              ref={sizePickerRef}
              sizes={sizes}
              selectedSize={selectedSize}
              error={sizeError}
              onSelect={(size) => {
                setSelectedSize(size)
                setSizeError(null)
              }}
            />
            <p aria-live="polite" className="min-h-5 text-xs text-danger">
              {isLowStock ? `Only ${selectedStock} left` : ''}
            </p>
            {product.fitNote && <p className="text-xs text-muted">{product.fitNote}</p>}
          </div>

          <div className="flex items-center gap-2">
            <Button ref={mainButtonRef} size="lg" isFullWidth onClick={handleAdd}>
              Add to bag
            </Button>
            <WishlistButton
              productTitle={product.title}
              className="size-14 shrink-0 rounded-btn border border-line"
            />
          </div>

          {details}
        </div>
      </div>

      <StickyAddBar
        isVisible={isStickyVisible}
        image={variant?.images[0]}
        title={product.title}
        price={product.price}
        salePrice={product.salePrice}
        selectedSize={selectedSize}
        onAdd={handleAdd}
      />
    </>
  )
}
