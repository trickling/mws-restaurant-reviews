var staticCacheName = 'mws-static-v14';
var contentImgsCache = 'mws-content-imgs';
var allCaches = [
  staticCacheName,
  contentImgsCache,
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(staticCacheName).then(function(cache) {
      return cache.addAll([
        '/',
        'manifest.json',
        'node_modules/idb/lib/idb.d.ts',
        'node_modules/idb/lib/idb.js',
        'node_modules/idb/lib/node.js',
        'js/store.js',
        'sw-index.js',
        'sw-cache.js',
        'js/dbhelper.js',
        'js/util.js',
        'js/main.js',
        'js/restaurant_info.js',
        'js/review_info.js',
        'js/review-update-info.js',
        'css/index/indexstyles.css',
        'css/restaurant/restaurantstyles.css',
        'css/review/reviewstyles.css',
        'index.html',
        'restaurant.html',
        'review.html',
        'review-update.html',
      ]);
    }));
  console.log('static cache open and loaded');
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
      // if (event.request.cache === 'only-if-cached' && event.request.mode !== 'same-origin') {
      //   return;
      // }
      return response || fetch(event.request);
    })
  );
});

function servePhoto(request) {
  var storageUrl = request.url;
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
