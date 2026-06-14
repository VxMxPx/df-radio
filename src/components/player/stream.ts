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
  url: 'https://ice5.somafm.com/live-128-mp3',
  meta: {
    title: 'Gravity',
    artist: 'R3DN1K',
    album: '',
    // cover: '/channels4_profile.jpg',
    urls: [
      { name: 'YouTube', url: 'https://youtube.com/home' },
      { name: 'Homepage', url: 'https://foobaz', label: 'Homepage' },
    ],
  } satisfies StreamMeta,
}
