import type { ClientReturn, QueryParams } from 'next-sanity'
import { cacheLife, cacheTag } from 'next/cache'
import type { CacheTag } from '@/lib/sanity/cache-tags'
import { sanityClient } from '@/lib/sanity/client'

type SanityFetchOptions<QueryString extends string> = {
  query: QueryString
  params?: QueryParams
  tags: CacheTag[]
}

// the publish webhook revalidates by tag, the hourly lifetime only covers a missed webhook
export async function sanityFetch<const QueryString extends string>({
  query,
  params = {},
  tags,
}: SanityFetchOptions<QueryString>): Promise<ClientReturn<QueryString, unknown>> {
  'use cache'
  cacheLife('hours')
  cacheTag(...tags)
  return sanityClient.fetch(query, params)
}
