'use client'

import { X } from '@phosphor-icons/react/ssr'
import { useEffect, useRef } from 'react'
import { Rnd } from 'react-rnd'
import { CustomizerControls } from '@/components/customizer/customizer-controls'
import { QuantelMark } from '@/components/quantel/quantel-mark'
import { IconButton } from '@/components/ui/icon-button'
import { Sheet } from '@/components/ui/sheet'
import { useMediaQuery } from '@/hooks/use-media-query'
import { isCustomizerShortcut, isTypingTarget } from '@/lib/keyboard'
import { fontVariables, type FontKey } from '@/lib/theme/presets'
import { useCustomizerStore } from '@/stores/customizer-store'

const PANEL_WIDTH = 360
const PANEL_MARGIN = 24
const PANEL_TOP = 96
const PANEL_MAX_HEIGHT = 720

function QuantelCredit() {
  return (
    <p className="flex items-center gap-2 font-q-body text-xs text-muted">
      <QuantelMark tone="onWhite" className="size-4" />
      Theme engine by Quantel Vision
    </p>
  )
}

// preset fonts are not preloaded, so they start loading when the panel opens instead of on first click
function warmPresetFonts() {
  if (!('fonts' in document)) return
  const styles = getComputedStyle(document.documentElement)
  for (const key of Object.keys(fontVariables) as FontKey[]) {
    const family = styles.getPropertyValue(fontVariables[key]).split(',')[0]?.trim()
    if (family) void document.fonts.load(`400 1em ${family}`).catch(() => undefined)
  }
}

function DesktopPanel({ onClose }: { onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null)
  const height = Math.min(PANEL_MAX_HEIGHT, window.innerHeight - PANEL_TOP - PANEL_MARGIN)

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    panelRef.current?.focus()
    return () => {
      if (previous?.isConnected) previous.focus()
    }
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-45">
      <Rnd
        default={{
          x: window.innerWidth - PANEL_WIDTH - PANEL_MARGIN,
          y: PANEL_TOP,
          width: PANEL_WIDTH,
          height,
        }}
        minWidth={320}
        minHeight={360}
        bounds="parent"
        dragHandleClassName="customizer-drag-handle"
        className="pointer-events-auto"
      >
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="false"
          aria-labelledby="customizer-title"
          tabIndex={-1}
          className="flex size-full flex-col overflow-hidden rounded-card border border-line bg-surface text-ink shadow-float outline-none"
        >
          <div className="customizer-drag-handle flex cursor-move items-start justify-between gap-3 border-b border-line py-3 pr-2 pl-5 select-none">
            <div className="flex flex-col gap-1">
              <h2 id="customizer-title" className="heading-display text-xl">
                Theme
              </h2>
              <QuantelCredit />
            </div>
            <IconButton label="Close theme panel" onClick={onClose}>
              <X weight="light" className="size-5" aria-hidden />
            </IconButton>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5">
            <CustomizerControls />
          </div>
        </div>
      </Rnd>
    </div>
  )
}

export function Customizer() {
  const isOpen = useCustomizerStore((state) => state.isOpen)
  const setOpen = useCustomizerStore((state) => state.setOpen)
  const toggle = useCustomizerStore((state) => state.toggle)
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (isCustomizerShortcut(event) && !isTypingTarget(event.target as HTMLElement | null)) {
        event.preventDefault()
        toggle()
      } else if (event.key === 'Escape' && useCustomizerStore.getState().isOpen && isDesktop) {
        setOpen(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [toggle, setOpen, isDesktop])

  useEffect(() => {
    if (isOpen) warmPresetFonts()
  }, [isOpen])

  if (isDesktop) {
    return isOpen ? <DesktopPanel onClose={() => setOpen(false)} /> : null
  }

  return (
    <Sheet
      open={isOpen}
      onOpenChange={setOpen}
      side="bottom"
      title="Theme"
      overlayClassName="bg-transparent"
      className="max-h-[70dvh]"
    >
      <div className="flex flex-col gap-5">
        <QuantelCredit />
        <CustomizerControls />
      </div>
    </Sheet>
  )
}
