'use client'

import { useId, type ComponentProps } from 'react'
import { controlClasses, Field, fieldDescriptionIds } from '@/components/ui/field'
import { cn } from '@/lib/cn'

type InputProps = Omit<ComponentProps<'input'>, 'id'> & {
  id?: string
  label: string
  hint?: string
  error?: string
  isOptional?: boolean
  fieldClassName?: string
}

export function Input({
  id,
  label,
  hint,
  error,
  isOptional,
  fieldClassName,
  className,
  ...props
}: InputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId

  return (
    <Field
      id={inputId}
      label={label}
      hint={hint}
      error={error}
      isOptional={isOptional}
      className={fieldClassName}
    >
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={fieldDescriptionIds(inputId, hint, error)}
        className={cn(controlClasses, className)}
        {...props}
      />
    </Field>
  )
}
