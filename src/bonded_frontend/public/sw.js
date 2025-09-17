const APP_VERSION = '2025-09-08T01';
const PRECACHE = `bonded-precache-${APP_VERSION}`;
const RUNTIME_STATIC = `bonded-static-${APP_VERSION}`;
const RUNTIME_DYNAMIC = `bonded-dynamic-${APP_VERSION}`;
const FONTS = `bonded-fonts-${APP_VERSION}`;

const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/web-app.png',

];

/* ====== INSTALL ====== */
self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(PRECACHE);
      await cache.addAll(PRECACHE_URLS);
      // Promote this SW immediately if page requests it
      await self.skipWaiting();
    })()
  );
});

/* ====== ACTIVATE ====== */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // Clean old caches
      const keep = new Set([PRECACHE, RUNTIME_STATIC, RUNTIME_DYNAMIC, FONTS]);
      const names = await caches.keys();
      await Promise.all(names.map((n) => (keep.has(n) ? null : caches.delete(n))));
      // Claim clients so new SW controls open tabs
      await self.clients.claim();

      // Enable Navigation Preload if supported
      if (self.registration.navigationPreload) {
        try {
          await self.registration.navigationPreload.enable();
        } catch { }
      }
    })()
  );
});

/* ====== MESSAGE (skip waiting) ====== */
self.addEventListener('message', (event) => {
  if (!event.data) return;
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/* ====== FETCH ====== */
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Only GET is safe for cache strategies
  if (req.method !== 'GET') return;

  // FIXME: Skip unsupported schemes (chrome-extension, moz-extension, etc.)
  if (!['http:', 'https:'].includes(url.protocol)) return;

  // 1) Handle SPA navigations (HTML documents)
  if (req.mode === 'navigate') {
    event.respondWith(handleNavigation(event));
    return;
  }

  // 2) Same-origin static assets: SWR (favors cached speed + background refresh)
  if (url.origin === self.location.origin) {
    if (/\.(?:css|js|mjs|wasm|png|jpg|jpeg|gif|svg|webp|ico|json)$/.test(url.pathname)) {
      event.respondWith(staleWhileRevalidate(req, RUNTIME_STATIC));
      return;
    }
  }

  // 3) Google Fonts – cache first with background refresh
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(staleWhileRevalidate(req, FONTS));
    return;
  }

  // 4) Everything else (APIs, cross-origin): Network-First with offline fallback from dynamic cache
  event.respondWith(networkFirst(req, RUNTIME_DYNAMIC));
});

/* ====== STRATEGIES ====== */

async function handleNavigation(event) {
  // Try: navigation preload -> network -> cache -> offline fallback
  try {
    const preload = await event.preloadResponse;
    if (preload) return preload;
  } catch { }

  try {
    // Revalidate HTML aggressively to avoid serving stale app shells forever
    const fresh = await fetch(event.request, { cache: 'no-cache' });
    // Only cache healthy HTML
    if (isCacheableHTMLResponse(fresh)) {
      const cache = await caches.open(PRECACHE);
      cache.put('/index.html', fresh.clone());
    }
    return fresh;
  } catch {
    // Offline: serve cached shell
    const cache = await caches.open(PRECACHE);
    const cached = await cache.match('/index.html');
    if (cached) return cached;
    // Final fallback
    return new Response('You are offline. Please reconnect.', { status: 503, headers: { 'Content-Type': 'text/plain' } });
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const fetchPromise = (async () => {
    try {
      const res = await fetch(request, { cache: 'no-cache' });
      if (isGoodResponse(res) && isCacheableRequest(request)) {
        cache.put(request, res.clone());
      }
      return res;
    } catch (e) {
      // swallow
      return undefined;
    }
  })();

  if (cached) {
    // kick off refresh but return cached immediately
    fetchPromise.catch(() => { });
    return cached;
  }

  // Nothing cached; await network
  const net = await fetchPromise;
  if (net) return net;

  return new Response('Offline content not available', { status: 503 });
}

async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  try {
    const res = await fetch(request);
    if (isGoodResponse(res) && isCacheableRequest(request)) {
      cache.put(request, res.clone());
    }
    return res;
  } catch {
    const cached = await cache.match(request);
    if (cached) return cached;
    return new Response('Offline content not available', { status: 503 });
  }
}


/* ====== HELPERS ====== */
function isGoodResponse(res) {
  return res && res.ok && (res.type === 'basic' || res.type === 'cors');
}

function isCacheableRequest(request) {
  const url = new URL(request.url);
  return ['http:', 'https:'].includes(url.protocol);
}

function isCacheableHTMLResponse(res) {
  if (!isGoodResponse(res)) return false;
  const ct = res.headers.get('Content-Type') || '';
  return ct.includes('text/html');
}
