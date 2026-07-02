export type StreamMeta = {
  title: string
  artist?: string
  album?: string
  genre?: string
  cover?: string
  duration?: number
  elapsed?: number
  receivedAt?: number
  playlist?: string
  isLive?: boolean
  streamer?: string
  listeners?: number
  urls?: {
    name: string
    url: string
    icon?: string
    label?: string
  }[]
}

export type NowPlaying = {
  now_playing?: {
    duration?: number
    elapsed?: number
    playlist?: string
    song?: {
      title?: string
      artist?: string
      album?: string
      genre?: string
      art?: string
    }
  }
  live?: {
    is_live?: boolean
    streamer_name?: string
  }
  listeners?: {
    current?: number
  }
}

export const getStreamMeta = (nowPlaying: NowPlaying): StreamMeta | null => {
  const current = nowPlaying.now_playing
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
    receivedAt: Date.now(),
    playlist: current.playlist || undefined,
    isLive: nowPlaying.live?.is_live,
    streamer: nowPlaying.live?.streamer_name || undefined,
    listeners: nowPlaying.listeners?.current,
  }
}
