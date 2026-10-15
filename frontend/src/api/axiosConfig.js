import axios from 'axios';
import { offlineService } from '../services/offlineService';
import { getStoredAuthToken, getStoredAuthUser } from '../services/authStorage';

const API_BASE = '/api';
const API_CACHE_FRESH_MS = 30 * 1000;
const API_CACHE_STALE_MAX_AGE_MS = 5 * 60 * 1000;
const backgroundRefreshes = new Set();
const lastBackgroundRefresh = new Map();

function buildCacheKey(url, params) {
  if (!params) return url;
  if (params instanceof URLSearchParams) return `${url}::params:${params.toString()}`;
  if (typeof params !== 'object') return `${url}::params:${String(params)}`;

  const sortedParams = Object.keys(params)
    .sort()
    .map((key) => [key, params[key]]);
  return `${url}::params:${JSON.stringify(sortedParams)}`;
}

function hasUnexpiredToken() {
  const token = getStoredAuthToken();
  if (!token) return false;

  try {
    const payload = token.split('.')[1]
      .replace(/-/g, '+')
      .replace(/_/g, '/')
      .padEnd(Math.ceil(token.split('.')[1].length / 4) * 4, '=');
    const claims = JSON.parse(atob(payload));
    return typeof claims.exp === 'number' && claims.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 90000,
});

// Reutilizar respuestas GET recientes al volver a un módulo. Las escrituras
// invalidan el caché; una respuesta cacheada nunca extiende la sesión del JWT.
const requestGet = api.get.bind(api);
function refreshCacheInBackground(url, config, cacheKey) {
  if (backgroundRefreshes.has(cacheKey)) return;
  const lastRefresh = lastBackgroundRefresh.get(cacheKey) || 0;
  if (Date.now() - lastRefresh < 15 * 1000) return;

  backgroundRefreshes.add(cacheKey);
  lastBackgroundRefresh.set(cacheKey, Date.now());
  requestGet(url, { ...config, _offlineCacheKey: cacheKey })
    .catch(() => {})
    .finally(() => backgroundRefreshes.delete(cacheKey));
}

api.get = (url, config = {}) => {
  const cacheKey = buildCacheKey(url, config.params);
  const cacheableResponse = config.responseType !== 'blob' && config.responseType !== 'arraybuffer';

  if (cacheableResponse && hasUnexpiredToken()) {
    const cached = offlineService.getCachedEntry(cacheKey);
    if (cached && Date.now() - cached.timestamp <= API_CACHE_STALE_MAX_AGE_MS) {
      if (Date.now() - cached.timestamp > API_CACHE_FRESH_MS) {
        refreshCacheInBackground(url, config, cacheKey);
      }

      return Promise.resolve({
        data: cached.data,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { ...config, baseURL: API_BASE, url, method: 'get' },
        fromCache: true,
      });
    }
  }

  return requestGet(url, { ...config, _offlineCacheKey: cacheKey });
};

// Interceptor: agregar JWT a cada request
api.interceptors.request.use((config) => {
  const token = getStoredAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Agregar usuarioId si esta disponible
  const userData = getStoredAuthUser();
  if (userData?.id) {
    config.headers['X-User-Id'] = userData.id;
  }
  if (userData?.email) {
    config.headers['X-User-Email'] = userData.email;
  }
  if (userData?.nombreCompleto) {
    config.headers['X-User-Name'] = userData.nombreCompleto;
  }

  return config;
});

// Interceptor: manejar errores y cache
api.interceptors.response.use(
  (response) => {
    const method = response.config.method?.toLowerCase();

    // Cachear solo GET JSON exitosos y borrar lecturas tras cualquier escritura.
    if (method === 'get' && response.config.responseType !== 'blob' && response.config.responseType !== 'arraybuffer') {
      offlineService.cacheData(
        response.config._offlineCacheKey || response.config.url,
        response.data
      );
    } else if (method && method !== 'get') {
      offlineService.invalidateCache();
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Disparar evento para que AuthContext haga el logout limpio
      window.dispatchEvent(new Event('auth:unauthorized'));
    }
    // Fallback offline para GET (Network Error o timeout)
    const requestConfig = error.config;
    if ((!error.response || error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED')
      && requestConfig?.method === 'get') {
      const cached = offlineService.getCachedData(
        requestConfig._offlineCacheKey || requestConfig.url
      );
      if (cached !== null) {
        return Promise.resolve({
          data: cached,
          status: 200,
          statusText: 'OK',
          headers: {},
          config: requestConfig,
          fromCache: true,
        });
      }
    }
    return Promise.reject(error);
  }
);

export default api;
