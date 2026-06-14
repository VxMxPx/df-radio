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
  @reference 'tailwindcss';

  .Popup {
    @apply absolute left-0 z-20
      w-[min(320px,calc(100vw-32px))] overflow-auto rounded-lg border
      border-white/15 bg-black/90 p-3 shadow-2xl backdrop-blur-md;
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
