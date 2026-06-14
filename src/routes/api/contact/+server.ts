import { json, type RequestHandler } from '@sveltejs/kit'
import { env } from '$env/dynamic/private'
import { Resend } from 'resend'

type ContactPayload = {
  email?: unknown
  message?: unknown
  metadata?: unknown
  name?: unknown
  reason?: unknown
}

const getString = (value: unknown) =>
  typeof value === 'string' ? value.trim() : ''

const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

const getHeader = (headers: Headers, name: string) =>
  headers.get(name)?.trim() || ''

const getClientAddressValue = (getClientAddress: () => string) => {
  try {
    return getClientAddress()
  } catch {
    return ''
  }
}

const getClientIp = (headers: Headers, getClientAddress: () => string) =>
  getHeader(headers, 'cf-connecting-ip') ||
  getHeader(headers, 'x-real-ip') ||
  getHeader(headers, 'x-forwarded-for').split(',')[0]?.trim() ||
  getClientAddressValue(getClientAddress)

const getClientGeo = (headers: Headers) => ({
  city:
    getHeader(headers, 'cf-ipcity') ||
    getHeader(headers, 'x-vercel-ip-city'),
  country:
    getHeader(headers, 'cf-ipcountry') ||
    getHeader(headers, 'x-vercel-ip-country'),
  region:
    getHeader(headers, 'cf-region') ||
    getHeader(headers, 'x-vercel-ip-country-region'),
})

const getMetadataRecord = (metadata: unknown) => {
  if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) {
    return {}
  }

  return metadata as Record<string, unknown>
}

const getMetadataString = (value: unknown) => {
  const maxLength = 300

  if (typeof value === 'string') {
    return value.replace(/\s+/g, ' ').trim().slice(0, maxLength)
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }

  return ''
}

export const POST: RequestHandler = async ({ getClientAddress, request }) => {
  const apiKey = env.RESEND_API_KEY
  const to = env.CONTACT_TO_EMAIL
  const from = env.CONTACT_FROM_EMAIL

  if (!apiKey || !to || !from) {
    return json(
      {
        error: 'Email is not configured.',
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
  const metadata = getMetadataRecord(payload.metadata)
  const headers = request.headers
  const geo = getClientGeo(headers)
  const requestContext = [
    ['IP', getClientIp(headers, getClientAddress)],
    ['Country', geo.country],
    ['Region', geo.region],
    ['City', geo.city],
    ['Browser', getMetadataString(metadata.browser)],
    ['Device', getMetadataString(metadata.device)],
    ['Platform', getMetadataString(metadata.platform)],
    ['Language', getMetadataString(metadata.language)],
    ['Timezone', getMetadataString(metadata.timezone)],
    ['Screen', getMetadataString(metadata.screen)],
    ['Viewport', getMetadataString(metadata.viewport)],
    ['User agent', getMetadataString(metadata.userAgent)],
    ['Request user agent', getHeader(headers, 'user-agent')],
  ]
  const contextLines = requestContext
    .filter(([, value]) => value)
    .map(([label, value]) => `${label}: ${value}`)

  if (!name || !email || !message) {
    return json(
      { error: 'Please fill in all required fields.' },
      { status: 400 },
    )
  }

  if (!isEmail(email)) {
    return json(
      { error: 'Please enter a valid email address.' },
      { status: 400 },
    )
  }

  const resend = new Resend(apiKey)
  const subject = `DarkForest.fm contact: ${reason}`
  const text = [
    `Reason: ${reason}`,
    `Name: ${name}`,
    `Email: ${email}`,
    '',
    message,
    '',
    '---',
    'Request context',
    ...contextLines,
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
