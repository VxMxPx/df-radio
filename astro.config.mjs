// @ts-check
import { defineConfig, fontProviders } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'

import svelte from '@astrojs/svelte'

// https://astro.build/config
export default defineConfig({
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Montagu Slab',
      cssVariable: '--font-montagu-slab',
      weights: [300],
    },
    {
      provider: fontProviders.google(),
      name: 'Handjet',
      cssVariable: '--font-handjet',
    },
  ],

  integrations: [svelte()],

  vite: {
    plugins: [tailwindcss()],
  },
})
