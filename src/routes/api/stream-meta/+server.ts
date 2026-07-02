import { STREAM } from '@app/constants'
import { getStreamMeta, type NowPlaying } from '@app/components/player/stream'
import { json, type RequestHandler } from '@sveltejs/kit'

const REQUEST_TIMEOUT = 8000

export const GET: RequestHandler = async ({ fetch }) => {
  const response = await fetch(
    `${STREAM.apiUrl}/nowplaying/${encodeURIComponent(STREAM.station)}`,
    { signal: AbortSignal.timeout(REQUEST_TIMEOUT) },
  ).catch(() => null)

  if (!response?.ok) {
    return json({ error: 'Stream metadata unavailable.' }, { status: 502 })
  }

  const nowPlaying = (await response.json()) as NowPlaying
  const meta = getStreamMeta(nowPlaying)

  if (!meta) {
    return json({ error: 'Stream metadata unavailable.' }, { status: 502 })
  }

  return json(
    { meta },
    {
      headers: {
        'cache-control': 'public, max-age=5',
      },
    },
  )
}
