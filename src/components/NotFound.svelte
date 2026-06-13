<script lang="ts">
  import { Box } from '@app/components'
  import logotypeUrl from '@app/assets/logotype-bw.svg?url'
</script>

<div class="justify-center items-center grow flex">
  <Box floating class="max-w-80 flex items-center gap-2! mt-[-25%]! relative">
    <img src={logotypeUrl} alt="" />
    <strong>Page Not Found!</strong>
    <a href="/">Return Home</a>
  </Box>
</div>
