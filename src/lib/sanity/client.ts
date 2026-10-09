import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '@/sanity/env'

// responses are cached by next with cache tags, so reads go to the live api instead of the sanity cdn
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: 'published',
})
