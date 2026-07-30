<script lang="ts">
  import type { Snippet } from 'svelte'

  type Props = {
    children?: Snippet
    class?: string
    floating?: boolean
  }

  const {
    children,
    class: classes = '',
    floating = false,
  }: Props = $props()
</script>

<div class={`ui Box ${classes}`} class:floating>
  {@render children?.()}
</div>

<style>
  .Box {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    border-radius: 0.5rem;
    background: rgb(0 0 0 / 0.15);
  }

  .Box.floating {
    --float-distance: -8px;
    animation: float 7s ease-in-out infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    .Box.floating {
      animation: none;
    }
  }
</style>
