const APP_VERSION = '2026.05.10.0138';
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

self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('notificationclick', e => {
  const data = e.notification && e.notification.data || {};
  const targetUrl = data.url || './?autodialFocus=dial';
  const phone = String(data.phone || '').replace(/[^+\d]/g, '');
  e.notification.close();
  e.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
    const sameApp = list.find(c => c.url && c.url.indexOf(self.registration.scope) === 0);
    if (sameApp) {
      const focused = sameApp.navigate ? sameApp.navigate(targetUrl).then(c => c ? c.focus() : sameApp.focus()) : sameApp.focus();
      return focused.then(() => phone && clients.openWindow ? clients.openWindow('tel:' + phone).catch(() => {}) : null);
    }
    if (clients.openWindow) {
      return clients.openWindow(targetUrl).then(() => phone ? clients.openWindow('tel:' + phone).catch(() => {}) : null);
    }
  }));
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  // Bypass API/beacon and every cross-origin request that isn't ours.
  // The pre-fix SW intercepted every GET and on network failure called
  // caches.match() — which returns undefined for cross-origin URLs that
  // aren't in our cache. Passing undefined to e.respondWith() throws
  // "Failed to convert value to 'Response'", which froze the user's tab.
  if (e.request.url.includes('googleapis.com') || e.request.url.includes('supabase') ||
      e.request.url.includes('workers.dev') || e.request.url.includes('anthropic.com') ||
      e.request.url.includes('generativelanguage.googleapis.com') ||
      e.request.url.includes('cloudflareinsights.com')) {
    return; // let the network handle it directly
  }
  // Only intercept same-origin requests; let cross-origin (CDN scripts,
  // fonts, etc.) go straight to the network so we never have to worry
  // about cache misses on URLs we don't own.
  var sameOrigin = false;
  try { sameOrigin = (new URL(e.request.url)).origin === self.location.origin; } catch (_e) {}
  if (!sameOrigin) return;
  e.respondWith(
    fetch(e.request).then(r => {
      if (r.ok) { const c = r.clone(); caches.open(CACHE_NAME).then(cache => cache.put(e.request, c)); }
      return r;
    }).catch(() => {
      // Defensive: caches.match() resolves to undefined when there's no
      // cache hit. Coerce to a synthetic empty Response so e.respondWith
      // never receives undefined.
      return caches.match(e.request).then(cached => cached || new Response('', {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'text/plain' }
      }));
    })
  );
});
