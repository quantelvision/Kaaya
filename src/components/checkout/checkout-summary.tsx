'use client'

import { CaretDown } from '@phosphor-icons/react/ssr'
import { useId, useState } from 'react'
import { CouponField } from '@/components/cart/coupon-field'
import { OrderSummaryRows } from '@/components/cart/order-summary-rows'
import { PointsToggle } from '@/components/cart/points-toggle'
import { SanityImage } from '@/components/ui/sanity-image'
import type { CartLine } from '@/lib/cart'
import { cn } from '@/lib/cn'
import { formatPrice } from '@/lib/format'
import type { StorePricing } from '@/lib/pricing/settings'
import type { OrderTotalsResult } from '@/lib/pricing/totals'

const PORTRAIT = 4 / 5

type CheckoutSummaryProps = {
  lines: CartLine[]
  totals: OrderTotalsResult
  balance: number
  storePricing: StorePricing
}

export function CheckoutSummary({ lines, totals, balance, storePricing }: CheckoutSummaryProps) {
  const [isOpen, setIsOpen] = useState(false)
  const regionId = useId()

  return (
    <div className="rounded-card border border-line bg-surface">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={regionId}
        onClick={() => setIsOpen((value) => !value)}
        className="flex min-h-tap w-full items-center justify-between gap-4 px-5 py-4 text-left md:pointer-events-none"
      >
        <span className="heading-display text-xl text-ink">Order summary</span>
        <span className="flex items-center gap-2 text-sm text-ink tabular-nums">
          {formatPrice(totals.total)}
          <CaretDown
            weight="light"
            aria-hidden
            className={cn('size-4 transition-transform md:hidden', isOpen && 'rotate-180')}
          />
        </span>
      </button>
      <div
        id={regionId}
        className={cn(
          'flex-col gap-5 border-t border-line px-5 py-5 md:flex',
          isOpen ? 'flex' : 'hidden',
        )}
      >
        <ul className="flex flex-col gap-4">
          {lines.map((line) => (
            <li key={line.id} className="flex gap-3">
              <div className="relative aspect-portrait w-14 shrink-0 overflow-hidden rounded-control bg-surface">
                {line.image && (
                  <SanityImage
                    image={line.image}
                    alt=""
                    aspectRatio={PORTRAIT}
                    sizes="56px"
                    className="mix-blend-multiply"
                  />
                )}
                <span className="absolute -top-1 -right-1 inline-flex size-5 items-center justify-center rounded-full bg-ink text-2xs text-canvas tabular-nums">
                  {line.quantity}
                </span>
              </div>
              <div className="flex min-w-0 flex-1 justify-between gap-3">
                <div className="flex min-w-0 flex-col">
                  <span className="truncate text-sm text-ink">{line.title}</span>
                  <span className="text-xs text-muted">
                    {line.colorName}, size {line.size}
                  </span>
                </div>
                <span className="text-sm text-ink tabular-nums">
                  {formatPrice(line.unitPrice * line.quantity)}
                </span>
              </div>
            </li>
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
        <div className="border-t border-line pt-5">
          <OrderSummaryRows totals={totals} showCodFee />
        </div>
      </div>
    </div>
  )
}
