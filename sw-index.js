const DBrestaurantURL = 'http://localhost:1337/restaurants/';
const DBreviewURL = 'http://localhost:1337/reviews/';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw-cache.js', {scope: './'}, {useCache: false}).then(function(reg) {

    if(reg.installing) {
      console.log('Service worker installing');
    } else if(reg.waiting) {
      console.log('Service worker installed');
    } else if(reg.active) {
      console.log('Service worker active');
    }

  }).catch(function(error) {
    // registration failed
    console.log('Registration failed with ' + error);
  });

  var refreshing;
  navigator.serviceWorker.addEventListener('controller', function() {
    if (refreshing) return;
    window.location.reload();
    loadDB(DBrestaurantURL, 'restaurants', dbRestaurantPromise);
    loadDB(DBreviewURL, 'reviews', dbReviewPromise);
    syncDB(DBreviewURL, 'reviews', dbReviewPromise);
    refreshing = true;
  });
}

function openRestaurantDatabase() {
  // If the browser doesn't support service worker,
  // we don't care about having a database
  if (!navigator.serviceWorker) {
    return Promise.resolve();
  }

  return idb.open('restaurant', 10, function(upgradeDb) {
    var store = upgradeDb.createObjectStore('restaurants', {
      keyPath: 'id'
    });
    store.createIndex('by-date', 'updatedAt');
  });
}

function openReviewDatabase() {
  // If the browser doesn't support service worker,
  // we don't care about having a database
  if (!navigator.serviceWorker) {
    return Promise.resolve();
  }

  return idb.open('review', 7, function(upgradeDb) {
    var store = upgradeDb.createObjectStore('reviews', {
      keyPath: 'id'
    });
    store.createIndex('by-date', 'updatedAt');
  });
}

// Check database for what is currently being posted and check it against
// cache request-response pairs.  If there is no database item for an item
// in the cache, delete from cache.
function cleanImageCache() {
  dbRestaurantPromise.then(function(db) {
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

/**
 * Fetch all reviews.
 */
function fetchReviews(callback) {
  return dbReviewPromise.then(function(db) {
    // if we're already showing posts, eg shift-refresh
    // or the very first load, there's no point fetching
    // posts from IDB
    if (!db) return;

    // fetch data from reviews and post
    var index = db.transaction('reviews')
      .objectStore('reviews').index('by-date');

    return index.getAll().then(function(messages) {
      callback(null, messages);
    }).catch(function(error) {
      callback(error, null);
    });
  });
  return dbReviewPromise.then(function() {
    console.log("In showCashedMessages");
  });
}

// Sync database
function syncDB(dbURL, dbName, dbPromise) {
  console.log("syncing");
  fetchReviews((error, reviews) => {
    if(reviews.length > 0){
      dbPromise.then(db => {
        fetch(dbURL)
          .then(function(response) {
            return response.json();
          }).then(function(items) {
            var tx = db.transaction(dbName, 'readwrite');
            var store = tx.objectStore(dbName);
            console.log("items length: ", items.length);
            let results = reviews;
            if (error) {
              callback(error, null);
            } else {
              for (var i = 0; i < items.length; i++) {
                let reviewresults = reviews;
                if (reviewresults.find(r => r.id == items[i].id) === undefined){
                  console.log("adding to idb");
                  store.put(items[i]);
                }
              }
              console.log("reviews length: ", reviews.length);
              for (var i = 0; i < reviews.length; i++) {
                let itemresults = items;
                if (itemresults.find(r => r.id == reviews[i].id) === undefined){
                  console.log("removing id: ", reviews[i].id);
                  store.delete(reviews[i].id);
                }
              }
              callback(null, results);
            }
            return tx.complete;
          }).catch(function(error) {
            console.log('Transaction error: ', error);
          });
        }).then(() => {
          console.log('database opened and synced')
        }).catch(function(error) {
          console.log('sync db error: ', error.message);
        });
      }
    }).then(() => {
      console.log('sync fetch complete');
    }).catch(function(error) {
      console.log('sync fetch error: ', error.message);
    });
}


// Initial load to database
function loadDB(dbURL, dbName, dbPromise) {

    dbPromise.then(function(db) {
    // if we're already showing posts, eg shift-refresh
    // or the very first load, there's no point fetching
    // posts from IDB
    if (!db) return;
    fetch(dbURL)
      .then(function(response) {
        return response.json();
      }).then(function(items) {
        var tx = db.transaction(dbName, 'readwrite');
        var store = tx.objectStore(dbName);
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

const dbRestaurantPromise = openRestaurantDatabase();
const dbReviewPromise = openReviewDatabase();

loadDB(DBrestaurantURL, 'restaurants', dbRestaurantPromise);
loadDB(DBreviewURL, 'reviews', dbReviewPromise);
syncDB(DBreviewURL, 'reviews', dbReviewPromise);

setInterval(function() {
  cleanImageCache();
}, 1000 * 60 * 5);
