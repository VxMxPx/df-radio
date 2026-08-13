export type StreamMeta = {
  title: string
  artist?: string
  album?: string
  genre?: string
  cover?: string
  duration?: number
  elapsed?: number
  received_at?: number
  playlist?: string
  is_live?: boolean
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

export type SocketMessage = {
  connect?: {
    data?: { data?: { np?: NowPlaying } }[]
    subs?: Record<string, { publications?: { data?: { np?: NowPlaying } }[] }>
  }
  pub?: { data?: { np?: NowPlaying } }
}
