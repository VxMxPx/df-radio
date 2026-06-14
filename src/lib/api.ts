export type ApiRequestOptions = Omit<RequestInit, 'body' | 'method'> & {
  fetch?: typeof fetch
}

export type ApiResponse = {
  error?: string
  ok?: boolean
}

export const post = async <Data, Response extends ApiResponse>(
  path: string,
  data: Data,
  options: ApiRequestOptions = {},
) => {
  const { fetch: requestFetch = fetch, headers, ...init } = options
  const requestHeaders = new Headers(headers)

  if (!requestHeaders.has('content-type')) {
    requestHeaders.set('content-type', 'application/json')
  }

  const response = await requestFetch(path, {
    ...init,
    method: 'POST',
    headers: requestHeaders,
    body: JSON.stringify(data),
  })

  const result = (await response.json()) as Response

  if (!response.ok || !result.ok) {
    throw new Error(result.error || 'Something went wrong.')
  }

  return result
}
