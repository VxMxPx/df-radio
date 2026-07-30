import { STREAM } from '@app/constants'
import { apiUrl } from '@app/lib/api'
import { playerState } from './player-state.svelte'
import { getStreamMeta, type NowPlaying, type StreamMeta } from './stream'

const META_REFRESH_INTERVAL = 30000
const SOCKET_RECONNECT_DELAY = 5000

export const createPlayerMetadata = () => {
  let refreshInterval: number | null = null
  let abortController: AbortController | null = null
  let socket: WebSocket | null = null
  let reconnectTimeout: number | null = null
  let enabled = false

  const setDefault = () => {
    playerState.streamMeta = STREAM.meta
  }

  const refresh = async () => {
    abortController?.abort()
    abortController = new AbortController()

    try {
      const response = await fetch(apiUrl('/api/stream-meta'), {
        signal: abortController.signal,
      })

      if (!response.ok) return

      const { meta } = (await response.json()) as { meta?: StreamMeta }

      if (meta?.title) playerState.streamMeta = meta
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return
    }
  }

  const startPolling = () => {
    void refresh()
    refreshInterval ??= window.setInterval(
      () => void refresh(),
      META_REFRESH_INTERVAL,
    )
  }

  const stopPolling = () => {
    if (refreshInterval !== null) {
      window.clearInterval(refreshInterval)
      refreshInterval = null
    }

    abortController?.abort()
    abortController = null
  }

  const handleNowPlaying = (nowPlaying?: NowPlaying) => {
    if (!nowPlaying) return

    const meta = getStreamMeta(nowPlaying)
    if (meta) playerState.streamMeta = meta
  }

  const handleSocketMessage = (event: MessageEvent<string>) => {
    try {
      const message = JSON.parse(event.data) as {
        connect?: {
          data?: { data?: { np?: NowPlaying } }[]
          subs?: Record<
            string,
            { publications?: { data?: { np?: NowPlaying } }[] }
          >
        }
        pub?: { data?: { np?: NowPlaying } }
      }

      if (message.pub) handleNowPlaying(message.pub.data?.np)
      message.connect?.data?.forEach(row => handleNowPlaying(row.data?.np))
      Object.values(message.connect?.subs ?? {}).forEach(subscription => {
        subscription.publications?.forEach(row =>
          handleNowPlaying(row.data?.np),
        )
      })
    } catch {
      // Ignore malformed messages and keep the connection alive.
    }
  }

  const connectSocket = () => {
    if (
      socket?.readyState === WebSocket.OPEN ||
      socket?.readyState === WebSocket.CONNECTING
    ) {
      return
    }

    const socketUrl = new URL(STREAM.apiUrl)
    socketUrl.protocol = socketUrl.protocol === 'https:' ? 'wss:' : 'ws:'
    socketUrl.pathname = `${socketUrl.pathname.replace(/\/$/, '')}/live/nowplaying/websocket`
    const nextSocket = new WebSocket(socketUrl)
    socket = nextSocket

    nextSocket.addEventListener('open', () => {
      stopPolling()
      nextSocket.send(
        JSON.stringify({
          subs: { [`station:${STREAM.station}`]: { recover: true } },
        }),
      )
    })
    nextSocket.addEventListener('message', handleSocketMessage)
    nextSocket.addEventListener('close', () => {
      if (socket === nextSocket) socket = null
      if (enabled) startPolling()
      if (enabled && reconnectTimeout === null) {
        reconnectTimeout = window.setTimeout(() => {
          reconnectTimeout = null
          connectSocket()
        }, SOCKET_RECONNECT_DELAY)
      }
    })
    nextSocket.addEventListener('error', () => nextSocket.close())
  }

  const start = () => {
    enabled = true

    if (socket?.readyState === WebSocket.OPEN) {
      stopPolling()
      return
    }

    startPolling()
    connectSocket()
  }

  const stop = () => {
    enabled = false
    stopPolling()
    socket?.close()
    socket = null

    if (reconnectTimeout !== null) {
      window.clearTimeout(reconnectTimeout)
      reconnectTimeout = null
    }
  }

  return { setDefault, start, stop }
}
