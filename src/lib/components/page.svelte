<script lang="ts">
  import { onMount, type Snippet } from 'svelte'
  import { Footer, Header, Player } from '.'
  import { Divider } from './ui'
  import { player_state } from './player/player-state.svelte'
  import { APP_NAME } from '$root/constants'

  type Props = {
    title?: string
    header?: boolean
    footer?: boolean
    player?: 'aways' | 'when-playing' | 'never'
    children: Snippet
    class?: string
  }

  const {
    children,
    title,
    header = true,
    footer = true,
    player = 'aways',
    class: classes = '',
  }: Props = $props()

  const player_visible = $derived(
    player === 'aways' ||
      (player === 'when-playing' && player_state.is_playing),
  )

  onMount(() => document.body.classList.remove('home-page-art'))
</script>

<svelte:head>
  <title>{title ? `${title} — ` : ''}{APP_NAME}</title>
</svelte:head>

<Player visible={player_visible} />
<div class:player={player_visible} class="page component {classes}">
  {#if header}
    <Header />
  {/if}
  <main>
    {@render children?.()}
  </main>
  {#if footer}
    <Divider center={false} />
    <div class="bottom">
      <div class="gfx cloud"></div>
      <!-- <div class="gfx forest"></div> -->
      <Footer />
    </div>
  {/if}
</div>

<style>
  .page.player {
    margin-top: var(--player-height) !important;
  }

  .page {
    width: 100%;
    flex-grow: 1;
    max-width: var(--content-width);
    /*padding: 0 var(--gap-20);*/
    margin: 0 auto;
    gap: var(--gap-40);
    display: flex;
    flex-direction: column;
  }
  .page :global(h2) {
    /*border-left: 1px solid var(--tx-primary-25);*/
    border-left: 1px solid var(--cl-accent);
    padding-left: var(--gap-10);
  }
  .page > main {
    display: flex;
    flex-direction: column;
    gap: var(--gap-40);
    flex-grow: 1;
  }

  /* Bottom */
  .page > .bottom {
    position: relative;
    width: 100%;
  }
  .page .gfx {
    position: absolute;
    mix-blend-mode: screen;
  }
  .page .gfx.cloud {
    width: 250px;
    height: 100px;
    background: url(/style/bt-cloud.png) no-repeat center;
    background-size: contain;
    left: -40px;
    bottom: -40px;
  }
  /*.page .gfx.forest {
    width: 180px;
    height: 100px;
    background: url(/style/bt-forest.png) no-repeat center;
    background-size: contain;
    bottom: -40px;
    right: -40px;
  }*/
  .page .bottom :global(footer) {
    background-color: transparent;
  }
</style>
