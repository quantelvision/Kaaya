function requireValue(value: string | undefined, name: string): string {
  if (!value) throw new Error(`Missing environment variable: ${name}`)
  return value
}

// next inlines NEXT_PUBLIC_ values only when they are read as literal property names
export const projectId = requireValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  'NEXT_PUBLIC_SANITY_PROJECT_ID',
)

export const dataset = requireValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  'NEXT_PUBLIC_SANITY_DATASET',
)

export const apiVersion = requireValue(
  process.env.NEXT_PUBLIC_SANITY_API_VERSION,
  'NEXT_PUBLIC_SANITY_API_VERSION',
)

export const studioBasePath = '/studio'
