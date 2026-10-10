import { formatNumber, formatPrice } from '@/lib/format'
import type { OrderTotals as OrderTotalsData } from '@/lib/order'

function Row({ label, value, isTotal }: { label: string; value: string; isTotal?: boolean }) {
  return (
    <div
      className={
        isTotal
          ? 'flex justify-between border-t border-line pt-3 text-base'
          : 'flex justify-between'
      }
    >
      <dt className={isTotal ? 'text-ink' : 'text-muted'}>{label}</dt>
      <dd className="text-ink tabular-nums">{value}</dd>
    </div>
  )
}

export function OrderTotals({ totals }: { totals: OrderTotalsData }) {
  return (
    <dl className="flex flex-col gap-2 text-sm">
      <Row label="Subtotal" value={formatPrice(totals.subtotal)} />
      {totals.couponCode && totals.couponDiscount > 0 && (
        <Row label={`Code ${totals.couponCode}`} value={`-${formatPrice(totals.couponDiscount)}`} />
      )}
      {totals.pointsDiscount > 0 && (
        <Row
          label={`${formatNumber(totals.pointsRedeemed)} points`}
          value={`-${formatPrice(totals.pointsDiscount)}`}
        />
      )}
      <Row label="Shipping" value={totals.shipping === 0 ? 'Free' : formatPrice(totals.shipping)} />
      {totals.codFee > 0 && <Row label="Cash on delivery fee" value={formatPrice(totals.codFee)} />}
      <Row label="Total paid" value={formatPrice(totals.total)} isTotal />
    </dl>
  )
}
