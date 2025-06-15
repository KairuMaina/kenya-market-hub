
// Service worker v3 - 2025-06-15 - Caches only GET requests, robust versioning and better activation
const CACHE_NAME = 'soko-smart-v3';

// Install event: cache essential files only and skip waiting.
self.addEventListener('install', (event) => {
  console.log('[SW] Install event');
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Opened cache');
        return cache.addAll(['/manifest.json']);
      })
  );
});

// Activate event: delete all old caches and take control of clients.
self.addEventListener('activate', (event) => {
  console.log('[SW] Activate event');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[SW] New service worker activated and claimed clients.');
      return self.clients.claim();
    })
  );
});

// Fetch event: cache GET requests only, network-first for navigation, cache-first otherwise.
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignore non-http/https requests.
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return;
  }

  // Only cache GET requests (Cache API doesn't support HEAD, POST, etc.)
  if (request.method !== 'GET') {
    // Skip any non-GET requests to avoid errors
    return;
  }

  // Network-first for navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Try caching, but catch & log failures (e.g., opaque responses)
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, responseToCache).catch((err) => {
              console.warn('[SW] Cache put failed (navigate):', err);
            });
          });
          return response;
        })
        .catch(() => {
          // Fallback to cache if network fails.
          return caches.match(request).then(response => response || caches.match('/'));
        })
    );
    return;
  }

  // Cache-first strategy for other assets
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request).then((networkResponse) => {
          // Only cache successful, un-opaque GET responses
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type === 'opaque') {
            return networkResponse;
          }
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache).catch((err) => {
              console.warn('[SW] Cache put failed (non-navigate):', err);
            });
          });
          return networkResponse;
        });
      })
  );
});

