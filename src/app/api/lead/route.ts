import { NextResponse, type NextRequest } from 'next/server'
import { leadSchema } from '@/lib/lead'
import { buildLeadEmail } from '@/lib/lead-email'
import { createRateLimiter } from '@/lib/rate-limit'
import { sendWithResend } from '@/lib/resend'
import { siteUrl } from '@/lib/site'

const HOUR_MS = 60 * 60 * 1000
const MAX_SUBMISSIONS_PER_HOUR = 5

// in memory on purpose: the demo gets little traffic and a restart resetting the count is fine
const rateLimiter = createRateLimiter(MAX_SUBMISSIONS_PER_HOUR, HOUR_MS)

function clientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  return forwarded?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown'
}

function recipients(value: string): string[] {
  return value
    .split(',')
    .map((address) => address.trim())
    .filter(Boolean)
}

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'invalid-json' }, { status: 400 })
  }

  if (typeof body === 'object' && body !== null && 'website' in body && body.website) {
    return NextResponse.json({ error: 'rejected' }, { status: 400 })
  }

  const parsed = leadSchema.safeParse(body)
  if (!parsed.success) {
    const fields = [...new Set(parsed.error.issues.map((issue) => issue.path.join('.')))]
    return NextResponse.json({ error: 'invalid', fields }, { status: 400 })
  }

  if (!rateLimiter.check(clientIp(request), Date.now())) {
    return NextResponse.json({ error: 'rate-limited' }, { status: 429 })
  }

  const apiKey = process.env.RESEND_API_KEY
  const to = recipients(process.env.LEAD_EMAIL_TO ?? '')
  const from = process.env.LEAD_EMAIL_FROM
  if (!apiKey || !from || to.length === 0) {
    return NextResponse.json({ error: 'not-configured' }, { status: 503 })
  }

  const email = buildLeadEmail(parsed.data, { submittedAt: new Date(), siteUrl: siteUrl.origin })
  try {
    await sendWithResend({ apiKey, from, to, replyTo: parsed.data.email, ...email })
  } catch {
    return NextResponse.json({ error: 'delivery-failed' }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}
