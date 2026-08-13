<script lang="ts">
  import { Page } from '$root/lib/components'
  import { browser } from '$app/environment'
  import Artists from './artists.svelte'
  import Shows from './shows.svelte'

  const active_tab_from_location =
    browser && location.hash.substring(1) === 'artists' ? 'artists' : 'shows'
  let active_tab = $state<'artists' | 'shows'>(active_tab_from_location)

  const set_active_tab = (tab: string) => {
    active_tab = tab === 'shows' ? 'shows' : 'artists'
    location.hash = tab
  }
</script>

<Page title="Explore">
  <div class="flex gap-20">
    <h1>Explore</h1>
    <div class="tabs">
      <button
        type="button"
        onclick={() => set_active_tab('shows')}
        class="tab"
        class:active={active_tab === 'shows'}>Shows</button
      >
      <button
        type="button"
        onclick={() => set_active_tab('artists')}
        class="tab"
        class:active={active_tab === 'artists'}>Artists</button
      >
    </div>
  </div>
  {#if active_tab === 'artists'}
    <Artists />
  {/if}
  {#if active_tab === 'shows'}
    <Shows />
  {/if}
</Page>

<style>
  .tabs {
    display: flex;
    gap: var(--gap-5);
    border-bottom: 1px solid var(--tx-primary-50);
    flex-grow: 1;
    padding-left: var(--gap-10);
  }
  .tabs .tab {
    background-color: transparent;
    font: var(--font-title-h2);
    border: 1px solid var(--tx-primary-25);
    border-radius: 3px 3px 0 0;
    padding: 0 var(--gap-20);
    border-bottom: none;
    color: var(--tx-primary-50);
    cursor: pointer;
    position: relative;
    display: flex;
    align-items: center;
  }
  .tabs .tab.active {
    top: 1px;
    color: var(--tx-primary);
    border-bottom: 1px solid var(--bg-primary);
  }
</style>
