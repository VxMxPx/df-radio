<script lang="ts">
  import type { HTMLSelectAttributes } from 'svelte/elements'

  type Props = {
    options: { label: string; value: string }[]
    size?: 'small' | 'default'
    class?: string
  } & Omit<HTMLSelectAttributes, 'size' | 'class'>
  const {
    size = 'default',
    options,
    class: class_name = '',
    ...props
  }: Props = $props()
</script>

<select class="ui select_ui size-{size} {class_name}" {...props}>
  {#each options as option}
    <option value={option.value}>{option.label}</option>
  {/each}
</select>

<style>
  .select_ui {
    border-radius: 3px;
    box-shadow: inset -1px -1px 0px var(--bg-primary-50);
    border: 1px solid var(--bg-primary-50);
    background: rgba(255, 255, 255);
    color: var(--bg-primary-75);
    padding: 5px;
  }
  .select_ui.size-default {
    font: var(--font-input-default);
  }
  .select_ui.size-small {
    font: var(--font-input-small);
  }
  .select_ui:focus {
    outline: 2px solid var(--cl-accent);
  }
</style>
