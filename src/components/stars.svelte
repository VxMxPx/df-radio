<script lang="ts">
  const STAR_COUNT = 70

  const getRandomInt = (min: number, max: number) => {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  const stars = Array.from({ length: STAR_COUNT }, (_, index) => {
    const size = getRandomInt(1, 3)
    const blinks = getRandomInt(1, 100) <= 35

    return {
      id: index,
      blinkDelay: `${getRandomInt(2000, 12000)}ms`,
      blinkDuration: `${getRandomInt(3000, 8000)}ms`,
      blinkOpacity: `${getRandomInt(15, 45) / 100}`,
      blinks,
      delay: `${index * 700}ms`,
      floatDuration: `${getRandomInt(7000, 16000)}ms`,
      opacity: `${getRandomInt(35, 100) / 100}`,
      size: `${size}px`,
      x: `${getRandomInt(-16, 16)}px`,
      y: `${getRandomInt(-10, 10)}px`,
      left: `${getRandomInt(1, 99)}%`,
      top: `${getRandomInt(5, 90)}%`,
    }
  })
</script>

{#each stars as star (star.id)}
  <span
    class="star"
    style:width={star.size}
    style:height={star.size}
    style:left={star.left}
    style:top={star.top}
    style:--star-float-duration={star.floatDuration}
    style:--star-opacity={star.opacity}
    style:--star-x={star.x}
    style:--star-y={star.y}
    style:animation-delay={star.delay}>
    <span
      class="spark"
      class:blinks={star.blinks}
      style:--star-blink-delay={star.blinkDelay}
      style:--star-blink-duration={star.blinkDuration}
      style:--star-blink-opacity={star.blinkOpacity}></span>
  </span>
{/each}

<style>
  .star {
    position: absolute;
    border-radius: 20px;
    animation:
      fade-in 1000ms ease both,
      float var(--star-float-duration) ease-in-out infinite alternate;
    z-index: 0;
  }

  .spark {
    display: block;
    width: 100%;
    height: 100%;
    border-radius: inherit;
    background: #ecbd47;
  }

  .spark.blinks {
    animation: blink var(--star-blink-duration) ease-in-out infinite;
    animation-delay: var(--star-blink-delay);
  }

  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: var(--star-opacity);
    }
  }

  @keyframes float {
    from {
      transform: translate3d(0, 0, 0);
    }
    to {
      transform: translate3d(var(--star-x), var(--star-y), 0);
    }
  }

  @keyframes blink {
    0%,
    72%,
    100% {
      opacity: 1;
    }
    78%,
    84% {
      opacity: var(--star-blink-opacity);
    }
    81% {
      opacity: 1;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .star {
      animation: fade-in 1000ms ease both;
    }

    .spark.blinks {
      animation: none;
    }
  }
</style>
