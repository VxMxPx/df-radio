<script lang="ts">
  import { onMount, type Snippet } from 'svelte'
  import { Footer, Header } from '.'
  import { Divider } from './ui'

  type Props = {
    title?: string
    children: Snippet
  }

  const { children, title }: Props = $props()

  onMount(() => document.body.classList.remove('home-page-art'))
</script>

<svelte:head>
  <title>{title ? `${title} — ` : ''}DarkForest.fm</title>
</svelte:head>

<div class="page component">
  <Header />
  <main>
    {@render children?.()}
  </main>
  <Divider center={false} />
  <div class="bottom">
    <div class="gfx cloud"></div>
    <!-- <div class="gfx forest"></div> -->
    <Footer />
  </div>
</div>

<style>
  .page {
    width: 100%;
    flex-grow: 1;
    max-width: var(--content-width);
    margin: 0 auto;
    gap: var(--gap-40);
    display: flex;
    flex-direction: column;
  }
  .page :global(h2) {
    border-left: 1px solid var(--tx-primary-25);
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
  .page :global(footer) {
    background-color: transparent;
  }
</style>
