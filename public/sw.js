
const CACHE_NAME = 'soko-smart-v2';

// Install event: skip waiting and cache essential files.
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(['/manifest.json']);
      })
  );
});

// Activate event: delete old caches and take control of clients.
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      ).then(() => {
        console.log('New service worker activated and claimed clients.');
        return self.clients.claim();
      });
    })
  );
});

// Fetch event: handle requests with appropriate caching strategies.
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignore non-http/https requests to prevent errors.
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return;
  }

  // Only cache GET requests (Cache API doesn't support HEAD, POST, etc.)
  if (request.method !== 'GET') {
    return;
  }

  // Network-first for navigation to prevent stale HTML.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, responseToCache);
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

  // Cache-first for other assets for performance.
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(request).then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type === 'opaque') {
            return networkResponse;
          }

          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });

          return networkResponse;
        });
      })
  );
});

