import { describe, expect, it } from 'vitest'
import { buildSearchTerm, normalizeQuery } from '@/lib/search'

describe('buildSearchTerm', () => {
  it('adds a wildcard to every word', () => {
    expect(buildSearchTerm('Linen shirt')).toBe('linen* shirt*')
  })

  it('removes characters that groq would read as syntax', () => {
    expect(buildSearchTerm('denim" || true')).toBe('denim* true*')
  })

  it('keeps hyphenated words and limits the word count', () => {
    expect(buildSearchTerm('low-rise a b c d e f')).toBe('low-rise* a* b* c* d*')
  })

  it('returns null for very short input', () => {
    expect(buildSearchTerm(' a ')).toBeNull()
    expect(buildSearchTerm('')).toBeNull()
  })
})

describe('normalizeQuery', () => {
  it('trims and collapses spaces', () => {
    expect(normalizeQuery('  cargo   pants ')).toBe('cargo pants')
  })
})
