const siteUrlValue = process.env.NEXT_PUBLIC_SITE_URL

if (!siteUrlValue) throw new Error('Missing environment variable: NEXT_PUBLIC_SITE_URL')

export const siteUrl = new URL(siteUrlValue)
