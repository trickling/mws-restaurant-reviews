let restaurant;
var newMap;

// time formatting
var date = Date.UTC(2012, 11, 17, 3, 0, 42);

var formatter = new Intl.DateTimeFormat('en-us', {
  weekday: 'long',
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  hour12: true,
  timeZone: 'UTC'
});


// Solution found on stackoverflow, Thusitha Sumanadasa
function pageRefresh() {
  if(window.localStorage && navigator.online) {
    if(!localStorage.getItem('firstLoad')) {
      localStorage['firstLoad'] = true;
      window.location.reload();
    } else {
      localStorage.removeItem('firstLoad');
    }
  }
}

pageRefresh();

// Based on guidance from Udacity MWS Webinar Stage 3, Elisa Romondia, Lorenzo Zaccagnini
window.addEventListener('online', function(event) {
  store.postitems('readwrite').then(function(postitems) {
    postitems.getAll()
   .then(function(items) {
     if (items.length > 0) {
       // console.log('items[0] id: ', items[0].id);
       if (items[0].id == -1) {
         const data = {restaurant_id: items[0].restaurant_id, name: items[0].name, rating: items[0].rating, comments: items[0].comments};
         return fetch(DBreviewURL, {
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
         .then(function() {
           return store.postitems('readwrite')
           .then(function(postitems) {
             return postitems.delete(items[0].id);
           });
         })
         .then(function() {
           syncReviewsDB(DBreviewURL, 'reviews', dbReviewPromise);
           document.location.reload(true);
         })
         .catch(function(error) {
           console.error(`Fetch Error =\n`, error);
         });
       } else {
         const data = {id: items[0].id, restaurant_id: items[0].restaurant_id, name: items[0].name, rating: items[0].rating, comments: items[0].comments};
         deleteReviewData(DBreviewURL, data)
         .then(function() {
           return fetch(DBreviewURL, {
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
           .then(function() {
             return store.postitems('readwrite')
             .then(function(postitems) {
               return postitems.delete(items[0].id);
             });
           })
           .then(function(response) {
             syncReviewsDB(DBreviewURL, 'reviews', dbReviewPromise);
             document.location.reload(true);
           })
           .catch(function(error) {
             console.error(`Fetch Error =\n`, error);
           });
         });
        }
      }
     });
   });
 });

 /**
  * Provide an option to skip map for accessibility
  */
function skipMap(){
  document.getElementById("footer-anchor").focus();
}

var mapctrl = document.getElementById("map-control");
mapctrl.addEventListener("keydown", skipMap, false);
 /**
  * Initialize map as soon as the page is loaded.
  */
document.addEventListener('DOMContentLoaded', (event) => {
   navigator.serviceWorker.ready.then(() =>{
     initMap();
   });
});

const mapContainer = document.getElementById('map-container');
const mapInset = document.getElementById('map');
const reviewsContainer = document.getElementById('reviews-container');
const restaurantContainer = document.getElementById('restaurant-container');
const reviewsTitle = document.getElementById('reviews-title');
const hideMap = document.createElement('button');
hideMap.id = "restaurant-hide-map";
const hideMapTxt = document.createElement('p')
hideMapTxt.id = "restaurant-hide-map-text";
hideMapTxt.innerHTML = "Hide Map";
hideMap.appendChild(hideMapTxt);
hideMap.style.order = "-1";
mapInset.insertAdjacentElement('beforeBegin', hideMap);

hideMap.addEventListener('click', function() {
 if (hideMapTxt.innerHTML == "Hide Map"){
   hideMapTxt.innerHTML = "Show Map";
   mapInset.style.display = "none";
   mapContainer.style.height = "50px";
   mapContainer.style.width = "150px";
   var mql1 = window.matchMedia('(min-width: 875px) and (max-width: 2400px)');
   var mql2 = window.matchMedia('(min-width: 800px) and (max-width: 2400px)');
   if (mql1.matches){
     restaurantContainer.style.width = "30%";
     restaurantContainer.style.padding = "0px 10px 20px 10px;";
     mapContainer.style.width = "8%"
     reviewsContainer.style.width = "30%";
     restaurantContainer.style.padding = "0px 10px 20px 10px;";
     reviewsTitle.style.margin = "25px 0 0 0";
   } else if (mql1.matches) {
     restaurantContainer.style.width = "50%";
     restaurantContainer.style.padding = "0px 40px 20px 40px;";
     reviewsContainer.style.width = "100%";
     reviewsTitle.style.margin = "20px 0 0 0";
   } else {
     restaurantContainer.style.width = "100%";
     restaurantContainer.style.padding = "0px 40px 20px 40px;";
     reviewsContainer.style.width = "100%";
     reviewsTitle.style.margin = "20px 0 0 0";
   }
 }else {
   window.location.reload();
 }
});

initMap = function() {

  fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.newMap = L.map('map', {
        center: [restaurant.latlng.lat, restaurant.latlng.lng],
        zoom: 16,
        scrollWheelZoom: false
      });
      L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={mapboxToken}', {
        mapboxToken: 'pk.eyJ1Ijoia2xzdHJvbXNsYW5kIiwiYSI6ImNqa3BvMGhtdzFjaWUzcXFyMjVxOWk3MzUifQ.zHxzVwvBZryUZIG3k38kCw',
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
          '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
          'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox.streets'
      }).addTo(newMap);
      fillBreadcrumb();
      DBHelper.mapMarkerForRestaurant(self.restaurant, self.newMap);
    }
  });
}

// This code was copied from an example given at:
// https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
// by Mozilla Contributors (MDN), is licensed under CC-BY-SA 2.5, or all open source licenses.
const deleteRestaurantData = function(url = ``, data = {}) {
    if (data) {
      return fetch(url, {
          // mode: "cors", // no-cors, cors, *same-origin
          method: "DELETE", // *GET, POST, PUT, DELETE, etc.
          headers: {
              "Content-Type": "application/json; charset=utf-8",
          },
          body: JSON.stringify(data), // body data type must match "Content-Type" header
      })
      .then(function(response) {
        return response.json()
      })
      .catch(function(error){
        console.error(`Fetch Error =\n`, error);
      });
    }
};

const postRestaurantFavoriteData = function(url = ``, data = {}) {
  // Default options are marked with *
  if (data){
    deleteRestaurantData(DBrestaurantURL, {id: data.id});
    data.is_favorite = !data.is_favorite;
    const heartIcon = document.getElementById("heart-icon");
    if (data.is_favorite == true){
      heartIcon.innerHTML = '\u2665';
    } else if (data.is_favorite == false){
      heartIcon.innerHTML = '\u2661';
    } else {
      heartIcon.innerHTML = '\u2661';
    }
    data = {name: data.name, neighborhood: data.neighborhood, photograph: data.photograph, address: data.address, cuisine_type: data.cuisine_type, id: data.id, is_favorite: data.is_favorite, latlng: data.latlng, operating_hours: data.operating_hours};
    return fetch(url, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, cors, *same-origin
        cache: "default", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "omit", // include, same-origin, *omit
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        redirect: "follow", // manual, *follow, error
        referrer: "client", // no-referrer, *client
        body: JSON.stringify(data), // body data type must match "Content-Type" header
    })
    .then(function(response) {
      syncRestaurantsDB(DBrestaurantURL, 'restaurants', dbRestaurantPromise);
      return response.json(); // parses response to JSON
    })
    .catch(function(error){
      console.error(`Fetch Error =\n`, error);
    });
  }
};

/**
 * Get current restaurant from page URL.
 */
fetchRestaurantFromURL = function(callback) {
  if (self.restaurant) { // restaurant already fetched!
    callback(null, self.restaurant);
    return;
  }
  const id = getParameterByName('id');
  if (!id) { // no id found in URL
    error = 'No restaurant id in URL';
    callback(error, null);
  } else {
    DBHelper.fetchRestaurantById(id, function(error, restaurant) {
      self.restaurant = restaurant;
      if (!restaurant) {
        console.error(error);
        return;
      }
      fillRestaurantHTML();
      callback(null, restaurant)
      const heartIcon = document.getElementById("heart-icon");
      heartIcon.addEventListener("click", function(){postRestaurantFavoriteData(DBrestaurantURL, restaurant)});
    });
  }
}

/**
 * Create restaurant HTML and add it to the webpage
 */
fillRestaurantHTML = function(restaurant = self.restaurant) {
  const name = document.getElementById('restaurant-name');
  name.innerHTML = restaurant.name;

  // create user options section
  const restaurantOptions = document.querySelector('.restaurant-user-options');
  const optionsForm = document.createElement('form');
  const hearticon = document.createElement('p');
  hearticon.id = "heart-icon";
  if (restaurant.is_favorite == true){
    hearticon.innerHTML = '\u2665';
  } else {
    hearticon.innerHTML = '\u2661';
  }
  const favoriteLink = document.createElement('a');
  favoriteLink.id = "heart36";
  favoriteLink.appendChild(hearticon);
  optionsForm.id = "favorite";
  optionsForm.appendChild(favoriteLink);
  restaurantOptions.appendChild(optionsForm);

  const writeReview = document.createElement('a');
  writeReview.className = "write-review-link";
  writeReview.href = DBHelper.urlForCreateReview(restaurant.id);
  writeReview.innerHTML = "Write Review";
  restaurantOptions.appendChild(writeReview);

  const address = document.getElementById('restaurant-address');
  address.setAttribute('aria-label', "address");
  address.innerHTML = restaurant.address;

  const image = document.getElementById('restaurant-img');
  image.className = 'restaurant-img';
  var myImage = new Image();
  myImage.id = 'restaurant-img';
  image.setAttribute('alt', "picture of " + restaurant.name + " restaurant");

  image.src = DBHelper.imageUrlForRestaurant(restaurant);
  if (window.matchMedia("(max-width: 600px)").matches) {
    if (image.src.includes("src")){
      image.src = image.src.replace("src", "400");
    }
  } else if (window.matchMedia("(min-width: 601px)").matches) {
    if (image.src.includes("400")) {
      image.src = image.src.replace("400", "src");
    }
  }

  imgLoad(image.src).then(function(response) {
    var imageURL = window.URL.createObjectURL(response);
    myImage.src = imageURL;
  }, function(Error) {
    console.log(Error);
  });

  const cuisine = document.getElementById('restaurant-cuisine');
  cuisine.setAttribute('aria-label', "cuisine");
  cuisine.innerHTML = restaurant.cuisine_type;

  // fill operating hours
  if (restaurant.operating_hours) {
    fillRestaurantHoursHTML();
  }
  // fill reviews
  fillReviewsHTML(restaurant);
}

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
fillRestaurantHoursHTML = function(operatingHours = self.restaurant.operating_hours) {
  const hours = document.getElementById('restaurant-hours');
  for (let key in operatingHours) {
    const row = document.createElement('tr');

    const day = document.createElement('td');
    day.innerHTML = key;
    row.appendChild(day);

    const time = document.createElement('td');
    time.innerHTML = operatingHours[key];
    row.appendChild(time);

    hours.appendChild(row);
  }
}

/**
 * Create all reviews HTML and add them to the webpage.
 */
fillReviewsHTML = function(restaurant = self.restaurant) {
  const container = document.getElementById('reviews-container');
  // change from h2 to h3, advice from Mentor to adhere to heading hierachy
  const writeReviewLink = document.querySelector('.reviews-header');
  const writeReview = document.createElement('a');
  writeReview.className = "write-review-link";
  writeReview.href = DBHelper.urlForCreateReview(restaurant.id);
  writeReview.innerHTML = "Write Review";
  writeReviewLink.appendChild(writeReview);
  DBHelper.fetchReviewsByRestaurantId(restaurant.id, function(error, reviews) {
    if (!reviews) {
      const noReviews = document.createElement('p');
      noReviews.innerHTML = 'No reviews yet!';
      container.appendChild(noReviews);
      return;
    } else {
      const ul = document.getElementById('reviews-list');
      store.postitems('readwrite').then(function(postitems) {
        postitems.getAll()
        .then(function(items) {
          if (items.length > 0) {
            reviews.forEach(function(review) {
              if (items[0].id !== review.id) {
                ul.appendChild(createReviewHTML(review));
                const deleteId = document.getElementById(`${review.id}-delete`);
                deleteId.addEventListener("click", function(){deleteReviewData(DBreviewURL, {id: review.id})});
              }
            });
            const offlineli = createReviewHTML(items[0]);
            offlineli.id = "off-line-li";
            offlineli.style.border = "medium solid #ff0000";
            ul.appendChild(offlineli);
            const offlineSection = document.createElement('section');
            offlineSection.id = "off-line-section";
            const offlineText = document.createElement('p');
            offlineText.innerHTML = "OFF LINE";
            offlineText.id = "off-line-text";
            offlineSection.appendChild(offlineText);
            const deleteId = document.getElementById(`${items[0].id}-delete`);
            deleteId.style.disable;
            const updateId = document.getElementById(`${items[0].id}-update`);
            updateId.style.disable;
            deleteId.insertAdjacentElement('afterend', offlineSection);
          } else {
            reviews.forEach(function(review) {
              ul.appendChild(createReviewHTML(review));
              const deleteId = document.getElementById(`${review.id}-delete`);
              deleteId.addEventListener("click", function(){deleteReviewData(DBreviewURL, {id: review.id})});
            });
          }
        });
      });
      container.appendChild(ul);
    }
  });
}


/**
 * Create review HTML and add it to the webpage.
 */
createReviewHTML = function(review) {
  const li = document.createElement('li');
  const name = document.createElement('p');
  name.innerHTML = review.name;
  li.appendChild(name);

  const date = document.createElement('p');
  if (typeof review.createdAt == "string"){
    date.innerHTML = formatter.format(Date.parse(review.createdAt));
  }else{
    date.innerHTML = formatter.format(review.createdAt);
  }
  li.appendChild(date);

  const rating = document.createElement('p');
  rating.innerHTML = `Rating: ${review.rating}`;
  li.appendChild(rating);

  const starNumber = 5;
  const starRatings = document.createElement('section');
  starRatings.id = 'restaurant-star-ratings';
  const starList = document.createElement('ul');
  starList.id = 'restaurant-star-list';
  for (var i=0; i < starNumber; i++) {
    const starItem = document.createElement('li');
    starItem.id = 'restaurant-star-item';
    const starButton = document.createElement('button');
    starButton.id = 'star' + (i+1).toString();
    const star = '\u2605';
    const star_border = '\u2606';
    switch(i){
      case 0:
        if (review.rating > 0){
          starButton.innerHTML = star;
        }else{
          starButton.innerHTML = star_border;
        }
        break;
      case 1:
        if (review.rating > 1){
          starButton.innerHTML = star;
        }else{
          starButton.innerHTML = star_border;
        }
        break;
      case 2:
        if (review.rating > 2){
          starButton.innerHTML = star;
        }else{
          starButton.innerHTML = star_border;
        }
        break;
      case 3:
        if (review.rating > 3){
          starButton.innerHTML = star;
        }else{
          starButton.innerHTML = star_border;
        }
        break;
      case 4:
        if (review.rating > 4){
          starButton.innerHTML = star;
        }else{
          starButton.innerHTML = star_border;
        }
        break;
    }
    starItem.appendChild(starButton);
    starList.appendChild(starItem);
  }
  starRatings.appendChild(starList);
  li.appendChild(starRatings);

  const comments = document.createElement('p');
  comments.innerHTML = review.comments;
  li.appendChild(comments);

  const reviewButtonContainer = document.createElement('section');
  reviewButtonContainer.id = 'reviews-button';
  const updateButton = document.createElement('a');
  updateButton.className = "reviews-button";
  updateButton.id = `${review.id}-update`;
  updateButton.href = `/review-update.html?id=${review.id}?restaurant_id=${review.restaurant_id}`;
  updateButton.innerHTML = "Update";
  reviewButtonContainer.appendChild(updateButton);

  const deleteButton = document.createElement('button');
  deleteButton.className = "reviews-button";
  deleteButton.id = `${review.id}-delete`;
  deleteButton.innerHTML = "Delete";
  reviewButtonContainer.appendChild(deleteButton);
  li.appendChild(reviewButtonContainer);
  if (document.getElementById('off-line-text')) {
    var offlineText = getElementById('off-line-text');
    offlineText.remove();
  }
  if (document.getElementById('off-line-section')) {
    var offlineSection = getElementById('off-line-section');
    offlineSection.remove();
  }
  li.style.border = "none";
  return li;
}

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
// Ammended to follow aria breadcrumb design pattern as recommended by Mentor
fillBreadcrumb = function(restaurant=self.restaurant) {
  const breadcrumb = document.getElementById('breadcrumb');
  const li = document.createElement('li');
  const elma = document.createElement('a');
  elma.href = DBHelper.urlForRestaurant(restaurant);
  elma.setAttribute("aria-current", "page");
  elma.innerHTML = restaurant.name;
  li.appendChild(elma);
  breadcrumb.appendChild(li);
}

/**
 * Get a parameter by name from page URL.
 */
getParameterByName = function(name, url) {
  if (!url)
    url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`);
    results = regex.exec(url);
  if (!results)
    return null;
  if (!results[2])
    return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

/**
 * Delete review from database and indexedDB.
 */
const deleteReviewData = function(url = ``, data = {}) {
  if (data) {
    return fetch(url, {
        method: "DELETE", // *GET, POST, PUT, DELETE, etc.
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(data), // body data type must match "Content-Type" header
    })
    .then(function(response) {
      syncReviewsDB(DBreviewURL, 'reviews', dbReviewPromise);
      document.location.reload(true);
    })
    .catch(function(error) {
      console.error(`Fetch Error =\n`, error);
    });
  }
}
