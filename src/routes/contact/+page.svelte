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
    <div class="basis-0 grow min-w-0 flex flex-col gap-4">
      <p>
        DarkForest.fm is still young, and many of its paths remain unexplored.
      </p>
      <p>
        If you have a thought, a story, a suggestion, a question, or a signal
        worth sharing, we’d love to hear from you. Every message helps shape
        what this place may become.
      </p>
      <p>And who knows what might emerge from a simple knock at the gate.</p>
      <div class="socials flex flex-col gap-2">
        <strong>Find Us Elsewhere</strong>
        <div class="grid grid-cols-2 gap-2">
          {#each socials as item}
            <a
              href={item.link}
              target="_blank"
              class="cursor-pointer p-2! rounded-sm grow flex gap-2 items-center hover:bg-black/20">
              <Icon
                name={item.icon}
                class="shrink-0"
                color="#ffffff"
                size={24} />
              <span class="flex flex-col">
                <span class="leading-[1em]">{item.name}</span>
                <small class="opacity-50">{item.handle}</small>
              </span>
            </a>
          {/each}
        </div>
      </div>
    </div>
    <div class="basis-0 grow min-w-0">
      <ContactForm />
    </div>
  </div>

  <Divider short />

  <div class="team section">
    <div class="columns">
      <div class="basis-0 grow min-w-0 flex flex-col gap-4">
        <h3>Donate</h3>
        <p>
          Your support helps maintain the infrastructure behind Dark Forest FM
          and allows the project to continue growing, exploring, and
          broadcasting into the night.
        </p>
        <p>
          If you decide to contribute, know that you have our sincere gratitude.
        </p>
        <small class="opacity-75">
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
      <div class="basis-0 grow min-w-0 flex flex-col gap-4">
        <h3>FAQ</h3>
        <div class="flex flex-col gap-2">
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
