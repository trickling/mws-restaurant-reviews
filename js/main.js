let restaurants,
  neighborhoods,
  cuisines
var newMap
var markers = []

/**
 * Provide an option to skip map for accessibility
 */
function skipMap(){
  document.getElementById("more-anchor").focus();
}
var mapctrl = document.getElementById("map-control");
mapctrl.addEventListener("keydown", skipMap, false);

/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', function(event) {
  navigator.serviceWorker.ready.then(function() {
    fetchNeighborhoods();
    fetchCuisines();
    window.initMap();
  });
});

/**
 * Fetch all neighborhoods and set their HTML.
 */
fetchNeighborhoods = function() {
  DBHelper.fetchNeighborhoods(function (error, neighborhoods) {
    if (error) { // Got an error
      console.error(error);
    } else {
      self.neighborhoods = neighborhoods;
      fillNeighborhoodsHTML();
    }
  });
}

/**
 * Set neighborhoods HTML.
 */
fillNeighborhoodsHTML = function(neighborhoods = self.neighborhoods) {
  const select = document.getElementById('neighborhoods-select');
  neighborhoods.forEach(neighborhood => {
    const option = document.createElement('option');
    option.innerHTML = neighborhood;
    option.value = neighborhood;
    select.append(option);
  });
}

/**
 * Fetch all cuisines and set their HTML.
 */
fetchCuisines = function() {
  DBHelper.fetchCuisines(function(error, cuisines) {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.cuisines = cuisines;
      fillCuisinesHTML();
    }
  });
}

/**
 * Set cuisines HTML.
 */
fillCuisinesHTML = function(cuisines = self.cuisines) {
  const select = document.getElementById('cuisines-select');

  cuisines.forEach(cuisine => {
    const option = document.createElement('option');
    option.innerHTML = cuisine;
    option.value = cuisine;
    select.append(option);
  });
}

/**
 * Initialize leaflet map, called from HTML.
 */
initMap = function() {
  self.newMap = L.map('map', {
        center: [40.722216, -73.987501],
        zoom: 12,
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
  updateRestaurants();
}

const select = document.getElementById('cuisines-select');
const mapInset = document.getElementById('map');
const mapContainer = document.getElementById('map-container');
var hideMap = document.createElement('button');
hideMap.id = "restaurants-hide-map";
var hideMapTxt = document.createElement('p')
hideMapTxt.id = "restaurants-hide-map-text";
hideMapTxt.innerHTML = "Hide Map";
hideMap.appendChild(hideMapTxt);
select.insertAdjacentElement('afterend', hideMap);

hideMap.addEventListener('click', function() {
  if (hideMapTxt.innerHTML == "Hide Map"){
    hideMapTxt.innerHTML = "Show Map";
    mapContainer.style.display = "none";
  }else {
    window.location.reload();
  }
});

/**
 * Update page and map for current restaurants.
 */
updateRestaurants = function() {
  const cSelect = document.getElementById('cuisines-select');
  const nSelect = document.getElementById('neighborhoods-select');

  const cIndex = cSelect.selectedIndex;
  const nIndex = nSelect.selectedIndex;

  const cuisine = cSelect[cIndex].value;
  const neighborhood = nSelect[nIndex].value;
  DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, function(error, restaurants) {
    if (error) { // Got an error!
      console.error(error);
    } else {
      resetRestaurants(restaurants);
      fillRestaurantsHTML();
    }
  });
}

// This code was copied from an example given at:
// https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
// by Mozilla Contributors (MDN), is licensed under CC-BY-SA 2.5, or all open source licenses.
const deleteRestaurantData = function(url = ``, data = {}) {
  if (data) {
    return fetch(url, {
        method: "DELETE", // *GET, POST, PUT, DELETE, etc.
        // mode: "cors", // no-cors, cors, *same-origin
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(data), // body data type must match "Content-Type" header
    })
    .then(function(response) {
      return response.json()
    })
    .then(function(resp) {
      // console.log("resp: ", resp);
    }) // parses response to JSON
    .catch(function(error){
      console.error(`Fetch Error =\n`, error);
    });
  }
};

const postRestaurantsFavoriteData = function(url = ``, data = {}) {
  // Default options are marked with *
  if (data){
    deleteRestaurantData(DBrestaurantURL, {id: data.id})
    .then(function() {
      data.is_favorite = !data.is_favorite;
      const heartIcon = document.getElementById("heart-icon-" + data.id.toString());
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
          body: JSON.stringify(data),
      })
      .then(function(response){
        syncRestaurantsDB(DBrestaurantURL, 'restaurants', dbRestaurantPromise);
        return response.json(); // parses response to JSON;
      })
      .catch(function(error){
        console.error(`Fetch Error =\n`, error);
      });
    });
  }
};

/**
 * Clear current restaurants, their HTML and remove their map markers.
 */
resetRestaurants = function(restaurants) {
  // Remove all restaurants
  self.restaurants = [];
  const ul = document.getElementById('restaurants-list');
  ul.innerHTML = '';

  // Remove all map markers
  if (self.markers) {
    self.markers.forEach(marker => marker.remove());
  }
  self.markers = [];
  self.restaurants = restaurants;
}

/**
 * Create all restaurants HTML and add them to the webpage.
 */
fillRestaurantsHTML = function(restaurants = self.restaurants) {
  const ul = document.getElementById('restaurants-list');
  restaurants.forEach(restaurant => {
    ul.append(createRestaurantHTML(restaurant));
    const detail = document.getElementById("more-anchor-" + restaurant.id.toString());
    detail.addEventListener("click", function() {
      loadDB(`http://localhost:1337/reviews/?restaurant_id=${restaurant.id}`, 'reviews', dbReviewPromise);
    });
    const heartIcon = document.getElementById("heart-icon-" + restaurant.id.toString());
    heartIcon.addEventListener("click", function(){postRestaurantsFavoriteData(DBrestaurantURL, restaurant)});
  });
  addMarkersToMap();
}


/**
 * Create restaurant HTML.
 */
createRestaurantHTML = function(restaurant) {
  const li = document.createElement('li');

  const descriptionSection = document.createElement('section');
  descriptionSection.className = 'restaurant-description';
  // change from h1 to h2, advice from Mentor to adhere to heading hierachy
  const name = document.createElement('h2');
  name.innerHTML = restaurant.name;
  descriptionSection.appendChild(name);

  const neighborhood = document.createElement('p');
  neighborhood.id = "restaurant-neighborhood";
  neighborhood.innerHTML = restaurant.neighborhood + " neigborhood";
  descriptionSection.appendChild(neighborhood);

  const address = document.createElement('p');
  address.id = "restaurant-list-address";
  address.innerHTML = restaurant.address;
  descriptionSection.appendChild(address);

  // create user options section
  const restaurantOptions = document.createElement('section');
  restaurantOptions.className = "restaurant-user-options";
  const writeReview = document.createElement('a');
  writeReview.className = "write-review-link";
  writeReview.href = DBHelper.urlForRestaurant(restaurant);
  writeReview.innerHTML = "Write Review";
  restaurantOptions.appendChild(writeReview);
  const optionsForm = document.createElement('form');
  // create favorites icon
  const hearticon = document.createElement('p');
  // hearticon.className = "material-icons";
  hearticon.id = "heart-icon-" + restaurant.id.toString();
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
  descriptionSection.appendChild(restaurantOptions);
  const moreDetails = document.createElement('p');
  moreDetails.id = "more-details";
  const more = document.createElement('a');
  more.id = "more-anchor-" + restaurant.id;
  more.href = DBHelper.urlForRestaurant(restaurant);
  more.innerHTML = "View " + restaurant.name + " Details";

  moreDetails.appendChild(more);
  descriptionSection.append(moreDetails);

  li.append(descriptionSection);

  const image = document.createElement('restaurantImage');
  const imgSection = document.createElement('section');
  var restaurantImage = new Image();
  image.src = DBHelper.imageUrlForRestaurant(restaurant);
  if (window.matchMedia("(max-width: 400px)").matches) {
    if (image.src.includes("src")){
      image.src = image.src.replace("src", "400");
    }
  } else if (window.matchMedia("(min-width: 401px)").matches) {
    if (image.src.includes("400")) {
      image.src = image.src.replace("400", "src");
    }
  }
  imgLoad(image.src).then(function(response) {
    var imageURL = window.URL.createObjectURL(response);
    restaurantImage.src = imageURL;
    imgSection.className  = 'restaurant-img-holder';
    restaurantImage.id = 'restaurant-img';
    restaurantImage.setAttribute('alt', "picture of " + restaurant.name + " restaurant");
    imgSection.appendChild(restaurantImage);
  }, function(Error) {
    console.log(Error);
  });
  li.append(imgSection);

  return li
}

/**
 * Add markers for current restaurants to the map.
 */
addMarkersToMap = function(restaurants = self.restaurants) {
  restaurants.forEach(restaurant => {
    // Add marker to the map
    const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.newMap);
    marker.on("click", onClick);
    function onClick() {
      window.location.href = marker.options.url;
    }
    self.markers.push(marker);
  });
}

/**
 * Get a parameter by name from page URL.
 */
getParameterByName = function(name, url) {
  if (!url)
    url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
  if (!results)
    return null;
  if (!results[2])
    return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
