<script lang="ts">
  import type { Snippet } from 'svelte'
  import type {
    HTMLAnchorAttributes,
    HTMLButtonAttributes,
  } from 'svelte/elements'

  type ButtonProps = Omit<HTMLButtonAttributes, 'type'> &
    Omit<HTMLAnchorAttributes, 'type'> & {
      children?: Snippet
      variant?: 'default' | 'accent'
      href?: HTMLAnchorAttributes['href']
      type?: HTMLButtonAttributes['type']
    }

  const {
    children,
    class: classes = '',
    variant = 'default',
    href,
    type = 'button',
    ...props
  }: ButtonProps = $props()

  const anchorProps = $derived(props as HTMLAnchorAttributes)
  const buttonProps = $derived(props as HTMLButtonAttributes)
</script>

{#if href}
  <a
    class={`ui Button is-link variant-${variant} ${classes}`}
    {href}
    {...anchorProps}>
    {@render children?.()}
  </a>
{:else}
  <button
    class={`ui Button variant-${variant} ${classes}`}
    {type}
    {...buttonProps}>
    {@render children?.()}
  </button>
{/if}

<style>
  .ui.Button {
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px 8px;
    background-color: var(--color-bg-faded);
    box-shadow:
      inset 1px 1px rgb(255 255 255 / 0.15),
      0 0 0 0 rgb(0 0 0 /0);
    position: relative;
    z-index: 1;
    transition: all 0.5s ease;
    font-size: var(--font-size-body);
    text-decoration: none;
  }
  .ui.Button.variant-accent {
    box-shadow:
      inset 1px 1px rgb(255 255 255 / 0.75),
      0 0 0 0 rgb(0 0 0 /0);
    background-color: var(--color-ttl);
    color: var(--color-bg);
  }
  .ui.Button.variant-accent:hover {
    box-shadow:
      inset 1px 1px rgb(255 255 255 /0.75),
      0 0 14px 0 color-mix(in srgb, var(--color-ttl) 40%, transparent);
  }

  .ui.Button:focus-within {
    outline: 1px solid color-mix(in srgb, var(--color-ttl) 50%, transparent);
    outline-offset: 2px;
  }

  .ui.Button:active:hover,
  .ui.Button:active {
    box-shadow:
      inset -1px -1px rgb(255 255 255 / 0.15),
      0 0 14px 0 rgb(0 0 0 /0.5);
    transition: box-shadow 0.1s ease;
  }

  .ui.Button:hover {
    box-shadow:
      inset 1px 1px rgb(255 255 255 /0.15),
      0 0 14px 0 rgb(0 0 0 /0.5);
  }
</style>
