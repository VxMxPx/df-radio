<script lang="ts">
  import type { HTMLTextareaAttributes } from 'svelte/elements'

  type TextareaProps = HTMLTextareaAttributes & {
    label?: string
  }

  let {
    label = '',
    required = false,
    class: classes = '',
    value = $bindable(),
    ...props
  }: TextareaProps = $props()
</script>

<label class="ui Field" data-required={required || undefined}>
  {label}
  <textarea class={`ui Textarea ${classes}`} bind:value {required} {...props}
  ></textarea>
</label>

<style>
  .ui.Field {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .ui.Textarea {
    box-shadow: inset 0 2px 4px rgb(0 0 0 / 0.75);
    border-radius: 4px;
    padding: 4px 8px;
    background-color: rgb(0 0 0 / 0.4);
    field-sizing: content;
    min-height: 8em;
    max-height: 400px;
    resize: none;
    font-size: var(--font-size-body);
  }

  .ui.Textarea:focus {
    outline: 1px solid rgba(236, 189, 71, 0.5);
    outline-offset: 2px;
  }

  :global(.ui.Field[data-error]) .ui.Textarea {
    border: 1px solid rgb(239 68 68 / 0.8);
    outline: 1px solid rgb(239 68 68 / 0.5);
  }

  .ui.Field[data-error]::after {
    content: attr(data-error);
    color: rgb(248 113 113);
    font-size: var(--font-size-small);
  }
</style>
