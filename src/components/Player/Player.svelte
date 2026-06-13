<script lang="ts">
  import Icon from '../Icon.svelte'
  import Loader from '../Loader.svelte'
  import { STREAM_NAME, STREAM_URL } from '@app/constants'
  import { playerState } from './playerState.svelte'
  import Button from '../Button.svelte'

  type PlayerState = 'normal' | 'topbar'
  type StreamMeta = {
    title: string
    artist?: string
    cover?: string
    urlName?: string
    url?: string
  }

  let { mode = 'normal' }: { mode?: PlayerState } = $props()
  let audio: HTMLAudioElement
  let currentState = $derived(mode)
  let streamMeta = $state<StreamMeta | null>(null)

  const setStreamMeta = () => {
    streamMeta = {
      title: 'Gravity',
      artist: 'R3DN1K',
      cover: '/public/channels4_profile.jpg',
      urlName: 'R3DN1K on YouTube',
      url: 'https://YouTube.com',
    }
  }

  const playStream = async () => {
    playerState.error = ''
    playerState.isLoading = true

    try {
      if (!audio.getAttribute('src')) {
        audio.src = STREAM_URL
      }
      await audio.play()
      setStreamMeta()
      playerState.isPlaying = true
    } catch {
      playerState.error = 'Stream unavailable'
      playerState.isPlaying = false
    } finally {
      playerState.isLoading = false
    }
  }

  const stopStream = () => {
    audio.pause()
    audio.removeAttribute('src')
    audio.load()
    streamMeta = null
    playerState.isPlaying = false
    playerState.isLoading = false
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
</script>

<div class="Player" class:topbar={currentState === 'topbar'}>
  <!-- Audio Element -->
  <audio
    bind:this={audio}
    src={STREAM_URL}
    muted={playerState.isMuted}
    preload="none"
    onplaying={() => {
      playerState.isPlaying = true
      playerState.isLoading = false
      playerState.error = ''
    }}
    onpause={() => {
      playerState.isPlaying = false
      playerState.isLoading = false
    }}
    onwaiting={() => {
      playerState.isLoading = true
    }}
    onerror={() => {
      playerState.error = 'Stream unavailable'
      playerState.isPlaying = false
      playerState.isLoading = false
    }}>
    <track kind="captions" />
  </audio>
  <!-- Main Controls -->

  <div class="metadata" class:visible={streamMeta}>
    <!-- Disc / Album Art -->
    <Button
      onclick={() => !playerState.isPlaying && playStream()}
      class={`Disc overflow-hidden relative w-10 h-10 ${playerState.isPlaying ? 'playing' : ''}`}
      aria-label={`Play ${STREAM_NAME}`}>
      <div
        class="absolute overflow-hidden top-0 left-0 w-full h-full flex items-center justify-center">
        <Icon class="z-10 player" name="Play" size={16} color="#ffffff" />
        <Icon class="z-10 record" name="Disc" size={22} color="#ffffff" />
        {#if streamMeta && streamMeta.cover}
          <img class="absolute z-0" src={streamMeta.cover} alt="" />
        {/if}
      </div>
    </Button>

    <div class="details" class:visible={streamMeta} aria-hidden={!streamMeta}>
      <div class="flex gap-1">
        <span>{streamMeta?.title}</span>
        {#if streamMeta?.artist}
          <span class="opacity-50">by</span>
          <span>{streamMeta.artist}</span>
        {/if}
      </div>
      {#if streamMeta?.url}
        <small class="flex">
          <a href={streamMeta.url}>{streamMeta.urlName || 'URL'}</a>
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
    class="PlayToggle h-10 px-4! gap-2 min-w-20"
    variant={playerState.isPlaying || playerState.isLoading
      ? 'default'
      : 'accent'}
    aria-label={`${playerState.isPlaying ? 'Stop' : 'Play'} ${STREAM_NAME}`}>
    {#if playerState.isLoading}
      <Loader class="opacity-90" size={16} />
    {:else}
      <!-- <Icon name={playerState.isPlaying ? 'Stop' : 'Play'} size={12} /> -->
      {playerState.isPlaying ? 'Stop' : 'Play'}
    {/if}
  </Button>

  <!-- Toggle Mute -->
  <Button
    onclick={toggleMuted}
    class="w-10 h-10"
    aria-label={`${playerState.isMuted ? 'Unmute' : 'Mute'} ${STREAM_NAME}`}
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
    @apply flex w-full items-center gap-3 justify-between transition-all duration-1500 ease-out;
  }
  .Player.topbar {
    @apply bg-black/40 flex p-4! backdrop-blur-sm! fixed
    top-0 left-0 z-10 w-full border-b-white/15 border-b
    shadow-[inset_0_-6px_10px_rgba(0,0,0,0.2)];
  }
  .metadata {
    display: flex;
    flex-direction: row;
    gap: 20px;
    min-width: 0;
    white-space: nowrap;
    flex-grow: 0;
  }
  .metadata.visible {
    flex-grow: 1;
  }
  .details {
    opacity: 0;
    transform: translateX(-8px);
    transition:
      opacity 240ms ease,
      transform 1s ease;
    overflow: hidden;
    text-overflow: ellipsis;
    display: flex;
    flex-direction: column;
    gap: 0px;
  }
  .details.visible {
    pointer-events: auto;
    opacity: 1;
    transform: translateX(0);
  }
  .metadata.visible + :global(.PlayToggle) {
    animation: play-toggle-arrive 1s ease;
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
</style>
