<script lang="ts">
  import type { Snippet } from 'svelte'
  import Icon from './icon.svelte'

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
  .Accordion {
    border-radius: 0.5rem;
    background: rgb(0 0 0 / 0.25);
  }

  .Accordion__summary {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem;
    cursor: pointer;
    list-style: none;
  }

  .Accordion__summary::-webkit-details-marker {
    display: none;
  }

  .Accordion__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: transform 150ms ease-out;
  }

  .Accordion[open] .Accordion__icon {
    transform: rotate(90deg);
  }

  .Accordion__content {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 0 1rem 1rem;
  }

  @media (prefers-reduced-motion: reduce) {
    .Accordion__icon {
      transition: none;
    }
  }
</style>
