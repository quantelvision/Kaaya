'use client'

import { Palette } from '@phosphor-icons/react/ssr'
import { useCustomizerStore } from '@/stores/customizer-store'

export function CustomizerButton() {
  const isOpen = useCustomizerStore((state) => state.isOpen)
  const toggle = useCustomizerStore((state) => state.toggle)

  return (
    <button
      type="button"
      aria-expanded={isOpen}
      aria-haspopup="dialog"
      aria-keyshortcuts="Control+Shift+K Meta+Shift+K"
      onClick={toggle}
      className="fixed right-4 floating-bottom z-40 inline-flex h-11 items-center gap-2 rounded-full border border-line bg-surface pr-4 pl-3 text-xs font-medium text-ink shadow-float transition-colors duration-200 hover:border-ink"
    >
      <Palette weight="light" className="size-5" aria-hidden />
      Customize
    </button>
  )
}
