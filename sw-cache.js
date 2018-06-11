var staticCacheName = 'mws-static-v7';
var contentImgsCache = 'mws-content-imgs';
var allCaches = [
  staticCacheName,
  contentImgsCache
];
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(staticCacheName).then(function(cache) {
      return cache.addAll([
        '/',
        'index.html',
        'restaurant.html',
        'sw-cache.js',
        'sw-index.js',
        'data/restaurants.json',
        'js/main.js',
        'js/restaurant_info.js',
        'js/dbhelper.js',
        'js/util.js',
        'css/styles.css'
      ]);
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName.startsWith('mws-') &&
                 !allCaches.includes(cacheName);
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('fetch', function(event) {
  var requestUrl = new URL(event.request.url);
  if (!(requestUrl.pathname.startsWith('/maps'))) {
    if (requestUrl.origin === location.origin) {
      if (requestUrl.pathname === '/') {
        event.respondWith(caches.match('/'));
        return;
      }
      if (requestUrl.pathname.startsWith('/restaurant')) {
        event.respondWith(caches.match('/restaurant.html'));
        return;
      }
      if (requestUrl.pathname.startsWith('/images_src/') || requestUrl.pathname.startsWith('/images_400/')  ||
        requestUrl.pathname.startsWith('/images_800/')) {
        event.respondWith(servePhoto(event.request));
        return;
      }
    }
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
      })
    );
  }
});

function servePhoto(request) {
  // Photo urls look like:
  // images_src/#.jpg
  // But storageUrl has the -2x.jpg bit missing.
  // Use this url to store & match the image in the cache.
  // This means you only store one copy of each photo.
  var storageUrl = request.url.replace(/-\dx\.jpg$/, '');

  // Return images from the "mws-content-imgs" cache
  // if they're in there. But afterwards, go to the network
  // to update the entry in the cache.

  return caches.open(contentImgsCache).then(function(cache) {
    return cache.match(storageUrl).then(function(response) {
      if (response) {
        fetch(request).then(function(networkResponse) {
          cache.put(networkResponse.url.replace(/-\dx\.jpg$/, ''), networkResponse.clone());
          return networkResponse;
        });
        return response;
      }
      return fetch(request).then(function(networkResponse) {
        cache.put(networkResponse.url.replace(/-\dx\.jpg$/, ''), networkResponse.clone());
        return networkResponse;
      });
    });
  });
}

self.addEventListener('message', function(event) {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
