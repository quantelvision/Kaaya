const MAX_SEARCH_WORDS = 5
export const MIN_SEARCH_LENGTH = 2

// groq match works on whole tokens, so each word gets a wildcard to match as you type
export function buildSearchTerm(query: string): string | null {
  const words = query
    .toLowerCase()
    .split(/\s+/)
    .map((word) => word.replace(/[^\p{L}\p{N}-]/gu, ''))
    .filter((word) => word.length > 0)
    .slice(0, MAX_SEARCH_WORDS)

  if (words.join('').length < MIN_SEARCH_LENGTH) return null
  return words.map((word) => `${word}*`).join(' ')
}

export function normalizeQuery(query: string): string {
  return query.trim().replace(/\s+/g, ' ')
}
