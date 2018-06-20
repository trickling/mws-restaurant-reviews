var staticCacheName = 'mws-static-v10';
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
        'manifest.json',
        'node_modules/idb/lib/idb.d.ts',
        'node_modules/idb/lib/idb.js',
        'node_modules/idb/lib/node.js',
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
  if (requestUrl.origin === location.origin) {
    if (requestUrl.pathname.startsWith('/images_src/') || requestUrl.pathname.startsWith('/images_400/')) {
      event.respondWith(servePhoto(event.request));
      return;
    }
  }
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});

function servePhoto(request) {

  var storageUrl = request.url
  var storageUrlid = request.url[request.url.length-5];
  return caches.open(contentImgsCache).then(function(cache) {
    return (cache.match("images_src/" + storageUrlid +'.jpg') ||
        cache.match("images_src/" + storageUrlid +'.svg') ||
        cache.match("images_400/" + storageUrlid + '.jpg') ||
        cache.match("images_400/" + storageUrlid + '.svg'))
      .then(function(response) {
        if (response) return response;

      return fetch(request).then(function(networkResponse) {
        cache.put(networkResponse.url, networkResponse.clone());
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
