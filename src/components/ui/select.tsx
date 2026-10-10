'use client'

import { CaretDown, Check } from '@phosphor-icons/react/ssr'
import * as SelectPrimitive from '@radix-ui/react-select'
import { useId } from 'react'
import { controlClasses, Field, fieldDescriptionIds } from '@/components/ui/field'
import { cn } from '@/lib/cn'

export type SelectOption = {
  value: string
  label: string
}

function SelectMenu({
  options,
  className,
}: {
  options: readonly SelectOption[]
  className?: string
}) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        position="popper"
        sideOffset={6}
        collisionPadding={16}
        className={cn(
          'z-60 max-h-(--radix-select-content-available-height) overflow-hidden rounded-card border border-line bg-surface text-ink shadow-float data-[state=closed]:animate-pop-out data-[state=open]:animate-pop-in',
          className,
        )}
      >
        <SelectPrimitive.Viewport className="max-h-72 p-1.5">
          {options.map((option) => (
            <SelectPrimitive.Item
              key={option.value}
              value={option.value}
              className="relative flex min-h-tap cursor-pointer items-center rounded-control py-2 pr-10 pl-3 text-sm outline-none select-none data-highlighted:bg-wash data-[state=checked]:font-medium"
            >
              <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
              <SelectPrimitive.ItemIndicator className="absolute right-3 inline-flex">
                <Check weight="light" className="size-4" aria-hidden />
              </SelectPrimitive.ItemIndicator>
            </SelectPrimitive.Item>
          ))}
        </SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

type SelectProps = {
  id?: string
  label: string
  options: readonly SelectOption[]
  value: string
  onValueChange: (value: string) => void
  onBlur?: () => void
  placeholder?: string
  hint?: string
  error?: string
  isOptional?: boolean
  fieldClassName?: string
  className?: string
}

export function Select({
  id,
  label,
  options,
  value,
  onValueChange,
  onBlur,
  placeholder,
  hint,
  error,
  isOptional,
  fieldClassName,
  className,
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
      <SelectPrimitive.Root
        value={value}
        onValueChange={onValueChange}
        onOpenChange={(open) => {
          if (!open) onBlur?.()
        }}
      >
        <SelectPrimitive.Trigger
          id={selectId}
          aria-invalid={error ? true : undefined}
          aria-describedby={fieldDescriptionIds(selectId, hint, error)}
          className={cn(
            controlClasses,
            'flex cursor-pointer items-center justify-between gap-3 text-left data-placeholder:text-muted',
            className,
          )}
        >
          <span className="truncate">
            <SelectPrimitive.Value placeholder={placeholder} />
          </span>
          <SelectPrimitive.Icon className="shrink-0 text-muted">
            <CaretDown weight="light" className="size-4" aria-hidden />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
        <SelectMenu options={options} className="w-(--radix-select-trigger-width)" />
      </SelectPrimitive.Root>
    </Field>
  )
}

type InlineSelectProps = {
  label: string
  options: readonly SelectOption[]
  value: string
  onValueChange: (value: string) => void
  className?: string
}

export function InlineSelect({
  label,
  options,
  value,
  onValueChange,
  className,
}: InlineSelectProps) {
  return (
    <SelectPrimitive.Root value={value} onValueChange={onValueChange}>
      <SelectPrimitive.Trigger
        aria-label={label}
        className={cn(
          'group inline-flex h-tap min-w-0 cursor-pointer items-center gap-1.5 rounded-btn px-2 text-sm text-ink',
          className,
        )}
      >
        <span className="truncate underline decoration-line underline-offset-4 transition-colors group-hover:decoration-ink">
          <SelectPrimitive.Value />
        </span>
        <SelectPrimitive.Icon className="shrink-0 text-muted">
          <CaretDown
            weight="light"
            className="size-4 transition-transform duration-200 group-data-[state=open]:rotate-180 motion-reduce:transition-none"
            aria-hidden
          />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectMenu options={options} className="min-w-(--radix-select-trigger-width)" />
    </SelectPrimitive.Root>
  )
}
