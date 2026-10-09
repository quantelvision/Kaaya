'use client'

import { CaretDown } from '@phosphor-icons/react/ssr'
import { useId, type ComponentProps } from 'react'
import { controlClasses, Field, fieldDescriptionIds } from '@/components/ui/field'
import { cn } from '@/lib/cn'

export type SelectOption = {
  value: string
  label: string
}

type SelectProps = Omit<ComponentProps<'select'>, 'id' | 'children'> & {
  id?: string
  label: string
  options: SelectOption[]
  placeholder?: string
  hint?: string
  error?: string
  isOptional?: boolean
  fieldClassName?: string
}

export function Select({
  id,
  label,
  options,
  placeholder,
  hint,
  error,
  isOptional,
  fieldClassName,
  className,
  ...props
}: SelectProps) {
  const generatedId = useId()
  const selectId = id ?? generatedId

  return (
    <Field
      id={selectId}
      label={label}
      hint={hint}
      error={error}
      isOptional={isOptional}
      className={fieldClassName}
    >
      <div className="relative">
        <select
          id={selectId}
          aria-invalid={error ? true : undefined}
          aria-describedby={fieldDescriptionIds(selectId, hint, error)}
          className={cn(controlClasses, 'appearance-none pr-10', className)}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <CaretDown
          weight="light"
          aria-hidden
          className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-muted"
        />
      </div>
    </Field>
  )
}
