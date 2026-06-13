<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLSelectAttributes } from 'svelte/elements'

  type SelectProps = HTMLSelectAttributes & {
    children?: Snippet
    label?: string
  }

  let {
    children,
    label = '',
    required = false,
    class: classes = '',
    value = $bindable(),
    ...props
  }: SelectProps = $props()
</script>

<label class="ui Field" data-required={required || undefined}>
  {label}
  <select class={`ui Select ${classes}`} bind:value {required} {...props}>
    {@render children?.()}
  </select>
</label>

<style>
  .ui.Field {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .ui.Select {
    box-shadow:
      inset 1px 1px rgb(255 255 255 / 0.15),
      0 0 0 0 rgb(0 0 0 /0);
    border-radius: 4px;
    padding: 4px 8px;
    background-color: rgb(0 0 0 / 0.4);
    font-size: var(--font-size-body);
  }

  .ui.Select:focus-within {
    outline: 1px solid color-mix(in srgb, var(--color-ttl) 50%, transparent);
    outline-offset: 2px;
  }

  .ui.Select:active:hover,
  .ui.Select:active {
    box-shadow:
      inset -1px -1px rgb(255 255 255 / 0.15),
      0 0 14px 0 rgb(0 0 0 /0.5);
    transition: box-shadow 0.1s ease;
  }

  :global(.ui.Field[data-error]) .ui.Select {
    border: 1px solid rgb(239 68 68 / 0.8);
    outline: 1px solid rgb(239 68 68 / 0.5);
  }

  .ui.Field[data-error]::after {
    content: attr(data-error);
    color: rgb(248 113 113);
    font-size: var(--font-size-small);
  }
</style>
