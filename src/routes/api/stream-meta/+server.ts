import { stream, type StreamMeta } from '@app/components/player/stream'
import { json, type RequestHandler } from '@sveltejs/kit'

const ICY_METADATA_HEADER = 'Icy-MetaData'
const REQUEST_TIMEOUT = 8000
const MAX_METADATA_BLOCKS = 8
const metadataUrl = stream.url.replace(/^https:/, 'http:')

const parseIcyValue = (metadata: string, key: string) => {
  const match = metadata.match(new RegExp(`${key}='([^']*)'`))

  return match?.[1]?.trim()
}

const parseStreamTitle = (streamTitle: string) => {
  const [artist, ...titleParts] = streamTitle.split(' - ')
  const title = titleParts.join(' - ').trim()

  if (!title) {
    return {
      title: streamTitle,
    }
  }

  return {
    artist: artist.trim(),
    title,
  }
}

const readStreamMetadata = async (
  reader: ReadableStreamDefaultReader<Uint8Array>,
  metaint: number,
) => {
  let bytes = new Uint8Array()
  let offset = metaint
  const decoder = new TextDecoder('iso-8859-1')

  for (let block = 0; block < MAX_METADATA_BLOCKS; block += 1) {
    while (bytes.length <= offset) {
      const { done, value } = await reader.read()

      if (done || !value) {
        return ''
      }

      const nextBytes = new Uint8Array(bytes.length + value.length)
      nextBytes.set(bytes)
      nextBytes.set(value, bytes.length)
      bytes = nextBytes
    }

    const metadataLength = bytes[offset] * 16

    while (bytes.length < offset + 1 + metadataLength) {
      const { done, value } = await reader.read()

      if (done || !value) {
        return ''
      }

      const nextBytes = new Uint8Array(bytes.length + value.length)
      nextBytes.set(bytes)
      nextBytes.set(value, bytes.length)
      bytes = nextBytes
    }

    if (metadataLength > 0) {
      return decoder
        .decode(bytes.slice(offset + 1, offset + 1 + metadataLength))
        .replace(/\0+$/g, '')
        .trim()
    }

    offset += 1 + metadataLength + metaint
  }

  return ''
}

const getStreamMeta = async () => {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT)

  try {
    const response = await fetch(metadataUrl, {
      headers: {
        [ICY_METADATA_HEADER]: '1',
      },
      signal: controller.signal,
    })
    const metaint = Number(response.headers.get('icy-metaint'))

    if (!response.ok || !response.body || !Number.isFinite(metaint)) {
      return null
    }

    const reader = response.body.getReader()

    try {
      const metadata = await readStreamMetadata(reader, metaint)
      const streamTitle = parseIcyValue(metadata, 'StreamTitle')

      if (!streamTitle) {
        return null
      }

      const streamUrl = parseIcyValue(metadata, 'StreamUrl')
      const meta: StreamMeta = {
        ...stream.meta,
        ...parseStreamTitle(streamTitle),
      }

      if (streamUrl) {
        meta.cover = streamUrl
      }

      return meta
    } finally {
      await reader.cancel().catch(() => undefined)
    }
  } finally {
    clearTimeout(timeout)
  }
}

export const GET: RequestHandler = async () => {
  const meta = await getStreamMeta().catch(() => null)

  if (!meta) {
    return json({ error: 'Stream metadata unavailable.' }, { status: 502 })
  }

  return json(
    { meta },
    {
      headers: {
        'cache-control': 'public, max-age=20',
      },
    },
  )
}
