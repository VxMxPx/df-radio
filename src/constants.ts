import type { StreamMeta } from '@app/components/player/stream'

export const APP_NAME = 'DarkForest.fm'
export const APP_DESC =
  'Waves of sound, thought, and symbol. Streaming from an alternate present. Welcome to the broadcast beyond the ordinary.'
export const APP_VERSION = '0.1'
export const ME = 'MDCCC'
export const STREAM = {
  name: 'DarkForest.live',
  url: 'http://192.168.1.190/listen/darkforest.fm/radio.mp3',
  apiUrl: 'http://192.168.1.190/api',
  station: 'darkforest.fm',
  meta: {
    title: '→',
  } satisfies StreamMeta,
}
