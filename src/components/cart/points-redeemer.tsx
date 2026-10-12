'use client'

import { useId, useState } from 'react'
import { Button } from '@/components/ui/button'
import { controlClasses } from '@/components/ui/field'
import { cn } from '@/lib/cn'
import { formatNumber, formatPrice } from '@/lib/format'
import { pointsValue, type LoyaltyRules } from '@/lib/pricing/loyalty'
import { minimumBagForPoints } from '@/lib/pricing/settings'
import { useCartStore } from '@/stores/cart-store'

type PointsRedeemerProps = {
  balance: number
  redeemablePoints: number
  pointsRedeemed: number
  rules: LoyaltyRules
}

export function PointsRedeemer({
  balance,
  redeemablePoints,
  pointsRedeemed,
  rules,
}: PointsRedeemerProps) {
  const id = useId()
  const setPointsToUse = useCartStore((state) => state.setPointsToUse)
  const [draft, setDraft] = useState<string | null>(null)

  const min = rules.minRedeemPoints
  const max = redeemablePoints
  const isUsing = pointsRedeemed > 0
  const left = balance - pointsRedeemed
  const draftValue = draft === null ? null : Number(draft)
  const isDraftOutOfRange =
    draftValue !== null && (!Number.isInteger(draftValue) || draftValue < min || draftValue > max)

  const commitDraft = () => {
    if (draft === null) return
    const value = Number(draft)
    if (draft.trim() !== '' && Number.isFinite(value)) setPointsToUse(value)
    setDraft(null)
  }

  return (
    <section
      aria-labelledby={`${id}-title`}
      className="flex flex-col gap-3 rounded-card border border-line p-4"
    >
      <div className="flex items-baseline justify-between gap-3">
        <h3 id={`${id}-title`} className="text-sm font-medium text-ink">
          Kaaya points
        </h3>
        <p className="text-xs text-muted tabular-nums">
          {isUsing
            ? `${formatNumber(left)} pts left after this order`
            : `${formatNumber(balance)} pts available`}
        </p>
      </div>

      {max <= 0 ? (
        <p className="text-xs text-muted">
          {balance < min
            ? `You can use points from ${formatNumber(min)} points.`
            : `Points apply on bags of ${formatPrice(minimumBagForPoints(rules))} or more.`}
        </p>
      ) : !isUsing ? (
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-muted tabular-nums">
            Use {max > min ? `${formatNumber(min)} to ${formatNumber(max)}` : formatNumber(max)}{' '}
            points on this bag and save up to {formatPrice(pointsValue(max, rules))}.
          </p>
          <Button variant="secondary" size="sm" onClick={() => setPointsToUse(max)}>
            Use points
          </Button>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2">
            <label htmlFor={`${id}-amount`} className="sr-only">
              Points to use
            </label>
            <input
              id={`${id}-amount`}
              inputMode="numeric"
              autoComplete="off"
              value={draft ?? String(pointsRedeemed)}
              aria-invalid={isDraftOutOfRange || undefined}
              aria-describedby={`${id}-range`}
              onChange={(event) => setDraft(event.target.value.replace(/[^0-9]/g, ''))}
              onBlur={commitDraft}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault()
                  commitDraft()
                }
              }}
              className={cn(controlClasses, 'h-11 w-24 text-sm tabular-nums')}
            />
            <span className="text-xs text-muted">points</span>
            <div className="ml-auto flex items-center gap-1">
              {pointsRedeemed < max && (
                <Button variant="ghost" size="sm" onClick={() => setPointsToUse(max)}>
                  Max
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setDraft(null)
                  setPointsToUse(0)
                }}
              >
                Remove
              </Button>
            </div>
          </div>
          <p
            id={`${id}-range`}
            aria-live="polite"
            className={cn('text-xs tabular-nums', isDraftOutOfRange ? 'text-danger' : 'text-muted')}
          >
            {isDraftOutOfRange
              ? `Enter a number from ${formatNumber(min)} to ${formatNumber(max)}.`
              : `Saves ${formatPrice(pointsValue(pointsRedeemed, rules))}. You can use ${formatNumber(min)} to ${formatNumber(max)} points on this bag.`}
          </p>
        </>
      )}
    </section>
  )
}
