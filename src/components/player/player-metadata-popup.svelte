<script lang="ts">
  import * as Icons from '../icons'
  import type { IconName } from '../icons/types'
  import Icon from '../icon.svelte'
  import Popup from '../popup.svelte'
  import type { StreamMeta } from './stream'

  type Props = {
    label: string
    meta: StreamMeta
    onOutsideClick?: () => void
    open?: boolean
    placement?: 'top' | 'bottom'
  }

  const {
    label,
    meta,
    onOutsideClick,
    open = false,
    placement = 'top',
  }: Props = $props()

  const getUrlIcon = (name?: string, icon?: string): IconName => {
    for (const value of [icon, name]) {
      if (!value) {
        continue
      }

      const normalizedValue = value
        .replace(/[^a-z0-9]+/gi, ' ')
        .trim()
        .split(' ')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
        .join('')
      const iconNames = [
        `Social${value}` as IconName,
        `Social${normalizedValue}` as IconName,
      ]

      for (const iconName of iconNames) {
        if (iconName in Icons) {
          return iconName
        }
      }
    }

    return 'Disc'
  }

  const getUrlLabel = (url: NonNullable<StreamMeta['urls']>[number]) => {
    if (url.label) {
      return url.label
    }

    if (meta.artist && url.name) {
      return `${meta.artist} on ${url.name}`
    }

    return 'Url'
  }
</script>

<Popup
  class="flex flex-col gap-2"
  {label}
  {onOutsideClick}
  {open}
  {placement}>
  <div class="PlayerMetadataPopup__cover">
    {#if meta.cover}
      <img src={meta.cover} alt="" />
    {:else}
      <Icon name="Disc" size={56} color="#ffffff" />
    {/if}
  </div>

  <div class="PlayerMetadataPopup__section">
    <strong>
      {meta.title}
      {#if meta.artist}
        <span>by</span>
        {meta.artist}
      {/if}
    </strong>
    {#if meta.album}
      <span>{meta.album}</span>
    {/if}
  </div>

  {#if meta.urls?.length}
    <div class="PlayerMetadataPopup__section PlayerMetadataPopup__links">
      {#each meta.urls as url}
        <a href={url.url} target="_blank">
          <Icon
            name={getUrlIcon(url.name, url.icon)}
            size={16}
            color="#ffffff" />
          <small>{getUrlLabel(url)}</small>
        </a>
      {/each}
    </div>
  {/if}
</Popup>

<style>
  @reference 'tailwindcss';

  .PlayerMetadataPopup__cover {
    @apply flex h-44 w-full items-center justify-center overflow-hidden
      rounded-md bg-white/10;
  }

  .PlayerMetadataPopup__cover img {
    @apply h-full w-full object-cover;
  }

  .PlayerMetadataPopup__section {
    @apply first:pt-0 last:pb-0;
  }

  .PlayerMetadataPopup__section strong {
    @apply flex flex-wrap gap-x-1 leading-tight;
  }

  .PlayerMetadataPopup__section strong span {
    @apply opacity-70;
  }

  .PlayerMetadataPopup__section > span {
    @apply mt-1 block opacity-70;
  }

  .PlayerMetadataPopup__links {
    @apply flex flex-col gap-0;
  }

  .PlayerMetadataPopup__links a {
    @apply flex items-center gap-1 rounded-sm p-1  hover:bg-white/10;
  }
</style>
