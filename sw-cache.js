var staticCacheName = 'mws-static-v13';
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
        'index.html',
        'restaurant.html',
        'review.html',
        'review-update.html',
        'node_modules/idb/lib/idb.d.ts',
        'node_modules/idb/lib/idb.js',
        'node_modules/idb/lib/node.js',
        'js/store.js',
        'sw-index.js',
        'sw-cache.js',
        'js/main.js',
        'js/restaurant_info.js',
        'js/review_info.js',
        'js/review-update-info.js',
        'js/dbhelper.js',
        'js/util.js',
        'css/styles.css',
        'node_modules/material-design-icons/iconfont/material-icons.css',
        'node_modules/material-design-icons/iconfont/MaterialIcons-Regular.woff'
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
/** The following is based on guidance from
    https://www.twilio.com/blog/2017/02/send-messages-when-youre-back-online-with-service-workers-and-background-sync.html
    (forwarded by mentor), https://ponyfoo.com/articles/serviceworker-messagechannel-postmessage (Nicolas Bevacqua),
    http://craig-russell.co.uk/2016/01/29/service-worker-messaging.html#.W2OgDVVKjmF (Craig Russell) */
self.addEventListener('sync', function(event) {
  importScripts('/node_modules/idb/lib/idb.js');
  importScripts('/js/store.js');
  console.log("IN SYNC");
  if (event.tag == 'Postsync'){
    console.log("FOUND Postsync tag EVENT");
    event.waitUntil(
      store.postitems('readonly')
      .then(postitems => {
        return postitems.getAll();
      })
      .then(items => {
        const data = {restaurant_id: items[0].restaurant_id, name: items[0].name, rating: items[0].rating, comments: items[0].comments};
        return fetch('http://localhost:1337/reviews', {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            mode: "cors", // no-cors, cors, *same-origin
            cache: "default", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "omit", // include, same-origin, *omit
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            redirect: "follow", // manual, *follow, error
            referrer: "client", // no-referrer, *client
            body: JSON.stringify(data),
        })
        .then(function(response){
          console.log("POSTED");
          return response.json();
        })
        .then(() => {
          return store.postitems('readwrite')
          .then(postitems => {
            console.log("DELETED");
            return postitems.delete(items[0].id);
          });
        })
        .then(() => {
          console.log("SENDING MESSAGE");
          send_message_to_all_clients(items[0].restaurant_id);
        })
        .catch(error => {
          console.error(`Fetch Error =\n`, error);
        });
      }));
  } else if (event.tag == 'Updatesync'){
      console.log("FOUND Updatesync tag EVENT");
      event.waitUntil(
        store.postitems('readonly')
        .then(postitems => {
          return postitems.getAll();
        })
        .then(items => {
          const data = {restaurant_id: items[0].restaurant_id, name: items[0].name, rating: items[0].rating, comments: items[0].comments};
          console.log('old_id: ', items[0].old_id);
          deleteReview('http://localhost:1337/reviews/', {id: items[0].old_id});
          return fetch('http://localhost:1337/reviews/', {
              method: "POST", // *GET, POST, PUT, DELETE, etc.
              mode: "cors", // no-cors, cors, *same-origin
              cache: "default", // *default, no-cache, reload, force-cache, only-if-cached
              credentials: "omit", // include, same-origin, *omit
              headers: {
                  "Content-Type": "application/json; charset=utf-8",
              },
              redirect: "follow", // manual, *follow, error
              referrer: "client", // no-referrer, *client
              body: JSON.stringify(data),
          })
          .then(function(response){
            console.log("UPDATED");
            return response.json();
          })
          .then(() => {
            return store.postitems('readwrite')
            .then(postitems => {
              console.log("DELETED");
              return postitems.delete(items[0].id);
            });
          })
          .then(() => {
            console.log("SENDING MESSAGE");
            send_message_to_all_clients(items[0].restaurant_id);
          })
          .catch(error => {
            console.error(`Fetch Error =\n`, error);
          });
        }));
  }
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
/** The following is based on guidance from
    http://craig-russell.co.uk/2016/01/29/service-worker-messaging.html#.W2OgDVVKjmF (Craig Russell) */
function send_message_to_all_clients(msg){
  clients.matchAll().then(clients => {
    clients.forEach(client => client.postMessage(msg));
  });
}

/**
 * Delete review from database and indexedDB.
 */
const deleteReview = (url = ``, data = ``) => {
  if (data){
    return fetch(url, {
        method: "DELETE", // *GET, POST, PUT, DELETE, etc.
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(data), // body data type must match "Content-Type" header
    })
    .then(response => response.json())
    .catch(error => console.error(`Fetch Error =\n`, error));
  }
};
