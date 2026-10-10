'use client'

import { Plus } from '@phosphor-icons/react/ssr'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export type AccordionEntry = {
  id: string
  title: string
  content: ReactNode
}

type AccordionProps = {
  items: AccordionEntry[]
  defaultOpenIds?: string[]
  className?: string
}

export function Accordion({ items, defaultOpenIds, className }: AccordionProps) {
  return (
    <AccordionPrimitive.Root
      type="multiple"
      defaultValue={defaultOpenIds}
      className={cn('border-t border-line', className)}
    >
      {items.map((item) => (
        <AccordionPrimitive.Item key={item.id} value={item.id} className="border-b border-line">
          <AccordionPrimitive.Header>
            <AccordionPrimitive.Trigger className="group flex min-h-tap w-full cursor-pointer items-center justify-between gap-4 py-4 text-left text-sm font-medium text-ink">
              {item.title}
              <Plus
                weight="light"
                aria-hidden
                className="size-4 shrink-0 transition-transform duration-300 ease-out-soft group-data-[state=open]:rotate-45 motion-reduce:transition-none"
              />
            </AccordionPrimitive.Trigger>
          </AccordionPrimitive.Header>
          <AccordionPrimitive.Content className="overflow-hidden text-sm text-muted data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
            <div className="max-w-prose pb-5">{item.content}</div>
          </AccordionPrimitive.Content>
        </AccordionPrimitive.Item>
      ))}
    </AccordionPrimitive.Root>
  )
}
