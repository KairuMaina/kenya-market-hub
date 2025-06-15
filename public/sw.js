
const CACHE_NAME = 'soko-smart-v1';
const urlsToCache = [
  '/',
  '/manifest.json'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  // We only want to cache GET requests for http/https protocols.
  // This robustly checks the protocol to avoid unsupported schemes.
  const isCacheable =
    event.request.method === 'GET' &&
    ['http:', 'https:'].includes(new URL(event.request.url).protocol);

  if (isCacheable) {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          // Return cached version or fetch from network
          if (response) {
            return response;
          }
          
          return fetch(event.request).then((networkResponse) => {
            // Check if we received a valid response.
            // 'basic' type ensures we only cache requests from our origin.
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }

            // Clone the response because it's a stream and can be consumed only once.
            const responseToCache = networkResponse.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                // Use .catch to handle potential errors from cache.put()
                cache.put(event.request, responseToCache).catch(err => {
                  console.warn(`SW: Failed to cache request for ${event.request.url}`, err);
                });
              });

            return networkResponse;
          });
        })
    );
  }
  // For other requests, do nothing and let the browser handle them.
});

// Activate event
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
      );
    })
  );
});
