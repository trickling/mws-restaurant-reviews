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
    store.createIndex('by-date', 'time');
  });
}

function IndexController(container) {
  this._container = container;
  this._dbPromise = openDatabase();
  this._registerServiceWorker();
  this._loadData();
  this._cleanImageCache();

  var indexController = this;

  setInterval(function() {
    indexController._cleanImageCache();
  }, 1000 * 60 * 5);
}

IndexController.prototype._registerServiceWorker = function() {
  if (!navigator.serviceWorker) return;

  var indexController = this;

  navigator.serviceWorker.register('/sw.js').then(function(reg) {
    if (!navigator.serviceWorker.controller) {
      return;
    }

    if (reg.waiting) {
      indexController._updateReady(reg.waiting);
      return;
    }

    if (reg.installing) {
      indexController._trackInstalling(reg.installing);
      return;
    }

    reg.addEventListener('updatefound', function() {
      indexController._trackInstalling(reg.installing);
    });
  });

  // Ensure refresh is only called once.
  // This works around a bug in "force update on reload".
  var refreshing;
  navigator.serviceWorker.addEventListener('controllerchange', function() {
    if (refreshing) return;
    window.location.reload();
    refreshing = true;
  });
};

IndexController.prototype._trackInstalling = function(worker) {
  var indexController = this;
  worker.addEventListener('statechange', function() {
    if (worker.state == 'installed') {
      indexController._updateReady(worker);
    }
  });
};

IndexController.prototype._cleanImageCache = function() {
  return this._dbPromise.then(function(db) {
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



// called when the web socket sends message data
IndexController.prototype._loadData = function() {
  fetch('http://localhost:1337/restaurants/')
    .then( function(response) {
      return response.json();
    }).then(function(messages) {
      return console.log(messages);
      // this._dbPromise.then(function(db) {
      //   if (!db) return;
      //   var tx = db.transaction('restaurants', 'readwrite');
      //   var store = tx.objectStore('restaurants');
      //   messages.forEach(function(message) {
      //     store.put(message);
      //   });
      // });
    });
};
