// Service Worker for Zalamati Autonomous AI Agent Ecosystem, PWA Offline Cache & Request Proxy
const CACHE_NAME = 'zalamati-cache-v2';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  'https://img.icons8.com/nolan/256/brain.png',
  'https://img.icons8.com/nolan/512/brain.png'
];

// Allowed origin patterns for strict proxy origin validation
const ALLOWED_ORIGIN_PATTERNS = [
  /^https:\/\/[a-zA-Z0-9-]+\.clients6\.google\.com$/,
  /^https:\/\/[a-zA-Z0-9-]+\.firebaseapp\.com$/,
  /^https:\/\/[a-zA-Z0-9-]+\.run\.app$/,
  /^https:\/\/firestore\.googleapis\.com$/,
  /^https:\/\/firebase\.googleapis\.com$/,
  /^https:\/\/aiplatform\.googleapis\.com$/,
  /^https:\/\/generativelanguage\.googleapis\.com$/
];

function isOriginAllowed(origin, requestUrl) {
  if (!origin) return true; // Local or same-origin request
  try {
    const originUrl = new URL(origin);
    if (originUrl.origin === self.location.origin) return true;
    return ALLOWED_ORIGIN_PATTERNS.some((pattern) => pattern.test(originUrl.origin) || pattern.test(requestUrl.origin));
  } catch (e) {
    return false;
  }
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch(err => {
        console.warn('Pre-caching assets skipped/failed:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Intercept fetch requests: Proxy Layer for Firestore, RAG, and API requests + Stale-While-Revalidate PWA caching
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  const requestOrigin = event.request.headers.get('origin') || self.location.origin;

  // Intercept local request proxy routes (/api-proxy or /api/proxy) or direct RAG / Firestore requests
  if (url.pathname.startsWith('/api-proxy') || url.pathname.startsWith('/api/proxy')) {
    event.respondWith(handleProxiedRequest(event.request, requestOrigin));
    return;
  }

  // If it's a direct Cloud Firestore, Firebase or Google AI API call, route through strict origin validation
  if (url.hostname.includes('firestore.googleapis.com') || 
      url.hostname.includes('firebase') || 
      url.hostname.includes('aiplatform') || 
      url.hostname.includes('generativelanguage')) {
    
    // Validate request origin against allowlist to prevent Cross-origin script load denied errors
    if (!isOriginAllowed(requestOrigin, url)) {
      event.respondWith(
        new Response(JSON.stringify({ error: 'Forbidden: Origin validation failed' }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' }
        })
      );
      return;
    }
    // Allow browser native handling for direct SDK connections with origin headers preserved
    return;
  }

  // If it's a local API route, handle network-first with offline fallback
  if (url.pathname.startsWith('/api')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        if (event.request.headers.get('accept')?.includes('application/json')) {
          return new Response(JSON.stringify({ 
            error: 'Offline mode active. Local cache proxy engaged.', 
            offline: true 
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        }
      })
    );
    return;
  }

  // Navigation requests (PWA HTML Shell offline support)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('/index.html') || caches.match('/');
      })
    );
    return;
  }

  // Static asset caching: Stale-While-Revalidate Strategy for JS, CSS, fonts, and images
  if (event.request.method === 'GET') {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        }).catch((err) => {
          return cachedResponse;
        });

        return cachedResponse || fetchPromise;
      })
    );
  }
});

// Handler for local request proxy layer (/api-proxy)
async function handleProxiedRequest(request, origin) {
  try {
    const url = new URL(request.url);
    const targetUrl = url.searchParams.get('targetUrl');

    if (!targetUrl) {
      return new Response(JSON.stringify({ error: 'Missing targetUrl query parameter' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const parsedTarget = new URL(targetUrl);
    if (!isOriginAllowed(origin, parsedTarget)) {
      return new Response(JSON.stringify({ error: 'Cross-origin validation failed' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Proxy request securely
    const proxyHeaders = new Headers(request.headers);
    proxyHeaders.set('X-Proxied-By', 'Zalamati-SW-Proxy');
    proxyHeaders.set('Origin', self.location.origin);

    const response = await fetch(targetUrl, {
      method: request.method,
      headers: proxyHeaders,
      body: request.method !== 'GET' && request.method !== 'HEAD' ? await request.blob() : undefined,
      mode: 'cors'
    });

    const responseHeaders = new Headers(response.headers);
    responseHeaders.set('Access-Control-Allow-Origin', origin || self.location.origin);
    responseHeaders.set('Access-Control-Allow-Credentials', 'true');
    responseHeaders.set('X-Content-Type-Options', 'nosniff');

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Proxy request failed', details: error.message }), {
      status: 502,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

// Background sync & voice navigator listener
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SYNC_PROGRESS') {
    self.clients.matchAll().then((clients) => {
      clients.forEach((client) => {
        client.postMessage({ type: 'TRIGGER_OFFLINE_SYNC', timestamp: Date.now() });
      });
    });
  } else if (event.data && event.data.type === 'VOICE_COMMAND_LOG') {
    self.clients.matchAll().then((clients) => {
      clients.forEach((client) => {
        client.postMessage({
          type: 'EXECUTE_VOICE_COMMAND',
          command: event.data.command,
          timestamp: Date.now()
        });
      });
    });
  }
});

