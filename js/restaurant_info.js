let restaurant;
var map;

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

/**
 * Provide an option to skip map for accessibility
 */
function skipMap(){
  document.getElementById("footer-anchor").focus();
}
var mapctrl = document.getElementById("map-control");
mapctrl.addEventListener("keydown", skipMap, false);

/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: restaurant.latlng,
        scrollwheel: false
      });
      fillBreadcrumb();
      DBHelper.mapMarkerForRestaurant(self.restaurant, self.map);
    }
  });
}

// This code was copied from an example given at:
// https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
// by Mozilla Contributors (MDN), is licensed under CC-BY-SA 2.5, or all open source licenses.

const deleteRestaurantData = (url = ``, data = {}) => {
    if (data) {
      return fetch(url, {
          // mode: "cors", // no-cors, cors, *same-origin
          method: "DELETE", // *GET, POST, PUT, DELETE, etc.
          headers: {
              "Content-Type": "application/json; charset=utf-8",
          },
          body: JSON.stringify(data), // body data type must match "Content-Type" header
      })
      .then(response => response.json()) // parses response to JSON
      .catch(error => console.error(`Fetch Error =\n`, error));
    }
};

const postFavoriteData = (url = ``, data = {}) => {
  // Default options are marked with *
  if (data){
    deleteRestaurantData('http://localhost:1337/restaurants/', {id: data.id});
    data.is_favorite = !data.is_favorite;
    const heartIcon = document.getElementById("heart-icon");
    if (data.is_favorite == true){
      heartIcon.innerHTML = "favorite";
    } else if (data.is_favorite == false){
      heartIcon.innerHTML = "favorite_border";
    } else {
      heartIcon.innerHTML = "favorite_border";
    }
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
    .then(response => {
      return response.json(); // parses response to JSON
    })
    .catch(error => console.error(`Fetch Error =\n`, error));
  }
};

/**
 * Get current restaurant from page URL.
 */
fetchRestaurantFromURL = (callback) => {
  if (self.restaurant) { // restaurant already fetched!
    callback(null, self.restaurant);
    return;
  }
  const id = getParameterByName('id');
  if (!id) { // no id found in URL
    error = 'No restaurant id in URL';
    callback(error, null);
  } else {
    DBHelper.fetchRestaurantById(id, (error, restaurant) => {
      self.restaurant = restaurant;
      if (!restaurant) {
        console.error(error);
        return;
      }
      fillRestaurantHTML();
      callback(null, restaurant)
      const heartIcon = document.getElementById("heart-icon");
      heartIcon.addEventListener("click", function(){postFavoriteData('http://localhost:1337/restaurants/', restaurant)});
    });
  }
}

/**
 * Create restaurant HTML and add it to the webpage
 */
fillRestaurantHTML = (restaurant = self.restaurant) => {
  const name = document.getElementById('restaurant-name');
  name.innerHTML = restaurant.name;

  // create user options section
  const restaurantOptions = document.querySelector('.restaurant-user-options');
  const optionsForm = document.createElement('form');
  // create favorites icon
  const hearticon = document.createElement('i');
  hearticon.className = "material-icons";
  hearticon.id = "heart-icon";
  if (restaurant.is_favorite == true){
    hearticon.innerHTML = "favorite";
  } else {
    hearticon.innerHTML = "favorite_border";
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
fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
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
fillReviewsHTML = (restaurant = self.restaurant) => {
  const container = document.getElementById('reviews-container');
  // change from h2 to h3, advice from Mentor to adhere to heading hierachy
  const writeReviewLink = document.querySelector('.reviews-header');
  const writeReview = document.createElement('a');
  writeReview.className = "write-review-link";
  writeReview.href = DBHelper.urlForCreateReview(restaurant.id);
  writeReview.innerHTML = "Write Review";
  writeReviewLink.appendChild(writeReview);
  DBHelper.fetchReviewsByRestaurantId(restaurant.id, (error, reviews) => {
    if (!reviews) {
      const noReviews = document.createElement('p');
      noReviews.innerHTML = 'No reviews yet!';
      container.appendChild(noReviews);
      return;
    }
    const ul = document.getElementById('reviews-list');
    reviews.forEach(function(review) {
      ul.appendChild(createReviewHTML(review));
      const deleteId = document.getElementById(`${review.id}-delete`);
      deleteId.addEventListener("click", function(){deleteReviewData('http://localhost:1337/reviews/', {id: review.id})});
      const updateId = document.getElementById(`${review.id}-update`);
    });
    container.appendChild(ul);
  })
}

/**
 * Create review HTML and add it to the webpage.
 */
createReviewHTML = (review) => {
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
    const starIcon = document.createElement('i');
    starIcon.id = "star24";
    starIcon.className = "material-icons";
    switch(i){
      case 0:
        if (review.rating > 0){
          starIcon.innerHTML = "star";
        }else{
          starIcon.innerHTML = "star_border";
        }
        break;
      case 1:
        if (review.rating > 1){
          starIcon.innerHTML = "star";
        }else{
          starIcon.innerHTML = "star_border";
        }
        break;
      case 2:
        if (review.rating > 2){
          starIcon.innerHTML = "star";
        }else{
          starIcon.innerHTML = "star_border";
        }
        break;
      case 3:
        if (review.rating > 3){
          starIcon.innerHTML = "star";
        }else{
          starIcon.innerHTML = "star_border";
        }
        break;
      case 4:
        if (review.rating > 4){
          starIcon.innerHTML = "star";
        }else{
          starIcon.innerHTML = "star_border";
        }
        break;
    }
    starButton.appendChild(starIcon);
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
  updateButton.type = "button";
  updateButton.href = `/review-update.html?id=${review.id}?restaurant_id=${review.restaurant_id}`;
  updateButton.innerHTML = "Update";
  reviewButtonContainer.appendChild(updateButton);

  const deleteButton = document.createElement('button');
  deleteButton.className = "reviews-button";
  deleteButton.id = `${review.id}-delete`;
  deleteButton.type = "button";
  deleteButton.innerHTML = "Delete";
  reviewButtonContainer.appendChild(deleteButton);
  li.appendChild(reviewButtonContainer);
  return li;
}

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
// Ammended to follow aria breadcrumb design pattern as recommended by Mentor
fillBreadcrumb = (restaurant=self.restaurant) => {
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
getParameterByName = (name, url) => {
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
const deleteReviewData = (url = ``, data = ``) => {
  if (data){
    return fetch(url, {
        method: "DELETE", // *GET, POST, PUT, DELETE, etc.
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(data), // body data type must match "Content-Type" header
    })
    .then(response => response.json())
    .then(() => syncDB(DBreviewURL, 'reviews', dbReviewPromise))
    .catch(error => console.error(`Fetch Error =\n`, error))
    .then(() => window.location.reload(true));
  }else{
    alert("Unable to delete entry");
  }
};
