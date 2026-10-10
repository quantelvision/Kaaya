'use client'

import { DecorativeQr } from '@/components/checkout/decorative-qr'
import { Input } from '@/components/ui/input'
import { RadioGroup } from '@/components/ui/radio-group'
import { Select } from '@/components/ui/select'
import type { CheckoutForm, FieldErrors } from '@/lib/checkout-validation'
import { formatPrice } from '@/lib/format'
import type { PaymentMethod } from '@/lib/order'
import { cardBrand, formatCardNumber, formatExpiry, netBankingBanks } from '@/lib/payment'

type PaymentSectionProps = {
  form: CheckoutForm
  errors: FieldErrors
  total: number
  codFee: number
  onChange: (update: Partial<CheckoutForm>) => void
  onBlurField: (key: string) => void
}

export function PaymentSection({
  form,
  errors,
  total,
  codFee,
  onChange,
  onBlurField,
}: PaymentSectionProps) {
  const brand = cardBrand(form.card.number)
  const updateCard = (update: Partial<CheckoutForm['card']>) =>
    onChange({ card: { ...form.card, ...update } })

  return (
    <div className="flex flex-col gap-6">
      <RadioGroup
        legend="Payment method"
        isLegendHidden
        value={form.paymentMethod}
        onValueChange={(value) => onChange({ paymentMethod: value as PaymentMethod })}
        options={[
          { value: 'upi', label: 'UPI', description: 'Pay with any UPI app' },
          {
            value: 'card',
            label: 'Card',
            description: 'Visa, Mastercard, RuPay and American Express',
          },
          { value: 'netbanking', label: 'Net banking', description: 'Pay from your bank account' },
          {
            value: 'cod',
            label: 'Cash on delivery',
            description: `Adds ${formatPrice(codFee)}, pay when it arrives`,
          },
        ]}
      />

      {form.paymentMethod === 'upi' && (
        <div className="flex flex-col gap-4">
          {form.isUpiQr ? (
            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-6">
              <DecorativeQr seed={`kaaya-${total}`} className="size-40 text-ink" />
              <div className="flex flex-col gap-2">
                <p className="text-sm text-ink">
                  Scan with any UPI app to pay {formatPrice(total)}.
                </p>
                <button
                  type="button"
                  onClick={() => onChange({ isUpiQr: false })}
                  className="self-start text-xs text-ink underline underline-offset-4"
                >
                  Pay with a UPI ID instead
                </button>
              </div>
            </div>
          ) : (
            <>
              <Input
                id="payment-upiId"
                label="UPI ID"
                placeholder="name@bank"
                autoComplete="off"
                autoCapitalize="none"
                value={form.upiId}
                error={errors['payment.upiId']}
                onChange={(event) => onChange({ upiId: event.target.value })}
                onBlur={() => onBlurField('payment.upiId')}
              />
              <button
                type="button"
                onClick={() => onChange({ isUpiQr: true })}
                className="self-start text-xs text-ink underline underline-offset-4"
              >
                Show QR
              </button>
            </>
          )}
        </div>
      )}

      {form.paymentMethod === 'card' && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            id="card-number"
            label="Card number"
            inputMode="numeric"
            autoComplete="cc-number"
            placeholder="4111 1111 1111 1111"
            fieldClassName="sm:col-span-2"
            value={form.card.number}
            hint={brand ? `${brand} card` : 'Visa, Mastercard, RuPay or American Express'}
            error={errors['card.number']}
            onChange={(event) => updateCard({ number: formatCardNumber(event.target.value) })}
            onBlur={() => onBlurField('card.number')}
          />
          <Input
            id="card-expiry"
            label="Expiry"
            inputMode="numeric"
            autoComplete="cc-exp"
            placeholder="MM/YY"
            value={form.card.expiry}
            error={errors['card.expiry']}
            onChange={(event) => updateCard({ expiry: formatExpiry(event.target.value) })}
            onBlur={() => onBlurField('card.expiry')}
          />
          <Input
            id="card-cvv"
            label="CVV"
            inputMode="numeric"
            autoComplete="cc-csc"
            maxLength={4}
            value={form.card.cvv}
            error={errors['card.cvv']}
            onChange={(event) => updateCard({ cvv: event.target.value.replace(/\D/g, '') })}
            onBlur={() => onBlurField('card.cvv')}
          />
          <Input
            id="card-name"
            label="Name on card"
            autoComplete="cc-name"
            fieldClassName="sm:col-span-2"
            value={form.card.name}
            error={errors['card.name']}
            onChange={(event) => updateCard({ name: event.target.value })}
            onBlur={() => onBlurField('card.name')}
          />
        </div>
      )}

      {form.paymentMethod === 'netbanking' && (
        <Select
          id="payment-bank"
          label="Bank"
          placeholder="Choose your bank"
          options={netBankingBanks.map((bank) => ({ value: bank, label: bank }))}
          value={form.bank}
          error={errors['payment.bank']}
          onValueChange={(bank) => onChange({ bank })}
          onBlur={() => onBlurField('payment.bank')}
        />
      )}

      {form.paymentMethod === 'cod' && (
        <p className="text-sm text-muted">
          Pay in cash or by UPI when your order arrives. A {formatPrice(codFee)} cash on delivery
          fee is added to your total.
        </p>
      )}

      <p className="rounded-card bg-wash px-4 py-3 text-xs text-ink">
        Demo checkout. No payment is taken.
      </p>
    </div>
  )
}
