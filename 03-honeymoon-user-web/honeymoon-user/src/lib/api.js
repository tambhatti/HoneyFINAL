'use client';
import axios from 'axios';

const BASE        = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
const TOKEN_KEY   = 'user_access_token';
const REFRESH_KEY = 'user_refresh_token';
const USER_KEY    = 'user_user';
const COOKIE_NAME = 'user_access_token';

/* ── Token store — localStorage + same-site cookie for middleware ─────────── */
export const tokenStore = {{
  get access()  {{ return typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY)   : null; }},
  get refresh() {{ return typeof window !== 'undefined' ? localStorage.getItem(REFRESH_KEY) : null; }},
  set(a, r) {{
    localStorage.setItem(TOKEN_KEY, a);
    localStorage.setItem(REFRESH_KEY, r);
    document.cookie = COOKIE_NAME + '=' + a + '; path=/; max-age=' + (60 * 60 * 24 * 30) + '; SameSite=Lax';
  }},
  clear() {{
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {{
      const k = localStorage.key(i);
      if (k && k.startsWith('user_')) keys.push(k);
    }}
    keys.forEach(k => localStorage.removeItem(k));
    document.cookie = COOKIE_NAME + '=; path=/; max-age=0';
  }},
}};

/* ── Axios instance ─────────────────────────────────────────────────────────── */
export const api = axios.create({{
  baseURL: BASE,
  headers: {{ 'Content-Type': 'application/json' }},
  timeout: 15000,
}});

/* ── Request interceptor — attach Bearer token ────────────────────────────── */
api.interceptors.request.use(config => {{
  const token = tokenStore.access;
  if (token) config.headers['Authorization'] = 'Bearer ' + token;
  return config;
}}, err => Promise.reject(err));

/* ── Response interceptor — 401 → refresh → retry ─────────────────────────── */
let _refreshing = false;
let _queue = [];

api.interceptors.response.use(
  res => res.data,
  async err => {{
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {{
      if (_refreshing) {{
        return new Promise((resolve, reject) => _queue.push({{ resolve, reject, config: original }}));
      }}
      original._retry = true;
      _refreshing = true;
      try {{
        const {{ data }} = await axios.post(BASE + '/auth/refresh-token', {{ refreshToken: tokenStore.refresh }});
        if (!data.success) throw new Error('refresh_failed');
        tokenStore.set(data.accessToken, data.refreshToken);
        original.headers['Authorization'] = 'Bearer ' + data.accessToken;
        _queue.forEach(q => api(q.config).then(q.resolve).catch(q.reject));
        _queue = [];
        return api(original);
      }} catch {{
        tokenStore.clear();
        _queue.forEach(q => q.reject(new Error('Session expired')));
        _queue = [];
        if (typeof window !== 'undefined') window.location.href = '/login';
        return Promise.reject({{ message: 'Session expired. Please log in again.' }});
      }} finally {{ _refreshing = false; }}
    }}
    // Normalise error shape so catch blocks get a clean .message
    const message = err.response?.data?.message || err.message || 'Request failed';
    const status  = err.response?.status;
    const errors  = err.response?.data?.errors;
    if (!err.response && err.code === 'ECONNABORTED') {{
      return Promise.reject({{ message: 'Request timed out. Please try again.', code: 'TIMEOUT' }});
    }}
    if (!err.response) {{
      return Promise.reject({{ message: 'Network error. Check your connection.', code: 'NETWORK_ERROR' }});
    }}
    return Promise.reject({{ message, status, errors }});
  }}
);

export default api;
