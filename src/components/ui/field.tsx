import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

type FieldProps = {
  id: string
  label: string
  hint?: string
  error?: string
  isOptional?: boolean
  className?: string
  children: ReactNode
}

export function fieldDescriptionIds(id: string, hint?: string, error?: string) {
  const ids = [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean)
  return ids.length > 0 ? ids.join(' ') : undefined
}

export function Field({ id, label, hint, error, isOptional, className, children }: FieldProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className="text-xs font-medium text-ink">
        {label}
        {isOptional && <span className="ml-1 font-normal text-muted">(optional)</span>}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-xs text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  )
}

export const controlClasses =
  'h-12 w-full rounded-btn border border-line bg-surface px-3.5 text-sm text-ink transition-colors duration-200 placeholder:text-muted hover:border-muted focus-visible:border-ink focus-visible:outline-none aria-invalid:border-danger disabled:cursor-not-allowed disabled:opacity-60'
