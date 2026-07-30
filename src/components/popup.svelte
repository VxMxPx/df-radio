<script lang="ts">
  import { onMount } from 'svelte'
  import type { Snippet } from 'svelte'

  type Props = {
    children?: Snippet
    class?: string
    label: string
    onOutsideClick?: () => void
    open?: boolean
    placement?: 'top' | 'bottom'
  }

  const {
    children,
    class: classes = '',
    label,
    onOutsideClick,
    open = false,
    placement = 'top',
  }: Props = $props()

  let element = $state<HTMLDivElement | null>(null)

  const pointerdown = (event: PointerEvent) => {
    if (!open || !element || element.contains(event.target as Node)) {
      return
    }
    onOutsideClick?.()
  }

  onMount(() => {
    document.addEventListener('pointerdown', pointerdown)
    return () => {
      document.removeEventListener('pointerdown', pointerdown)
    }
  })
</script>

{#if open}
  <div
    bind:this={element}
    class={`ui Popup placement-${placement} ${classes}`}
    role="dialog"
    aria-label={label}>
    {@render children?.()}
  </div>
{/if}

<style>
  .Popup {
    position: absolute;
    left: 0;
    z-index: 1000;
    width: min(320px, calc(100vw - 32px));
    overflow: auto;
    padding: 0.75rem;
    border: 1px solid rgb(255 255 255 / 0.15);
    border-radius: 0.5rem;
    background: rgb(0 0 0 / 0.9);
    box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
    backdrop-filter: blur(12px);
    white-space: normal;
    overflow: hidden;
    animation: popup-arrive 160ms ease-out both;
  }

  .Popup.placement-top {
    bottom: calc(100% + 12px);
  }

  .Popup.placement-bottom {
    top: calc(100% + 12px);
    max-height: calc(100vh - 100px);
  }

  @keyframes popup-arrive {
    from {
      opacity: 0;
      transform: translateY(6px) scale(0.98);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .Popup {
      animation: none;
    }
  }
</style>
