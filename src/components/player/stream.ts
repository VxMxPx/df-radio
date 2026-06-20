export type StreamMeta = {
  title: string
  artist?: string
  album?: string
  cover?: string
  urls?: {
    name: string
    url: string
    icon?: string
    label?: string
  }[]
}

export const stream = {
  name: 'DarkForest.live',
  url: 'https://ice5.somafm.com/live-128-mp3',
  meta: {
    title: '...',
  } satisfies StreamMeta,
}
