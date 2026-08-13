<script lang="ts">
  import Icon from './icon.svelte'

  type Props = {
    size?: number
    color?: string
    text?: string
    class?: string
  }

  const {
    size = 24,
    text,
    class: classes = '',
    color = 'currentColor',
  }: Props = $props()
</script>

<span class={`ui loader_ui ${classes}`} aria-label="Loading" role="status">
  <Icon name="Hourglass" {size} {color} />
  {#if text}
    <span>{text}</span>
  {/if}
</span>

<style>
  .loader_ui {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
  }

  .loader_ui :global(.icon_ui) {
    display: inline-flex;
    transform-origin: center;
    animation: hourglass-flip 2200ms ease-in-out infinite;
  }

  @keyframes hourglass-flip {
    0%,
    28% {
      transform: rotate(0deg);
    }
    44%,
    72% {
      transform: rotate(180deg);
    }
    88%,
    100% {
      transform: rotate(360deg);
    }
  }
</style>
