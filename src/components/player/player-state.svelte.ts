import type { StreamMeta } from './stream'

export const playerState = $state({
  isPlaying: false,
  isLoading: false,
  isMuted: false,
  isStopping: false,
  error: '',
  streamMeta: null as StreamMeta | null,
})

let playerAudio: HTMLAudioElement | null = null

export const getPlayerAudio = () => {
  if (!playerAudio && typeof Audio !== 'undefined') {
    playerAudio = new Audio()
    playerAudio.preload = 'none'
  }

  return playerAudio
}
