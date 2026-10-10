'use client'

import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import * as Popover from '@radix-ui/react-popover'
import { Check } from '@phosphor-icons/react/ssr'
import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog'
import { useId, useState, type FormEvent, type ReactNode } from 'react'
import { Spinner } from '@/components/ui/spinner'
import { cn } from '@/lib/cn'
import { LEAD_ERROR_MESSAGE, leadSchema, type LeadInput } from '@/lib/lead'

type LeadFields = Omit<LeadInput, 'consent' | 'source' | 'orderId'> & { consent: boolean }

const emptyFields: LeadFields = {
  name: '',
  businessName: '',
  phone: '',
  email: '',
  sells: '',
  message: '',
  consent: false,
  website: '',
}

const inputClasses =
  'w-full rounded-q border border-q-border-dark bg-transparent px-4 text-base text-q-text-dark transition-colors placeholder:text-q-text-dark/40 hover:border-q-text-dark/50 focus-visible:border-q-accent focus-visible:outline-none aria-invalid:border-q-accent'

function QuantelField({
  label,
  error,
  isOptional,
  children,
  htmlFor,
}: {
  label: string
  error?: string
  isOptional?: boolean
  children: ReactNode
  htmlFor: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-xs font-medium text-q-text-dark/80">
        {label}
        {isOptional && <span className="ml-1 font-normal text-q-text-dark/50">(optional)</span>}
      </label>
      {children}
      {error && (
        <p id={`${htmlFor}-error`} className="text-xs text-q-accent">
          {error}
        </p>
      )}
    </div>
  )
}

type ContactFormProps = {
  source: 'gate' | 'credit-pill'
  orderId: string | null
  onSuccess: () => void
}

export function ContactForm({ source, orderId, onSuccess }: ContactFormProps) {
  const id = useId()
  const [fields, setFields] = useState<LeadFields>(emptyFields)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'failed'>('idle')

  const update = (next: Partial<LeadFields>) => setFields((current) => ({ ...current, ...next }))
  const fieldId = (name: string) => `${id}-${name}`

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const payload = { ...fields, source, ...(orderId ? { orderId } : {}) }
    const parsed = leadSchema.safeParse(payload)
    if (!parsed.success) {
      const nextErrors: Record<string, string> = {}
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? '')
        if (!nextErrors[key]) nextErrors[key] = issue.message
      }
      setErrors(nextErrors)
      const firstKey = Object.keys(nextErrors)[0]
      if (firstKey) document.getElementById(fieldId(firstKey))?.focus()
      return
    }

    setErrors({})
    setStatus('sending')
    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!response.ok) throw new Error(`Lead request failed with ${response.status}`)
      setStatus('idle')
      onSuccess()
    } catch {
      setStatus('failed')
    }
  }

  const textField = (
    name: 'name' | 'businessName' | 'phone' | 'email' | 'sells',
    label: string,
    props: {
      type?: string
      autoComplete?: string
      inputMode?: 'tel' | 'email'
      isOptional?: boolean
    },
  ) => (
    <QuantelField
      label={label}
      error={errors[name]}
      isOptional={props.isOptional}
      htmlFor={fieldId(name)}
    >
      <input
        id={fieldId(name)}
        type={props.type ?? 'text'}
        autoComplete={props.autoComplete}
        inputMode={props.inputMode}
        value={fields[name] ?? ''}
        aria-invalid={errors[name] ? true : undefined}
        aria-describedby={errors[name] ? `${fieldId(name)}-error` : undefined}
        onChange={(event) => update({ [name]: event.target.value })}
        className={cn(inputClasses, 'h-12')}
      />
    </QuantelField>
  )

  return (
    <form noValidate onSubmit={submit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <DialogTitle className="font-q-heading text-2xl font-semibold text-q-text-dark">
          Book a strategy call
        </DialogTitle>
        <DialogDescription className="text-sm text-q-text-dark/70">
          Tell us about your business and we will call you to plan your store.
        </DialogDescription>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {textField('name', 'Name', { autoComplete: 'name' })}
        {textField('businessName', 'Business name', { autoComplete: 'organization' })}
        {textField('phone', 'Phone', { type: 'tel', autoComplete: 'tel', inputMode: 'tel' })}
        {textField('email', 'Email', { type: 'email', autoComplete: 'email', inputMode: 'email' })}
      </div>
      {textField('sells', 'What do you sell?', { isOptional: true })}
      <QuantelField label="Message" isOptional htmlFor={fieldId('message')}>
        <textarea
          id={fieldId('message')}
          rows={3}
          value={fields.message ?? ''}
          onChange={(event) => update({ message: event.target.value })}
          className={cn(inputClasses, 'resize-y py-3')}
        />
      </QuantelField>

      <div aria-hidden className="absolute -left-[9999px] size-px overflow-hidden">
        <label htmlFor={fieldId('website')}>Website</label>
        <input
          id={fieldId('website')}
          tabIndex={-1}
          autoComplete="off"
          value={fields.website ?? ''}
          onChange={(event) => update({ website: event.target.value })}
        />
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex items-start gap-3">
          <CheckboxPrimitive.Root
            id={fieldId('consent')}
            checked={fields.consent}
            onCheckedChange={(checked) => update({ consent: checked === true })}
            aria-invalid={errors.consent ? true : undefined}
            className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-q-sm border border-q-border-dark text-q-text transition-colors data-[state=checked]:border-q-accent data-[state=checked]:bg-q-accent"
          >
            <CheckboxPrimitive.Indicator>
              <Check weight="light" className="size-4" aria-hidden />
            </CheckboxPrimitive.Indicator>
          </CheckboxPrimitive.Root>
          <div className="text-sm text-q-text-dark/80">
            <label htmlFor={fieldId('consent')} className="cursor-pointer">
              I agree that Quantel Vision can contact me about this enquiry.
            </label>{' '}
            <Popover.Root>
              <Popover.Trigger className="text-q-text-dark underline underline-offset-4 hover:text-q-accent">
                Privacy note
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content
                  side="top"
                  sideOffset={8}
                  collisionPadding={16}
                  className="z-60 max-w-xs rounded-q border border-q-border-dark bg-q-bg-dark p-4 font-q-body text-xs leading-relaxed text-q-text-dark shadow-float outline-none data-[state=closed]:animate-pop-out data-[state=open]:animate-pop-in"
                >
                  We use these details only to reply to this enquiry. We do not share them or add
                  you to a mailing list.
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
          </div>
        </div>
        {errors.consent && <p className="pl-8 text-xs text-q-accent">{errors.consent}</p>}
      </div>

      <div className="flex flex-col gap-3">
        <button
          type="submit"
          disabled={status === 'sending'}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-q-accent px-6 font-q-heading text-sm font-semibold text-q-text transition-colors hover:bg-q-accent-dark disabled:opacity-70"
        >
          {status === 'sending' && <Spinner />}
          Send
        </button>
        <p aria-live="polite" className="min-h-5 text-sm text-q-accent">
          {status === 'failed' ? LEAD_ERROR_MESSAGE : ''}
        </p>
      </div>
    </form>
  )
}
