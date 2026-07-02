<script lang="ts">
  import { Divider, Page } from '@app/components'
</script>

<Page title="About" elements={{ lines: true, stars: true }}>
  <h2>About the Project</h2>
  <Divider />

  <div class="columns">
    <div class="text">
      <p>
        DarkForest.fm is an independent internet radio dedicated to quiet music,
        thoughtful curation, and slower rhythms.
      </p>
      <p>
        Every piece of music is selected by hand. There are no recommendation
        algorithms deciding what comes next, no endless playlists generated for
        engagement, and no race to keep you listening for as long as possible.
      </p>
    </div>
    <div class="text">
      <p>
        The station explores ambient, neoclassical, drone, experimental, dark
        jazz, post-rock, and other contemplative genres, creating an atmosphere
        rather than simply broadcasting songs.
      </p>
      <p>
        DarkForest.fm is an invitation to slow down. Whether you’re working,
        reading, walking through nature, driving at night, or simply taking a
        moment for yourself, the station is here to accompany rather than
        interrupt.
      </p>
    </div>
  </div>

  <Divider wavey />

  <div class="team section">
    <h3>The Team</h3>
    <div class="columns">
      <div class="text">
        <p>
          DarkForest.fm is currently a one-person project. I’m Marko, a product
          engineer and designer from Slovenia with a long-standing interest in
          technology, psychology, music, and thoughtful digital experiences.
        </p>
        <p>
          This station brings those interests together. Every aspect of the
          project—from the software and visual identity to licensing, artwork,
          and music selection—is built and maintained independently.
        </p>
        <p>
          Perhaps one day the project will grow into something larger. For now,
          its small scale is one of its strengths. It allows every decision to
          be intentional and every addition to have a reason for being.
        </p>
      </div>
      <div class="text">
        <p>
          <img
            class="block rounded-xs object-cover"
            src="/images/mdccc-cc.png"
            alt="" />
        </p>
      </div>
    </div>
  </div>

  <Divider short />

  <div class="mission section">
    <h3>Mission</h3>
    <div class="columns">
      <div class="text">
        <p>DarkForest.fm exists as an alternative.</p>

        <p>
          Today’s internet is remarkably good at capturing attention. Platforms
          are designed to measure, predict, optimize, and compete for every
          possible moment. They become places we consume almost automatically.
        </p>

        <p>This project follows a different philosophy.</p>
      </div>

      <div class="text">
        <p>
          It is hand-crafted, almost analogue in spirit. It values curation over
          automation, presence over urgency, and participation over engagement
          metrics.
        </p>
        <p>
          Despite its name, a dark forest is not empty. It is alive with quiet
          rhythms, hidden paths, small movements, and the possibility of
          discovery. It asks nothing of you except that you enter with
          curiosity.
        </p>

        <p>
          Take what you need, stay for as long as you wish, and return whenever
          the path leads you here again.
        </p>
      </div>
    </div>
  </div>
</Page>
