<script lang="ts">
  import { Box } from '@app/components'
  import logotypeUrl from '@app/assets/logotype-bw.svg?url'
</script>

<div class="NotFound">
  <Box floating class="NotFound__box">
    <img src={logotypeUrl} alt="" />
    <strong>Page Not Found!</strong>
    <a href="/">Return Home</a>
  </Box>
</div>

<style>
  .NotFound {
    display: flex;
    flex-grow: 1;
    align-items: center;
    justify-content: center;
  }

  :global(.NotFound__box) {
    position: relative;
    max-width: 20rem;
    margin-top: -25% !important;
    flex-direction: row;
    align-items: center;
    gap: 0.5rem !important;
  }
</style>
