'use client'

import * as DialogPrimitive from '@radix-ui/react-dialog'
import type { CSSProperties } from 'react'

type ProcessingDialogProps = {
  message: string | null
  durationMs: number
}

export function ProcessingDialog({ message, durationMs }: ProcessingDialogProps) {
  const style = { '--progress-duration': `${durationMs}ms` } as CSSProperties

  return (
    <DialogPrimitive.Root open={message !== null}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-ink/40" />
        <DialogPrimitive.Content
          onEscapeKeyDown={(event) => event.preventDefault()}
          onPointerDownOutside={(event) => event.preventDefault()}
          onInteractOutside={(event) => event.preventDefault()}
          className="fixed top-1/2 left-1/2 z-50 flex w-[calc(100vw-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 flex-col gap-5 rounded-card bg-surface p-6 shadow-float outline-none"
        >
          <DialogPrimitive.Title className="heading-display text-xl text-ink">
            {message}
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className="text-sm text-muted">
            Demo checkout. No payment is taken.
          </DialogPrimitive.Description>
          <div className="h-1 overflow-hidden rounded-full bg-line" aria-hidden>
            {durationMs > 0 && (
              <div
                key={message}
                style={style}
                className="h-full origin-left animate-progress rounded-full bg-primary motion-reduce:animate-none"
              />
            )}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
