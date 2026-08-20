<script lang="ts">
  import '../app.css'
  import '@fontsource/bona-nova'
  import '@fontsource/geist-mono'
  import favicon from '$lib/assets/favicon.svg'
  import { APP_NAME } from '$root/constants'

  let { children } = $props()
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
  <title>{APP_NAME}</title>
</svelte:head>

<div class="app-shell">
  {@render children()}
</div>

<style>
  :global {
    body {
      padding: var(--gap-40);
    }
  }

  .app-shell {
    position: relative;
    display: flex;
    flex: 1;
    flex-direction: column;
  }
</style>
