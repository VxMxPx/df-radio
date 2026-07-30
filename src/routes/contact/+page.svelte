<script lang="ts">
  import {
    Accordion,
    Button,
    Divider,
    Icon,
    Page,
    type IconName,
  } from '@app/components'
  import faq from './faq.json'
  import socialsData from './socials.json'
  import ContactForm from './contact-form.svelte'

  const socials = socialsData as {
    name: string
    icon: IconName
    handle: string
    link: string
  }[]
</script>

<Page title="Contact" elements={{ stars: true, lines: true }}>
  <h2>Contact</h2>
  <Divider />
  <div class="columns">
    <div class="contact-column">
      <p>
        DarkForest.fm is still young, and many of its paths remain unexplored.
      </p>
      <p>
        If you have a thought, a story, a suggestion, a question, or a signal
        worth sharing, we’d love to hear from you. Every message helps shape
        what this place may become.
      </p>
      <p>And who knows what might emerge from a simple knock at the gate.</p>
      <div class="socials">
        <strong>Find Us Elsewhere</strong>
        <div class="socials__list">
          {#each socials as item}
            <a
              href={item.link}
              target="_blank"
              class="socials__link">
              <Icon
                name={item.icon}
                class="socials__icon"
                color="#ffffff"
                size={24} />
              <span class="socials__label">
                <span class="socials__name">{item.name}</span>
                <small class="socials__handle">{item.handle}</small>
              </span>
            </a>
          {/each}
        </div>
      </div>
    </div>
    <div class="contact-column">
      <ContactForm />
    </div>
  </div>

  <Divider short />

  <div class="team section">
    <div class="columns">
      <div class="contact-column">
        <h3>Donate</h3>
        <p>
          Your support helps maintain the infrastructure behind Dark Forest FM
          and allows the project to continue growing, exploring, and
          broadcasting into the night.
        </p>
        <p>
          If you decide to contribute, know that you have our sincere gratitude.
        </p>
        <small class="donation-note">
          Support is processed securely through Stripe’s payment platform.
        </small>
        <div>
          <Button
            variant="accent"
            target="_blank"
            href="https://donate.stripe.com/eVqaEY6p2eYibA9clf8ww00">
            Donate
          </Button>
        </div>
      </div>
      <div class="contact-column">
        <h3>FAQ</h3>
        <div class="faq-list">
          {#each faq as item}
            <Accordion title={item.title}>
              {@html item.body}
            </Accordion>
          {/each}
        </div>
      </div>
    </div>
  </div>
</Page>

<style>
  .contact-column {
    display: flex;
    flex: 1 1 0;
    flex-direction: column;
    min-width: 0;
    gap: 1rem;
  }

  .socials,
  .faq-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .socials__list {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.5rem;
  }

  .socials__link {
    display: flex;
    flex-grow: 1;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem !important;
    border-radius: 0.125rem;
    cursor: pointer;
    text-decoration: none;
  }

  .socials__link:hover {
    background: rgb(0 0 0 / 0.2);
  }

  :global(.socials__icon) {
    flex-shrink: 0;
  }

  .socials__label {
    display: flex;
    flex-direction: column;
  }

  .socials__name {
    line-height: 1;
  }

  .socials__handle {
    opacity: 0.5;
  }

  .donation-note {
    opacity: 0.75;
  }
</style>
