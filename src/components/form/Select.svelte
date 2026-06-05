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
    box-shadow: inset 0 2px 4px rgb(0 0 0 / 0.75);
    border-radius: 4px;
    padding: 4px 8px;
    background-color: rgb(0 0 0 / 0.4);
    font-size: 20px;
  }

  .ui.Select:focus {
    outline: 1px solid rgba(236, 189, 71, 0.5);
    outline-offset: 2px;
  }

  :global(.ui.Field[data-error]) .ui.Select {
    border: 1px solid rgb(239 68 68 / 0.8);
    outline: 1px solid rgb(239 68 68 / 0.5);
  }

  .ui.Field[data-error]::after {
    content: attr(data-error);
    color: rgb(248 113 113);
    font-size: 14px;
  }
</style>
