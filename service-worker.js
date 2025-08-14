// Simple service worker for offline caching
const CACHE = 'bacchio-cache-v1';
const CORE_ASSETS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.webmanifest',
  './assets/icon-192.png',
  './assets/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE_ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => (k !== CACHE ? caches.delete(k) : null))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const req = e.request;
  e.respondWith(
    caches.match(req).then(cacheRes => 
      cacheRes || fetch(req).then(netRes => {
        if (req.method === 'GET' && netRes.status === 200 && netRes.type === 'basic') {
          const cloned = netRes.clone();
          caches.open(CACHE).then(c => c.put(req, cloned));
        }
        return netRes;
      }).catch(() => caches.match('./index.html'))
    )
  );
});
