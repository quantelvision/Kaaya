import { Check } from '@phosphor-icons/react/ssr'
import { cn } from '@/lib/cn'
import { formatShortDate } from '@/lib/format'
import type { TrackingStep } from '@/lib/tracking'

export function TrackingTimeline({ steps }: { steps: TrackingStep[] }) {
  return (
    <ol className="flex flex-col">
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1
        return (
          <li key={step.key} className="relative flex gap-4 pb-6 last:pb-0">
            {!isLast && (
              <span
                aria-hidden
                className={cn(
                  'absolute top-6 left-[0.6875rem] h-[calc(100%-1.5rem)] w-px',
                  step.state === 'complete' ? 'bg-primary' : 'bg-line',
                )}
              />
            )}
            <span
              aria-hidden
              className={cn(
                'relative z-10 mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full border',
                step.state === 'complete' && 'border-primary bg-primary text-on-primary',
                step.state === 'current' && 'border-primary bg-surface',
                step.state === 'upcoming' && 'border-line bg-surface',
              )}
            >
              {step.state === 'complete' && <Check weight="light" className="size-3.5" />}
              {step.state === 'current' && <span className="size-2 rounded-full bg-primary" />}
            </span>
            <div className="flex flex-col gap-0.5">
              <span
                className={cn('text-sm', step.state === 'upcoming' ? 'text-muted' : 'text-ink')}
              >
                {step.label}
                <span className="sr-only">
                  {step.state === 'complete'
                    ? ', done'
                    : step.state === 'current'
                      ? ', current step'
                      : ''}
                </span>
              </span>
              <span className="text-xs text-muted tabular-nums">
                {step.state === 'upcoming' ? 'Expected ' : ''}
                {formatShortDate(step.expectedAt)}
              </span>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
