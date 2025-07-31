const BASE_URL = 'http://localhost:3001' // should be from env in prod
let _token: string | null = null

function setToken(token: string | null) {
  _token = token
}

/**
 * Send HTTP requests to backend API.
 */
// PUBLIC_INTERFACE
async function http<T = unknown>(
  method: string,
  url: string,
  data?: Record<string, unknown>,
  params?: Record<string, string | number | boolean | undefined>
): Promise<T> {
  let fullUrl = BASE_URL + url
  if (params) {
    const qs = new URLSearchParams(
      Object.entries(params).reduce(
        (acc, [key, val]) => {
          if (val !== undefined) acc[key] = String(val)
          return acc
        },
        {} as Record<string, string>
      )
    ).toString()
    if (qs) fullUrl += '?' + qs
  }

  const resp = await fetch(fullUrl, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(!!_token ? { 'Authorization': `Bearer ${_token}` } : {})
    },
    body: ['POST', 'PUT', 'PATCH'].includes(method) ? JSON.stringify(data) : undefined
  })
  if (resp.ok) {
    if (resp.status !== 204) {
      try {
        return await resp.json()
      } catch { return null as T }
    }
    return null as T
  } else {
    let detail
    try {
      detail = (await resp.json())?.detail || resp.statusText
      if (typeof detail === 'object') detail = JSON.stringify(detail)
    } catch {
      detail = resp.statusText
    }
    throw new Error(detail)
  }
}

// PUBLIC_INTERFACE
function get<T = unknown>(url: string, params?: Record<string, string|number|boolean|undefined>) {
  return http<T>('GET', url, undefined, params)
}
// PUBLIC_INTERFACE
function post<T = unknown>(url: string, data?: Record<string, unknown>) {
  return http<T>('POST', url, data)
}
// PUBLIC_INTERFACE
function put<T = unknown>(url: string, data?: Record<string, unknown>) {
  return http<T>('PUT', url, data)
}
// PUBLIC_INTERFACE
function del<T = unknown>(url: string) {
  return http<T>('DELETE', url)
}

export default { setToken, http, get, post, put, delete: del }
