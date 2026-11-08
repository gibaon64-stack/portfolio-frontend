const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '')
let csrfToken = ''

export function resolveApiUrl(path) {
  const apiUrl = new URL(apiBaseUrl, window.location.origin)
  return new URL(path, apiUrl.origin).href
}

function readCsrfCookie() {
  const cookie = document.cookie.split('; ').find((item) => item.startsWith('csrf_access_token='))
  return cookie ? decodeURIComponent(cookie.slice('csrf_access_token='.length)) : ''
}

async function request(path, options = {}) {
  const method = options.method || 'GET'
  const isFormData = options.body instanceof FormData
  const headers = new Headers(options.headers || {})
  if (!isFormData && options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  if (!['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    csrfToken ||= readCsrfCookie()
    if (csrfToken && !headers.has('X-CSRF-TOKEN')) headers.set('X-CSRF-TOKEN', csrfToken)
  }

  const response = await fetch(`${apiBaseUrl}${path}`, {
    credentials: 'include',
    ...options,
    method,
    headers,
  })

  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new Error(body.error || `Request failed with status ${response.status}`)
  }

  return response.json()
}

export function getPortfolio() {
  return request('/portfolio')
}

export function submitInquiry(inquiry) {
  return request('/inquiries', {
    method: 'POST',
    body: JSON.stringify(inquiry),
  })
}

export async function loginAdmin(credentials) {
  const result = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  })
  csrfToken = result.csrf_token || readCsrfCookie()
  return result.user
}

export function registerUser(details) {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(details),
  })
}

export async function loginUser(credentials) {
  const result = await request('/auth/user/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  })
  csrfToken = result.csrf_token || readCsrfCookie()
  return result.user
}

export async function getCurrentAdmin() {
  const result = await request('/auth/me')
  csrfToken = result.csrf_token || readCsrfCookie()
  return result
}

export function logoutAdmin() {
  return request('/auth/logout', { method: 'POST' }).then((result) => {
    csrfToken = ''
    return result
  })
}

export function getAdminContent() {
  return request('/admin/content')
}

export function getAdminOverview() {
  return request('/admin/overview')
}

export function saveAdminResource(path, method, data) {
  return request(path, {
    method,
    body: data instanceof FormData ? data : JSON.stringify(data),
  })
}