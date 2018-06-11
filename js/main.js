let restaurants,
  neighborhoods,
  cuisines
var map
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
document.addEventListener('DOMContentLoaded', (event) => {
  fetchNeighborhoods();
  fetchCuisines();
});


/**
 * Fetch all neighborhoods and set their HTML.
 */
fetchNeighborhoods = () => {
  DBHelper.fetchNeighborhoods((error, neighborhoods) => {
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
fillNeighborhoodsHTML = (neighborhoods = self.neighborhoods) => {
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
fetchCuisines = () => {
  DBHelper.fetchCuisines((error, cuisines) => {
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
fillCuisinesHTML = (cuisines = self.cuisines) => {
  const select = document.getElementById('cuisines-select');

  cuisines.forEach(cuisine => {
    const option = document.createElement('option');
    option.innerHTML = cuisine;
    option.value = cuisine;
    select.append(option);
  });
}

/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
  let loc = {
    lat: 40.722216,
    lng: -73.987501
  };
  self.map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: loc,
    scrollwheel: false
  });
  updateRestaurants();
}

/**
 * Update page and map for current restaurants.
 */
updateRestaurants = () => {
  const cSelect = document.getElementById('cuisines-select');
  const nSelect = document.getElementById('neighborhoods-select');

  const cIndex = cSelect.selectedIndex;
  const nIndex = nSelect.selectedIndex;

  const cuisine = cSelect[cIndex].value;
  const neighborhood = nSelect[nIndex].value;

  DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, (error, restaurants) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      resetRestaurants(restaurants);
      fillRestaurantsHTML();
    }
  })
}

/**
 * Clear current restaurants, their HTML and remove their map markers.
 */
resetRestaurants = (restaurants) => {
  // Remove all restaurants
  self.restaurants = [];
  const ul = document.getElementById('restaurants-list');
  ul.innerHTML = '';

  // Remove all map markers
  self.markers.forEach(m => m.setMap(null));
  self.markers = [];
  self.restaurants = restaurants;
}

/**
 * Create all restaurants HTML and add them to the webpage.
 */
fillRestaurantsHTML = (restaurants = self.restaurants) => {
  const ul = document.getElementById('restaurants-list');
  restaurants.forEach(restaurant => {
    ul.append(createRestaurantHTML(restaurant));
  });
  addMarkersToMap();
}

/**
 * Create restaurant HTML.
 */
createRestaurantHTML = (restaurant) => {
  const li = document.createElement('li');
  const image = document.createElement('myImage');
  const imgSection = document.createElement('section');

  var myImage = new Image();

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

  const moreDetails = document.createElement('p');
  moreDetails.id = "more-details";
  const more = document.createElement('a');
  more.id = "more-anchor";
  more.innerHTML = "View " + restaurant.name + " Details";
  more.href = DBHelper.urlForRestaurant(restaurant);
  moreDetails.appendChild(more);
  descriptionSection.append(moreDetails);

  li.append(descriptionSection);

  image.src = DBHelper.imageUrlForRestaurant(restaurant);

  if (window.matchMedia("(min-width: 801px)").matches) {
    image.src = image.src.replace("400", "src");
  } else if (window.matchMedia("(min-width: 399px)").matches) {
    image.src = image.src.replace("400", "800");
  }

  imgLoad(image.src).then(function(response) {
    var imageURL = window.URL.createObjectURL(response);
    myImage.src = imageURL;
    imgSection.className  = 'restaurant-img-holder';
    myImage.id = 'restaurant-img';
    myImage.setAttribute('alt', "picture of " + restaurant.name);
    imgSection.appendChild(myImage);
  }, function(Error) {
    console.log(Error);
  });
  li.append(imgSection);

  return li
}

/**
 * Add markers for current restaurants to the map.
 */
addMarkersToMap = (restaurants = self.restaurants) => {
  restaurants.forEach(restaurant => {
    // Add marker to the map
    const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.map);
    google.maps.event.addListener(marker, 'click', () => {
      window.location.href = marker.url
    });
    self.markers.push(marker);
  });
}
