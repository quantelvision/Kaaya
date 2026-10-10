'use client'

import { CaretDown } from '@phosphor-icons/react/ssr'
import * as Popover from '@radix-ui/react-popover'
import Link from 'next/link'
import { useState } from 'react'
import type { NavEdit } from '@/components/layout/nav-types'
import { navLinkClasses } from '@/components/layout/nav-link-classes'

export function LooksMenu({ edits }: { edits: NavEdit[] }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger className={navLinkClasses('group gap-1')}>
        Looks
        <CaretDown
          weight="light"
          aria-hidden
          className="size-3.5 transition-transform duration-200 group-data-[state=open]:rotate-180"
        />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={4}
          className="z-50 w-64 rounded-card border border-line bg-surface p-2 shadow-float outline-none data-[state=closed]:animate-pop-out data-[state=open]:animate-pop-in"
        >
          <ul className="flex flex-col">
            {edits.map((edit) => (
              <li key={edit.slug}>
                <Link
                  href={`/looks/${edit.slug}`}
                  onNavigate={() => setIsOpen(false)}
                  className="flex min-h-tap items-center rounded-control px-3 text-sm text-ink transition-colors hover:bg-wash"
                >
                  {edit.title}
                </Link>
              </li>
            ))}
          </ul>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
