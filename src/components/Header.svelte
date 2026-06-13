<script lang="ts">
  import logotypeUrl from '@app/assets/logotype-color.svg?url'
  import { APP_NAME } from '@app/constants'
  import Button from './Button.svelte'
  import Icon from './Icon.svelte'

  type HeaderProps = {
    currentPath: string
  }

  const { currentPath }: HeaderProps = $props()

  const paths = [
    { url: '/', title: 'Home' },
    { url: '/about', title: 'About' },
    { url: '/program', title: 'Program' },
    { url: '/contact', title: 'Contact' },
  ]

  const appName = APP_NAME.toLocaleLowerCase().split('.')
  let isNavOpen = $state(false)
</script>

<header>
  <a href="/">
    <h1>
      <img src={logotypeUrl} alt="" />
      <span>
        <span>{appName[0]}</span><span class="opacity-50">.{appName[1]}</span>
      </span>
    </h1>
  </a>
  <nav id="main-nav" data-open={isNavOpen}>
    {#each paths as path}
      <a
        class:active={path.url === currentPath}
        href={path.url}
        onclick={() => (isNavOpen = false)}>
        {path.title}
      </a>
    {/each}
  </nav>
  <div class="mobile-nav-button" class:open={isNavOpen}>
    <Button
      aria-controls="main-nav"
      aria-expanded={isNavOpen}
      aria-label="Toggle navigation"
      class="w-8 h-8"
      onclick={() => (isNavOpen = !isNavOpen)}>
      <Icon name="Menu" size={20} />
    </Button>
  </div>
</header>

<style>
  header {
    position: relative;
    margin-top: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    z-index: 2;
  }
  header h1 {
    color: var(--color-fg);
    align-items: center;
    display: flex;
    gap: 10px;
    cursor: pointer;
  }
  header img {
    display: block;
    width: 44px;
    height: 44px;
  }
  header a {
    text-decoration: none;
  }
  nav {
    --nav-gap: 8px;
    background: var(--color-bg-faded);
    padding: 8px 16px;
    box-shadow: inset 2px 3px 6px rgba(0, 0, 0, 0.15);
    border-radius: 6px;
    display: flex;
    gap: var(--nav-gap);
  }
  nav a {
    display: flex;
    align-items: center;
    text-align: right;
    color: #ffffff;
    text-decoration: none;
  }
  nav a.active {
    font-weight: bold;
  }
  nav a:not(:last-child)::after {
    content: '|';
    opacity: 30%;
    margin-left: var(--nav-gap);
  }

  .mobile-nav-button {
    display: none;
  }

  @media (width < 680px) {
    .mobile-nav-button {
      display: block;
      position: relative;
      z-index: 1001;
    }

    nav {
      position: fixed;
      inset: 0;
      z-index: 1000;
      border-radius: 0;
      padding: 100px 24px 24px;
      display: none;
      flex-direction: column;
      align-items: stretch;
      justify-content: flex-start;
      gap: 18px;
      background: color-mix(in srgb, var(--color-bg) 94%, #000);
    }

    nav[data-open='true'] {
      display: flex;
    }

    nav a {
      justify-content: center;
      font-size: 36px;
      text-align: center;
    }

    nav a:not(:last-child)::after {
      content: none;
    }

    .mobile-nav-button.open {
      position: fixed;
      top: 24px;
      right: 24px;
    }
  }

  @media (width < 420px) {
    header h1 {
      gap: clamp(6px, 2vw, 10px);
      font-size: clamp(28px, 9vw, 40px);
    }
    header img {
      width: clamp(32px, 10vw, 44px);
      height: auto;
      aspect-ratio: 1;
    }
  }
</style>
