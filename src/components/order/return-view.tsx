'use client'

import Link from 'next/link'
import { useMemo, useState, type FormEvent } from 'react'
import { Button, buttonClasses } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup } from '@/components/ui/radio-group'
import { Select } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { useNow } from '@/hooks/use-now'
import { formatNumber, formatPrice, formatShortDate } from '@/lib/format'
import { returnReasons, type ReturnReason, type ReturnRequest } from '@/lib/order'
import { createReturnId, uniqueId } from '@/lib/order-id'
import { paymentMethodLabels } from '@/lib/payment'
import {
  buildReturnItems,
  emptyReturnLine,
  exchangeSizes,
  refundPointsFor,
  validateReturn,
  type ReturnLineDraft,
} from '@/lib/returns'
import { DELIVERED_INDEX, pickupSlots, pickupWindows } from '@/lib/tracking'
import { useHasHydrated } from '@/stores/hydration-store'
import { useOrdersStore } from '@/stores/orders-store'

type ReturnViewProps = {
  orderId: string
  returnWindowDays: number
  pointValueRupees: number
}

export function ReturnView({ orderId, returnWindowDays, pointValueRupees }: ReturnViewProps) {
  const hasHydrated = useHasHydrated()
  const order = useOrdersStore((state) => state.orders.find((entry) => entry.id === orderId))
  const orders = useOrdersStore((state) => state.orders)
  const updateOrder = useOrdersStore((state) => state.updateOrder)
  const [drafts, setDrafts] = useState<Record<string, ReturnLineDraft>>({})
  const [slotId, setSlotId] = useState('')
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [booked, setBooked] = useState<ReturnRequest | null>(null)
  const now = useNow(60_000)
  const dayStamp = now === null ? null : new Date(now).toDateString()
  const slots = useMemo(() => (dayStamp ? pickupSlots(new Date(dayStamp)) : []), [dayStamp])

  if (!hasHydrated) {
    return (
      <div aria-hidden className="mx-auto flex max-w-page flex-col gap-6 gutter-x pt-8 md:pt-12">
        <Skeleton className="h-12 w-72" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="mx-auto flex max-w-page flex-col items-start gap-5 gutter-x py-section">
        <h1 className="heading-display text-3xl text-ink md:text-4xl">
          We cannot find this order on this device
        </h1>
        <Link href="/" className={buttonClasses()}>
          Go to the home page
        </Link>
      </div>
    )
  }

  if (booked) {
    const slot = slots.find((entry) => entry.id === slotId)
    return (
      <div className="mx-auto flex max-w-page flex-col items-start gap-6 gutter-x pt-8 md:pt-12">
        <p className="label-caps text-primary tabular-nums">Return {booked.id}</p>
        <h1 className="heading-display text-4xl text-ink md:text-5xl">Your pickup is booked</h1>
        {slot && (
          <p className="max-w-prose text-base text-muted">
            A courier will collect your {booked.items.length === 1 ? 'piece' : 'pieces'} on{' '}
            {formatShortDate(slot.date)}, {slot.label}. Keep the tags on and pack them in any bag.
          </p>
        )}
        <ul className="flex flex-col gap-2 text-sm text-ink">
          {booked.items.map((item) => {
            const line = order.lines.find((entry) => entry.id === item.lineId)
            return (
              <li key={item.lineId}>
                {line?.title}:{' '}
                {item.resolution === 'exchange'
                  ? `exchange for size ${item.exchangeSize}`
                  : item.refundTo === 'points'
                    ? `refund as ${formatNumber(item.refundPoints)} Kaaya points after pickup`
                    : `refund of ${formatPrice(item.refundAmount)} to ${paymentMethodLabels[order.paymentMethod]} after pickup`}
              </li>
            )
          })}
        </ul>
        <Link href={`/order/${order.id}`} className={buttonClasses()}>
          Back to your order
        </Link>
      </div>
    )
  }

  const errors = validateReturn(order.lines, drafts, slotId)
  const showError = (key: string) => (hasSubmitted ? errors[key] : undefined)
  const updateDraft = (lineId: string, update: Partial<ReturnLineDraft>) =>
    setDrafts((current) => ({
      ...current,
      [lineId]: { ...emptyReturnLine, ...current[lineId], ...update },
    }))

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setHasSubmitted(true)
    if (Object.keys(errors).length > 0) return
    const slot = slots.find((entry) => entry.id === slotId)
    if (!slot) return
    const now = new Date()
    const existing = new Set(orders.flatMap((entry) => entry.returns.map((request) => request.id)))
    const request: ReturnRequest = {
      id: uniqueId(createReturnId, now, existing),
      createdAt: now.toISOString(),
      items: buildReturnItems(order.lines, drafts, pointValueRupees),
      pickup: { date: slot.date, window: slot.window },
      status: 'pickupScheduled',
    }
    updateOrder(order.id, (current) => ({ ...current, returns: [request, ...current.returns] }))
    setBooked(request)
  }

  return (
    <div className="mx-auto max-w-page gutter-x pt-8 md:pt-12">
      <header className="mb-10 flex flex-col gap-3">
        <Link href={`/order/${order.id}`} className="text-xs text-muted hover:text-ink">
          Order {order.id}
        </Link>
        <h1 className="heading-display text-4xl text-ink md:text-5xl">Return or exchange</h1>
        <p className="max-w-prose text-base text-muted">
          You can return or exchange within {returnWindowDays} days of delivery.
          {order.statusIndex < DELIVERED_INDEX &&
            ' Returns open after delivery. Enabled here for the demo.'}
        </p>
      </header>

      <form noValidate onSubmit={submit} className="flex max-w-3xl flex-col gap-10">
        <fieldset className="flex flex-col gap-4">
          <legend className="mb-4 heading-display text-2xl text-ink">Pieces</legend>
          {showError('items') && (
            <p role="alert" className="text-xs text-danger">
              {showError('items')}
            </p>
          )}
          {order.lines.map((line) => {
            const draft = { ...emptyReturnLine, ...drafts[line.id] }
            const sizes = exchangeSizes(line)
            const amount = line.unitPrice * line.quantity
            return (
              <div
                key={line.id}
                className="flex flex-col gap-4 rounded-card border border-line p-4"
              >
                <Checkbox
                  checked={draft.isSelected}
                  onCheckedChange={(checked) =>
                    updateDraft(line.id, { isSelected: checked === true })
                  }
                  label={
                    <span className="flex flex-col">
                      <span>{line.title}</span>
                      <span className="text-xs text-muted">
                        {line.colorName}, size {line.size}, {formatPrice(amount)}
                      </span>
                    </span>
                  }
                />
                {draft.isSelected && (
                  <div className="flex flex-col gap-4 pl-8">
                    <Select
                      label="Reason"
                      placeholder="Choose a reason"
                      options={returnReasons.map((reason) => ({ value: reason, label: reason }))}
                      value={draft.reason}
                      error={showError(`${line.id}.reason`)}
                      onValueChange={(reason) =>
                        updateDraft(line.id, { reason: reason as ReturnReason })
                      }
                    />
                    <RadioGroup
                      legend="What would you like"
                      value={draft.resolution}
                      onValueChange={(value) =>
                        updateDraft(line.id, { resolution: value as ReturnLineDraft['resolution'] })
                      }
                      options={[
                        {
                          value: 'exchange',
                          label: 'Exchange for another size',
                          isDisabled: sizes.length === 0,
                          description: sizes.length === 0 ? 'No other size is in stock' : undefined,
                        },
                        { value: 'refund', label: 'Refund' },
                      ]}
                    />
                    {draft.resolution === 'exchange' ? (
                      <Select
                        label="New size"
                        placeholder="Choose a size"
                        options={sizes.map((size) => ({ value: size, label: size }))}
                        value={draft.exchangeSize}
                        error={showError(`${line.id}.exchangeSize`)}
                        onValueChange={(exchangeSize) => updateDraft(line.id, { exchangeSize })}
                      />
                    ) : (
                      <RadioGroup
                        legend="Refund to"
                        value={draft.refundTo}
                        onValueChange={(value) =>
                          updateDraft(line.id, { refundTo: value as ReturnLineDraft['refundTo'] })
                        }
                        options={[
                          {
                            value: 'original',
                            label: `${paymentMethodLabels[order.paymentMethod]}, ${formatPrice(amount)}`,
                            description: 'Back to the original payment method',
                          },
                          {
                            value: 'points',
                            label: `${formatNumber(refundPointsFor(amount, pointValueRupees))} Kaaya points`,
                            description: 'Includes a 10% bonus',
                          },
                        ]}
                      />
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </fieldset>

        <fieldset className="flex flex-col gap-3">
          <legend className="mb-4 heading-display text-2xl text-ink">Pickup</legend>
          <RadioGroup
            legend="Pickup slot"
            isLegendHidden
            value={slotId}
            onValueChange={setSlotId}
            error={showError('slot')}
            options={slots.map((slot) => ({
              value: slot.id,
              label: `${formatShortDate(slot.date)}, ${pickupWindows[slot.window]}`,
            }))}
          />
        </fieldset>

        <Button type="submit" size="lg" className="self-start">
          Book pickup
        </Button>
      </form>
    </div>
  )
}
