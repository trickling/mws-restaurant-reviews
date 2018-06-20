const dbURL = 'http://localhost:1337/restaurants/';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw-cache.js', {scope: './'}).then(function(reg) {

    if(reg.installing) {
      console.log('Service worker installing');
    } else if(reg.waiting) {
      console.log('Service worker installed');
    } else if(reg.active) {
      console.log('Service worker active');
    }

    if (reg.waiting) {
      // updateReady(reg.waiting);
      return;
    }

    // if (reg.installing) {
    //   trackInstalling(reg.installing);
    //   return;
    // }

    // reg.addEventListener('updatefound', function() {
    //   trackInstalling(reg.installing);
    // });

  }).catch(function(error) {
    // registration failed
    console.log('Registration failed with ' + error);
  });

  var refreshing;
  navigator.serviceWorker.addEventListener('controllerchange', function() {
    if (refreshing) return;
    window.location.reload();
    refreshing = true;
  });
}

// function trackInstalling(worker) {
  // worker.addEventListener('statechange', function() {
    // if (worker.state == 'installed') {
      // updateReady(worker);
    // }
//   });
// }

// serviceWorker status check curtesy alert
// function updateReady() {
//   var toast = this._toastsView.show("New version available", {
//     buttons: ['refresh', 'dismiss']
//   });
//
//   toast.answer.then(function(answer) {
//     if (answer != 'refresh') return;
//     worker.postMessage({action: 'skipWaiting'});
//   });
// }

function openDatabase() {
  // If the browser doesn't support service worker,
  // we don't care about having a database
  if (!navigator.serviceWorker) {
    return Promise.resolve();
  }

  return idb.open('restaurant', 1, function(upgradeDb) {
    var store = upgradeDb.createObjectStore('restaurants', {
      keyPath: 'id'
    });
    store.createIndex('by-date', 'updatedAt');
  });
}

// Handles posting from database if needed.
// function showCachedMessages() {
  // return dbPromise.then(function(db) {
    // if we're already showing posts, eg shift-refresh
    // or the very first load, there's no point fetching
    // posts from IDB
    // if (!db || postsView.showingPosts()) return;
    //
    // // fetch data from restaurants and post
    // var index = db.transaction('restaurants')
    //   .objectStore('restaurants').index('updatedAt');
    //
    // return index.getAll().then(function(messages) {
    //   postsView.addPosts(messages.reverse());
    // });
  // });
//   return dbPromise.then(function() {
//     console.log("In showCashedMessages");
//   })
// }



// open a connection to the server for live updates around
// add new posts
// open a connection to the server for live updates on a timer?
// function openSocket() {
  // var latestPostDate = postsView.getLatestPostDate();

  // create a url pointing to /updates with the ws protocol
  // var socketUrl = new URL('/updates', window.location);
  // var socketUrl = new URL('ws://localhost:1337/restaurants', window.location);
  // socketUrl.protocol = 'ws';

  // if (latestPostDate) {
  //   socketUrl.search = 'since=' + latestPostDate.valueOf();
  // }

  // this is a little hack for the settings page's tests,
  // it isn't needed for Wittr
  // socketUrl.search += '&' + location.search.slice(1);

  // var ws = new WebSocket(socketUrl.href);
  // var ws = new WebSocket('ws://localhost:1337/restaurants/');

  // add listeners

  // ws.addEventListener('message', function (event) {
  //   event.respondWith(onSocketMessage(event.data)
  //     .then(function() {
  //       console.log("responding");
  //     }));
  // });

//   ws.addEventListener('close', function() {
//     // try and reconnect in 5 seconds
//     setTimeout(function() {
//       openSocket();
//     }, 5000);
//   });
// };

// Check database for what is currently being posted and check it against
// cache request-response pairs.  If there is no database item for an item
// in the cache, delete from cache.
function cleanImageCache() {
  dbPromise.then(function(db) {
    if (!db) return;

    var imagesNeeded = [];

    var tx = db.transaction('restaurants');
    return tx.objectStore('restaurants').getAll().then(function(messages) {
      messages.forEach(function(message) {
        if (message.photograph) {
          imagesNeeded.push(message.photograph);
        }
      });

      return caches.open('mws-content-imgs');
    }).then(function(cache) {
      return cache.keys().then(function(requests) {
        requests.forEach(function(request) {
          var url = new URL(request.url);
          if (!imagesNeeded.includes(url.pathname)) cache.delete(request);
        });
      });
    });
  });
};

// called when the web socket sends message data - ie data from server
// function onSocketMessage(data) {
//   var messages = data;
//
//   dbPromise.then(function(db) {
//     if (!db) return;
//
//     fetch(dbURL)
//       .then(function(response) {
//         return response.json();
//       }).then(function(items) {
//         var tx = db.transaction('restaurants', 'readwrite');
//         var store = tx.objectStore('restaurants');
//         for (var i = 0; i < items.length; i++) {
//           store.put(items[i]);
//         }
//         return tx.complete;
//       }).then(function() {
//         return console.log("Item loaded");
//       });
//
//     // limit store to 30 items
//     store.index('by-date').openCursor(null, "prev").then(function(cursor) {
//       return cursor.advance(30);
//     }).then(function deleteRest(cursor) {
//       if (!cursor) return;
//       cursor.delete();
//       return cursor.continue().then(deleteRest);
//     });
//   })

  // this._postsView.addPosts(messages);
// };

// Initial load to database
function loadDB() {

    dbPromise.then(function(db) {
    // if we're already showing posts, eg shift-refresh
    // or the very first load, there's no point fetching
    // posts from IDB
    if (!db) return;
    fetch(dbURL)
      .then(function(response) {
        return response.json();
      }).then(function(items) {
        var tx = db.transaction('restaurants', 'readwrite');
        var store = tx.objectStore('restaurants');
        for (var i = 0; i < items.length; i++) {
          store.put(items[i]);
        }
        return tx.complete;
      }).catch(function(error) {
        console.log('Transaction error: ', error);
      });
  }).then(function(){
    console.log('database opened and loaded');
  }).catch(function(error) {
    console.log('Load db error: ', error.message);
  });
}

// self.addEventListener('fetch', function(event) {
//   event.respondWith(
//     new Response("Hello world");
//   );
// });
const dbPromise = openDatabase();

// const loadPromise = loadDB(dbPromise);
loadDB();

setInterval(function() {
  cleanImageCache();
}, 1000 * 60 * 5);

// Handles posting from database if needed, then opens socket network connection
// showCachedMessages().then(function() {
//   openSocket();
// });
