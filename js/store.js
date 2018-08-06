/** The following is based on guidance from
    https://www.twilio.com/blog/2017/02/send-messages-when-youre-back-online-with-service-workers-and-background-sync.html
    (forwarded by mentor) */

var store = {
  db: null,

  init: function() {
    if (store.db) { return Promise.resolve(store.db); }
    return idb.open('postitem', 1, function(upgradeDb) {
      upgradeDb.createObjectStore('postitems', { autoIncrement : true, keyPath: 'id' });
    }).then(function(db) {
      return store.db = db;
    });
  },

  postitems: function(mode) {
    return store.init().then(function(db) {
      return db.transaction('postitems', mode).objectStore('postitems');
    })
  }
}
