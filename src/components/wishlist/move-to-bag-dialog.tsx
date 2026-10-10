'use client'

import { useState } from 'react'
import { ColorSwatches } from '@/components/product/color-swatches'
import { SizePicker } from '@/components/product/size-picker'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { Price } from '@/components/ui/price'
import { effectivePrice, isOnSale, stockForSize } from '@/lib/product'
import type { ProductCardData } from '@/lib/sanity/models'
import { useCartStore } from '@/stores/cart-store'
import { useWishlistStore } from '@/stores/wishlist-store'

type MoveToBagDialogProps = {
  product: ProductCardData | null
  onOpenChange: (open: boolean) => void
}

function MoveToBagForm({ product, onDone }: { product: ProductCardData; onDone: () => void }) {
  const [variantKey, setVariantKey] = useState(product.variants[0]?._key ?? '')
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const addLine = useCartStore((state) => state.addLine)
  const setCartOpen = useCartStore((state) => state.setOpen)
  const removeFromWishlist = useWishlistStore((state) => state.remove)

  const variant = product.variants.find((entry) => entry._key === variantKey) ?? product.variants[0]
  const sizes = variant?.sizes ?? []

  const moveToBag = () => {
    if (!variant || !selectedSize) {
      setError('Select a size to move this piece to your bag.')
      return
    }
    const status = addLine({
      productId: product._id,
      slug: product.slug,
      title: product.title,
      colorName: variant.colorName,
      colorSlug: variant.colorSlug,
      size: selectedSize,
      unitPrice: effectivePrice(product),
      compareAtPrice: isOnSale(product) ? product.price : null,
      image: variant.images[0] ?? null,
      stock: stockForSize(sizes, selectedSize),
    })
    if (status === 'unavailable') {
      setError('This size is sold out.')
      return
    }
    removeFromWishlist(product._id)
    onDone()
    setCartOpen(true)
  }

  return (
    <div className="flex flex-col gap-5">
      <Price price={product.price} salePrice={product.salePrice} size="md" />
      <ColorSwatches
        variants={product.variants}
        selectedKey={variantKey}
        onSelect={(key) => {
          setVariantKey(key)
          setSelectedSize(null)
        }}
      />
      <SizePicker
        sizes={sizes}
        selectedSize={selectedSize}
        error={error}
        onSelect={(size) => {
          setSelectedSize(size)
          setError(null)
        }}
      />
      <Button size="lg" isFullWidth onClick={moveToBag}>
        Move to bag
      </Button>
    </div>
  )
}

export function MoveToBagDialog({ product, onOpenChange }: MoveToBagDialogProps) {
  return (
    <Dialog
      open={product !== null}
      onOpenChange={onOpenChange}
      title={product ? product.title : 'Move to bag'}
      description="Choose a size to move this piece to your bag."
    >
      {product && (
        <MoveToBagForm key={product._id} product={product} onDone={() => onOpenChange(false)} />
      )}
    </Dialog>
  )
}
