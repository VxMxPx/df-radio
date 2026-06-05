<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'
  import Loader from '../Loader.svelte'
  import Icon from '../Icon.svelte'
  import Button from '../Button.svelte'

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
  class={`ui Message flex items-center justify-center state-${state} ${classes}`}
  aria-hidden={state === 'inactive'}
  {...props}>
  <div class="content flex flex-col gap-1 items-center">
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
      <Button class="mt-2!" onclick={onDismiss}>Understood</Button>
    {/if}
    {#if state === 'success'}
      <Button class="mt-2!" onclick={onDismiss}>Okay</Button>
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
    pointer-events: none;
    transition: background-color 0.4s ease;
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
    opacity: 0;
    transition: opacity 0.5s ease;
  }
  .ui.Message:not(.state-inactive) .content {
    transition-delay: var(--main-transition-length);
    opacity: 1;
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
