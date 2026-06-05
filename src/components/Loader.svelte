<script lang="ts">
  import Icon from './Icon.svelte'

  type Props = {
    size?: number
    color?: string
    text?: string
  }

  const { size = 24, text, color = 'currentColor' }: Props = $props()
</script>

<span
  class="ui Loader flex flex-col gap-1 items-center"
  aria-label="Loading"
  role="status">
  <Icon name="Hourglass" {size} {color} />
  {#if text}
    <span>{text}</span>
  {/if}
</span>

<style>
  .ui.Loader :global(.ui.Icon) {
    display: inline-flex;
    transform-origin: center;
    animation: hourglass-flip 1800ms ease-in-out infinite;
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
