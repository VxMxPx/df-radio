import { post, type ApiRequestOptions } from '@app/lib/api'

export type ContactData = Record<
  string,
  FormDataEntryValue | FormDataEntryValue[]
>

export const contact = (data: ContactData, options?: ApiRequestOptions) =>
  post<ContactData, { ok: true }>('/api/contact', data, options)
