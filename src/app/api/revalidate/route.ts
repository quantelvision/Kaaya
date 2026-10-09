import { parseBody } from 'next-sanity/webhook'
import { revalidateTag } from 'next/cache'
import { NextResponse, type NextRequest } from 'next/server'
import { cacheTagForDocumentType } from '@/lib/sanity/cache-tags'

type WebhookPayload = {
  _type?: string
}

export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET
  if (!secret) {
    return NextResponse.json({ message: 'Revalidation is not configured.' }, { status: 500 })
  }

  try {
    const { body, isValidSignature } = await parseBody<WebhookPayload>(request, secret)
    if (!isValidSignature) {
      return NextResponse.json({ message: 'Invalid signature.' }, { status: 401 })
    }

    const tag = body?._type ? cacheTagForDocumentType(body._type) : null
    if (!tag) {
      return NextResponse.json({ message: 'Unknown document type.' }, { status: 400 })
    }

    // expire 0 makes the next visit load fresh content instead of one more stale page
    revalidateTag(tag, { expire: 0 })
    return NextResponse.json({ revalidated: true, tag })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ message: `Revalidation failed: ${message}` }, { status: 500 })
  }
}
