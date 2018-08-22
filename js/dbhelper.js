/**
 * Common database helper functions.
 */
class DBHelper {

  /**
   * Fetch all restaurants.
   */
  static fetchRestaurants(callback) {
    return dbRestaurantPromise.then(function(db) {
      if (!db) return;
      // fetch data from restaurants and post
      var index = db.transaction('restaurants')
        .objectStore('restaurants').index('by-date');
      return index.getAll().then(function(messages) {
        // console.log('fetchRestaurants: ', messages.reverse());
        callback(null, messages);
      }).catch(function(error) {
        callback(error, null);
      });
    });
    return dbRestaurantPromise.then(function() {
      console.log("fetching restaurants");
    });
  }

  /**
   * Fetch a restaurant by its ID.
   */
  static fetchRestaurantById(id, callback) {
    // fetch all restaurants with proper error handling.
    DBHelper.fetchRestaurants(function(error, restaurants) {
        if (error) {
          callback(error, null);
        } else {
          if (restaurants){
            let results = restaurants;
            const restaurant = results.find(r => r.id == id);
            callback(null, restaurant);
          }
        }
    });
  }

  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
  static fetchRestaurantByCuisine(cuisine, callback) {
    // Fetch all restaurants  with proper error handling
    DBHelper.fetchRestaurants(function(error, restaurants) {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given cuisine type
        const results = restaurants.filter(r => r.cuisine_type == cuisine);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
  static fetchRestaurantByNeighborhood(neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants(function(error, restaurants) {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given neighborhood
        const results = restaurants.filter(r => r.neighborhood == neighborhood);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants(function(error, restaurants) {
      if (error) {
        callback(error, null);
      } else {
        let results = restaurants;
        if (cuisine != 'all') { // filter by cuisine
          results = results.filter(r => r.cuisine_type == cuisine);
        }
        if (neighborhood != 'all') { // filter by neighborhood
          results = results.filter(r => r.neighborhood == neighborhood);
        }
        callback(null, results);
      }
    });
  }

  /**
   * Fetch all neighborhoods with proper error handling.
   */
  static fetchNeighborhoods(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants(function(error, restaurants) {
      if (error) {
        callback(error, null);
      } else {
        // Get all neighborhoods from all restaurants
        const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood);
        // Remove duplicates from neighborhoods
        const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i);
        callback(null, uniqueNeighborhoods);
      }
    });
  }

  /**
   * Fetch all cuisines with proper error handling.
   */
  static fetchCuisines(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants(function(error, restaurants) {
      if (error) {
        callback(error, null);
      } else {
        // Get all cuisines from all restaurants
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type);
        // Remove duplicates from cuisines
        const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i);
        callback(null, uniqueCuisines);
      }
    });
  }


  /**
   * Fetch all reviews.
   */
  static fetchReviews(callback) {
    return dbReviewPromise.then(function(db) {
      if (!db) return;

      // fetch data from reviews and post
      var index = db.transaction('reviews')
        .objectStore('reviews').index('by-date');

      return index.getAll().then(function(messages) {
        // console.log(messages.reverse());
        callback(null, messages);
      }).catch(function(error) {
        callback(error, null);
      });
    });
    return dbReviewPromise.then(function() {
      console.log("fetching reviews");
    });
  }

  /**
   * Fetch a reviews by its restaurant ID.
   */
  static fetchReviewsByRestaurantId(rest_id, callback) {
    // fetch all reviews with proper error handling.
    DBHelper.fetchReviews(function(error, reviews) {
      if (error) {
        callback(error, null);
      } else {
        // Get all reviews for restaurant
        let results = reviews;
        results = reviews.filter(r => r.restaurant_id == rest_id);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch a reviews by its review ID.
   */
  static fetchReviewById(id, callback) {
    // fetch all reviews with proper error handling.
    DBHelper.fetchReviews(function(error, reviews) {
      if (error) {
        callback(error, null);
      } else {
        const review = reviews.find(r => r.id == id);
        if (review) { // Got the review
          callback(null, review);
        }
      }
    });
  }
  /**
   * Restaurant page URL.
   */
  static urlForRestaurant(restaurant) {
    return (`./restaurant.html?id=${restaurant.id}`);
  }

  /**
   * CreateReview page URL.
   */
  static urlForCreateReview(restaurant) {
    return (`./review.html?restaurant_id=${restaurant}`);
  }

  /**
   * Review page URL.
   */
  static urlForUpdateReview(review) {
    return (`./review.html?restaurant_id=${review.restaurant_id}?id=${review.id}`);
  }

  /**
   * Restaurant image URL.
   */
  static imageUrlForRestaurant(restaurant) {
    if (restaurant.photograph) {
      return (`/images_400/${restaurant.photograph}.jpg`);
    } else {
      return (`/images_src/placeholder.svg`);
    }
  }

  /**
   * Map marker for a restaurant.
   */
  // static mapMarkerForRestaurant(restaurant, map) {
  //   const marker = new google.maps.Marker({
  //     position: restaurant.latlng,
  //     title: restaurant.name,
  //     url: DBHelper.urlForRestaurant(restaurant),
  //     map: map,
  //     animation: google.maps.Animation.DROP}
  //   );
  //   return marker;
  // }

    /**
   * Map marker for a restaurant.
   */
   static mapMarkerForRestaurant(restaurant, map) {
    // https://leafletjs.com/reference-1.3.0.html#marker
    const marker = new L.marker([restaurant.latlng.lat, restaurant.latlng.lng],
      {title: restaurant.name,
      alt: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant)
      })
      marker.addTo(newMap);
    return marker;
  }
}
