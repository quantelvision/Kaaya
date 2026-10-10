import { formatNumber, formatPrice } from '@/lib/format'
import type { OrderTotalsResult } from '@/lib/pricing/totals'

type OrderSummaryRowsProps = {
  totals: OrderTotalsResult
  showCodFee?: boolean
}

function Row({ label, value, emphasis }: { label: string; value: string; emphasis?: boolean }) {
  return (
    <div
      className={
        emphasis
          ? 'flex justify-between border-t border-line pt-3 text-base'
          : 'flex justify-between'
      }
    >
      <dt className={emphasis ? 'text-ink' : 'text-muted'}>{label}</dt>
      <dd className="text-ink tabular-nums">{value}</dd>
    </div>
  )
}

export function OrderSummaryRows({ totals, showCodFee = false }: OrderSummaryRowsProps) {
  return (
    <div className="flex flex-col gap-2">
      <dl className="flex flex-col gap-2 text-sm">
        <Row label="Subtotal" value={formatPrice(totals.subtotal)} />
        {totals.couponDiscount > 0 && totals.coupon && (
          <Row
            label={`Code ${totals.coupon.code}`}
            value={`-${formatPrice(totals.couponDiscount)}`}
          />
        )}
        {totals.pointsDiscount > 0 && (
          <Row
            label={`${formatNumber(totals.pointsRedeemed)} points`}
            value={`-${formatPrice(totals.pointsDiscount)}`}
          />
        )}
        <Row
          label="Shipping"
          value={totals.shipping === 0 ? 'Free' : formatPrice(totals.shipping)}
        />
        {showCodFee && totals.codFee > 0 && (
          <Row label="Cash on delivery fee" value={formatPrice(totals.codFee)} />
        )}
        <Row label="Total" value={formatPrice(totals.total)} emphasis />
      </dl>
      <p className="text-xs text-muted">
        Inclusive of all taxes
        {totals.pointsEarned > 0 && (
          <span className="tabular-nums">
            . You earn {formatNumber(totals.pointsEarned)} points.
          </span>
        )}
      </p>
    </div>
  )
}
