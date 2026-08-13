<script lang="ts">
  type Props = {
    variant?: 'h1' | 'h2' | 'h3'
  }
  const { variant = 'h1' }: Props = $props()
</script>

<svelte:element this={variant}>DarkForest<span>.fm</span></svelte:element>

<style>
  h1 {
    color: var(--cl-accent);
  }
  h1 > span {
    color: var(--tx-primary-50);
  }
</style>
