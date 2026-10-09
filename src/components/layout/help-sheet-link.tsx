'use client'

import type { ReactNode } from 'react'
import { Sheet } from '@/components/ui/sheet'

type HelpSheetLinkProps = {
  label: string
  title: string
  children: ReactNode
}

export function HelpSheetLink({ label, title, children }: HelpSheetLinkProps) {
  return (
    <Sheet
      title={title}
      trigger={
        <button
          type="button"
          className="inline-flex min-h-tap items-center text-sm text-ink underline-offset-4 hover:underline"
        >
          {label}
        </button>
      }
    >
      <div className="flex max-w-prose flex-col gap-3 text-sm text-muted">{children}</div>
    </Sheet>
  )
}
