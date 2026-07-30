<script lang="ts">
  import { Box, Page, Player, Divider } from '@app/components'
</script>

<Page elements={{ stars: true, lines: true }}>
  <div class="home-illustration" aria-hidden="true"></div>
  <div class="contents">
    <Box floating>
      <div class="intro">
        <p>
          Waves of sound, thought, and symbol. Streaming from an alternate
          present, through hidden paths and quiet hours.
        </p>
        <p>Welcome to the broadcast beyond the ordinary.</p>
      </div>
      <Divider />
      <Player />
    </Box>
  </div>
</Page>

<style>
  .contents {
    display: flex;
    flex-grow: 1;
    align-items: center;
    justify-content: center;
  }

  :global(.Box) {
    /* position: relative; */
    z-index: 22;
    width: 32.5rem;
    max-width: 100%;
    margin-top: -25%;
    gap: 2.75rem !important;
    background: transparent !important;
    text-align: center;
  }

  .intro {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .home-illustration {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    background-image: url('/main-illustration.svg');
    background-repeat: no-repeat;
    background-position: bottom center;
    background-size: 100%;
  }
</style>
