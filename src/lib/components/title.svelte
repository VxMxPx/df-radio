<script lang="ts">
  import { APP_NAME } from '$root/constants'

  type Props = {
    variant?: 'h1' | 'h2' | 'h3'
  }
  const { variant = 'h1' }: Props = $props()
  const [domain, tld] = APP_NAME.split('.')
</script>

<svelte:element this={variant}>{domain}<span>.{tld}</span></svelte:element>

<style>
  h1 {
    color: var(--cl-accent);
  }
  h1 > span {
    color: var(--tx-primary-50);
  }
</style>
