import { env } from '$env/dynamic/public'

export type ApiRequestOptions = Omit<RequestInit, 'body' | 'method'> & {
  fetch?: typeof fetch
}

export type ApiResponse = {
  error?: string
  ok?: boolean
}

const api_base_url = env.PUBLIC_API_URL?.replace(/\/$/, '') || ''

export const api_url = (path: string) => `${api_base_url}${path}`

export const get = async <Response>(
  path: string,
  options: ApiRequestOptions = {},
) => {
  const { fetch: request_fetch = fetch, headers, ...init } = options
  const response = await request_fetch(api_url(path), {
    ...init,
    method: 'GET',
    headers,
  })

  const result = (await response.json()) as Response & ApiResponse

  if (!response.ok) {
    throw new Error(result.error || 'Something went wrong.')
  }

  return result as Response
}

export const post = async <Data, Response extends ApiResponse>(
  path: string,
  data: Data,
  options: ApiRequestOptions = {},
) => {
  const { fetch: request_fetch = fetch, headers, ...init } = options
  const request_headers = new Headers(headers)

  if (!request_headers.has('content-type')) {
    request_headers.set('content-type', 'application/json')
  }

  const response = await request_fetch(api_url(path), {
    ...init,
    method: 'POST',
    headers: request_headers,
    body: JSON.stringify(data),
  })

  const result = (await response.json()) as Response

  if (!response.ok || !result.ok) {
    throw new Error(result.error || 'Something went wrong.')
  }

  return result
}
