<script lang="ts">
  import { Icon } from '@app/components'
  import { playerState } from './playerState.svelte'

  type PlayerState = 'normal' | 'topbar'

  let { mode = 'normal' }: { mode?: PlayerState } = $props()
  let currentState = $derived(mode)

  const togglePlaying = () => {
    playerState.isPlaying = !playerState.isPlaying
  }
</script>

<div class="Player" class:topbar={currentState === 'topbar'}>
  <div class="w-8 h-8 rounded-lg bg-white/80 shadow-xs"></div>
  <button onclick={togglePlaying}>
    <Icon
      name={!playerState.isPlaying ? 'Play' : 'Stop'}
      color="rgb(255, 255, 255, .8)"
      size={24} />
  </button>
  <button>M</button>
</div>

<style>
  @reference 'tailwindcss';
  .Player {
    @apply flex justify-between transition-all duration-500 ease-out;
  }
  .Player.topbar {
    @apply bg-black/60 flex justify-between p-4! backdrop-blur-sm! fixed
    top-0 left-0 z-10 w-full border-b-white/15 border-b
    shadow-[inset_0_-6px_10px_rgba(0,0,0,0.2)];
  }
</style>
