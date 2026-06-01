<script lang="ts">
  import { Icon } from '.'
  import * as Icons from './icons'

  type Names = keyof typeof Icons

  type Props = {
    name: Names
    size?: number
    color?: string
  }

  const { name, size = 16, color = '#000000' }: Props = $props()

  let Component = $derived(Icons[name])
</script>

<span
  class="ui Icon"
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
