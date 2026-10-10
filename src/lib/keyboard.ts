type TargetLike = {
  tagName?: string
  isContentEditable?: boolean
} | null

type KeyEventLike = {
  key: string
  ctrlKey: boolean
  metaKey: boolean
  shiftKey: boolean
  altKey: boolean
}

const typingTags = new Set(['INPUT', 'TEXTAREA', 'SELECT'])

export function isTypingTarget(target: TargetLike): boolean {
  if (!target) return false
  return Boolean(target.isContentEditable) || typingTags.has(target.tagName ?? '')
}

export function isCustomizerShortcut(event: KeyEventLike): boolean {
  return (
    (event.ctrlKey || event.metaKey) &&
    event.shiftKey &&
    !event.altKey &&
    event.key.toLowerCase() === 'k'
  )
}
