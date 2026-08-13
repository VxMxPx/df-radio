import { STREAM } from '$root/constants'
import { create_metadata } from './metadata.service'
import type { StreamMeta } from './player.type'

export const player_state = $state({
  is_playing: false,
  is_mutted: false,
  is_busy: false,
  error: '',
  metadata: null as StreamMeta | null,
})

let audio: HTMLAudioElement | null = null
const stream_meta = create_metadata({
  on_meta_update: (meta) => {
    player_state.metadata = { ...meta }
  },
})

export const get_audio_element = () => {
  if (!audio && typeof Audio !== 'undefined') {
    audio = new Audio()
    audio.preload = 'none'

    audio.addEventListener('playing', () => {
      player_state.is_playing = true
      player_state.is_busy = false
      player_state.error = ''
      // streamMetadata.start()
    })

    audio.addEventListener('pause', () => {
      player_state.is_playing = false
      player_state.is_busy = false
      // streamMetadata.stop()
    })

    audio.addEventListener('waiting', () => (player_state.is_busy = true))

    audio.addEventListener('error', () => {
      if (!audio?.src) {
        player_state.error = ''
        player_state.is_busy = false
        return
      }
      player_state.error = 'Stream unavailable'
      player_state.is_playing = false
      player_state.is_busy = false
    })
  }
  return audio
}

export const stop = () => {
  stop_stream()
}

export const play = () => {
  start_stream()
}

export const toggle_playing = async () => {
  if (player_state.is_playing || player_state.is_busy) {
    stop_stream()
    return
  }
  start_stream()
}

export const toggle_muted = (state?: boolean) => {
  const next = state ?? !player_state.is_mutted
  if (audio) audio.muted = next
  player_state.is_mutted = next
}

//
// private
//

const unload_stream = () => {
  audio?.pause()
  audio?.removeAttribute('src')
  audio?.load()
}

const start_stream = async () => {
  player_state.error = ''
  player_state.is_busy = true

  try {
    audio ??= get_audio_element()

    if (!audio) throw 'Audio unavailable'

    if (!audio.src) {
      audio.src = STREAM.url
    }

    if (player_state.is_mutted) audio.muted = true
    await audio.play()
    stream_meta.start()
    player_state.is_playing = true
  } catch {
    unload_stream()
    stream_meta.stop()
    player_state.metadata = null
    player_state.error = 'Stream unavailable'
    player_state.is_playing = false
  } finally {
    player_state.is_busy = false
  }
}

const stop_stream = () => {
  if (!audio) {
    return
  }
  player_state.error = ''
  unload_stream()
  stream_meta.stop()
  player_state.metadata = null
  player_state.is_playing = false
  player_state.is_busy = false
}
