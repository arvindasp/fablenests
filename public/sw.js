// public/sw.js

self.addEventListener('install', (evt) => {
    // immediately take control
    self.skipWaiting();
  });
  
  self.addEventListener('activate', (evt) => {
    // claim any clients immediately so the page doesn’t have to reload
    evt.waitUntil(self.clients.claim());
  });
  
  self.addEventListener('fetch', (evt) => {
    const url = new URL(evt.request.url);
  
    // OPTION 1: bypass any `/api/` requests entirely,
    // so they go straight out to your Vercel functions:
    if (url.pathname.startsWith('/api/')) {
      evt.respondWith(fetch(evt.request));
      return;
    }
  
    // — otherwise your existing cache strategy can run —
    // eg:
    // evt.respondWith(
    //   caches.match(evt.request).then(cached => cached || fetch(evt.request))
    // );
  });
  