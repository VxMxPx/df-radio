<script lang="ts">
  import type { Snippet } from 'svelte'
  import Icon from './icon.svelte'

  type Props = {
    children?: Snippet
    title: string
    open?: boolean
    class?: string
  }

  const { children, title, open = false, class: classes = '' }: Props = $props()
</script>

<details class={`ui accordion_ui ${classes}`} {open}>
  <summary class="summary">
    <span class="icon" aria-hidden="true">
      <Icon color="var(--cl-accent)" name="ArrowRight" size={12} />
    </span>
    <span>{title}</span>
  </summary>
  <div class="content">
    {@render children?.()}
  </div>
</details>

<style>
  .accordion_ui {
    border-bottom: 1px solid var(--tx-primary-25);
    /*color: var(--tx-primary-75);*/
  }

  .accordion_ui[open] {
    color: var(--tx-primary);
  }

  .summary {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 10px 0;
    cursor: pointer;
    list-style: none;
  }

  .summary::-webkit-details-marker {
    display: none;
  }

  .icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: transform 150ms ease-out;
  }

  .accordion_ui[open] .icon {
    transform: rotate(90deg);
  }

  .content {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 0 0 10px 16px;
  }

  @media (prefers-reduced-motion: reduce) {
    .icon {
      transition: none;
    }
  }
</style>
