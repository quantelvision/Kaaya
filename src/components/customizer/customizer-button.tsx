import { Palette } from '@phosphor-icons/react/ssr'

export function CustomizerButton() {
  return (
    <button
      type="button"
      className="fixed right-4 floating-bottom z-40 inline-flex h-11 items-center gap-2 rounded-full border border-line bg-surface pr-4 pl-3 text-xs font-medium text-ink shadow-float transition-colors duration-200 hover:border-ink"
    >
      <Palette weight="light" className="size-5" aria-hidden />
      Customize
    </button>
  )
}
