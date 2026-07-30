<script lang="ts">
  import { onMount } from 'svelte'
  import { STREAM } from '@app/constants'
  import { getPlayerAudio, playerState } from './player-state.svelte'
  import { createPlayerMetadata } from './player-metadata'
  import PlayerMetadataPopup from './player-metadata-popup.svelte'
  import { Button, Icon, Loader } from '../'

  type PlayerState = 'normal' | 'topbar'

  //
  // state
  //
  let { mode = 'normal' }: { mode?: PlayerState } = $props()
  let audio = $state<HTMLAudioElement | null>(null)
  let isReady = $state(false)
  let isStreamPopupOpen = $state(false)
  const streamMetadata = createPlayerMetadata()

  //
  // unloads stream on error or when stopped
  //
  const unloadStream = () => {
    audio?.pause()
    audio?.removeAttribute('src')
    audio?.load()
  }

  //
  // clicking disk displays metadata details
  //
  const handleShowMetadata = async () => {
    if (!playerState.streamMeta) {
      await playStream()
      return
    }
    isStreamPopupOpen = !isStreamPopupOpen
  }

  //
  // start the stream playing
  //
  const playStream = async () => {
    playerState.error = ''
    playerState.isLoading = true

    try {
      audio ??= getPlayerAudio()

      if (!audio) {
        throw new Error('Audio unavailable')
      }

      if (!audio.src) {
        audio.src = STREAM.url
      }

      await audio.play()
      streamMetadata.setDefault()
      streamMetadata.start()
      playerState.isPlaying = true
    } catch {
      unloadStream()
      streamMetadata.stop()
      playerState.streamMeta = null
      playerState.error = 'Stream unavailable'
      playerState.isPlaying = false
      setErrorCleanup()
    } finally {
      playerState.isLoading = false
    }
  }

  //
  // clear error after couple of seconds
  //
  const setErrorCleanup = () => {
    setTimeout(() => {
      playerState.error = ''
    }, 5000)
  }

  //
  // handle stopping the stream
  //
  const stopStream = () => {
    if (!audio) {
      return
    }

    playerState.isStopping = true
    playerState.error = ''
    unloadStream()
    streamMetadata.stop()
    playerState.streamMeta = null
    isStreamPopupOpen = false
    playerState.isPlaying = false
    playerState.isLoading = false

    window.setTimeout(() => {
      playerState.isStopping = false
    }, 0)
  }

  //
  // toggles play/stop state of the stream
  //
  const togglePlaying = async () => {
    if (playerState.isPlaying || playerState.isLoading) {
      stopStream()
      return
    }
    await playStream()
  }

  //
  // toggles muted state
  //
  const toggleMuted = () => {
    playerState.isMuted = !playerState.isMuted
  }

  //
  // hide details on esc
  //
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
      streamMetadata.setDefault()
      streamMetadata.start()
    }
    const pause = () => {
      playerState.isPlaying = false
      playerState.isLoading = false
      streamMetadata.stop()
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
    playerState.isPlaying =
      Boolean(audio.src) && !audio.paused && !audio.ended && !audio.error

    if (playerState.isPlaying && !playerState.streamMeta) {
      streamMetadata.setDefault()
    }

    if (playerState.isPlaying) {
      streamMetadata.start()
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
      streamMetadata.stop()
    }
  })

  $effect(() => {
    if (audio) {
      audio.muted = playerState.isMuted
    }
  })
</script>

<div class="Player" class:ready={isReady} class:topbar={mode === 'topbar'}>
  <div class="metadata" class:visible={playerState.streamMeta}>
    <!-- Disc / Album Art -->
    <Button
      onclick={handleShowMetadata}
      onpointerdown={(event) => event.stopPropagation()}
      class={`Disc ${playerState.isPlaying ? 'playing' : ''}`}
      aria-label={`${playerState.streamMeta ? 'Show details for' : 'Play'} ${STREAM.name}`}
      aria-expanded={playerState.streamMeta ? isStreamPopupOpen : undefined}
    >
      <div class="Disc__content">
        <Icon class="player" name="Play" size={16} color="#ffffff" />
        <Icon class="record" name="Disc" size={22} color="#ffffff" />
        {#if playerState.streamMeta?.cover}
          <img src={playerState.streamMeta.cover} alt="" />
        {/if}
      </div>
    </Button>

    {#if playerState.streamMeta}
      <PlayerMetadataPopup
        label={`${STREAM.name} details`}
        meta={playerState.streamMeta}
        onOutsideClick={() => (isStreamPopupOpen = false)}
        open={isStreamPopupOpen}
        placement={mode === 'topbar' ? 'bottom' : 'top'}
      />
    {/if}

    <div
      class="details"
      class:visible={playerState.streamMeta}
      aria-hidden={!playerState.streamMeta}
    >
      <div class="track-title">
        <span>{playerState.streamMeta?.title}</span>
        {#if playerState.streamMeta?.artist}
          <span class="by">by</span>
          <span>{playerState.streamMeta.artist}</span>
        {/if}
      </div>
      {#if playerState.streamMeta?.urls?.length}
        <small class="track-link">
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
    class="PlayToggle"
    variant={playerState.isPlaying || playerState.isLoading
      ? 'default'
      : 'accent'}
    aria-label={`${playerState.isPlaying ? 'Stop' : 'Play'} ${STREAM.name}`}
  >
    {#if playerState.isLoading}
      <Loader class="PlayToggle__loader" size={16} />
    {:else}
      {playerState.isPlaying ? 'Stop' : 'Play'}
    {/if}
  </Button>

  <!-- Toggle Mute -->
  <Button
    onclick={toggleMuted}
    class="MuteToggle"
    aria-label={`${playerState.isMuted ? 'Unmute' : 'Mute'} ${STREAM.name}`}
    aria-pressed={playerState.isMuted}
  >
    <Icon
      name={playerState.isMuted ? 'Mute' : 'Volume'}
      size={16}
      color="#ffffff"
      class="MuteToggle__icon"
    />
  </Button>
</div>

<style>
  .Player {
    --route-motion-duration: 340ms;
    --route-motion-easing: ease;
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
  }

  .Player.topbar {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 22;
    display: flex;
    width: 100%;
    padding: 1rem !important;
    border-bottom: 1px solid rgb(255 255 255 / 0.15);
    background: rgb(0 0 0 / 0.4);
    box-shadow: inset 0 -6px 10px rgb(0 0 0 / 0.2);
    backdrop-filter: blur(4px) !important;
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
    height: 2.5rem;
    padding: 0 1rem !important;
    gap: 0.5rem;
  }

  :global(.PlayToggle__loader) {
    opacity: 0.9;
  }

  :global(.MuteToggle) {
    width: 2.5rem;
    height: 2.5rem;
  }

  :global(.MuteToggle__icon) {
    opacity: 0.75;
  }

  /* Disc */
  :global(.Disc) {
    position: relative;
    flex-shrink: 0;
    width: 2.5rem;
    height: 2.5rem;
    overflow: hidden;
  }
  .Disc__content {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  .Disc__content img {
    position: absolute;
    z-index: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  :global(.Disc .Icon.player) {
    position: absolute;
    z-index: 10;
    opacity: 0.75;
    transition: opacity 0.5s ease;
  }
  :global(.Disc.playing .Icon.player) {
    opacity: 0;
  }
  :global(.Disc .Icon.record) {
    position: relative;
    z-index: 10;
    margin-top: 52px;
    transition: all 0.5s ease;
    opacity: 0;
  }
  :global(.Disc.playing .Icon.record) {
    margin-top: 0;
    animation: disc-spin 1800ms linear infinite;
    opacity: 1;
  }

  .track-title,
  .track-link {
    display: flex;
  }

  .track-title {
    gap: 0.25rem;
  }

  .by {
    opacity: 0.5;
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
