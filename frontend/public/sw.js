// Service worker de CampoVital: prioriza la versión más reciente de la aplicación.
const CACHE_NAME = 'campovital-cache-v2';
const STATIC_ASSETS = ['/manifest.json'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

async function guardarRespuesta(request, response) {
  if (!response || !response.ok) return response;
  const cache = await caches.open(CACHE_NAME);
  await cache.put(request, response.clone());
  return response;
}

async function cargarPagina(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, response.clone());
      await cache.put('/index.html', response.clone());
    }
    return response;
  } catch {
    return (await caches.match(request))
      || (await caches.match('/index.html'))
      || (await caches.match('/'))
      || Response.error();
  }
}

async function cargarRecurso(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  if (response.ok && new URL(request.url).origin === self.location.origin) {
    await cache.put(request, response.clone());
  }
  return response;
}

async function cargarApi(request) {
  try {
    return await guardarRespuesta(request, await fetch(request));
  } catch {
    return (await caches.match(request)) || Response.error();
  }
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (url.pathname.startsWith('/api/')) {
    event.respondWith(cargarApi(request));
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(cargarPagina(request));
    return;
  }

  event.respondWith(cargarRecurso(request));
});
