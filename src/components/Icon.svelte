<script lang="ts">
  import * as Icons from './icons'
  import type { IconName } from './icons/types'

  type Props = {
    name: IconName
    size?: number
    color?: string
    class?: string
  }

  const {
    name,
    size = 16,
    color = '#000000',
    class: classes = '',
  }: Props = $props()

  let Component = $derived(Icons[name])
</script>

<span
  class={`ui Icon ${classes}`}
  style:color
  style:width={size + 'px'}
  style:height={size + 'px'}>
  <Component />
</span>

<style>
  .ui.Icon {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .ui.Icon :global(svg) {
    display: block;
    width: 100%;
    height: 100%;
  }
</style>
