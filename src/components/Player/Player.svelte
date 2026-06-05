<script lang="ts">
  import Icon from '../Icon.svelte'
  import Loader from '../Loader.svelte'
  import { STREAM_NAME, STREAM_URL } from '@app/constants'
  import { playerState } from './playerState.svelte'
  import Button from '../Button.svelte'

  type PlayerState = 'normal' | 'topbar'

  let { mode = 'normal' }: { mode?: PlayerState } = $props()
  let audio: HTMLAudioElement
  let currentState = $derived(mode)

  const playStream = async () => {
    playerState.error = ''
    playerState.isLoading = true

    try {
      if (!audio.getAttribute('src')) {
        audio.src = STREAM_URL
      }
      await audio.play()
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
  <div class="flex gap-2">
    <Button
      onclick={() => !playerState.isPlaying && playStream()}
      class={`Disc w-10 h-10 ${playerState.isPlaying ? 'playing' : ''}`}
      aria-label={`Play ${STREAM_NAME}`}>
      <div
        class="absolute overflow-hidden top-0 left-0 w-full h-full flex items-center justify-center">
        <Icon class="player" name="Play" size={16} color="#ffffff" />
        <Icon class="record" name="Disc" size={22} color="#ffffff" />
      </div>
    </Button>
  </div>
  <Button
    onclick={togglePlaying}
    class="h-10 px-4! gap-2"
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
  {#if playerState.error}
    <small>{playerState.error}</small>
  {/if}
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
    @apply flex justify-between transition-all duration-1500 ease-out;
  }
  .Player.topbar {
    @apply bg-black/40 flex justify-between p-4! backdrop-blur-sm! fixed
    top-0 left-0 z-10 w-full border-b-white/15 border-b
    shadow-[inset_0_-6px_10px_rgba(0,0,0,0.2)];
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
</style>
