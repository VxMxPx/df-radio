<script>
  import { APP_NAME } from '$root/constants'
  import { Page } from '$root/lib/components'
  import { Accordion, Button, Icon } from '$root/lib/components/ui'
  import Divider from '$root/lib/components/ui/divider.svelte'
  import { default as faq } from './faq.json'

  const email = `hi@${APP_NAME.toLowerCase()}`
</script>

<Page title="Contact">
  <h1>Contact</h1>

  <div class="initial columns gap-40">
    <div>
      <p>DarkForest is still young, and many of its paths remain unexplored.</p>
      <p>
        If you have a thought, a story, a suggestion, a question, or a signal
        worth sharing, we’d love to hear from you. Every message helps shape
        what this place may become.
      </p>
      <p>And who knows what might emerge from a simple knock at the gate.</p>
      <p>
        <a class="social" href="mailto:{email}">
          <Icon name="Mail" />
          <small>{email}</small>
        </a>
      </p>
    </div>
    <div class="connectors">
      <span> Find us elsewhere </span>
      <div class="flex flex-col gap-10">
        <a href="https://t.me/darkforestfm">
          <Icon name="SocialTelegram" />
          <small>t.me/darkforestfm</small>
        </a>
        <a href="https://x.com/darkforestfm">
          <Icon name="SocialX" />
          <small>@darkforestfm</small>
        </a>
        <a href="https://www.instagram.com/darkforest.fm">
          <Icon name="SocialInstagram" />
          <small>@darkforest.fm</small>
        </a>
        <a href="mailto:{email}">
          <Icon name="Mail" />
          <small>{email}</small>
        </a>
      </div>
    </div>
  </div>

  <Divider edge={false} center={false} class="mw-25" />

  <div class="columns gap-40">
    <div>
      <h2>Donate</h2>
      <p>
        Your support helps maintain the infrastructure behind Dark Forest FM and
        allows the project to continue growing, exploring, and broadcasting into
        the night.
      </p>
      <p>
        If you decide to contribute, know that you have our sincere gratitude.
      </p>
      <small>
        Support is processed securely through Stripe’s payment platform.
      </small>
      <div>
        <Button
          variant="primary"
          href="https://donate.stripe.com/eVqaEY6p2eYibA9clf8ww00"
        >
          Donate
        </Button>
      </div>
    </div>
    <div>
      <h2>FAQ</h2>
      <div class="faq-list">
        {#each faq as item}
          <Accordion title={item.title}>
            {@html item.body}
          </Accordion>
        {/each}
      </div>
    </div>
  </div>
</Page>

<style>
  .connectors {
    display: flex;
    flex-direction: column;
    /*gap: var(--gap-10);*/
  }
  a.social,
  .connectors a {
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: var(--gap-10);
  }
  a.social :global(.icon_ui),
  .connectors a :global(.icon_ui) {
    opacity: 0.5;
  }

  .initial.columns {
    grid-template-columns: 1fr auto;
  }

  .faq-list :global(*:last-child) {
    border-bottom: none;
  }
</style>
