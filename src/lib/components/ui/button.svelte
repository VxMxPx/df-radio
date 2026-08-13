<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'

  type Props = HTMLButtonAttributes & {
    variant?: 'primary' | 'default'
    size?: 'small' | 'default'
    children?: Snippet
    class?: string
    href?: string
  }
  const {
    variant = 'default',
    size = 'default',
    children,
    href,
    class: class_name = '',
    ...props
  }: Props = $props()
</script>

<svelte:element
  this={href ? 'a' : 'button'}
  {href}
  class="ui button_ui size-{size} variant-{variant} {class_name}"
  type={href ? undefined : 'button'}
  {...props}
>
  {@render children?.()}
</svelte:element>

<style>
  .button_ui {
    display: inline-flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    border-radius: 3px;
    box-shadow: inset 0px -3px 0px rgba(0, 0, 0, 0.5);

    cursor: pointer;
    gap: var(--gap-10);
    padding: 5px 20px;

    text-decoration: none;

    text-transform: uppercase;
    letter-spacing: -5%;
  }
  .button_ui:active {
    padding-top: 7px;
    padding-bottom: 6px;
    box-shadow: inset 0 3px 0 rgba(0, 0, 0, 0.7);
  }
  .button_ui.size-default {
    font: var(--font-input-default);
  }
  .button_ui.size-small {
    font: var(--font-input-small);
  }
  .button_ui.variant-default {
    color: var(--tx-primary);
    background: color-mix(in srgb, var(--bg-primary) 95%, #ffffff);
    box-shadow: inset 1px 1px 0px rgba(255 255 255 / 0.2);
  }
  .button_ui.variant-default:active {
    box-shadow: inset -1px -1px 0px rgba(255 255 255 / 0.2);
  }
  .button_ui.variant-primary {
    color: var(--bg-primary);
    background: var(--cl-accent);
    outline: 1px solid var(--cl-accent-50);
    outline-offset: 1px;
    padding-bottom: 8px;
  }
</style>
