<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'

  type ButtonProps = HTMLButtonAttributes & {
    children?: Snippet
  }

  const {
    children,
    class: classes = '',
    type = 'button',
    ...props
  }: ButtonProps = $props()
</script>

<button class={`ui Button ${classes}`} {type} {...props}>
  {@render children?.()}
</button>

<style>
  .ui.Button {
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px 8px;
    background-color: rgb(0 0 0 /0.5);
    box-shadow: inset 1px 1px rgb(255 255 255 / 0.15);
    position: relative;
    z-index: 1;
  }

  .ui.Button:focus-within {
    outline: 1px solid rgba(236, 189, 71, 0.5);
    outline-offset: 2px;
  }

  .ui.Button:active {
    box-shadow: inset -1px -1px rgb(255 255 255 / 0.15);
  }

  .ui.Button::after {
    content: '';
    background-color: rgb(0 0 0 / 0.4);
    position: absolute;
    inset: 0;
    border-radius: 4px;
    opacity: 0;
    transition: all 0.5s ease;
    filter: blur(2px);
  }

  .ui.Button:hover::after {
    opacity: 0.6;
    inset: -5px;
    filter: blur(10px);
  }
</style>
