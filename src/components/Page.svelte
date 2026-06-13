<script lang="ts">
  import type { Snippet } from 'svelte'
  import { APP_NAME } from '@app/constants'
  import Lines from './Lines.svelte'
  import Stars from './Stars.svelte'

  type PageElements = {
    lines?: boolean
    stars?: boolean
  }

  type Props = {
    children?: Snippet
    title?: string
    elements?: PageElements
  }

  const { children, title, elements = {} }: Props = $props()
  const pageTitle = $derived([title, APP_NAME].filter(Boolean).join(' - '))
</script>

<svelte:head>
  <title>{pageTitle}</title>
</svelte:head>

{@render children?.()}

{#if elements.stars}
  <Stars />
{/if}
{#if elements.lines}
  <Lines />
{/if}
