const APP_VERSION = '2026.04.29.0007';
const CACHE_NAME = `autodial-v2-${APP_VERSION}`;
const ASSETS = ['./', './index.html', './manifest.json', './icon-180.png', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
  )).then(() => self.clients.claim()));
});

self.addEventListener('notificationclick', e => {
  const data = e.notification && e.notification.data || {};
  const targetUrl = data.url || './?autodialFocus=dial';
  e.notification.close();
  e.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
    const sameApp = list.find(c => c.url && c.url.indexOf(self.registration.scope) === 0);
    if (sameApp) {
      if (sameApp.navigate) return sameApp.navigate(targetUrl).then(c => c ? c.focus() : sameApp.focus());
      return sameApp.focus();
    }
    if (clients.openWindow) return clients.openWindow(targetUrl);
  }));
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  // Network-first for API calls, cache-first for assets
  if (e.request.url.includes('googleapis.com') || e.request.url.includes('supabase') || 
      e.request.url.includes('workers.dev') || e.request.url.includes('anthropic.com') ||
      e.request.url.includes('generativelanguage.googleapis.com')) {
    return; // Don't cache API calls
  }
  e.respondWith(
    fetch(e.request).then(r => {
      if (r.ok) { const c = r.clone(); caches.open(CACHE_NAME).then(cache => cache.put(e.request, c)); }
      return r;
    }).catch(() => caches.match(e.request))
  );
});
