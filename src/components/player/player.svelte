<script lang="ts">
  import { onMount } from 'svelte'
  import { getPlayerAudio, playerState } from './player-state.svelte'
  import PlayerMetadataPopup from './player-metadata-popup.svelte'
  import { stream, type StreamMeta } from './stream'
  import { Button, Icon, Loader } from '../'

  type PlayerState = 'normal' | 'topbar'

  let { mode = 'normal' }: { mode?: PlayerState } = $props()
  let audio = $state<HTMLAudioElement | null>(null)
  let isReady = $state(false)
  let isStreamPopupOpen = $state(false)
  let currentState = $derived(mode)
  let streamMetaRefresh: number | null = null
  let streamMetaAbortController: AbortController | null = null

  const setStreamMeta = () => {
    playerState.streamMeta = stream.meta
  }

  const refreshStreamMeta = async () => {
    streamMetaAbortController?.abort()
    streamMetaAbortController = new AbortController()

    try {
      const response = await fetch('/api/stream-meta', {
        signal: streamMetaAbortController.signal,
      })

      if (!response.ok) {
        return
      }

      const { meta } = (await response.json()) as { meta?: StreamMeta }

      if (meta?.title) {
        playerState.streamMeta = meta
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return
      }
    }
  }

  const startStreamMetaRefresh = () => {
    void refreshStreamMeta()

    streamMetaRefresh ??= window.setInterval(() => {
      void refreshStreamMeta()
    }, 60000)
  }

  const stopStreamMetaRefresh = () => {
    if (streamMetaRefresh) {
      window.clearInterval(streamMetaRefresh)
      streamMetaRefresh = null
    }

    streamMetaAbortController?.abort()
    streamMetaAbortController = null
  }

  const clickDisc = async () => {
    if (!playerState.streamMeta) {
      await playStream()
      return
    }
    isStreamPopupOpen = !isStreamPopupOpen
  }

  const playStream = async () => {
    playerState.error = ''
    playerState.isLoading = true

    try {
      audio ??= getPlayerAudio()

      if (!audio) {
        throw new Error('Audio unavailable')
      }

      if (!audio.src) {
        audio.src = stream.url
      }

      await audio.play()
      setStreamMeta()
      startStreamMetaRefresh()
      playerState.isPlaying = true
    } catch {
      playerState.error = 'Stream unavailable'
      playerState.isPlaying = false
    } finally {
      playerState.isLoading = false
    }
  }

  const stopStream = () => {
    if (!audio) {
      return
    }

    playerState.isStopping = true
    playerState.error = ''
    audio.pause()
    audio.removeAttribute('src')
    audio.load()
    stopStreamMetaRefresh()
    playerState.streamMeta = null
    isStreamPopupOpen = false
    playerState.isPlaying = false
    playerState.isLoading = false

    window.setTimeout(() => {
      playerState.isStopping = false
    }, 0)
  }

  const togglePlaying = async () => {
    if (playerState.isPlaying || playerState.isLoading) {
      stopStream()
      return
    }

    await playStream()
  }

  const toggleMuted = () => {
    playerState.isMuted = !playerState.isMuted
  }

  const keydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      isStreamPopupOpen = false
    }
  }

  onMount(() => {
    window.addEventListener('keydown', keydown)
    audio = getPlayerAudio()
    const readyFrame = window.requestAnimationFrame(() => {
      isReady = true
    })

    if (!audio) {
      return () => {
        window.cancelAnimationFrame(readyFrame)
        window.removeEventListener('keydown', keydown)
      }
    }

    const playing = () => {
      playerState.isPlaying = true
      playerState.isLoading = false
      playerState.error = ''
      setStreamMeta()
      startStreamMetaRefresh()
    }
    const pause = () => {
      playerState.isPlaying = false
      playerState.isLoading = false
      stopStreamMetaRefresh()
    }
    const waiting = () => {
      playerState.isLoading = true
    }
    const error = () => {
      if (playerState.isStopping || !audio?.src) {
        playerState.error = ''
        playerState.isLoading = false
        return
      }

      playerState.error = 'Stream unavailable'
      playerState.isPlaying = false
      playerState.isLoading = false
    }

    audio.muted = playerState.isMuted
    playerState.isPlaying = !audio.paused && !audio.ended

    if (playerState.isPlaying && !playerState.streamMeta) {
      setStreamMeta()
    }

    if (playerState.isPlaying) {
      startStreamMetaRefresh()
    }

    audio.addEventListener('playing', playing)
    audio.addEventListener('pause', pause)
    audio.addEventListener('waiting', waiting)
    audio.addEventListener('error', error)

    return () => {
      window.cancelAnimationFrame(readyFrame)
      window.removeEventListener('keydown', keydown)
      audio?.removeEventListener('playing', playing)
      audio?.removeEventListener('pause', pause)
      audio?.removeEventListener('waiting', waiting)
      audio?.removeEventListener('error', error)
      stopStreamMetaRefresh()
    }
  })

  $effect(() => {
    if (audio) {
      audio.muted = playerState.isMuted
    }
  })
</script>

<div
  class="Player"
  class:ready={isReady}
  class:topbar={currentState === 'topbar'}>
  <div class="metadata" class:visible={playerState.streamMeta}>
    <!-- Disc / Album Art -->
    <Button
      onclick={clickDisc}
      onpointerdown={event => event.stopPropagation()}
      class={`Disc overflow-hidden relative shrink-0 w-10 h-10 ${playerState.isPlaying ? 'playing' : ''}`}
      aria-label={`${playerState.streamMeta ? 'Show details for' : 'Play'} ${stream.name}`}
      aria-expanded={playerState.streamMeta ? isStreamPopupOpen : undefined}>
      <div
        class="absolute overflow-hidden top-0 left-0 w-full h-full flex items-center justify-center">
        <Icon class="z-10 player" name="Play" size={16} color="#ffffff" />
        <Icon class="z-10 record" name="Disc" size={22} color="#ffffff" />
        {#if playerState.streamMeta?.cover}
          <img class="absolute z-0" src={playerState.streamMeta.cover} alt="" />
        {/if}
      </div>
    </Button>

    {#if playerState.streamMeta}
      <PlayerMetadataPopup
        label={`${stream.name} details`}
        meta={playerState.streamMeta}
        onOutsideClick={() => (isStreamPopupOpen = false)}
        open={isStreamPopupOpen}
        placement={currentState === 'topbar' ? 'bottom' : 'top'} />
    {/if}

    <div
      class="details"
      class:visible={playerState.streamMeta}
      aria-hidden={!playerState.streamMeta}>
      <div class="flex gap-1">
        <span>{playerState.streamMeta?.title}</span>
        {#if playerState.streamMeta?.artist}
          <span class="opacity-50">by</span>
          <span>{playerState.streamMeta.artist}</span>
        {/if}
      </div>
      {#if playerState.streamMeta?.urls?.length}
        <small class="flex">
          <a href={playerState.streamMeta.urls[0].url}>
            {playerState.streamMeta.artist} on
            {playerState.streamMeta.urls[0].label ||
              playerState.streamMeta.urls[0].name ||
              'Url'}
          </a>
        </small>
      {/if}
    </div>
  </div>

  <!-- Error State -->
  {#if playerState.error}
    <small>{playerState.error}</small>
  {/if}

  <!-- Toggle Play / Stop -->
  <Button
    onclick={togglePlaying}
    class="PlayToggle h-10 px-4! gap-2"
    variant={playerState.isPlaying || playerState.isLoading
      ? 'default'
      : 'accent'}
    aria-label={`${playerState.isPlaying ? 'Stop' : 'Play'} ${stream.name}`}>
    {#if playerState.isLoading}
      <Loader class="opacity-90" size={16} />
    {:else}
      {playerState.isPlaying ? 'Stop' : 'Play'}
    {/if}
  </Button>

  <!-- Toggle Mute -->
  <Button
    onclick={toggleMuted}
    class="w-10 h-10"
    aria-label={`${playerState.isMuted ? 'Unmute' : 'Mute'} ${stream.name}`}
    aria-pressed={playerState.isMuted}>
    <Icon
      name={playerState.isMuted ? 'Mute' : 'Volume'}
      size={16}
      color="#ffffff"
      class="opacity-75" />
  </Button>
</div>

<style>
  @reference 'tailwindcss';

  .Player {
    --route-motion-duration: 340ms;
    --route-motion-easing: ease;
    @apply flex w-full items-center gap-3 justify-between;
  }

  .Player.topbar {
    @apply bg-black/40 flex p-4! backdrop-blur-sm! fixed
    top-0 left-0 z-10 w-full border-b-white/15 border-b
    shadow-[inset_0_-6px_10px_rgba(0,0,0,0.2)];
    animation: topbar-arrive var(--route-motion-duration)
      var(--route-motion-easing) both;
  }

  .metadata {
    position: relative;
    display: flex;
    flex-direction: row;
    gap: 20px;
    min-width: 0;
    white-space: nowrap;
    flex-grow: 0;
    flex-basis: 40px;
    overflow: visible;
  }

  .Player.ready .metadata {
    transition:
      flex-grow 500ms ease,
      flex-basis 500ms ease;
  }
  .metadata.visible {
    flex-grow: 1;
    flex-basis: 0;
  }

  .details {
    opacity: 0;
    position: relative;
    left: -20px;
    transition:
      opacity 160ms ease,
      left 160ms ease /* transform 160ms ease */;
    overflow: hidden;
    text-overflow: ellipsis;
    display: flex;
    flex-direction: column;
    gap: 0px;
    justify-content: center;
  }
  .details > div {
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
  }

  .details.visible {
    pointer-events: auto;
    opacity: 1;
    left: 0;
    transition:
      opacity 240ms ease 520ms,
      left 360ms ease 520ms /* transform 360ms ease 520ms */;
  }

  .Player.ready .metadata.visible + :global(.PlayToggle) {
    animation: play-toggle-arrive 1s ease;
  }

  :global(.PlayToggle) {
    min-width: 80px;
    overflow: hidden;
  }

  /* Disc */
  :global(.Disc .Icon.player) {
    position: absolute;
    opacity: 0.75;
    transition: opacity 0.5s ease;
  }
  :global(.Disc.playing .Icon.player) {
    opacity: 0;
  }
  :global(.Disc .Icon.record) {
    position: relative;
    margin-top: 52px;
    transition: all 0.5s ease;
    opacity: 0;
  }
  :global(.Disc.playing .Icon.record) {
    margin-top: 0;
    animation: disc-spin 1800ms linear infinite;
    opacity: 1;
  }

  @keyframes disc-spin {
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes play-toggle-arrive {
    from {
      opacity: 0.75;
      transform: translateX(-8px) scale(0.97);
    }
    to {
      opacity: 1;
      transform: translateX(0) scale(1);
    }
  }

  @keyframes player-control-state {
    from {
      opacity: 0;
      transform: translateY(3px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes topbar-arrive {
    from {
      transform: translateY(-100%);
    }
    to {
      transform: translateY(0);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .Player.topbar {
      animation: none;
    }
  }
</style>
