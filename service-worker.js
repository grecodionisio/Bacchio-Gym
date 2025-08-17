const CACHE='bacchio-cache-v4';
const CORE=['./','./index.html','./style.css','./app.js','./manifest.webmanifest','./assets/icon-192.png','./assets/icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>k!==CACHE?caches.delete(k):null))));self.clients.claim();});
self.addEventListener('fetch',e=>{e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(net=>{if(e.request.method==='GET'&&net.status===200&&net.type==='basic'){const clone=net.clone();caches.open(CACHE).then(c=>c.put(e.request,clone));}return net;}).catch(()=>caches.match('./index.html'))));});