<script lang="ts">
  type Props = {
    wavey?: boolean
    class?: string
    short?: boolean
  }

  const { wavey = false, short, class: classes = '' }: Props = $props()
</script>

<div class={`ui Divider ${classes} ${short && 'max-w-[10%]'}`} class:wavey>
  {#if wavey}
    <img src="/images/divider-wave.svg" alt="" />
  {/if}
</div>

<style>
  .Divider {
    width: 100%;
  }

  .Divider img {
    max-width: 100%;
  }

  .Divider:not(.wavey) {
    height: 1px;
    opacity: 0.4;
    background-color: var(--color-ttl);
  }
</style>
