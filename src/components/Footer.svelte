<script lang="ts">
  import { APP_VERSION, ME } from '@app/constants'

  const version = __APP_VERSION__
  const year = new Date().getFullYear()
</script>

<div class="footer">
  <a href="/version">
    <small>by {ME} · {year} · v{APP_VERSION}-{version}</small>
  </a>
</div>

<style>
  .footer {
    opacity: 0.5;
    width: 100%;
    bottom: 0;
    left: 0;
    text-align: center;
    z-index: 10;
    padding: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .footer a {
    text-decoration: none;
  }
</style>
