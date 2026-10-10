'use client'

import Link from 'next/link'
import { useEffect, type ReactNode } from 'react'
import { OrderTotals } from '@/components/order/order-totals'
import { TrackingTimeline } from '@/components/order/tracking-timeline'
import { Button, buttonClasses } from '@/components/ui/button'
import { SanityImage } from '@/components/ui/sanity-image'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDate, formatNumber, formatPrice, formatShortDate } from '@/lib/format'
import { paymentMethodLabels } from '@/lib/payment'
import { DELIVERED_INDEX, nextStatusIndex, pickupWindows, trackingSteps } from '@/lib/tracking'
import { useHasHydrated } from '@/stores/hydration-store'
import { useOrdersStore } from '@/stores/orders-store'
import { useQuantelStore } from '@/stores/quantel-store'

const PORTRAIT = 4 / 5
const GATE_DELAY_MS = 3000

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4 border-t border-line pt-6">
      <h2 className="label-caps text-muted">{title}</h2>
      {children}
    </section>
  )
}

export function OrderView({ orderId }: { orderId: string }) {
  const hasHydrated = useHasHydrated()
  const order = useOrdersStore((state) => state.orders.find((entry) => entry.id === orderId))
  const updateOrder = useOrdersStore((state) => state.updateOrder)
  const openGate = useQuantelStore((state) => state.openGate)
  const shouldShowGate = Boolean(order && !order.hasSeenGate)

  // the gate opens once per order, three seconds after the confirmation loads
  useEffect(() => {
    if (!shouldShowGate) return
    const timer = window.setTimeout(() => {
      updateOrder(orderId, (current) => ({ ...current, hasSeenGate: true }))
      openGate(orderId)
    }, GATE_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [shouldShowGate, orderId, openGate, updateOrder])

  if (!hasHydrated) {
    return (
      <div aria-hidden className="mx-auto flex max-w-page flex-col gap-6 gutter-x pt-8 md:pt-12">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-12 w-72" />
        <Skeleton className="h-72 w-full" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="mx-auto flex max-w-page flex-col items-start gap-5 gutter-x py-section">
        <h1 className="heading-display text-3xl text-ink md:text-4xl">
          We cannot find this order on this device
        </h1>
        <p className="max-w-prose text-base text-muted">
          Demo orders live only in the browser tab where they were placed. Place a new order to see
          tracking and returns.
        </p>
        <Link href="/" className={buttonClasses()}>
          Go to the home page
        </Link>
      </div>
    )
  }

  const steps = trackingSteps(order.createdAt, order.statusIndex)
  const isDelivered = order.statusIndex >= DELIVERED_INDEX
  const firstName = order.contact.name.split(' ')[0] ?? order.contact.name
  const latestReturn = order.returns[0]

  return (
    <div className="mx-auto max-w-page gutter-x pt-8 md:pt-12">
      <header className="mb-10 flex flex-col gap-3">
        <p className="label-caps text-muted tabular-nums">
          Order {order.id}, placed {formatDate(order.createdAt)}
        </p>
        <h1 className="heading-display text-4xl text-ink md:text-5xl">Thank you, {firstName}</h1>
        <p className="max-w-prose text-base text-muted">
          Your order is confirmed. Updates go to {order.contact.email}.
        </p>
      </header>

      <div className="grid gap-12 md:grid-cols-12">
        <div className="flex flex-col gap-8 md:col-span-7">
          <section aria-labelledby="tracking-heading" className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 id="tracking-heading" className="heading-display text-2xl text-ink">
                Tracking
              </h2>
              <Button
                variant="ghost"
                size="sm"
                disabled={isDelivered}
                onClick={() =>
                  updateOrder(order.id, (current) => ({
                    ...current,
                    statusIndex: nextStatusIndex(current.statusIndex),
                  }))
                }
              >
                Advance status (demo)
              </Button>
            </div>
            <div aria-live="polite">
              <TrackingTimeline steps={steps} />
            </div>
          </section>

          {latestReturn && (
            <section className="flex flex-col gap-2 rounded-card bg-wash p-5">
              <p className="label-caps text-primary">Return {latestReturn.id}</p>
              <p className="text-sm text-ink">
                Pickup scheduled for {formatShortDate(latestReturn.pickup.date)},{' '}
                {pickupWindows[latestReturn.pickup.window]}.
              </p>
            </section>
          )}

          <div className="flex flex-col gap-2">
            <Link
              href={`/order/${order.id}/return`}
              className={buttonClasses({ variant: 'secondary', className: 'self-start' })}
            >
              Request a return or exchange
            </Link>
            {!isDelivered && (
              <p className="text-xs text-muted">
                Returns open after delivery. Enabled here for the demo.
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-6 md:col-span-5">
          <Panel title="Items">
            <ul className="flex flex-col gap-4">
              {order.lines.map((line) => (
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
                  </div>
                  <div className="flex min-w-0 flex-1 justify-between gap-3">
                    <div className="flex min-w-0 flex-col">
                      <span className="truncate text-sm text-ink">{line.title}</span>
                      <span className="text-xs text-muted">
                        {line.colorName}, size {line.size}, qty {line.quantity}
                      </span>
                    </div>
                    <span className="text-sm text-ink tabular-nums">
                      {formatPrice(line.unitPrice * line.quantity)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
            <OrderTotals totals={order.totals} />
          </Panel>

          <Panel title="Payment">
            <p className="text-sm text-ink">
              {paymentMethodLabels[order.paymentMethod]}
              <span className="text-muted">, {order.paymentDetail}</span>
            </p>
          </Panel>

          <Panel title="Delivery address">
            <address className="text-sm text-ink not-italic">
              {order.contact.name}
              <br />
              {order.address.line}
              <br />
              {order.address.city}, {order.address.state} {order.address.pinCode}
              <br />
              {order.contact.phone}
            </address>
          </Panel>

          <Panel title="Kaaya points">
            <p className="text-sm text-ink tabular-nums">
              You earned {formatNumber(order.pointsEarned)} points. Your balance is{' '}
              {formatNumber(order.pointsBalanceAfter)} points.
            </p>
            <Link href="/rewards" className="text-xs text-ink underline underline-offset-4">
              See how rewards work
            </Link>
          </Panel>
        </div>
      </div>
    </div>
  )
}
