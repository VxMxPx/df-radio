<script lang="ts">
  import '../app.css'
  import '@fontsource/bona-nova'
  import '@fontsource/geist-mono'
  import favicon from '$lib/assets/favicon.svg'
  import { Player } from '$lib/components'
  import { player_state } from '$lib/components/player/player-state.svelte'
  import { page } from '$app/state'

  let { children } = $props()
  const playerVisible = $derived(
    player_state.is_playing || page.url.pathname !== '/',
  )
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
  <title>DarkForest.fm</title>
</svelte:head>

<div class:player-visible={playerVisible} class="app-shell">
  <Player visible={playerVisible} />
  {@render children()}
</div>

<style>
  :global {
    body {
      padding-top: var(--gap-40);
      padding-bottom: var(--gap-40);
    }
  }

  .app-shell {
    position: relative;
    display: flex;
    flex: 1;
    flex-direction: column;
  }

  .app-shell.player-visible {
    padding-top: var(--player-height);
  }
</style>
