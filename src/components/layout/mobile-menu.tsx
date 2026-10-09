'use client'

import { List } from '@phosphor-icons/react/ssr'
import Link from 'next/link'
import { useState } from 'react'
import { CategoryIcon } from '@/components/icons/category-icon'
import type { NavCategory, NavEdit } from '@/components/layout/nav-types'
import { IconButton } from '@/components/ui/icon-button'
import { Sheet } from '@/components/ui/sheet'

type MobileMenuProps = {
  categories: NavCategory[]
  edits: NavEdit[]
}

const rowClasses =
  'flex min-h-tap items-center gap-3 border-b border-line py-2 text-base text-ink transition-colors hover:text-primary'

export function MobileMenu({ categories, edits }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const close = () => setIsOpen(false)

  return (
    <Sheet
      open={isOpen}
      onOpenChange={setIsOpen}
      side="left"
      title="Menu"
      isTitleHidden
      trigger={
        <IconButton label="Open menu" className="-ml-3 md:hidden">
          <List weight="light" className="size-6" aria-hidden />
        </IconButton>
      }
    >
      <nav aria-label="Mobile" className="flex flex-col gap-8 pt-2">
        <div>
          <p className="mb-2 label-caps text-muted">Shop</p>
          <ul>
            <li>
              <Link href="/shop" onNavigate={close} className={rowClasses}>
                Shop all
              </Link>
            </li>
            {categories.map((category) => (
              <li key={category.slug}>
                <Link href={`/shop/${category.slug}`} onNavigate={close} className={rowClasses}>
                  <CategoryIcon iconKey={category.iconKey} className="text-muted" />
                  {category.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-2 label-caps text-muted">Edits</p>
          <ul>
            {edits.map((edit) => (
              <li key={edit.slug}>
                <Link href={`/edits/${edit.slug}`} onNavigate={close} className={rowClasses}>
                  {edit.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <ul>
          <li>
            <Link href="/wishlist" onNavigate={close} className={rowClasses}>
              Wishlist
            </Link>
          </li>
          <li>
            <Link href="/rewards" onNavigate={close} className={rowClasses}>
              Kaaya rewards
            </Link>
          </li>
        </ul>
      </nav>
    </Sheet>
  )
}
