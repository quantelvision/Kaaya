'use client'

import { X } from '@phosphor-icons/react/ssr'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import type { ReactNode } from 'react'
import { IconButton } from '@/components/ui/icon-button'
import { cn } from '@/lib/cn'

type DialogProps = {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: ReactNode
  title: string
  description?: string
  isTitleHidden?: boolean
  className?: string
  children: ReactNode
}

export function Dialog({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  isTitleHidden = false,
  className,
  children,
}: DialogProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>}
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-ink/40" />
        <DialogPrimitive.Content
          className={cn(
            'fixed top-1/2 left-1/2 z-50 flex max-h-[90dvh] w-[calc(100vw-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 flex-col rounded-card bg-surface text-ink shadow-float outline-none',
            className,
          )}
        >
          <div className="flex items-start justify-between gap-4 py-3 pr-2 pl-6">
            <div className={cn('flex flex-col gap-1 pt-2', isTitleHidden && 'sr-only')}>
              <DialogPrimitive.Title className="font-display text-xl">
                {title}
              </DialogPrimitive.Title>
              {description ? (
                <DialogPrimitive.Description className="text-sm text-muted">
                  {description}
                </DialogPrimitive.Description>
              ) : null}
            </div>
            <DialogPrimitive.Close asChild>
              <IconButton label="Close" className="ml-auto">
                <X weight="light" className="size-5" aria-hidden />
              </IconButton>
            </DialogPrimitive.Close>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-6">{children}</div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
