import { get, type ApiRequestOptions } from './api'

export type Artist = {
  name: string
  country: string
  websites?: string[]
  ai: string
}

export const get_artists = (options?: ApiRequestOptions) =>
  get<Artist[]>('/artists', options)
