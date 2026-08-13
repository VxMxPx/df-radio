import { STREAM } from '$root/constants'
import { api_url } from '$root/lib/api/api'
import type { NowPlaying, SocketMessage, StreamMeta } from './player.type'

export const transform_metadata = (now: NowPlaying): StreamMeta | null => {
  const current = now.now_playing
  const song = current?.song

  if (!song?.title || !current) {
    return null
  }

  return {
    title: song.title,
    artist: song.artist || undefined,
    album: song.album || undefined,
    genre: song.genre || undefined,
    cover: song.art || undefined,
    duration: current.duration,
    elapsed: current.elapsed,
    received_at: Date.now(),
    playlist: current.playlist || undefined,
    is_live: now.live?.is_live,
    streamer: now.live?.streamer_name || undefined,
    listeners: now.listeners?.current,
  }
}

const META_REFRESH_INTERVAL = 30000
const SOCKET_RECONNECT_DELAY = 5000

type Props = {
  on_meta_update: (meta: StreamMeta) => void
}

export const create_metadata = ({ on_meta_update }: Props) => {
  let refresh_interval: number | null = null
  let abort_controller: AbortController | null = null
  let socket: WebSocket | null = null
  let reconnect_timeout: number | null = null
  let enabled = false

  const refresh = async () => {
    if (abort_controller) abort_controller.abort()
    abort_controller = new AbortController()

    try {
      const response = await fetch(api_url('/api/stream-meta'), {
        signal: abort_controller.signal,
      })
      if (!response.ok) return
      const { meta } = (await response.json()) as { meta?: StreamMeta }
      if (meta?.title) on_meta_update(meta)
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return
    }
  }

  const start_polling = () => {
    void refresh()
    refresh_interval ??= window.setInterval(
      () => void refresh(),
      META_REFRESH_INTERVAL,
    )
  }

  const stop_polling = () => {
    if (refresh_interval !== null) {
      window.clearInterval(refresh_interval)
      refresh_interval = null
    }
    abort_controller?.abort()
    abort_controller = null
  }

  const handle_now_playing = (now_playing?: NowPlaying) => {
    if (!now_playing) return
    const meta = transform_metadata(now_playing)
    if (meta) on_meta_update(meta)
  }

  const handle_socket_message = (event: MessageEvent<string>) => {
    try {
      const message = JSON.parse(event.data) as SocketMessage
      if (message.pub) handle_now_playing(message.pub.data?.np)
      message.connect?.data?.forEach((row) => handle_now_playing(row.data?.np))
      Object.values(message.connect?.subs ?? {}).forEach((subscription) => {
        subscription.publications?.forEach((row) =>
          handle_now_playing(row.data?.np),
        )
      })
    } catch {
      // ignore malformed messages and keep the connection alive
    }
  }

  const connect_socket = () => {
    if (
      socket?.readyState === WebSocket.OPEN ||
      socket?.readyState === WebSocket.CONNECTING
    ) {
      return
    }

    const socket_url = new URL(STREAM.apiUrl)
    socket_url.protocol = socket_url.protocol === 'https:' ? 'wss:' : 'ws:'
    socket_url.pathname = `${socket_url.pathname.replace(/\/$/, '')}/live/nowplaying/websocket`
    const next_socket = new WebSocket(socket_url)
    socket = next_socket

    next_socket.addEventListener('open', () => {
      stop_polling()
      next_socket.send(
        JSON.stringify({
          subs: { [`station:${STREAM.station}`]: { recover: true } },
        }),
      )
    })
    next_socket.addEventListener('message', handle_socket_message)
    next_socket.addEventListener('close', () => {
      if (socket === next_socket) socket = null
      if (enabled) start_polling()
      if (enabled && reconnect_timeout === null) {
        reconnect_timeout = window.setTimeout(() => {
          reconnect_timeout = null
          connect_socket()
        }, SOCKET_RECONNECT_DELAY)
      }
    })
    next_socket.addEventListener('error', () => next_socket.close())
  }

  const start = () => {
    enabled = true
    if (socket?.readyState === WebSocket.OPEN) {
      stop_polling()
      return
    }
    start_polling()
    connect_socket()
  }

  const stop = () => {
    enabled = false
    stop_polling()
    socket?.close()
    socket = null
    if (reconnect_timeout !== null) {
      window.clearTimeout(reconnect_timeout)
      reconnect_timeout = null
    }
  }

  return { start, stop }
}
