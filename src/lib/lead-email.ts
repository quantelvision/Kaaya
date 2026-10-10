import type { Lead } from '@/lib/lead'
import { formatIndianMobile, normalizeIndianMobile } from '@/lib/india'
import { quantelEmailColors as color } from '@/lib/quantel-tokens'

const sourceLabels: Record<Lead['source'], string> = {
  gate: 'Conversion gate after a demo order',
  'credit-pill': 'Built by Quantel Vision pill',
}

export function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

type EmailContext = {
  submittedAt: Date
  siteUrl: string
}

function submittedLabel(date: Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Kolkata',
  }).format(date)
}

function leadRows(lead: Lead, context: EmailContext): [string, string][] {
  const phone = normalizeIndianMobile(lead.phone)
  const rows: [string, string][] = [
    ['Name', lead.name],
    ['Business', lead.businessName],
    ['Phone', phone ? formatIndianMobile(phone) : lead.phone],
    ['Email', lead.email],
    ['What they sell', lead.sells || 'Not shared'],
    ['Message', lead.message || 'No message'],
    ['Came from', sourceLabels[lead.source]],
  ]
  if (lead.orderId) rows.push(['Demo order', lead.orderId])
  rows.push(['Submitted', `${submittedLabel(context.submittedAt)} IST`])
  return rows
}

export function buildLeadEmail(lead: Lead, context: EmailContext) {
  const rows = leadRows(lead, context)
  const phone = normalizeIndianMobile(lead.phone)
  const subject = `New Kaaya demo enquiry from ${lead.businessName}`

  const rowHtml = rows
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid ${color.border};width:150px;vertical-align:top;font-size:13px;color:${color.muted};">${escapeHtml(label)}</td>
          <td style="padding:12px 0;border-bottom:1px solid ${color.border};vertical-align:top;font-size:15px;color:${color.ink};white-space:pre-line;">${escapeHtml(value)}</td>
        </tr>`,
    )
    .join('')

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(subject)}</title>
  </head>
  <body style="margin:0;padding:0;background:${color.page};font-family:Inter,Segoe UI,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${color.page};padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:${color.card};border:1px solid ${color.border};border-radius:12px;overflow:hidden;">
            <tr>
              <td style="background:${color.dark};padding:24px 32px;">
                <p style="margin:0;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:${color.accent};">New enquiry</p>
                <p style="margin:8px 0 0;font-size:22px;line-height:1.3;color:${color.onDark};font-weight:600;">${escapeHtml(lead.businessName)} wants to talk</p>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 32px 8px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rowHtml}
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 32px 32px;">
                <a href="mailto:${escapeHtml(lead.email)}" style="display:inline-block;background:${color.accent};color:${color.ink};text-decoration:none;font-size:14px;font-weight:600;padding:12px 20px;border-radius:999px;">Reply to ${escapeHtml(lead.name)}</a>
                ${phone ? `<a href="https://wa.me/91${phone}" style="display:inline-block;margin-left:8px;color:${color.ink};font-size:14px;padding:12px 8px;">WhatsApp</a>` : ''}
              </td>
            </tr>
            <tr>
              <td style="background:${color.accentWash};padding:16px 32px;font-size:12px;color:${color.muted};">
                Sent from the Kaaya demo store at ${escapeHtml(context.siteUrl)}. The visitor agreed to be contacted about this enquiry.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`

  const text = [
    subject,
    '',
    ...rows.map(([label, value]) => `${label}: ${value}`),
    '',
    `Sent from the Kaaya demo store at ${context.siteUrl}. The visitor agreed to be contacted about this enquiry.`,
  ].join('\n')

  return { subject, html, text }
}
