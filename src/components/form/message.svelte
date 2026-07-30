<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'
  import Loader from '../loader.svelte'
  import Icon from '../icon.svelte'
  import Button from '../button.svelte'

  export type FormState = 'inactive' | 'working' | 'success' | 'error'

  type MessageProps = HTMLAttributes<HTMLDivElement> & {
    state: FormState
    onDismiss?: () => void
    text?: string
  }

  const {
    state = 'inactive',
    onDismiss = () => null,
    text = 'Submitting the form...',
    class: classes = '',
    ...props
  }: MessageProps = $props()
</script>

<div
  class={`ui Message state-${state} ${classes}`}
  aria-hidden={state === 'inactive'}
  {...props}>
  <div class="content">
    <span>
      {#if state === 'working'}
        <Loader />
      {:else if state !== 'inactive'}
        <Icon
          size={24}
          name={state === 'success'
            ? 'CircleCheck'
            : state === 'error'
              ? 'CircleX'
              : 'Disc'}
          color="#ffffff" />
      {/if}
    </span>
    {#if state !== 'inactive' && text}
      <span>
        {text}
      </span>
    {/if}

    {#if state === 'error'}
      <Button class="Message__dismiss" onclick={onDismiss}>Understood</Button>
    {/if}
    {#if state === 'success'}
      <Button class="Message__dismiss" onclick={onDismiss}>Okay</Button>
    {/if}
  </div>
</div>

<style>
  .ui.Message {
    --main-transition-length: 1s;
  }

  .ui.Message {
    background-color: rgb(0 0 0 / 0.95);
    left: -4px;
    top: -4px;
    width: calc(100% + 8px);
    height: 0;
    overflow: hidden;
    position: absolute;
    z-index: 2;
    padding: 0 20px;
    text-align: center;
    pointer-events: none;
    transition: background-color 0.8s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .ui.Message.state-success {
    background-color: rgba(72, 107, 97, 0.95);
  }
  .ui.Message.state-error {
    background-color: rgba(107, 72, 90, 0.95);
  }

  .ui.Message:not(.state-inactive) {
    animation: working-form var(--main-transition-length) ease-in-out forwards;
    pointer-events: auto;
  }

  .ui.Message .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    opacity: 0;
    transition: opacity 0.5s ease;
  }
  .ui.Message:not(.state-inactive) .content {
    transition-delay: var(--main-transition-length);
    opacity: 1;
  }

  :global(.Message__dismiss) {
    margin-top: 0.5rem !important;
  }

  @keyframes working-form {
    0% {
      border-radius: 4px 4px 80% 40%;
    }
    50% {
      border-radius: 4px 4px 40% 80%;
    }
    100% {
      border-radius: 4px;
      height: calc(100% + 8px);
    }
  }
</style>
