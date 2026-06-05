// @ts-check
import { execSync } from 'node:child_process'
import { defineConfig, fontProviders } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'

import svelte from '@astrojs/svelte'

const commitHash =
  process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ||
  process.env.NETLIFY_COMMIT_REF?.slice(0, 7) ||
  process.env.CF_PAGES_COMMIT_SHA?.slice(0, 7) ||
  execSync('git rev-parse --short HEAD').toString().trim()

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
    define: {
      __APP_VERSION__: JSON.stringify(commitHash),
    },
  },
})
