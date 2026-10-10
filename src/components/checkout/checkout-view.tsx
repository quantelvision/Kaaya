'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, type FormEvent, type ReactNode } from 'react'
import { useCartTotals } from '@/components/cart/use-cart-totals'
import { CheckoutSummary } from '@/components/checkout/checkout-summary'
import { PaymentSection } from '@/components/checkout/payment-section'
import { ProcessingDialog } from '@/components/checkout/processing-dialog'
import { Button, buttonClasses } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { useNow } from '@/hooks/use-now'
import { checkoutTestData } from '@/lib/checkout-test-data'
import {
  emptyCheckoutForm,
  validateCheckoutForm,
  type CheckoutForm,
} from '@/lib/checkout-validation'
import { formatPrice } from '@/lib/format'
import { indianStates } from '@/lib/india'
import { buildOrder } from '@/lib/order-builder'
import { createOrderId, uniqueId } from '@/lib/order-id'
import { paymentDelaysMs } from '@/lib/payment'
import type { StorePricing } from '@/lib/pricing/settings'
import { useCartStore } from '@/stores/cart-store'
import { useLoyaltyStore } from '@/stores/loyalty-store'
import { useOrdersStore } from '@/stores/orders-store'

function fieldId(key: string): string {
  return key.replace('.', '-')
}

function processingMessage(form: CheckoutForm): string {
  switch (form.paymentMethod) {
    case 'upi':
      return 'Waiting for approval in your UPI app'
    case 'card':
      return 'Processing your card payment'
    case 'netbanking':
      return `Connecting to ${form.bank}`
    case 'cod':
      return 'Placing your order'
  }
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="flex flex-col gap-5 border-t border-line pt-8 first-of-type:border-t-0 first-of-type:pt-0">
      <legend className="float-left mb-2 w-full heading-display text-2xl text-ink">{title}</legend>
      {children}
    </fieldset>
  )
}

export function CheckoutView({ storePricing }: { storePricing: StorePricing }) {
  const router = useRouter()
  const [form, setForm] = useState<CheckoutForm>(emptyCheckoutForm)
  const [touched, setTouched] = useState<Set<string>>(() => new Set())
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [processing, setProcessing] = useState<{ message: string; durationMs: number } | null>(null)
  const [isCompleting, setIsCompleting] = useState(false)
  const { totals, lines, balance, hasHydrated } = useCartTotals(storePricing, form.paymentMethod)
  const clearCart = useCartStore((state) => state.clear)
  const addOrder = useOrdersStore((state) => state.addOrder)
  const orders = useOrdersStore((state) => state.orders)
  const earn = useLoyaltyStore((state) => state.earn)
  const redeem = useLoyaltyStore((state) => state.redeem)

  const now = useNow(60_000)
  const allErrors = validateCheckoutForm(form, new Date(now ?? 0))
  const visibleError = (key: string) =>
    hasSubmitted || touched.has(key) ? allErrors[key] : undefined
  const markTouched = (key: string) => setTouched((current) => new Set(current).add(key))
  const update = (next: Partial<CheckoutForm>) => setForm((current) => ({ ...current, ...next }))
  const updateContact = (next: Partial<CheckoutForm['contact']>) =>
    setForm((current) => ({ ...current, contact: { ...current.contact, ...next } }))
  const updateAddress = (next: Partial<CheckoutForm['address']>) =>
    setForm((current) => ({ ...current, address: { ...current.address, ...next } }))

  const fillTestData = () => {
    setForm((current) => ({
      ...current,
      contact: checkoutTestData.contact,
      address: checkoutTestData.address,
      upiId: checkoutTestData.upiId,
      card: checkoutTestData.card,
      bank: checkoutTestData.bank,
    }))
  }

  const completeOrder = () => {
    const createdAt = new Date()
    const id = uniqueId(createOrderId, createdAt, new Set(orders.map((order) => order.id)))
    const order = buildOrder({ id, createdAt, form, lines, totals, pointsBalance: balance })
    addOrder(order)
    redeem(totals.pointsRedeemed)
    earn(totals.pointsEarned)
    setIsCompleting(true)
    router.push(`/order/${id}`)
    clearCart()
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setHasSubmitted(true)
    const errors = validateCheckoutForm(form, new Date())
    const firstError = Object.keys(errors)[0]
    if (firstError) {
      document.getElementById(fieldId(firstError))?.focus()
      return
    }
    const durationMs = paymentDelaysMs[form.paymentMethod]
    setProcessing({ message: processingMessage(form), durationMs })
    window.setTimeout(completeOrder, durationMs)
  }

  if (!hasHydrated || isCompleting) {
    return (
      <div aria-hidden className="mx-auto grid max-w-page gap-10 gutter-x pt-8 md:grid-cols-12">
        <div className="flex flex-col gap-4 md:col-span-7">
          <Skeleton className="h-12 w-48" />
          <Skeleton className="h-64 w-full" />
        </div>
        <Skeleton className="h-80 w-full md:col-span-5" />
        <ProcessingDialog message={processing?.message ?? null} durationMs={0} />
      </div>
    )
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto flex max-w-page flex-col items-start gap-5 gutter-x pt-8 md:pt-12">
        <h1 className="heading-display text-4xl text-ink md:text-5xl">Checkout</h1>
        <p className="text-base text-muted">Your bag is empty. Add a piece to check out.</p>
        <Link href="/shop" className={buttonClasses()}>
          Shop all
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-page gutter-x pt-8 md:pt-12">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="heading-display text-4xl text-ink md:text-5xl">Checkout</h1>
          <p className="text-sm text-muted">Guest checkout. No account needed.</p>
        </div>
        <Button variant="secondary" size="sm" onClick={fillTestData}>
          Fill test data
        </Button>
      </div>

      <div className="grid gap-10 md:grid-cols-12 md:gap-12">
        <aside className="md:sticky md:top-24 md:order-2 md:col-span-5 md:self-start">
          <CheckoutSummary
            lines={lines}
            totals={totals}
            balance={balance}
            storePricing={storePricing}
          />
        </aside>

        <form
          noValidate
          onSubmit={submit}
          className="flex flex-col gap-10 md:order-1 md:col-span-7"
        >
          <Section title="Contact">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                id="contact-name"
                label="Full name"
                autoComplete="name"
                fieldClassName="sm:col-span-2"
                value={form.contact.name}
                error={visibleError('contact.name')}
                onChange={(event) => updateContact({ name: event.target.value })}
                onBlur={() => markTouched('contact.name')}
              />
              <Input
                id="contact-email"
                type="email"
                label="Email"
                autoComplete="email"
                value={form.contact.email}
                error={visibleError('contact.email')}
                onChange={(event) => updateContact({ email: event.target.value })}
                onBlur={() => markTouched('contact.email')}
              />
              <Input
                id="contact-phone"
                type="tel"
                label="Mobile number"
                inputMode="tel"
                autoComplete="tel"
                placeholder="+91 90000 00000"
                value={form.contact.phone}
                error={visibleError('contact.phone')}
                onChange={(event) => updateContact({ phone: event.target.value })}
                onBlur={() => markTouched('contact.phone')}
              />
            </div>
          </Section>

          <Section title="Delivery address">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                id="address-line"
                label="House number and street"
                autoComplete="street-address"
                fieldClassName="sm:col-span-2"
                value={form.address.line}
                error={visibleError('address.line')}
                onChange={(event) => updateAddress({ line: event.target.value })}
                onBlur={() => markTouched('address.line')}
              />
              <Input
                id="address-city"
                label="City"
                autoComplete="address-level2"
                value={form.address.city}
                error={visibleError('address.city')}
                onChange={(event) => updateAddress({ city: event.target.value })}
                onBlur={() => markTouched('address.city')}
              />
              <Input
                id="address-pinCode"
                label="PIN code"
                inputMode="numeric"
                autoComplete="postal-code"
                maxLength={6}
                value={form.address.pinCode}
                error={visibleError('address.pinCode')}
                onChange={(event) =>
                  updateAddress({ pinCode: event.target.value.replace(/\D/g, '') })
                }
                onBlur={() => markTouched('address.pinCode')}
              />
              <Select
                id="address-state"
                label="State"
                placeholder="Choose your state"
                fieldClassName="sm:col-span-2"
                options={indianStates.map((state) => ({ value: state, label: state }))}
                value={form.address.state}
                error={visibleError('address.state')}
                onValueChange={(state) => updateAddress({ state })}
                onBlur={() => markTouched('address.state')}
              />
            </div>
          </Section>

          <Section title="Payment">
            <PaymentSection
              form={form}
              errors={{
                'payment.upiId': visibleError('payment.upiId') ?? '',
                'payment.bank': visibleError('payment.bank') ?? '',
                'card.number': visibleError('card.number') ?? '',
                'card.expiry': visibleError('card.expiry') ?? '',
                'card.cvv': visibleError('card.cvv') ?? '',
                'card.name': visibleError('card.name') ?? '',
              }}
              total={totals.total}
              codFee={storePricing.pricing.codFee}
              onChange={update}
              onBlurField={markTouched}
            />
          </Section>

          <div className="flex flex-col gap-3 border-t border-line pt-8">
            <Button type="submit" size="lg" isFullWidth isLoading={processing !== null}>
              Complete order, {formatPrice(totals.total)}
            </Button>
            {hasSubmitted && Object.keys(allErrors).length > 0 && (
              <p role="alert" className="text-xs text-danger">
                Check the highlighted fields to place your order.
              </p>
            )}
          </div>
        </form>
      </div>

      <ProcessingDialog
        message={processing?.message ?? null}
        durationMs={processing?.durationMs ?? 0}
      />
    </div>
  )
}
