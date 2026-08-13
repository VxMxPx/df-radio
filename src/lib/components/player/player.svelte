<script lang="ts">
  import {
    player_state,
    toggle_muted,
    toggle_playing,
  } from './player-state.svelte'
  import { Button, Icon, Loader } from '../ui'
  let { visible = false }: { visible?: boolean } = $props()
</script>

{#if visible}
  <div class="player component {player_state.is_playing && 'playing'}">
    {#if player_state.error}
      <div class="error">
        <small>
          {player_state.error}
        </small>
        <Button size="small" onclick={() => (player_state.error = '')}
          >Okay</Button
        >
      </div>
    {/if}

    <div class="cover-art">
      <Icon name="Disc3" />
      <img
        src={player_state.metadata?.cover ?? '/style/no-music-blank.png'}
        alt=""
      />
    </div>
    <div class="metadata">
      {#if player_state.metadata}
        <div class="artist">
          <span>{player_state.metadata?.title}</span>
          <span style:color="var(--tx-primary-50)">by</span>
          <span style:text-decoration="underline" style:cursor="pointer"
            >{player_state.metadata?.artist}</span
          >
        </div>
        <span class="album" style:color="var(--tx-primary-50)"
          >{player_state.metadata?.album}</span
        >
      {/if}
    </div>
    <div class="actions">
      <Button
        variant={player_state.is_playing ? 'default' : 'primary'}
        size="small"
        onclick={() => toggle_playing()}
      >
        {#if player_state.is_busy}
          <Loader size={12} />
        {:else}
          {player_state.is_playing ? 'Stop' : 'Play'}
        {/if}
      </Button>
      <Button
        class={player_state.is_mutted ? 'animation-pulse' : ''}
        size="small"
        onclick={() => toggle_muted()}
        ><Icon
          name={player_state.is_mutted ? 'Mute' : 'Volume2'}
          size={12}
        /></Button
      >
    </div>

    <svg
      class="ants"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path d="M 0 0 V 100 H 100 V 0" />
    </svg>
  </div>
{/if}

<style>
  .error {
    position: absolute;
    inset: 0;
    background-color: rgba(200 40 40);
    backdrop-filter: blur(2px);
    z-index: 10;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .player {
    position: relative;
    overflow: hidden;
    display: flex;
    gap: var(--gap-10);
    align-items: center;
    width: var(--content-width);
    /*border: 1px dotted var(--tx-primary-50);*/
    /*border-top: none;*/
    background: var(--bg-primary);
    height: var(--player-height);
    padding: 10px;
    border-radius: 0 0 4px 4px;
    position: absolute;
    top: calc(var(--gap-40) * -1);
    left: 50%;
    transform: translateX(-50%);
    z-index: 1;
  }

  .metadata {
    flex-grow: 1;
    font: var(--font-body-small);
  }
  .metadata .artist {
    display: flex;
    gap: 4px;
  }

  .cover-art {
    height: 100%;
    border-radius: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  .cover-art img {
    display: block;
    height: 100%;
  }
  .cover-art :global(.icon_ui) {
    position: absolute;
    opacity: 0;
    translate: 0 30px;
    transition:
      opacity 0.4s ease,
      translate 0.4s ease;
  }
  .playing .cover-art :global(.icon_ui) {
    opacity: 1;
    animation: rotate 3s linear infinite;
    translate: 0 0;

    background-color: #000000cc;
    border-radius: 20px;
  }

  .actions {
    display: flex;
    gap: var(--gap-10);
    flex-grow: 1;
    justify-content: space-between;
    transition: all 0.5s ease;
  }
  .playing .actions {
    flex-grow: 0;
    /*justify-content: flex-end;*/
  }

  /* ants animation */
  .ants {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    overflow: visible;
    pointer-events: none;
  }

  .ants path {
    fill: none;
    stroke: var(--tx-primary-75);
    stroke-width: 2px;
    stroke-dasharray: 4 4;
    vector-effect: non-scaling-stroke;
  }
  .playing .ants path {
    animation: march 500ms linear infinite;
  }

  @keyframes march {
    to {
      stroke-dashoffset: 8;
    }
  }

  @keyframes rotate {
    to {
      transform: rotate(360deg);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .playing .cover-art :global(.icon_ui),
    .playing .ants path {
      animation: none;
    }
  }
</style>
