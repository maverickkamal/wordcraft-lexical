const CACHE_NAME = 'wordcraft-lexica-cache-v1';
const urlsToCache = [
  '/',
  '/manifest.json',
  // Note: Next.js build outputs (JS, CSS) are typically hashed.
  // For robust caching of these, a tool like Workbox (e.g., via next-pwa) is recommended.
  // This basic SW primarily ensures the app shell and manifest are cached.
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('Failed to cache during install:', error);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        // Not in cache - fetch from network
        return fetch(event.request).then(
          (networkResponse) => {
            // Check if we received a valid response to cache
            if (networkResponse && networkResponse.status === 200 && event.request.method === 'GET') {
              // IMPORTANT: Clone the response. A response is a stream
              // and because we want the browser to consume the response
              // as well as the cache consuming the response, we need
              // to clone it so we have two streams.
              const responseToCache = networkResponse.clone();
              if (event.request.url.startsWith('http')) { // Only cache http/https requests
                caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                });
              }
            }
            return networkResponse;
          }
        ).catch(() => {
          // Optional: Return a fallback offline page if network fails and not in cache
          // if (event.request.mode === 'navigate') {
          //   return caches.match('/offline.html'); // You would need to create and cache offline.html
          // }
        });
      })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
