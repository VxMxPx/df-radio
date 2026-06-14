import { post, type ApiRequestOptions } from '@app/lib/api'

export type ContactMetadata = {
  browser?: string
  device?: string
  language?: string
  platform?: string
  screen?: string
  timezone?: string
  userAgent?: string
  viewport?: string
}

export type ContactData = Record<
  string,
  ContactMetadata | FormDataEntryValue | FormDataEntryValue[] | undefined
> & {
  metadata?: ContactMetadata
}

export const contact = (data: ContactData, options?: ApiRequestOptions) =>
  post<ContactData, { ok: true }>('/api/contact', data, options)
