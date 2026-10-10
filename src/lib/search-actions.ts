'use server'

import { getSearchSuggestions } from '@/lib/sanity/data'
import { buildSearchTerm } from '@/lib/search'

const MAX_QUERY_LENGTH = 80

export async function fetchSearchSuggestions(query: unknown) {
  if (typeof query !== 'string') return null
  const term = buildSearchTerm(query.slice(0, MAX_QUERY_LENGTH))
  if (!term) return null
  return getSearchSuggestions(term)
}
