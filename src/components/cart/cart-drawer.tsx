'use client'

import Link from 'next/link'
import { CartLineItem } from '@/components/cart/cart-line-item'
import { Button, buttonClasses } from '@/components/ui/button'
import { Price } from '@/components/ui/price'
import { SanityImage } from '@/components/ui/sanity-image'
import { Sheet } from '@/components/ui/sheet'
import { cartItemCount, cartSubtotal } from '@/lib/cart'
import { formatPrice } from '@/lib/format'
import { shippingFor, type ShippingSettings } from '@/lib/pricing/shipping'
import { useCartStore } from '@/stores/cart-store'
import { useHasHydrated } from '@/stores/hydration-store'
import { useRecentlyViewedStore } from '@/stores/recently-viewed-store'

const PORTRAIT = 4 / 5
const EMPTY_STATE_PRODUCTS = 4

function EmptyBag({ onClose }: { onClose: () => void }) {
  const recentlyViewed = useRecentlyViewedStore((state) => state.items)

  return (
    <div className="flex flex-col gap-8 pt-4">
      <div className="flex flex-col gap-2">
        <p className="heading-display text-2xl text-ink">Your bag is empty</p>
        <p className="text-sm text-muted">Pieces you add will wait here for this visit.</p>
      </div>
      <Link
        href="/shop?collection=best-sellers"
        onNavigate={onClose}
        className={buttonClasses({ className: 'self-start' })}
      >
        See best sellers
      </Link>
      {recentlyViewed.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="label-caps text-muted">Recently viewed</p>
          <ul className="grid grid-cols-2 gap-4">
            {recentlyViewed.slice(0, EMPTY_STATE_PRODUCTS).map((product) => {
              const image = product.variants[0]?.images[0]
              return (
                <li key={product._id}>
                  <Link
                    href={`/product/${product.slug}`}
                    onNavigate={onClose}
                    className="flex flex-col gap-2"
                  >
                    <span className="relative block aspect-portrait overflow-hidden rounded-control bg-surface">
                      {image && (
                        <SanityImage
                          image={image}
                          alt={product.title}
                          aspectRatio={PORTRAIT}
                          sizes="160px"
                          className="mix-blend-multiply"
                        />
                      )}
                    </span>
                    <span className="text-xs text-ink">{product.title}</span>
                    <Price price={product.price} salePrice={product.salePrice} size="sm" />
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}

export function CartDrawer({ shippingSettings }: { shippingSettings: ShippingSettings | null }) {
  const hasHydrated = useHasHydrated()
  const isOpen = useCartStore((state) => state.isOpen)
  const lines = useCartStore((state) => state.lines)
  const setOpen = useCartStore((state) => state.setOpen)
  const setQuantity = useCartStore((state) => state.setQuantity)
  const removeLine = useCartStore((state) => state.removeLine)

  const visibleLines = hasHydrated ? lines : []
  const count = cartItemCount(visibleLines)
  const subtotal = cartSubtotal(visibleLines)
  const shipping = shippingSettings ? shippingFor(subtotal, shippingSettings) : null
  const close = () => setOpen(false)

  return (
    <Sheet
      open={isOpen}
      onOpenChange={setOpen}
      title="Your bag"
      description={count > 0 ? `${count} ${count === 1 ? 'piece' : 'pieces'}` : undefined}
      footer={
        visibleLines.length > 0 ? (
          <div className="flex flex-col gap-4">
            <dl className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">Subtotal</dt>
                <dd className="text-ink tabular-nums">{formatPrice(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Shipping</dt>
                <dd className="text-ink tabular-nums">
                  {shipping === null
                    ? 'At checkout'
                    : shipping === 0
                      ? 'Free'
                      : formatPrice(shipping)}
                </dd>
              </div>
              <div className="flex justify-between border-t border-line pt-3 text-base">
                <dt className="text-ink">Total</dt>
                <dd className="text-ink tabular-nums">{formatPrice(subtotal + (shipping ?? 0))}</dd>
              </div>
            </dl>
            <p className="-mt-2 text-xs text-muted">Inclusive of all taxes</p>
            <div className="flex flex-col gap-2">
              <Link
                href="/checkout"
                onNavigate={close}
                className={buttonClasses({ size: 'lg', isFullWidth: true })}
              >
                Checkout
              </Link>
              <Button variant="ghost" isFullWidth onClick={close}>
                Continue shopping
              </Button>
            </div>
          </div>
        ) : undefined
      }
    >
      <p aria-live="polite" className="sr-only">
        {count > 0
          ? `${count} ${count === 1 ? 'piece' : 'pieces'} in your bag`
          : 'Your bag is empty'}
      </p>
      {visibleLines.length === 0 ? (
        <EmptyBag onClose={close} />
      ) : (
        <ul>
          {visibleLines.map((line) => (
            <CartLineItem
              key={line.id}
              line={line}
              onQuantityChange={(quantity) => setQuantity(line.id, quantity)}
              onRemove={() => removeLine(line.id)}
              onNavigate={close}
            />
          ))}
        </ul>
      )}
    </Sheet>
  )
}
