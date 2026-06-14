<script lang="ts">
  import { onMount } from 'svelte'

  function getRandomInt(min: number, max: number) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  function createStar() {
    const star = document.createElement('div')
    const size = getRandomInt(1, 3)
    star.style.position = 'absolute'
    star.style.zIndex = '0'
    star.style.background = '#ECBD47'
    star.style.borderRadius = '20px'
    star.style.width = `${size}px`
    star.style.height = `${size}px`
    star.style.left = `${getRandomInt(5, 95)}%`
    star.style.top = `${getRandomInt(5, 50)}%`
    star.className = 'star'
    return star
  }

  onMount(() => {
    const timeouts: ReturnType<typeof setTimeout>[] = []
    const stars: HTMLDivElement[] = []

    for (let i = 0; i < 22; i++) {
      const star = createStar()
      stars.push(star)
      timeouts.push(
        setTimeout(() => {
          document.body.append(star)
        }, 1000 * i),
      )
    }

    return () => {
      timeouts.forEach(clearTimeout)
      stars.forEach(star => star.remove())
    }
  })
</script>

<style>
  :global(body > .star) {
    animation: fade-in 1000ms ease both;
  }

  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
</style>
