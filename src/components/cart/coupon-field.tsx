'use client'

import { useId, useState, useTransition, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { controlClasses } from '@/components/ui/field'
import { cn } from '@/lib/cn'
import { lookupCoupon } from '@/lib/coupon-actions'
import { couponEligibility, couponMessage, normalizeCouponCode } from '@/lib/pricing/coupons'
import type { CouponResult } from '@/lib/pricing/totals'
import { useCartStore } from '@/stores/cart-store'
import { useOrdersStore } from '@/stores/orders-store'

type CouponFieldProps = {
  subtotal: number
  applied: CouponResult | null
}

export function CouponField({ subtotal, applied }: CouponFieldProps) {
  const messageId = useId()
  const [code, setCode] = useState('')
  const [rejection, setRejection] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const setCoupon = useCartStore((state) => state.setCoupon)
  const removeCoupon = useCartStore((state) => state.removeCoupon)
  const hasPlacedOrder = useOrdersStore((state) => state.orders.length > 0)

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const normalized = normalizeCouponCode(code)
    if (!normalized) return
    startTransition(async () => {
      const coupon = await lookupCoupon(normalized)
      const eligibility = couponEligibility(coupon, {
        subtotal,
        hasPlacedOrder,
        now: Date.now(),
      })
      // codes that can still apply as the bag grows are kept, the rest only show their message
      if (coupon && (eligibility.status === 'eligible' || eligibility.status === 'belowMinimum')) {
        setCoupon(coupon.code, coupon)
        setRejection(null)
        setCode('')
      } else {
        setRejection(couponMessage(eligibility, normalized, 0))
      }
    })
  }

  const message = rejection ?? applied?.message ?? null
  const isApplied = applied?.isApplied ?? false

  return (
    <div className="flex flex-col gap-2">
      <form onSubmit={submit} className="flex items-end gap-2">
        <label className="flex min-w-0 flex-1 flex-col gap-1.5">
          <span className="text-xs font-medium text-ink">Discount code</span>
          <input
            value={code}
            onChange={(event) => {
              setCode(event.target.value)
              setRejection(null)
            }}
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            placeholder="For example KAAYA10"
            aria-describedby={messageId}
            className={cn(controlClasses, 'uppercase placeholder:normal-case')}
          />
        </label>
        <Button type="submit" variant="secondary" isLoading={isPending} disabled={!code.trim()}>
          Apply
        </Button>
      </form>
      <div
        aria-live="polite"
        id={messageId}
        className="flex min-h-5 items-start justify-between gap-3"
      >
        {message && (
          <p
            className={cn(
              'text-xs',
              rejection ? 'text-danger' : isApplied ? 'text-ink' : 'text-muted',
            )}
          >
            {message}
          </p>
        )}
        {applied && !rejection && (
          <button
            type="button"
            onClick={removeCoupon}
            className="shrink-0 text-xs text-muted underline underline-offset-4 hover:text-ink"
          >
            Remove {applied.code}
          </button>
        )}
      </div>
    </div>
  )
}
