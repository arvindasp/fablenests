// public/sw.js

const CACHE_NAME = 'fablenests-static-v1';

self.addEventListener('install', (evt) => {
  // Activate right away
  self.skipWaiting();
});

self.addEventListener('activate', (evt) => {
  // Claim clients immediately so the SW starts controlling pages
  evt.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (evt) => {
  const { request } = evt;
  const url = new URL(request.url);

  // 1) Bypass all /api/* routes
  if (url.pathname.startsWith('/api/')) {
    evt.respondWith(fetch(request));
    return;
  }

  // 2) Bypass any non-GET (e.g. POST for form submissions, etc)
  if (request.method !== 'GET') {
    evt.respondWith(fetch(request));
    return;
  }

  // 3) Cache-first for everything else
  evt.respondWith(
    caches.match(request).then((cached) => {
      if (cached) {
        return cached;
      }
      return fetch(request).then((networkResp) => {
        // we can decide whether to cache it—here we cache all GETs:
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, networkResp.clone());
          return networkResp;
        });
      });
    })
  );
});
