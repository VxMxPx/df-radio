<script>
  import { Title, Navigation, Footer, Page } from '$lib/components'
  import { Button, Divider, Icon } from '$lib/components/ui'
  import { onMount } from 'svelte'
  import {
    player_state,
    toggle_playing,
  } from '$lib/components/player/player-state.svelte'
  import Intro from './intro.svelte'

  onMount(() => document.body.classList.add('home-page-art'))
</script>

<Page class="home-page" player="when-playing" header={false} footer={false}>
  <header style:z-index="1">
    <Title />
    <Navigation />
  </header>
  <Divider edge={false} />
  <Intro />
  {#if !player_state.is_playing}
    <Button variant="primary" onclick={() => toggle_playing()}>Play →</Button>
  {:else}
    <Button href="/explore">Explore</Button>
  {/if}
  <div class="grow"></div>
  <Footer />
</Page>

<!-- Various graphics? -->
<div class="gfx-elements">
  <div class="moon"></div>
  <div class="cloud"></div>
</div>

<style>
  :global(.home-page main) {
    align-items: center;
    gap: var(--gap-40);
    margin: auto;
    width: 100%;
    max-width: var(--content-width);
    display: flex;
    flex-direction: column;
    position: relative;
    /*z-index: 1;*/
    flex-grow: 1;
  }
  :global(.home-page main > header) {
    align-items: center;
    display: flex;
    flex-direction: column;
    gap: var(--gap-20);
  }

  /* Elements */
  .gfx-elements .moon {
    position: absolute;
    background: url(/style/moon.png);
    background-repeat: no-repeat;
    background-size: contain;
    width: 80px;
    height: 80px;
    right: 15%;
    top: 30px;
    mix-blend-mode: screen;
  }
  .gfx-elements .cloud {
    position: absolute;
    background: url(/style/cloud.png);
    background-repeat: no-repeat;
    background-size: contain;
    width: 520px;
    height: 80px;
    left: 4%;
    top: 40px;
    mix-blend-mode: screen;
  }
</style>
