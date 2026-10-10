importScripts('sw/config.js', 'sw/meta.js', 'sw/freshness.js', 'sw/strategy.js');

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  if (new URL(request.url).origin !== self.location.origin) return;

  event.respondWith(
    request.mode === 'navigate' ? handleNavigation(request) : handleAsset(request)
  );
});
