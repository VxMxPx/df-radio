<script lang="ts">
  import { page } from '$app/state'
  import { Button } from '$lib/components/ui'
  import { onMount } from 'svelte'

  onMount(() => document.body.classList.add('home-page-art'))
</script>

<div class="page pg_error">
  <div class="flex-col gap-10">
    {#if page.status === 404}
      <h1>Page not found</h1>
      <p>The requested page doesn’t exist.</p>
    {:else}
      <h1>{page.status}</h1>
      <p>{page.error?.message}</p>
    {/if}
  </div>
  <!-- <a href="/">Return to home page</a> -->
  <Button href="/">Return home</Button>
</div>

<style>
  .pg_error {
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: var(--gap-20);
    border: 1px solid var(--tx-primary-50);
    align-self: center;
    justify-self: center;
    padding: var(--gap-20);
    border-radius: 4px;
  }
</style>
