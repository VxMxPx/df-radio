/// <reference types="astro/client" />

declare const __APP_VERSION__: string

declare module '*.astro' {
  import type { AstroComponentFactory } from 'astro/runtime/server/index.js'

  const component: AstroComponentFactory
  export default component
}
