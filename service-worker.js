

const CACHE_NAME = 'pro-pest-v4';
const DYNAMIC_CACHE = 'pro-pest-dynamic-v4';
const OFFLINE_URL = '/index.html';

const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Install Event: Cache core assets immediately
self.addEventListener('install', (event) => {
  self.skipWaiting(); // Force activation
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
});

// Activate Event: Cleanup old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.map((key) => {
        if (key !== CACHE_NAME && key !== DYNAMIC_CACHE) {
          return caches.delete(key);
        }
      })
    )).then(() => self.clients.claim())
  );
});

// Fetch Event: Network First for Nav, Stale-While-Revalidate for Assets
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Exclude API calls from caching strategies (Always Network First)
  if (url.pathname.startsWith('/api/')) {
       // Optional: Add offline queueing logic here for POST requests if needed
       return;
  }

  // Navigation: Network First -> Cache -> Offline Fallback
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match(OFFLINE_URL))
    );
    return;
  }

  // Static Assets / Images: Stale-While-Revalidate
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(DYNAMIC_CACHE).then((cache) => {
          try { cache.put(event.request, responseToCache); } catch(e) {}
        });
        return networkResponse;
      }).catch(() => {
          // Fallback logic for images if offline
          if (event.request.destination === 'image') {
              // Return a placeholder or nothing
          }
      });
      return cachedResponse || fetchPromise;
    })
  );
});

// Push Notifications
self.addEventListener('push', (event) => {
  let data = { title: 'Pro Pest Hunters', body: 'New update available.', url: '/' };
  if (event.data) {
    try { data = event.data.json(); } catch(e) { data.body = event.data.text(); }
  }

  const options = {
    body: data.body,
    icon: 'https://i.ibb.co/zHBzVwRV/image.png',
    badge: 'https://i.ibb.co/5xYk6jZb/maskable-icon.png',
    vibrate: [100, 50, 100],
    data: { url: data.url || '/' },
    actions: [
        { action: 'explore', title: 'View Details' },
        { action: 'close', title: 'Close' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Pro Pest Hunters', options)
  );
});

// Notification Click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'close') return;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Focus existing window if available
      for (const client of clientList) {
        if (client.url === event.notification.data.url && 'focus' in client) {
          return client.focus();
        }
      }
      // Open new window
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data.url);
      }
    })
  );
});

// Background Sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-bookings') {
    event.waitUntil(
      // Logic to sync localDB bookings to server when online
      console.log('[ServiceWorker] Background Sync Executed')
    );
  }
});

// Periodic Sync
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'content-update') {
    event.waitUntil(
      // Logic to fetch fresh content periodically
       caches.open(DYNAMIC_CACHE).then(cache => {
           return fetch('/api/init').then(res => {
               // We don't cache API directly usually, but this is a placeholder for logic
               console.log('[ServiceWorker] Periodic Content Check');
           })
       })
    );
  }
});