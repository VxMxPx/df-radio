<script lang="ts">
  import type { Snippet } from 'svelte'
  import Icon from './Icon.svelte'

  type Props = {
    children?: Snippet
    title: string
    open?: boolean
    class?: string
  }

  const {
    children,
    title,
    open = false,
    class: classes = '',
  }: Props = $props()
</script>

<details class={`ui Accordion ${classes}`} {open}>
  <summary class="Accordion__summary">
    <span class="Accordion__icon" aria-hidden="true">
      <Icon name="ArrowRight" size={18} />
    </span>
    <span>{title}</span>
  </summary>
  <div class="Accordion__content">
    {@render children?.()}
  </div>
</details>

<style>
  @reference 'tailwindcss';

  .Accordion {
    @apply bg-[rgb(0,0,0,0.25)] rounded-lg;
  }

  .Accordion__summary {
    @apply flex items-center gap-3 p-2;
    cursor: pointer;
    list-style: none;
  }

  .Accordion__summary::-webkit-details-marker {
    display: none;
  }

  .Accordion__icon {
    @apply inline-flex items-center justify-center;
    transition: transform 150ms ease-out;
  }

  .Accordion[open] .Accordion__icon {
    transform: rotate(90deg);
  }

  .Accordion__content {
    @apply px-4 pb-4 flex flex-col gap-2;
  }

  @media (prefers-reduced-motion: reduce) {
    .Accordion__icon {
      transition: none;
    }
  }
</style>
