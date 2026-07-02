<script lang="ts">
  import { page } from '$app/stores'
  import '@app/main.css'
  import { Header, Footer, Player } from '@app/components'
  import { APP_DESC, APP_NAME } from '@app/constants'

  import type { Snippet } from 'svelte'

  type LayoutProps = {
    children: Snippet
  }

  const { children }: LayoutProps = $props()

  const isHome = $derived($page.url.pathname === '/')
</script>

<svelte:head>
  <meta name="description" content={APP_DESC} />
  <title>{APP_NAME}</title>
</svelte:head>

<main id="application" class:has-topbar={!isHome} class:is-homepage={isHome}>
  <Header currentPath={$page.url.pathname} />
  <div class="main-content">
    {@render children()}
  </div>
  <Footer />
</main>

{#if !isHome}
  <Player mode="topbar" />
{/if}

<style>
  :global(html) {
    background: url('/images/background-noise.png') repeat;
  }

  :global(body) {
    background-image: url('/images/top-cutout.svg');
    background-position: top left;
    background-repeat: no-repeat;
  }

  main#application {
    --route-motion-duration: 420ms;
    --route-motion-easing: cubic-bezier(0.2, 0.8, 0.2, 1);
    max-width: var(--w-page);
    min-height: 100%;
    margin: auto;
    /* position: relative; */
    display: flex;
    flex-direction: column;
    padding-top: 0;
    gap: 70px;
    z-index: 2;
    transition: padding-top var(--route-motion-duration)
      var(--route-motion-easing);
  }

  main#application > .main-content {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: 40px;
  }

  main#application.has-topbar {
    padding-top: 60px;
  }

  :global(body)::after {
    background: url('/images/top-sun.svg');
    background-repeat: no-repeat;
    background-size: 100%;
    height: 160px;
    width: 160px;
    content: '';
    position: absolute;
    z-index: 1;
    top: 0;
    left: 48%;
  }
</style>
