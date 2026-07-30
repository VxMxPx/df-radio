<script lang="ts">
  type Props = {
    wavey?: boolean
    class?: string
    short?: boolean
  }

  const { wavey = false, short, class: classes = '' }: Props = $props()
</script>

<div class={`ui Divider ${classes}`} class:short class:wavey>
  {#if wavey}
    <img src="/divider-wave.svg" alt="" />
  {/if}
</div>

<style>
  .Divider {
    width: 100%;
  }

  .Divider img {
    max-width: 100%;
  }

  .Divider.short {
    max-width: 10%;
  }

  .Divider:not(.wavey) {
    height: 1px;
    opacity: 0.4;
    background-color: var(--color-ttl);
  }
</style>
