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
        .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
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

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    return `${minutes}:${Math.floor(seconds % 60)
      .toString()
      .padStart(2, '0')}`
  }

  let now = $state(Date.now())
  let elapsed = $derived(
    Math.min(
      meta.duration ?? Infinity,
      (meta.elapsed ?? 0) +
        Math.max(0, Math.floor((now - (meta.receivedAt ?? now)) / 1000)),
    ),
  )

  $effect(() => {
    if (!open || meta.duration === undefined) return
    const timer = window.setInterval(() => (now = Date.now()), 1000)
    return () => window.clearInterval(timer)
  })
</script>

<Popup class="PlayerMetadataPopup" {label} {onOutsideClick} {open} {placement}>
  {#if meta.cover}
    <div class="PlayerMetadataPopup__cover">
      <img src={meta.cover} alt="" />
    </div>
  {/if}

  <div class="PlayerMetadataPopup__section">
    <strong>
      {meta.title}
      {#if meta.artist}
        <span>by</span>
        {meta.artist}
      {/if}
    </strong>
    {#if meta.album}
      <small class="album">{meta.album}</small>
    {/if}
    {#if meta.duration !== undefined}
      <small class="album"
        >{formatTime(elapsed)} / {formatTime(meta.duration)}</small>
    {/if}
    {#if meta.genre}<small class="album">Genre: {meta.genre}</small>{/if}
    {#if meta.isLive}<small class="album"
        >Live{meta.streamer ? ` with ${meta.streamer}` : ''}</small
      >{/if}
    {#if meta.listeners !== undefined}
      <small class="album"
        >{meta.listeners}
        {meta.listeners === 1 ? 'listener' : 'listeners'}</small>
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
  .PlayerMetadataPopup__cover {
    display: flex;
    width: 100%;
    height: 11rem;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    border-radius: 0.375rem;
    background: rgb(255 255 255 / 0.1);
  }

  .PlayerMetadataPopup__cover img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .PlayerMetadataPopup__section {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    text-align: left;
  }

  .PlayerMetadataPopup__section strong {
    display: flex;
    flex-wrap: wrap;
    column-gap: 0.25rem;
    line-height: 1.25;
  }

  .PlayerMetadataPopup__section strong span {
    opacity: 0.7;
  }

  .PlayerMetadataPopup__section > .album {
    display: block;
    opacity: 0.7;
    line-height: 1.25;
    text-align: left;
  }

  .PlayerMetadataPopup__links {
    gap: 0;
  }

  .PlayerMetadataPopup__links a {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem;
    border-radius: 0.125rem;
  }

  .PlayerMetadataPopup__links a:hover {
    background: rgb(255 255 255 / 0.1);
  }

  :global(.PlayerMetadataPopup) {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
</style>
