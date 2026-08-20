<script lang="ts">
  import { onMount } from 'svelte'
  import { artists_api, type Artist } from '$lib/api'

  let artists = $state<Artist[]>([])
  let error = $state<string>('')

  onMount(async () => {
    try {
      artists = (await artists_api.get_artists()) ?? []
    } catch (request_error) {
      error =
        request_error instanceof Error
          ? request_error.message
          : 'Unable to load artists.'
    }
  })
</script>

<p>
  Meet the artists shaping the sounds of Dark Forest. From distant corners of
  the world to local underground scenes, these are the musicians whose work
  finds its way into our broadcasts.
</p>

{#if error}
  <div>{error}</div>
{:else if !artists.length}
  <div>Loading artists...</div>
{:else}
  <div class="artists-list">
    {#each artists as artist}
      <div class="artist">
        <span class="name grow">
          {artist.name}
        </span>
        <small class="websites">
          {#if artist.websites?.length}
            <a href={artist.websites?.[0]}>
              {artist.websites?.[0]}
            </a>
          {:else}
            N/A
          {/if}
        </small>
      </div>
    {/each}
  </div>
{/if}

<style>
  .artists-list {
    display: flex;
    flex-direction: column;
    /*gap: var(--gap-20);*/
  }
  .artists-list .artist {
    display: flex;
    border-bottom: 1px dashed var(--tx-primary-25);
    padding-top: var(--gap-10);
    padding-bottom: var(--gap-10);
    align-items: center;
    transition: padding 0.4s ease;
  }
  .artists-list .artist:hover {
    background-color: var(--tx-primary-10);
    padding-left: var(--gap-10);
    padding-right: var(--gap-10);
  }
  .artists-list .artist:last-child {
    border-bottom: none;
  }
  .artists-list .artist .websites,
  .artists-list .artist .websites a {
    color: var(--tx-primary-50);
  }
</style>
