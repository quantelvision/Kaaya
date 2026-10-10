'use client'

import { X } from '@phosphor-icons/react/ssr'
import type { ReactNode } from 'react'
import { Drawer } from 'vaul'
import { IconButton } from '@/components/ui/icon-button'
import { useMediaQuery } from '@/hooks/use-media-query'
import { cn } from '@/lib/cn'

type SheetSide = 'responsive' | 'left' | 'right' | 'bottom'
type Direction = 'left' | 'right' | 'bottom'

const contentClasses: Record<Direction, string> = {
  bottom: 'inset-x-0 bottom-0 max-h-[92dvh] rounded-t-card shadow-sheet',
  right: 'inset-y-0 right-0 h-dvh w-full max-w-md shadow-drawer',
  left: 'inset-y-0 left-0 h-dvh w-[min(88vw,24rem)] shadow-drawer',
}

type SheetProps = {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: ReactNode
  title: string
  description?: string
  isTitleHidden?: boolean
  side?: SheetSide
  footer?: ReactNode
  className?: string
  overlayClassName?: string
  headerStart?: ReactNode
  children: ReactNode
}

export function Sheet({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  isTitleHidden = false,
  side = 'responsive',
  footer,
  className,
  overlayClassName,
  headerStart,
  children,
}: SheetProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const direction: Direction = side === 'responsive' ? (isDesktop ? 'right' : 'bottom') : side

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange} direction={direction} autoFocus>
      {trigger && <Drawer.Trigger asChild>{trigger}</Drawer.Trigger>}
      <Drawer.Portal>
        <Drawer.Overlay className={cn('fixed inset-0 z-50 bg-ink/40', overlayClassName)} />
        <Drawer.Content
          className={cn(
            'fixed z-50 flex flex-col bg-surface text-ink outline-none',
            contentClasses[direction],
            className,
          )}
        >
          {direction === 'bottom' && (
            <Drawer.Handle className="mt-3 h-1! w-10! shrink-0 bg-line!" />
          )}
          <div className="flex items-center justify-between gap-4 py-3 pr-2 pl-5">
            {headerStart}
            <div className={cn('flex flex-col gap-0.5', isTitleHidden && 'sr-only')}>
              <Drawer.Title className="font-display text-xl">{title}</Drawer.Title>
              {description && (
                <Drawer.Description className="text-xs text-muted">
                  {description}
                </Drawer.Description>
              )}
            </div>
            <Drawer.Close asChild>
              <IconButton label="Close" className="ml-auto">
                <X weight="light" className="size-5" aria-hidden />
              </IconButton>
            </Drawer.Close>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-6">
            {children}
          </div>
          {footer && <div className="border-t border-line px-5 py-4">{footer}</div>}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
