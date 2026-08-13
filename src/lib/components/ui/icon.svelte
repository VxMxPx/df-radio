<script lang="ts">
  import * as icons from './icons'
  import * as icons_local from './icons/index'

  export type IconName = keyof typeof icons | keyof typeof icons_local

  let {
    name,
    class: class_name = '',
    color = 'currentColor',
    size,
    stroke_width = 2,
  }: {
    name: IconName
    class?: string
    color?: string
    size?: number
    stroke_width?: number
  } = $props()

  const is_local = $derived(name in icons_local)
  const LocalIcon = $derived(icons_local[name as keyof typeof icons_local])
  const LucideIcon = $derived(icons[name as keyof typeof icons])
</script>

{#if is_local}
  <span
    class="ui icon_ui icon_local {class_name}"
    style:color
    style:--icon-size={`${size ?? 16}px`}
    style:--icon-stroke-width={stroke_width}
  >
    <LocalIcon />
  </span>
{:else}
  <LucideIcon
    class="ui icon_ui {class_name}"
    {color}
    size={size ?? 16}
    strokeWidth={stroke_width}
  />
{/if}

<style>
  .icon_local {
    display: inline-flex;
    width: var(--icon-size);
    height: var(--icon-size);
    flex: 0 0 auto;
  }

  .icon_local :global(svg) {
    width: 100%;
    height: 100%;
  }

  .icon_local :global(svg *) {
    stroke-width: var(--icon-stroke-width);
  }
</style>
