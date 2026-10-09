'use client'

import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import { useId, type ComponentProps, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

export type RadioOption = {
  value: string
  label: ReactNode
  description?: ReactNode
  isDisabled?: boolean
}

type RadioGroupProps = Omit<ComponentProps<typeof RadioGroupPrimitive.Root>, 'children'> & {
  legend: string
  options: RadioOption[]
  isLegendHidden?: boolean
  error?: string
}

export function RadioGroup({
  legend,
  options,
  isLegendHidden = false,
  error,
  className,
  ...props
}: RadioGroupProps) {
  const groupId = useId()
  const legendId = `${groupId}-legend`

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <span
        id={legendId}
        className={cn('text-xs font-medium text-ink', isLegendHidden && 'sr-only')}
      >
        {legend}
      </span>
      <RadioGroupPrimitive.Root
        aria-labelledby={legendId}
        aria-describedby={error ? `${groupId}-error` : undefined}
        className="flex flex-col"
        {...props}
      >
        {options.map((option) => {
          const optionId = `${groupId}-${option.value}`
          return (
            <div key={option.value} className="flex min-h-tap items-start gap-3 py-2.5">
              <RadioGroupPrimitive.Item
                id={optionId}
                value={option.value}
                disabled={option.isDisabled}
                className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full border border-muted bg-surface transition-colors duration-200 hover:border-ink disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-primary"
              >
                <RadioGroupPrimitive.Indicator className="size-2.5 rounded-full bg-primary" />
              </RadioGroupPrimitive.Item>
              <label htmlFor={optionId} className="flex cursor-pointer flex-col gap-0.5">
                <span className="text-sm text-ink">{option.label}</span>
                {option.description && (
                  <span className="text-xs text-muted">{option.description}</span>
                )}
              </label>
            </div>
          )
        })}
      </RadioGroupPrimitive.Root>
      {error && (
        <p id={`${groupId}-error`} className="text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  )
}
