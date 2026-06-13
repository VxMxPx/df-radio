<script lang="ts">
  import { Box, Page, Player, Divider } from '@app/components'
</script>

<Page elements={{ stars: true, lines: true }}>
  <div class="home-illustration" aria-hidden="true"></div>
  <div class="contents">
    <Box floating>
      <div class="flex flex-col gap-2">
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
  @reference 'tailwindcss';

  .contents {
    @apply flex grow justify-center items-center;
  }

  :global(.Box) {
    @apply z-10 w-130 text-center relative mt-[-25%] bg-transparent! gap-11!;
  }

  .home-illustration {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    background-image: url('/images/main-illustration.svg');
    background-repeat: no-repeat;
    background-position: bottom center;
    background-size: 100%;
  }
</style>
