<script>
  import { Title, Navigation } from '.'
  import { Divider } from './ui'
</script>

<header class="component header">
  <div class="line">
    <a class="no-decoration" href="/">
      <Title variant="h3" />
    </a>
    <Navigation />
  </div>
  <Divider />
</header>

<style>
  header {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: var(--gap-40);
  }
  header > .line {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  header :global(h3) {
    color: var(--tx-primary-75);
  }
</style>
