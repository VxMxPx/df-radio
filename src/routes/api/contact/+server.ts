import { json, type RequestHandler } from '@sveltejs/kit'
import { env } from '$env/dynamic/private'
import { Resend } from 'resend'

type ContactPayload = {
  email?: unknown
  message?: unknown
  name?: unknown
  reason?: unknown
}

const getString = (value: unknown) =>
  typeof value === 'string' ? value.trim() : ''

const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

export const POST: RequestHandler = async ({ request }) => {
  const apiKey = env.RESEND_API_KEY
  const to = env.CONTACT_TO_EMAIL
  const from = env.CONTACT_FROM_EMAIL

  if (!apiKey || !to || !from) {
    return json(
      {
        error:
          'Email is not configured. Please set RESEND_API_KEY, CONTACT_TO_EMAIL, and CONTACT_FROM_EMAIL.',
      },
      { status: 500 },
    )
  }

  let payload: ContactPayload

  try {
    payload = (await request.json()) as ContactPayload
  } catch {
    return json({ error: 'Invalid request.' }, { status: 400 })
  }

  const name = getString(payload.name)
  const email = getString(payload.email)
  const reason = getString(payload.reason) || 'Contact'
  const message = getString(payload.message)

  if (!name || !email || !message) {
    return json({ error: 'Please fill in all required fields.' }, { status: 400 })
  }

  if (!isEmail(email)) {
    return json({ error: 'Please enter a valid email address.' }, { status: 400 })
  }

  const resend = new Resend(apiKey)
  const subject = `DarkForest.fm contact: ${reason}`
  const text = [
    `Reason: ${reason}`,
    `Name: ${name}`,
    `Email: ${email}`,
    '',
    message,
  ].join('\n')

  try {
    const result = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject,
      text,
    })

    if (result.error) {
      return json(
        { error: result.error.message || 'Message could not be sent.' },
        { status: 502 },
      )
    }

    return json({ ok: true })
  } catch {
    return json({ error: 'Message could not be sent.' }, { status: 502 })
  }
}
