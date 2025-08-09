// Basic service worker with push notification support and caching
// See https://nextjs.org/docs/app/guides/progressive-web-apps for more information

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('luke-app-v1').then((cache) => {
      return cache.addAll(['/', '/assets/logo.png'])
    })
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  // Clean up old caches
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            return (
              cacheName.startsWith('luke-app-') && cacheName !== 'luke-app-v1'
            )
          })
          .map((cacheName) => {
            return caches.delete(cacheName)
          })
      )
    })
  )
  self.clients.claim()
})

// Serve cached content when offline
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse
      }
      return fetch(event.request)
        .then((response) => {
          // Don't cache non-success responses or non-GET requests
          if (
            !response ||
            response.status !== 200 ||
            event.request.method !== 'GET'
          ) {
            return response
          }

          // Cache the response
          const responseToCache = response.clone()
          caches.open('luke-app-v1').then((cache) => {
            cache.put(event.request, responseToCache)
          })

          return response
        })
        .catch(() => {
          // If fetch fails, e.g., because we're offline, try to return the cached home page
          if (event.request.mode === 'navigate') {
            return caches.match('/')
          }
          // Otherwise just return nothing (which will result in an error)
          return new Response('Offline and no cached version available', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
              'Content-Type': 'text/plain',
            }),
          })
        })
    })
  )
})

// Push notification support
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json()
    const options = {
      body: data.body || 'New notification',
      icon: data.icon || '/assets/logo.png',
      badge: '/assets/logo.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: '1',
      },
    }

    event.waitUntil(
      self.registration.showNotification(data.title || 'Notification', options)
    )
  }
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  // This looks to see if the current is already open and focuses if it is
  event.waitUntil(
    clients
      .matchAll({
        type: 'window',
      })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url === '/' && 'focus' in client) {
            return client.focus()
          }
        }
        // If no open page is found, open a new one
        if (clients.openWindow) {
          return clients.openWindow('/')
        }
      })
  )
})
