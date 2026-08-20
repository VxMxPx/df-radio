<script>
  import { APP_NAME } from '$root/constants'
  import { Player } from '$root/lib/components'
  import { Button } from '$root/lib/components/ui'
</script>

<svelte:head>
  <title>{APP_NAME}</title>
</svelte:head>

<div class="live-page">
  <Player visible={true}>
    <Button href="/" size="small">Home</Button>
  </Player>
</div>

<style>
  .live-page :global(.player.component) {
    border-top: 1px dashed var(--tx-primary-50);
    margin: var(--gap-20);
    justify-self: center;
    height: calc(100% - var(--gap-20) * 2) !important;
    border-radius: 4px !important;
    position: fixed !important;
    flex-direction: column;
    width: calc(100% - var(--gap-20) * 2) !important;
    top: 0 !important;
    left: 0 !important;
    bottom: 0 !important;
    right: 0 !important;
    transform: none !important;
    padding: 20px !important;
  }
  .live-page :global(.player.component .cover-art) {
    max-width: 100%;
    max-height: 100%;
    width: 100%;
  }
  .live-page :global(.player.component .cover-art img) {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .live-page :global(.player.component .cover-art svg) {
    width: 80px;
    height: 80px;
    border-radius: 80px;
    stroke-width: 1;
  }
  .live-page :global(.player.component .metadata),
  .live-page :global(.player.component .actions) {
    width: 100%;
  }
</style>
