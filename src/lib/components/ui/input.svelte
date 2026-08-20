<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements'

  type Props =
    | {
        size?: 'small' | 'default'
        class?: string
      }
    | HTMLInputAttributes
  const { size = 'default', class: class_name = '', ...props }: Props = $props()
</script>

<input class="ui input_ui size-{size} {class_name}" {...props} />

<style>
  .input_ui {
    border-radius: 3px;
    box-shadow: inset 1px 1px 0px var(--bg-primary-50);
    border: 1px solid var(--bg-primary-50);
    background: rgba(255, 255, 255);
    color: var(--bg-primary-75);
    padding: 5px;
  }
  .input_ui.size-default {
    font: var(--font-input-default);
  }
  .input_ui.size-small {
    font: var(--font-input-small);
  }
  .input_ui:focus {
    outline: 2px solid var(--cl-accent);
  }
</style>
