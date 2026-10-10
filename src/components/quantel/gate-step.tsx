'use client'

import { Check } from '@phosphor-icons/react/ssr'
import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog'
import { AnimatedCheck } from '@/components/quantel/animated-check'
import { QUANTEL_WHATSAPP_URL } from '@/lib/quantel'

const usedFeatures = [
  'Headless CMS',
  'Installable app (PWA)',
  'Coupons and loyalty',
  'Order tracking and returns',
  'Live theme engine',
]

type GateStepProps = {
  onBookCall: () => void
  onResetDemo: () => void
}

export function GateStep({ onBookCall, onResetDemo }: GateStepProps) {
  return (
    <div className="flex flex-col gap-7">
      <AnimatedCheck />
      <div className="flex flex-col gap-4">
        <DialogTitle className="font-q-heading text-2xl leading-tight font-semibold text-q-text-dark md:text-3xl">
          This demo was designed and engineered by Quantel Vision.
        </DialogTitle>
        <DialogDescription className="text-base leading-relaxed text-q-text-dark/70">
          Imagine offering your customers a fast, bespoke shopping experience with real-time CMS
          control and native PWA capabilities.
        </DialogDescription>
      </div>
      <div className="flex flex-col gap-3">
        <p className="text-xs tracking-label text-q-text-dark/60 uppercase">What you just used</p>
        <ul className="grid gap-2 sm:grid-cols-2">
          {usedFeatures.map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-sm text-q-text-dark">
              <Check weight="light" className="size-4 shrink-0 text-q-accent" aria-hidden />
              {feature}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={onBookCall}
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-q-accent px-6 text-center font-q-heading text-sm font-semibold text-q-text transition-colors hover:bg-q-accent-dark"
        >
          Book a strategy call with Quantel Vision
        </button>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onResetDemo}
            className="inline-flex min-h-tap items-center justify-center rounded-full border border-q-border-dark px-5 text-sm text-q-text-dark transition-colors hover:border-q-text-dark"
          >
            Reset demo
          </button>
          <a
            href={QUANTEL_WHATSAPP_URL}
            target="_blank"
            rel="noopener"
            className="inline-flex min-h-tap items-center text-sm text-q-text-dark underline underline-offset-4 hover:text-q-accent"
          >
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}
