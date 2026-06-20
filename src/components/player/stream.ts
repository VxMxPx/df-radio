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
  name: 'SomaFM Live',
  url: 'https://s5.radio.co/s5f6124412/listen',
  meta: {
    title: 'SomaFM Live',
    artist: 'SomaFM',
    album: 'Special Live Events and rebroadcasts of past live events',
    cover: 'https://somafm.com/logos/512/live512.jpg',
    urls: [
      {
        name: 'Homepage',
        url: 'https://somafm.com/live',
        label: 'SomaFM Live',
      },
    ],
  } satisfies StreamMeta,
}
