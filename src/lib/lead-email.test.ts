import { describe, expect, it } from 'vitest'
import { leadSchema } from '@/lib/lead'
import { buildLeadEmail, escapeHtml } from '@/lib/lead-email'
import { createRateLimiter } from '@/lib/rate-limit'

describe('createRateLimiter', () => {
  it('allows five submissions per hour for one key', () => {
    const limiter = createRateLimiter(5, 60 * 60 * 1000)
    const results = Array.from({ length: 6 }, (_, index) => limiter.check('1.2.3.4', index))
    expect(results).toEqual([true, true, true, true, true, false])
    expect(limiter.check('5.6.7.8', 10)).toBe(true)
  })

  it('frees the key after the window', () => {
    const limiter = createRateLimiter(1, 1000)
    expect(limiter.check('ip', 0)).toBe(true)
    expect(limiter.check('ip', 500)).toBe(false)
    expect(limiter.check('ip', 1001)).toBe(true)
  })
})

describe('buildLeadEmail', () => {
  const lead = leadSchema.parse({
    name: 'Arjun <Mehta>',
    businessName: 'Mehta & Sons',
    phone: '98400 12345',
    email: 'arjun@mehtatextiles.in',
    message: 'We sell sarees\nonline and offline',
    consent: true,
    source: 'gate',
    orderId: 'KY-261010-0421',
  })
  const email = buildLeadEmail(lead, {
    submittedAt: new Date('2026-10-10T08:30:00Z'),
    siteUrl: 'https://kaaya.quantelvision.com',
  })

  it('names the business in the subject', () => {
    expect(email.subject).toBe('New Kaaya demo enquiry from Mehta & Sons')
  })

  it('escapes visitor input in the html', () => {
    expect(email.html).toContain('Arjun &lt;Mehta&gt;')
    expect(email.html).toContain('Mehta &amp; Sons')
    expect(email.html).not.toContain('<Mehta>')
  })

  it('includes every field in the text version', () => {
    expect(email.text).toContain('Phone: +91 98400 12345')
    expect(email.text).toContain('Demo order: KY-261010-0421')
    expect(email.text).toContain('Came from: Conversion gate after a demo order')
    expect(email.text).toContain('Submitted: 10 Oct 2026, 2:00 pm IST')
  })

  it('escapes all html special characters', () => {
    expect(escapeHtml(`<a href="x">'&'</a>`)).toBe(
      '&lt;a href=&quot;x&quot;&gt;&#39;&amp;&#39;&lt;/a&gt;',
    )
  })
})
