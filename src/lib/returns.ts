import type { CartLine } from '@/lib/cart'
import type { ReturnItem, ReturnReason } from '@/lib/order'

export const REFUND_POINTS_BONUS = 0.1

export type ReturnLineDraft = {
  isSelected: boolean
  reason: ReturnReason | ''
  resolution: 'exchange' | 'refund'
  exchangeSize: string
  refundTo: 'original' | 'points'
}

export const emptyReturnLine: ReturnLineDraft = {
  isSelected: false,
  reason: '',
  resolution: 'refund',
  exchangeSize: '',
  refundTo: 'original',
}

export function exchangeSizes(line: CartLine): string[] {
  return line.availableSizes
    .filter((entry) => entry.stock > 0 && entry.size !== line.size)
    .map((entry) => entry.size)
}

export function refundPointsFor(amount: number, pointValueRupees: number): number {
  if (pointValueRupees <= 0) return 0
  return Math.round((amount * (1 + REFUND_POINTS_BONUS)) / pointValueRupees)
}

export type ReturnErrors = Record<string, string>

export function validateReturn(
  lines: CartLine[],
  drafts: Record<string, ReturnLineDraft>,
  slotId: string,
): ReturnErrors {
  const errors: ReturnErrors = {}
  const selected = lines.filter((line) => drafts[line.id]?.isSelected)
  if (selected.length === 0) errors.items = 'Choose at least one piece to return or exchange.'

  for (const line of selected) {
    const draft = drafts[line.id]
    if (!draft) continue
    if (!draft.reason) errors[`${line.id}.reason`] = 'Choose a reason.'
    if (draft.resolution === 'exchange' && !exchangeSizes(line).includes(draft.exchangeSize)) {
      errors[`${line.id}.exchangeSize`] = 'Choose a size that is in stock.'
    }
  }

  if (!slotId) errors.slot = 'Choose a pickup slot.'
  return errors
}

export function buildReturnItems(
  lines: CartLine[],
  drafts: Record<string, ReturnLineDraft>,
  pointValueRupees: number,
): ReturnItem[] {
  return lines.flatMap((line) => {
    const draft = drafts[line.id]
    if (!draft?.isSelected || !draft.reason) return []
    const amount = line.unitPrice * line.quantity
    const isRefund = draft.resolution === 'refund'
    return [
      {
        lineId: line.id,
        reason: draft.reason,
        resolution: draft.resolution,
        exchangeSize: isRefund ? null : draft.exchangeSize,
        refundTo: isRefund ? draft.refundTo : null,
        refundAmount: isRefund ? amount : 0,
        refundPoints:
          isRefund && draft.refundTo === 'points' ? refundPointsFor(amount, pointValueRupees) : 0,
      },
    ]
  })
}
