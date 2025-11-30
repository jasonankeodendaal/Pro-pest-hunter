const CACHE_NAME = 'pest-control-v1';
const DYNAMIC_CACHE = 'pest-control-dynamic-v1';

// Assets that must be cached immediately
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Install Event: Cache core assets
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Activate Event: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME && key !== DYNAMIC_CACHE) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch Event: Handle requests
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // STRATEGY 1: API Calls -> Network Only (Don't cache dynamic data)
  if (url.pathname.startsWith('/api/')) {
    return; // Let the browser handle it (Network only)
  }

  // STRATEGY 2: External CDNs (Tailwind, Fonts, Images) -> Stale-While-Revalidate
  // This serves from cache fast, but updates in background
  if (url.origin !== self.location.origin || url.pathname.match(/\.(png|jpg|jpeg|svg|gif)$/)) {
    event.respondWith(
      caches.open(DYNAMIC_CACHE).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          const fetchPromise = fetch(event.request).then((networkResponse) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          }).catch(() => {
             // If offline and image missing, just return nothing or placeholder
          });
          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }

  // STRATEGY 3: Navigation (HTML) -> Network First, Fallback to Cache
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match('/index.html');
        })
    );
    return;
  }

  // STRATEGY 4: Static Files (JS/CSS) -> Cache First
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});