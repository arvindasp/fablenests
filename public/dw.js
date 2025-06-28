// public/sw.js

// 1. Skip waiting and claim clients so the new SW is active right away
self.addEventListener('install', (evt) => {
    self.skipWaiting();
  });
  self.addEventListener('activate', (evt) => {
    evt.waitUntil(self.clients.claim());
  });
  
  // 2. Intercept all fetches
  self.addEventListener('fetch', (evt) => {
    const { request } = evt;
    const url = new URL(request.url);
  
    // Always bypass anything that isn't HTTP/HTTPS (e.g. chrome-extension://…)
    if (!url.protocol.startsWith('http')) {
      return evt.respondWith(fetch(request));
    }
  
    // Always bypass API calls (GET, POST, OPTIONS, whatever)
    if (url.pathname.startsWith('/api/')) {
      return evt.respondWith(fetch(request));
    }
  
    // Only try to cache GETs, pass everything else straight through
    if (request.method !== 'GET') {
      return evt.respondWith(fetch(request));
    }
  
    // At this point you can implement your caching strategy.
    // For example, “cache-first, then network”:
    evt.respondWith(
      caches.match(request).then((cached) => {
        return cached || fetch(request).then((networkRes) => {
          // Optionally cache the new response
          return caches.open('fablenests-v1').then((cache) => {
            cache.put(request, networkRes.clone());
            return networkRes;
          });
        });
      })
    );
  });
  