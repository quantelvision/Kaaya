'use client'

import { X } from '@phosphor-icons/react/ssr'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ContactForm } from '@/components/quantel/contact-form'
import { GateStep } from '@/components/quantel/gate-step'
import { GrainTexture } from '@/components/quantel/grain-texture'
import { LEAD_SUCCESS_MESSAGE } from '@/lib/lead'
import { QUANTEL_WHATSAPP_URL } from '@/lib/quantel'
import { resetDemoSession } from '@/stores/persisted-stores'
import { useQuantelStore } from '@/stores/quantel-store'

export function QuantelDialog() {
  const router = useRouter()
  const isOpen = useQuantelStore((state) => state.isOpen)
  const step = useQuantelStore((state) => state.step)
  const orderId = useQuantelStore((state) => state.orderId)
  const setStep = useQuantelStore((state) => state.setStep)
  const close = useQuantelStore((state) => state.close)

  const resetDemo = () => {
    resetDemoSession()
    close()
    router.push('/')
  }

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={(open) => (open ? undefined : close())}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-q-bg-dark/70 data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in" />
        <DialogPrimitive.Content className="fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-q-bg-dark font-q-body text-q-text-dark outline-none data-[state=closed]:animate-pop-out data-[state=open]:animate-pop-in md:inset-auto md:top-1/2 md:left-1/2 md:max-h-[90dvh] md:w-full md:max-w-xl md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-q md:border md:border-q-border-dark">
          <GrainTexture />
          <div className="relative flex flex-col gap-8 px-6 pt-6 pb-10 md:px-10 md:pt-8">
            <div className="flex items-center justify-between gap-4">
              <Image
                src="/brand/quantelvision/quantelvision-logo-white.png"
                alt="Quantel Vision"
                width={800}
                height={343}
                sizes="120px"
                loading="eager"
                className="h-9 w-auto"
              />
              <DialogPrimitive.Close
                aria-label="Close"
                className="-mr-2 inline-flex size-tap items-center justify-center rounded-full text-q-text-dark transition-colors hover:text-q-accent"
              >
                <X weight="light" className="size-5" aria-hidden />
              </DialogPrimitive.Close>
            </div>

            {step === 'gate' && (
              <GateStep onBookCall={() => setStep('form')} onResetDemo={resetDemo} />
            )}

            {step === 'form' && (
              <ContactForm
                source={orderId ? 'gate' : 'credit-pill'}
                orderId={orderId}
                onSuccess={() => setStep('success')}
              />
            )}

            {step === 'success' && (
              <div className="flex flex-col gap-5">
                <DialogPrimitive.Title className="font-q-heading text-2xl font-semibold text-q-text-dark">
                  {LEAD_SUCCESS_MESSAGE}
                </DialogPrimitive.Title>
                <DialogPrimitive.Description className="text-sm text-q-text-dark/70">
                  Prefer to talk now? Message us and we will reply on WhatsApp.
                </DialogPrimitive.Description>
                <div className="flex flex-wrap items-center gap-4">
                  <a
                    href={QUANTEL_WHATSAPP_URL}
                    target="_blank"
                    rel="noopener"
                    className="inline-flex min-h-12 items-center justify-center rounded-full bg-q-accent px-6 font-q-heading text-sm font-semibold text-q-text transition-colors hover:bg-q-accent-dark"
                  >
                    Chat on WhatsApp
                  </a>
                  <button
                    type="button"
                    onClick={resetDemo}
                    className="inline-flex min-h-tap items-center text-sm text-q-text-dark underline underline-offset-4"
                  >
                    Reset demo
                  </button>
                </div>
              </div>
            )}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
