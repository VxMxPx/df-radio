/// <reference types="@sveltejs/kit" />
/// <reference types="vite/client" />

declare const __APP_VERSION__: string

declare module '*.svelte' {
  import type { Component } from 'svelte'

  const component: Component<any>
  export default component
}
