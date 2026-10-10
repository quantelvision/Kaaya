'use client'

import Link from 'next/link'
import { CartLineItem } from '@/components/cart/cart-line-item'
import { CouponField } from '@/components/cart/coupon-field'
import { OrderSummaryRows } from '@/components/cart/order-summary-rows'
import { PointsToggle } from '@/components/cart/points-toggle'
import { useCartTotals } from '@/components/cart/use-cart-totals'
import { Button, buttonClasses } from '@/components/ui/button'
import { Price } from '@/components/ui/price'
import { SanityImage } from '@/components/ui/sanity-image'
import { Sheet } from '@/components/ui/sheet'
import { cartItemCount } from '@/lib/cart'
import { formatPrice } from '@/lib/format'
import type { StorePricing } from '@/lib/pricing/settings'
import { useCartStore } from '@/stores/cart-store'
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

export function CartDrawer({ storePricing }: { storePricing: StorePricing }) {
  const isOpen = useCartStore((state) => state.isOpen)
  const setOpen = useCartStore((state) => state.setOpen)
  const setQuantity = useCartStore((state) => state.setQuantity)
  const removeLine = useCartStore((state) => state.removeLine)
  const { totals, lines, balance } = useCartTotals(storePricing, null)

  const count = cartItemCount(lines)
  const close = () => setOpen(false)

  return (
    <Sheet
      open={isOpen}
      onOpenChange={setOpen}
      title="Your bag"
      description={count > 0 ? `${count} ${count === 1 ? 'piece' : 'pieces'}` : undefined}
      footer={
        lines.length > 0 ? (
          <div className="flex flex-col gap-4">
            <OrderSummaryRows totals={totals} />
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
          ? `${count} ${count === 1 ? 'piece' : 'pieces'} in your bag, total ${formatPrice(totals.total)}`
          : 'Your bag is empty'}
      </p>
      {lines.length === 0 ? (
        <EmptyBag onClose={close} />
      ) : (
        <div className="flex flex-col gap-6">
          <ul>
            {lines.map((line) => (
              <CartLineItem
                key={line.id}
                line={line}
                onQuantityChange={(quantity) => setQuantity(line.id, quantity)}
                onRemove={() => removeLine(line.id)}
                onNavigate={close}
              />
            ))}
          </ul>
          <div className="flex flex-col gap-4 border-t border-line pt-5">
            <CouponField subtotal={totals.subtotal} applied={totals.coupon} />
            {storePricing.loyalty && (
              <PointsToggle
                balance={balance}
                redeemablePoints={totals.redeemablePoints}
                pointsDiscount={totals.pointsDiscount}
                rules={storePricing.loyalty}
              />
            )}
          </div>
        </div>
      )}
    </Sheet>
  )
}
