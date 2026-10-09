'use client'

import { Check } from '@phosphor-icons/react/ssr'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { useId, type ComponentProps, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

type CheckboxProps = Omit<ComponentProps<typeof CheckboxPrimitive.Root>, 'id'> & {
  id?: string
  label: ReactNode
  error?: string
}

export function Checkbox({ id, label, error, className, ...props }: CheckboxProps) {
  const generatedId = useId()
  const checkboxId = id ?? generatedId

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <div className="flex min-h-tap items-start gap-3 py-2.5">
        <CheckboxPrimitive.Root
          id={checkboxId}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${checkboxId}-error` : undefined}
          className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-control border border-muted bg-surface text-on-primary transition-colors duration-200 hover:border-ink aria-invalid:border-danger data-[state=checked]:border-primary data-[state=checked]:bg-primary"
          {...props}
        >
          <CheckboxPrimitive.Indicator>
            <Check weight="light" className="size-4" aria-hidden />
          </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
        <label htmlFor={checkboxId} className="cursor-pointer text-sm text-ink">
          {label}
        </label>
      </div>
      {error && (
        <p id={`${checkboxId}-error`} className="text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  )
}
