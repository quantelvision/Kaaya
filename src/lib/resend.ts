const RESEND_ENDPOINT = 'https://api.resend.com/emails'

type EmailMessage = {
  apiKey: string
  from: string
  to: string[]
  replyTo?: string
  subject: string
  html: string
  text: string
}

export async function sendWithResend(message: EmailMessage): Promise<void> {
  const response = await fetch(RESEND_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${message.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: message.from,
      to: message.to,
      reply_to: message.replyTo,
      subject: message.subject,
      html: message.html,
      text: message.text,
    }),
  })

  if (!response.ok) {
    const detail = await response.text().catch(() => '')
    throw new Error(`Resend responded with ${response.status} ${detail.slice(0, 200)}`)
  }
}
