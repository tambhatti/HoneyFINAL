import AsyncStorage from '@react-native-async-storage/async-storage';

export const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api/v1'; // B-07: set EXPO_PUBLIC_API_URL in .env for production

// ─── Token storage helpers ────────────────────────────────────────────────────
export const TokenStore = {
  getAccess:   () => AsyncStorage.getItem('accessToken'),
  getRefresh:  () => AsyncStorage.getItem('refreshToken'),
  getRole:     () => AsyncStorage.getItem('userRole'),
  setTokens: async (accessToken, refreshToken, role) => {
    await AsyncStorage.multiSet([
      ['accessToken',  accessToken],
      ['refreshToken', refreshToken],
      ['userRole',     role],
    ]);
  },
  clear: () => AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'userRole', 'userData']),
};

// ─── Core request function ────────────────────────────────────────────────────
let isRefreshing = false;
let refreshQueue = [];

async function request(method, path, body = null, requiresAuth = true, isRetry = false) {
  const headers = { 'Content-Type': 'application/json' };

  if (requiresAuth) {
    const token = await TokenStore.getAccess();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const config = { method, headers };
  if (body) config.body = JSON.stringify(body);

  const url = path.startsWith('http') ? path : `${BASE_URL}${path}`;

  let res;
  try {
    res = await fetch(url, config);
  } catch (networkError) {
    throw { message: 'Network error — check your connection', code: 'NETWORK_ERROR' };
  }

  // ── Auto-refresh on 401 ──────────────────────────────────────────────────
  if (res.status === 401 && !isRetry) {
    if (isRefreshing) {
      // Queue this request until refresh completes
      return new Promise((resolve, reject) => {
        refreshQueue.push({ resolve, reject, method, path, body, requiresAuth });
      });
    }
    isRefreshing = true;
    try {
      const refreshToken = await TokenStore.getRefresh();
      if (!refreshToken) throw new Error('No refresh token');

      const refreshRes = await fetch(`${BASE_URL}/auth/refresh-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
      const refreshData = await refreshRes.json();
      if (!refreshData.success) throw new Error('Refresh failed');

      const role = await TokenStore.getRole();
      await TokenStore.setTokens(refreshData.accessToken, refreshData.refreshToken, role);

      // Drain the queue
      refreshQueue.forEach(({ resolve, reject, ...args }) => {
        request(args.method, args.path, args.body, args.requiresAuth, true)
          .then(resolve).catch(reject);
      });
      refreshQueue = [];

      // Retry the original request
      return request(method, path, body, requiresAuth, true);
    } catch {
      refreshQueue.forEach(({ reject }) => reject({ message: 'Session expired', code: 'SESSION_EXPIRED' }));
      refreshQueue = [];
      await TokenStore.clear();
      throw { message: 'Session expired — please login again', code: 'SESSION_EXPIRED' };
    } finally {
      isRefreshing = false;
    }
  }

  const data = await res.json().catch(() => ({ success: false, message: 'Invalid response' }));

  if (!res.ok) {
    throw {
      message: data.message || `Request failed (${res.status})`,
      status:  res.status,
      errors:  data.errors,
      code:    data.code,
    };
  }

  return data;
}

// ─── Exported HTTP methods ────────────────────────────────────────────────────
export const api = {
  get:    (path, auth = true)        => request('GET',    path, null, auth),
  post:   (path, body, auth = true)  => request('POST',   path, body, auth),
  put:    (path, body, auth = true)  => request('PUT',    path, body, auth),
  patch:  (path, body, auth = true)  => request('PATCH',  path, body, auth),
  delete: (path, auth = true)        => request('DELETE', path, null, auth),

  // Query string helper
  getQ: (path, params = {}, auth = true) => {
    const qs = Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== null && v !== '')
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      .join('&');
    return request('GET', qs ? `${path}?${qs}` : path, null, auth);
  },
};

export default api;
